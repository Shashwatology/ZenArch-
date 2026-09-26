'use server'

import prisma from '@/lib/prisma'
import { requireCustomerAuth } from './customerAuth'
import { requireAdmin } from '@/lib/admin/auth'
import { revalidatePath } from 'next/cache'

export async function createQuoteRequest(formData: FormData) {
  const { dbUser } = await requireCustomerAuth()

  const productId = formData.get('productId') as string
  const variantId = formData.get('variantId') as string || null
  const quantity = parseInt(formData.get('quantity') as string || '1', 10)
  const notes = formData.get('notes') as string
  const projectType = formData.get('projectType') as string
  const budget = formData.get('budget') ? parseFloat(formData.get('budget') as string) : null

  if (!productId) {
    throw new Error('Product is required')
  }

  // Snapshot the product
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { variants: true }
  })

  if (!product) {
    throw new Error('Product not found')
  }

  const variant = variantId ? product.variants.find(v => v.id === variantId) : null
  const priceAtTime = variant?.priceInr || product.basePrice || null
  const productNameAtTime = product.name

  const quoteRequest = await prisma.quoteRequest.create({
    data: {
      userId: dbUser.id,
      notes,
      projectType,
      budget,
      items: {
        create: {
          productId: product.id,
          variantId: variantId,
          quantity: quantity,
          priceAtTime,
          productNameAtTime
        }
      }
    }
  })

  await prisma.auditLog.create({
    data: {
      userId: dbUser.id,
      action: 'QUOTE_CREATED',
      entityType: 'QuoteRequest',
      entityId: quoteRequest.id,
      after: JSON.stringify({ status: 'NEW' })
    }
  })

  revalidatePath('/account/quotes')
  return { success: true, quoteId: quoteRequest.id }
}

export async function getCustomerQuotes() {
  const { dbUser } = await requireCustomerAuth()

  return prisma.quoteRequest.findMany({
    where: { userId: dbUser.id },
    include: {
      items: {
        include: {
          product: {
            include: { images: true }
          },
          variant: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

// ADMIN ACTIONS

export async function getAdminQuotes() {
  await requireAdmin()

  return prisma.quoteRequest.findMany({
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

export async function updateQuoteStatus(quoteId: string, status: any, adminNotes?: string) {
  const { dbUser } = await requireAdmin()

  const oldQuote = await prisma.quoteRequest.findUnique({ where: { id: quoteId } })
  if (!oldQuote) throw new Error('Quote not found')

  const updated = await prisma.quoteRequest.update({
    where: { id: quoteId },
    data: { status },
    include: { user: true }
  })

  await prisma.auditLog.create({
    data: {
      userId: dbUser.id,
      action: 'QUOTE_STATUS_CHANGED',
      entityType: 'QuoteRequest',
      entityId: quoteId,
      before: JSON.stringify({ status: oldQuote.status }),
      after: JSON.stringify({ status: updated.status })
    }
  })

  if (status === 'QUOTED' && oldQuote.status !== 'QUOTED') {
    const { dispatchEmailEvent } = await import('@/lib/email/dispatcher')
    await dispatchEmailEvent({
      type: 'quote.sent',
      recipient: updated.user.email,
      customerId: updated.user.id,
      quoteRequestId: updated.id,
      quoteUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/account/quotes/${updated.id}`
    })
  }

  revalidatePath('/account/quotes')
  revalidatePath('/admin/quotes')
  revalidatePath(`/admin/quotes/${quoteId}`)
  
  return { success: true }
}
