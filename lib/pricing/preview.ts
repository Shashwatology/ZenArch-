'use server'

import prisma from '@/lib/prisma'
import { calculateQuote } from './engine'
import { QuoteCalculationRequest, PricingLineItemInput } from './types'
import { Decimal } from '@prisma/client/runtime/library'

export async function previewQuoteCalculation(data: {
  items: Array<{ productId: string, variantId?: string | null, quantity: number }>,
  promotionCode?: string,
  couponCode?: string
}) {
  const lineItems: PricingLineItemInput[] = []
  let hasPriceConflict = false

  for (const it of data.items) {
    const product = await prisma.product.findUnique({ where: { id: it.productId } })
    if (!product) continue
    
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
    })
  }

  let promotionInput = null
  if (data.promotionCode) {
    const promo = await prisma.promotion.findUnique({ where: { id: data.promotionCode } })
    if (promo && promo.isActive) {
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
    if (coupon && coupon.isActive) {
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

  const result = await calculateQuote({
    items: lineItems,
    promotion: promotionInput,
    coupon: couponInput,
    hasPriceConflict
  })

  // Convert Decimals to strings for JSON serialization
  return {
    subtotal: result.subtotal.toString(),
    promotionDiscount: result.promotionDiscount.toString(),
    couponDiscount: result.couponDiscount.toString(),
    finalTotal: result.finalTotal.toString(),
    priceState: result.priceState,
    items: result.items.map(i => ({
      ...i,
      baseUnitPrice: i.baseUnitPrice.toString(),
      lineSubtotal: i.lineSubtotal.toString(),
      promotionDiscount: i.promotionDiscount.toString(),
      couponDiscount: i.couponDiscount.toString(),
      finalLineTotal: i.finalLineTotal.toString()
    }))
  }
}
