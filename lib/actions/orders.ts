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

export async function updateOrderStatus(orderId: string, status: any) {
  const { dbUser } = await requireAdmin()

  const oldOrder = await prisma.order.findUnique({ where: { id: orderId } })
  if (!oldOrder) throw new Error('Order not found')

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status }
  })

  await prisma.auditLog.create({
    data: {
      userId: dbUser.id,
      action: 'ORDER_STATUS_CHANGED',
      entityType: 'Order',
      entityId: orderId,
      before: JSON.stringify({ status: oldOrder.status }),
      after: JSON.stringify({ status: updated.status })
    }
  })

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

  revalidatePath('/account/orders')
  revalidatePath('/admin/orders')
  revalidatePath('/account/quotes')
  revalidatePath('/admin/quotes')

  return { success: true, orderId: order.id }
}
