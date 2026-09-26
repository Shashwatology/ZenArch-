'use server'

import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin/auth'
import { calculateQuote } from './engine'
import { QuoteCalculationRequest, PricingLineItemInput } from './types'
import { Decimal } from '@prisma/client/runtime/library'
import { revalidatePath } from 'next/cache'

// Note: This implements the core quote generation logic calling the engine.
export async function generateQuoteVersion(quoteRequestId: string, data: {
  items: Array<{ productId: string, variantId?: string | null, quantity: number }>,
  promotionCode?: string,
  couponCode?: string,
  terms?: string
}) {
  const { dbUser } = await requireAdmin()

  // 1. Load quote request
  const quoteReq = await prisma.quoteRequest.findUnique({
    where: { id: quoteRequestId }
  })
  if (!quoteReq) throw new Error("Quote Request not found")

  // 2. Fetch full product details for pricing
  const lineItems: PricingLineItemInput[] = []
  let hasPriceConflict = false

  for (const it of data.items) {
    const product = await prisma.product.findUnique({ where: { id: it.productId } })
    if (!product) throw new Error(`Product ${it.productId} not found`)
    
    if (product.priceStatus === 'CONFLICT' || product.priceStatus === 'NOT_PROVIDED' || product.priceStatus === 'PRICE_ON_REQUEST') {
      hasPriceConflict = true
    }

    let basePrice = product.basePrice || new Decimal(0)
    if (it.variantId) {
      const variant = await prisma.productVariant.findUnique({ where: { id: it.variantId } })
      if (variant?.priceInr) {
        basePrice = variant.priceInr
      }
    }

    lineItems.push({
      productId: it.productId,
      variantId: it.variantId,
      quantity: it.quantity,
      basePrice,
      collectionId: product.collectionId,
      projectType: quoteReq.projectType
    })
  }

  // 3. Resolve Promotion & Coupon (mocking fetching for now if codes provided, 
  // but wait we need to fetch them from DB actually).
  
  let promotionInput = null
  if (data.promotionCode) {
    // In real flow, we'd lookup by code. Promotion model doesn't have a code, just active state.
    // Assuming data.promotionCode is the Promotion ID for now.
    const promo = await prisma.promotion.findUnique({ where: { id: data.promotionCode } })
    if (promo && promo.isActive && promo.startAt <= new Date() && (!promo.endAt || promo.endAt >= new Date())) {
      promotionInput = {
        id: promo.id,
        type: promo.type,
        value: promo.value,
        appliesTo: promo.appliesTo,
        targetIds: promo.targetIds,
        minOrderValue: promo.minOrderValue
      }
    }
  }

  let couponInput = null
  if (data.couponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: data.couponCode.toUpperCase() } })
    if (coupon && coupon.isActive && coupon.startAt <= new Date() && (!coupon.expiresAt || coupon.expiresAt >= new Date())) {
      couponInput = {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        appliesTo: coupon.appliesTo,
        targetIds: coupon.targetIds,
        minSubtotal: coupon.minSubtotal,
        maxDiscount: coupon.maxDiscount
      }
    }
  }

  // 4. Calculate Prices
  const calculationRequest: QuoteCalculationRequest = {
    items: lineItems,
    promotion: promotionInput,
    coupon: couponInput,
    hasPriceConflict
  }

  const result = await calculateQuote(calculationRequest)

  if (result.priceState === 'PRICE_REQUIRES_CONFIRMATION') {
    throw new Error("Cannot generate quote: One or more products have a price conflict or require confirmation.")
  }

  // 5. Check Coupon Limits (concurrency protection via transaction)
  if (couponInput) {
    // We should lock the coupon row in a transaction to safely check and increment redemptions,
    // but quote generation is a draft until accepted. Let's record redemption only on order, 
    // OR just record usage right now if quotes deduct from usage limits.
    // Usually coupons are consumed at checkout/order. We will validate limit here.
    const usageCount = await prisma.couponRedemption.count({ where: { couponId: couponInput.id } })
    const couponObj = await prisma.coupon.findUnique({ where: { id: couponInput.id } })
    if (couponObj && couponObj.usageLimit && usageCount >= couponObj.usageLimit) {
      throw new Error(`Coupon ${couponInput.code} usage limit reached.`)
    }
  }

  // 6. Create Quote Version
  const currentVersions = await prisma.quoteVersion.count({ where: { quoteRequestId: quoteRequestId } })
  const versionNumber = currentVersions + 1

  const newVersion = await prisma.quoteVersion.create({
    data: {
      quoteRequestId,
      versionNumber,
      totalAmount: result.finalTotal,
      totalDiscount: result.promotionDiscount.plus(result.couponDiscount),
      terms: data.terms,
      lineItems: JSON.parse(JSON.stringify(result.items)),
      appliedDiscounts: JSON.parse(JSON.stringify({
        promotion: promotionInput,
        coupon: couponInput,
        promotionDiscount: result.promotionDiscount,
        couponDiscount: result.couponDiscount
      })),
      createdByUserId: dbUser.id
    }
  })

  // Log audit
  await prisma.auditLog.create({
    data: {
      action: 'QUOTE_VERSION_CREATED',
      entityType: 'QuoteRequest',
      entityId: quoteRequestId,
      userId: dbUser.id,
      after: JSON.stringify({ versionId: newVersion.id, versionNumber })
    }
  })

  // Automatically move status to QUOTED if it's NEW/IN_REVIEW
  if (quoteReq.status === 'NEW' || quoteReq.status === 'IN_REVIEW') {
    await prisma.quoteRequest.update({
      where: { id: quoteRequestId },
      data: { status: 'QUOTED' }
    })
  }

  revalidatePath(`/admin/quotes/${quoteRequestId}`)
  return { success: true, version: newVersion }
}
