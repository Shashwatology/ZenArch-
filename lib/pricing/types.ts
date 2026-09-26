import { Decimal } from '@prisma/client/runtime/library'

export type DiscountType = 'PERCENTAGE' | 'FIXED'
export type ScopeType = 'GLOBAL' | 'PRODUCT' | 'COLLECTION' | 'PROJECT_TYPE'

export interface PricingLineItemInput {
  productId: string
  variantId?: string | null
  quantity: number
  basePrice: Decimal
  // additional metadata
  collectionId?: string | null
  projectType?: string | null
}

export interface PromotionInput {
  id: string
  type: DiscountType
  value: Decimal
  appliesTo: ScopeType
  targetIds: string[]
  minOrderValue?: Decimal | null
}

export interface CouponInput {
  id: string
  code: string
  type: DiscountType
  value: Decimal
  appliesTo: ScopeType
  targetIds: string[]
  minSubtotal?: Decimal | null
  maxDiscount?: Decimal | null
}

export interface CalculatedLineItem {
  productId: string
  variantId?: string | null
  quantity: number
  baseUnitPrice: Decimal
  lineSubtotal: Decimal // quantity * baseUnitPrice
  
  // discount allocations
  promotionDiscount: Decimal
  couponDiscount: Decimal
  
  finalLineTotal: Decimal
}

export interface PricingCalculationResult {
  items: CalculatedLineItem[]
  
  subtotal: Decimal
  promotionDiscount: Decimal
  couponDiscount: Decimal
  finalTotal: Decimal
  
  appliedPromotionId?: string
  appliedCouponId?: string
  
  priceState: 'VALID' | 'PRICE_REQUIRES_CONFIRMATION'
}

export interface QuoteCalculationRequest {
  items: PricingLineItemInput[]
  promotion?: PromotionInput | null
  coupon?: CouponInput | null
  hasPriceConflict?: boolean
}
