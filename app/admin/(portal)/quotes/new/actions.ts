'use server'

import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin/auth'
import { generateQuoteVersion } from '@/lib/pricing/quote-builder'
import { redirect } from 'next/navigation'

export async function createAdminQuoteAction(data: {
  userId: string,
  items: Array<{ productId: string, variantId?: string | null, quantity: number }>,
  promotionCode?: string,
  couponCode?: string,
  notes?: string
}) {
  const { dbUser } = await requireAdmin()

  // 1. Create a base Quote Request
  const quoteReq = await prisma.quoteRequest.create({
    data: {
      userId: data.userId,
      status: 'NEW',
      notes: data.notes
    }
  })

  // 2. Generate the first Quote Version
  try {
    await generateQuoteVersion(quoteReq.id, {
      items: data.items,
      promotionCode: data.promotionCode,
      couponCode: data.couponCode
    })
  } catch (err: any) {
    // If generation fails, we should delete the empty quote request
    await prisma.quoteRequest.delete({ where: { id: quoteReq.id } })
    throw err
  }

  return { quoteId: quoteReq.id }
}
