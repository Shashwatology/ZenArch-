import { calculateQuote } from './engine'
import { QuoteCalculationRequest } from './types'
import { Decimal } from '@prisma/client/runtime/library'
import assert from 'assert'

const D = (v: number | string) => new Decimal(v)

async function runTests() {
  console.log("Running Pricing Engine Tests...")

  // Test 1
  let req: QuoteCalculationRequest = {
    items: [
      { productId: 'p1', quantity: 2, basePrice: D(1000) }
    ]
  }
  let res = calculateQuote(req)
  assert.strictEqual(res.priceState, 'VALID')
  assert.strictEqual(res.subtotal.toString(), '2000')
  assert.strictEqual(res.promotionDiscount.toString(), '0')
  assert.strictEqual(res.couponDiscount.toString(), '0')
  assert.strictEqual(res.finalTotal.toString(), '2000')
  assert.strictEqual(res.items[0].finalLineTotal.toString(), '2000')
  console.log("✅ Basic calculation works")

  // Test 2
  req = {
    hasPriceConflict: true,
    items: [
      { productId: 'p1', quantity: 1, basePrice: D(1000) }
    ]
  }
  res = calculateQuote(req)
  assert.strictEqual(res.priceState, 'PRICE_REQUIRES_CONFIRMATION')
  assert.strictEqual(res.finalTotal.toString(), '0')
  console.log("✅ Price conflict protection works")

  // Test 3
  req = {
    items: [
      { productId: 'p1', quantity: 1, basePrice: D(1000) },
      { productId: 'p2', quantity: 2, basePrice: D(500) }
    ],
    promotion: {
      id: 'promo1',
      type: 'PERCENTAGE',
      value: D(10),
      appliesTo: 'GLOBAL',
      targetIds: []
    }
  }
  res = calculateQuote(req)
  assert.strictEqual(res.subtotal.toString(), '2000')
  assert.strictEqual(res.promotionDiscount.toString(), '200')
  assert.strictEqual(res.finalTotal.toString(), '1800')
  assert.strictEqual(res.items[0].promotionDiscount.toString(), '100')
  assert.strictEqual(res.items[1].promotionDiscount.toString(), '100')
  console.log("✅ Percentage global promotion works")

  // Test 4
  req = {
    items: [
      { productId: 'p1', quantity: 1, basePrice: D(1000) }
    ],
    promotion: {
      id: 'promo1',
      type: 'FIXED',
      value: D(150),
      appliesTo: 'GLOBAL',
      targetIds: []
    }
  }
  res = calculateQuote(req)
  assert.strictEqual(res.promotionDiscount.toString(), '150')
  assert.strictEqual(res.finalTotal.toString(), '850')
  console.log("✅ Fixed global promotion works")

  // Test 5
  req = {
    items: [
      { productId: 'p1', quantity: 1, basePrice: D(1000) },
      { productId: 'p2', quantity: 1, basePrice: D(1000) }
    ],
    promotion: {
      id: 'promo1',
      type: 'PERCENTAGE',
      value: D(50),
      appliesTo: 'PRODUCT',
      targetIds: ['p1']
    }
  }
  res = calculateQuote(req)
  assert.strictEqual(res.promotionDiscount.toString(), '500')
  assert.strictEqual(res.finalTotal.toString(), '1500')
  assert.strictEqual(res.items[0].promotionDiscount.toString(), '500')
  assert.strictEqual(res.items[1].promotionDiscount.toString(), '0')
  console.log("✅ Product-scoped promotion works")

  // Test 6
  req = {
    items: [
      { productId: 'p1', quantity: 1, basePrice: D(1000) }
    ],
    promotion: {
      id: 'promo1',
      type: 'PERCENTAGE',
      value: D(10),
      appliesTo: 'GLOBAL',
      targetIds: []
    },
    coupon: {
      id: 'coupon1',
      code: 'TEST20',
      type: 'PERCENTAGE',
      value: D(20),
      appliesTo: 'GLOBAL',
      targetIds: []
    }
  }
  res = calculateQuote(req)
  assert.strictEqual(res.promotionDiscount.toString(), '100')
  assert.strictEqual(res.couponDiscount.toString(), '180')
  assert.strictEqual(res.finalTotal.toString(), '720')
  console.log("✅ Global coupon over existing promotion works")

  // Test 7
  req = {
    items: [
      { productId: 'p1', quantity: 1, basePrice: D(10000) }
    ],
    coupon: {
      id: 'coupon1',
      code: 'TEST',
      type: 'PERCENTAGE',
      value: D(50),
      maxDiscount: D(2000),
      appliesTo: 'GLOBAL',
      targetIds: []
    }
  }
  res = calculateQuote(req)
  assert.strictEqual(res.couponDiscount.toString(), '2000')
  assert.strictEqual(res.finalTotal.toString(), '8000')
  console.log("✅ Coupon max discount cap works")

  console.log("🎉 All tests passed!")
}

runTests().catch(e => {
  console.error("Test failed:", e)
  process.exit(1)
})
