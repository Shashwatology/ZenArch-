import { Decimal } from '@prisma/client/runtime/library'
import {
  QuoteCalculationRequest,
  PricingCalculationResult,
  CalculatedLineItem,
  DiscountType,
  ScopeType
} from './types'

function roundDecimal(val: Decimal): Decimal {
  // Round to 2 decimal places for financial safety, using ROUND_HALF_EVEN (banker's rounding)
  // Decimal.js uses set rounding modes, but we can just use toDecimalPlaces(2)
  return val.toDecimalPlaces(2)
}

function isEligible(
  appliesTo: ScopeType,
  targetIds: string[],
  productId: string,
  collectionId?: string | null,
  projectType?: string | null
): boolean {
  if (appliesTo === 'GLOBAL') return true
  if (appliesTo === 'PRODUCT' && targetIds.includes(productId)) return true
  if (appliesTo === 'COLLECTION' && collectionId && targetIds.includes(collectionId)) return true
  if (appliesTo === 'PROJECT_TYPE' && projectType && targetIds.includes(projectType)) return true
  return false
}

function calculateDiscountValue(
  type: DiscountType,
  value: Decimal,
  eligibleAmount: Decimal,
  maxDiscount?: Decimal | null
): Decimal {
  if (eligibleAmount.lte(0)) return new Decimal(0)
  
  let discountAmount = new Decimal(0)
  
  if (type === 'PERCENTAGE') {
    discountAmount = eligibleAmount.mul(value).div(100)
  } else if (type === 'FIXED') {
    discountAmount = value
  }

  // Cap at maxDiscount if provided
  if (maxDiscount && discountAmount.gt(maxDiscount)) {
    discountAmount = maxDiscount
  }

  // Cap at eligibleAmount (cannot discount more than the subtotal)
  if (discountAmount.gt(eligibleAmount)) {
    discountAmount = eligibleAmount
  }

  return roundDecimal(discountAmount)
}

export function calculateQuote(request: QuoteCalculationRequest): PricingCalculationResult {
  // 1. Price Conflict Protection
  if (request.hasPriceConflict) {
    return {
      items: [],
      subtotal: new Decimal(0),
      promotionDiscount: new Decimal(0),
      couponDiscount: new Decimal(0),
      finalTotal: new Decimal(0),
      priceState: 'PRICE_REQUIRES_CONFIRMATION'
    }
  }

  const items: CalculatedLineItem[] = []
  let globalSubtotal = new Decimal(0)

  // 2. Base Line Item Subtotals
  for (const item of request.items) {
    const lineSubtotal = item.basePrice.mul(item.quantity)
    globalSubtotal = globalSubtotal.plus(lineSubtotal)
    
    items.push({
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      baseUnitPrice: item.basePrice,
      lineSubtotal,
      promotionDiscount: new Decimal(0),
      couponDiscount: new Decimal(0),
      finalLineTotal: lineSubtotal
    })
  }

  let totalPromotionDiscount = new Decimal(0)
  let totalCouponDiscount = new Decimal(0)

  // 3. Apply Promotion (if any)
  if (request.promotion) {
    // Check min order value
    const meetsMin = !request.promotion.minOrderValue || globalSubtotal.gte(request.promotion.minOrderValue)
    
    if (meetsMin) {
      if (request.promotion.appliesTo === 'GLOBAL' && request.promotion.type === 'FIXED') {
        // Spread fixed discount globally or just apply at order level? 
        // User requested: "Line Item Base Price -> ... The exact ordering must be centralized."
        // Fixed global discount is applied to the global subtotal.
        const discount = calculateDiscountValue(request.promotion.type, request.promotion.value, globalSubtotal)
        totalPromotionDiscount = discount
      } else {
        // Percentage global, or scoped promotions apply item-by-item
        let eligibleSubtotalForPromo = new Decimal(0)
        const eligibleItemIndices: number[] = []

        for (let i = 0; i < items.length; i++) {
          const orig = request.items[i]
          if (isEligible(request.promotion.appliesTo, request.promotion.targetIds, orig.productId, orig.collectionId, orig.projectType)) {
            eligibleSubtotalForPromo = eligibleSubtotalForPromo.plus(items[i].lineSubtotal)
            eligibleItemIndices.push(i)
          }
        }

        const discount = calculateDiscountValue(request.promotion.type, request.promotion.value, eligibleSubtotalForPromo)
        totalPromotionDiscount = discount

        // Pro-rate discount across eligible items
        if (discount.gt(0) && eligibleSubtotalForPromo.gt(0)) {
          let distributed = new Decimal(0)
          for (let i = 0; i < eligibleItemIndices.length; i++) {
            const idx = eligibleItemIndices[i]
            if (i === eligibleItemIndices.length - 1) {
              // last item gets the remainder to avoid rounding lost pennies
              items[idx].promotionDiscount = discount.minus(distributed)
            } else {
              const weight = items[idx].lineSubtotal.div(eligibleSubtotalForPromo)
              const itemDiscount = roundDecimal(discount.mul(weight))
              items[idx].promotionDiscount = itemDiscount
              distributed = distributed.plus(itemDiscount)
            }
          }
        }
      }
    }
  }

  // Calculate Subtotal post-promotion
  let subtotalPostPromo = globalSubtotal.minus(totalPromotionDiscount)
  if (subtotalPostPromo.lt(0)) subtotalPostPromo = new Decimal(0)

  // 4. Apply Coupon (if any)
  if (request.coupon) {
    const meetsMin = !request.coupon.minSubtotal || subtotalPostPromo.gte(request.coupon.minSubtotal)

    if (meetsMin) {
      if (request.coupon.appliesTo === 'GLOBAL' && request.coupon.type === 'FIXED') {
        const discount = calculateDiscountValue(request.coupon.type, request.coupon.value, subtotalPostPromo, request.coupon.maxDiscount)
        totalCouponDiscount = discount
      } else {
        // Calculate eligible amount based on items post-promotion
        let eligibleSubtotalForCoupon = new Decimal(0)
        const eligibleItemIndices: number[] = []

        for (let i = 0; i < items.length; i++) {
          const orig = request.items[i]
          if (isEligible(request.coupon.appliesTo, request.coupon.targetIds, orig.productId, orig.collectionId, orig.projectType)) {
            const itemPostPromoSubtotal = items[i].lineSubtotal.minus(items[i].promotionDiscount)
            if (itemPostPromoSubtotal.gt(0)) {
              eligibleSubtotalForCoupon = eligibleSubtotalForCoupon.plus(itemPostPromoSubtotal)
              eligibleItemIndices.push(i)
            }
          }
        }

        const discount = calculateDiscountValue(request.coupon.type, request.coupon.value, eligibleSubtotalForCoupon, request.coupon.maxDiscount)
        totalCouponDiscount = discount

        // Pro-rate discount across eligible items
        if (discount.gt(0) && eligibleSubtotalForCoupon.gt(0)) {
          let distributed = new Decimal(0)
          for (let i = 0; i < eligibleItemIndices.length; i++) {
            const idx = eligibleItemIndices[i]
            if (i === eligibleItemIndices.length - 1) {
              items[idx].couponDiscount = discount.minus(distributed)
            } else {
              const itemPostPromoSubtotal = items[idx].lineSubtotal.minus(items[idx].promotionDiscount)
              const weight = itemPostPromoSubtotal.div(eligibleSubtotalForCoupon)
              const itemDiscount = roundDecimal(discount.mul(weight))
              items[idx].couponDiscount = itemDiscount
              distributed = distributed.plus(itemDiscount)
            }
          }
        }
      }
    }
  }

  // 5. Finalize Line Items
  for (const item of items) {
    let final = item.lineSubtotal.minus(item.promotionDiscount).minus(item.couponDiscount)
    if (final.lt(0)) final = new Decimal(0)
    item.finalLineTotal = final
  }

  let finalTotal = globalSubtotal.minus(totalPromotionDiscount).minus(totalCouponDiscount)
  if (finalTotal.lt(0)) finalTotal = new Decimal(0)

  return {
    items,
    subtotal: globalSubtotal,
    promotionDiscount: totalPromotionDiscount,
    couponDiscount: totalCouponDiscount,
    finalTotal,
    appliedPromotionId: request.promotion?.id,
    appliedCouponId: request.coupon?.id,
    priceState: 'VALID'
  }
}
