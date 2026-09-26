'use server'

import prisma from '@/lib/prisma'
import { requireCustomerAuth } from './customerAuth'
import { requireAdmin } from '@/lib/admin/auth'
import { revalidatePath } from 'next/cache'

// CUSTOMER ACTIONS

export async function getCustomerOrders() {
  const { dbUser } = await requireCustomerAuth()

  return prisma.order.findMany({
    where: { userId: dbUser.id },
    include: {
      items: {
        include: {
          product: { include: { images: true } },
          variant: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

// ADMIN ACTIONS

export async function getAdminOrders() {
  await requireAdmin()

  return prisma.order.findMany({
    include: {
      user: {
        include: { customerProfile: true }
      },
      items: {
        include: {
          product: true,
          variant: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function updateOrderAdmin(orderId: string, data: { status?: any, deliveryPartner?: string, trackingId?: string, trackingUrl?: string }) {
  const { dbUser } = await requireAdmin()

  const oldOrder = await prisma.order.findUnique({ 
    where: { id: orderId },
    include: { user: true } 
  })
  if (!oldOrder) throw new Error('Order not found')

  const updated = await prisma.order.update({
    where: { id: orderId },
    data
  })

  // Audit log
  await prisma.auditLog.create({
    data: {
      userId: dbUser.id,
      action: 'ORDER_UPDATED',
      entityType: 'Order',
      entityId: orderId,
      before: JSON.stringify({ status: oldOrder.status, trackingId: oldOrder.trackingId }),
      after: JSON.stringify({ status: updated.status, trackingId: updated.trackingId })
    }
  })

  // Dispatch emails
  const { dispatchEmailEvent } = await import('@/lib/email/dispatcher')
  
  if (data.status && data.status !== oldOrder.status) {
    await dispatchEmailEvent({
      type: 'order.status_update',
      recipient: oldOrder.user.email,
      customerId: oldOrder.user.id,
      orderId: updated.orderId || updated.id,
      status: updated.status
    })
  }

  if (data.trackingId && data.trackingId !== oldOrder.trackingId) {
    await dispatchEmailEvent({
      type: 'order.tracking_added',
      recipient: oldOrder.user.email,
      customerId: oldOrder.user.id,
      orderId: updated.orderId || updated.id,
      trackingId: updated.trackingId || '',
      deliveryPartner: updated.deliveryPartner || ''
    })
  }

  revalidatePath('/account/orders')
  revalidatePath('/admin/orders')
  
  return { success: true }
}

export async function createOrderFromQuote(quoteId: string) {
  const { dbUser } = await requireAdmin()

  const quote = await prisma.quoteRequest.findUnique({
    where: { id: quoteId },
    include: { items: true }
  })

  if (!quote) throw new Error('Quote not found')

  // Calculate total amount based on items
  const totalAmount = quote.items.reduce((sum, item) => sum + ((Number(item.priceAtTime) || 0) * item.quantity), 0)

  const order = await prisma.order.create({
    data: {
      userId: quote.userId,
      totalAmount,
      items: {
        create: quote.items.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          priceAtTime: item.priceAtTime || 0,
          productNameAtTime: item.productNameAtTime
        }))
      }
    }
  })

  await prisma.auditLog.create({
    data: {
      userId: dbUser.id,
      action: 'ORDER_CREATED',
      entityType: 'Order',
      entityId: order.id,
      after: JSON.stringify({ sourceQuoteId: quote.id })
    }
  })

  // Optionally mark quote as accepted
  await prisma.quoteRequest.update({
    where: { id: quote.id },
    data: { status: 'ACCEPTED' }
  })
  
  // Analytics tracking for quote_accepted and order_created
  const { trackEvent } = await import('@/lib/analytics/tracker')
  await trackEvent('quote_accepted', { quoteId: quote.id, amount: totalAmount }, { userId: quote.userId, source: 'SERVER' })
  await trackEvent('order_created', { orderId: order.id, amount: totalAmount, sourceQuoteId: quote.id }, { userId: quote.userId, source: 'SERVER' })

  const orderUser = await prisma.user.findUnique({ where: { id: quote.userId } })
  if (orderUser?.email) {
    const { dispatchEmailEvent } = await import('@/lib/email/dispatcher')
    await dispatchEmailEvent({
      type: 'order.created',
      recipient: orderUser.email,
      customerId: orderUser.id,
      orderId: order.id,
      orderNumber: order.id.substring(0, 8).toUpperCase(),
      amount: totalAmount.toString()
    })
  }

  revalidatePath('/account/orders')
  revalidatePath('/admin/orders')
  revalidatePath('/account/quotes')
  revalidatePath('/admin/quotes')

  return { success: true, orderId: order.id }
}

export async function createDirectOrder(data: {
  productId: string
  variantId?: string
  quantity: number
  shippingName: string
  shippingAddress: string
  shippingCity: string
  shippingState: string
  shippingPincode: string
  shippingPhone: string
}) {
  const { dbUser } = await requireCustomerAuth()

  // Get Product Pricing
  const product = await prisma.product.findUnique({
    where: { id: data.productId },
    include: { variants: true }
  })

  if (!product) return { error: 'Product not found' }

  let price: number = 0
  let productName = product.name
  let variantName: string | null = null

  if (data.variantId) {
    const variant = product.variants.find(v => v.id === data.variantId)
    if (!variant || !variant.priceInr) return { error: 'Variant pricing not available' }
    price = variant.priceInr.toNumber()
    variantName = variant.name
  } else {
    if (!product.basePrice) return { error: 'Product pricing not available' }
    price = product.basePrice.toNumber()
  }

  // Basic order ID generator ZNA-YYYY-XXXXXX
  const generateOrderId = () => {
    const year = new Date().getFullYear()
    const rand = Math.floor(Math.random() * 900000) + 100000
    return `ZNA-${year}-${rand}`
  }

  const orderIdStr = generateOrderId()
  const totalAmount = price * data.quantity

  try {
    const order = await prisma.order.create({
      data: {
        orderId: orderIdStr,
        userId: dbUser.id,
        status: 'CONFIRMED', 
        totalAmount: totalAmount,
        currency: 'INR',
        shippingName: data.shippingName,
        shippingAddress: data.shippingAddress,
        shippingCity: data.shippingCity,
        shippingState: data.shippingState,
        shippingPincode: data.shippingPincode,
        shippingPhone: data.shippingPhone,
        items: {
          create: {
            productId: product.id,
            variantId: data.variantId,
            quantity: data.quantity,
            priceAtTime: price,
            productNameAtTime: productName,
            variantNameAtTime: variantName
          }
        }
      }
    })

    return { success: true, orderId: order.orderId }
  } catch (err: any) {
    console.error("Order creation failed:", err)
    return { error: 'Failed to create order. Please try again.' }
  }
}
