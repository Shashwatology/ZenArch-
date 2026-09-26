import React from 'react'
import { requireAdmin } from '@/lib/admin/auth'
import prisma from '@/lib/prisma'
import { QuoteBuilderClient } from './QuoteBuilderClient'

export const dynamic = 'force-dynamic'

export default async function NewQuotePage() {
  await requireAdmin()

  // Pre-load data for the builder
  const customers = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    include: { customerProfile: true }
  })
  
  const products = await prisma.product.findMany({
    where: { status: 'PUBLISHED' },
    include: { variants: true, images: true }
  })

  const promotions = await prisma.promotion.findMany({
    where: { isActive: true }
  })

  const coupons = await prisma.coupon.findMany({
    where: { isActive: true }
  })

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-light text-white tracking-wider mb-8">Quote Builder</h1>
      <QuoteBuilderClient 
        customers={customers} 
        products={products}
        promotions={promotions}
        coupons={coupons}
      />
    </div>
  )
}
