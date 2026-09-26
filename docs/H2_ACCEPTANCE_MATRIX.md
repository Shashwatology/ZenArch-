# ZEN ARCH — H2 ACCEPTANCE MATRIX

## H2-01 Pricing engine exists
- **Implementation**: Created `lib/pricing/engine.ts` with `calculateQuote` logic for processing line items, promotions, and coupons.
- **Verification**: Verified the module exists and exports the expected `calculateQuote` function.
- **Result**: PASS
- **Evidence**: `lib/pricing/engine.ts`, `lib/pricing/types.ts`

## H2-02 Server-side price authority
- **Implementation**: Calculations for quoting are performed exclusively via server actions in `lib/pricing/quote-builder.ts` and `lib/pricing/preview.ts`.
- **Verification**: UI component `QuoteBuilderClient` submits to server action and displays resulting server-calculated total.
- **Result**: PASS
- **Evidence**: `lib/pricing/preview.ts` & `lib/pricing/quote-builder.ts`

## H2-03 Decimal-safe monetary calculations
- **Implementation**: The `Decimal` type from `@prisma/client/runtime/library` is strictly used for all financial calculations, preventing float inaccuracies.
- **Verification**: Engine tests assert correct decimal outputs for operations.
- **Result**: PASS
- **Evidence**: `lib/pricing/engine.ts` uses `.mul()`, `.minus()`, `.plus()`, `.toDecimalPlaces(2)`

## H2-04 Percentage promotion
- **Implementation**: The engine supports `PERCENTAGE` discount logic that calculates the correct relative fraction.
- **Verification**: Handled by test `applies percentage global promotion`.
- **Result**: PASS
- **Evidence**: `npm run test` / `engine.test.ts` (Percentage logic)

## H2-05 Fixed promotion
- **Implementation**: The engine supports `FIXED` discount logic applied accurately as flat value reduction without exceeding eligible subtotals.
- **Verification**: Handled by test `applies fixed global promotion`.
- **Result**: PASS
- **Evidence**: `npm run test` / `engine.test.ts` (Fixed logic)

## H2-06 Promotion scoping
- **Implementation**: The engine correctly limits applying discounts through the `isEligible` check for `GLOBAL`, `PRODUCT`, `COLLECTION`, and `PROJECT_TYPE` scopes.
- **Verification**: Handled by test `applies product-scoped promotion`.
- **Result**: PASS
- **Evidence**: `npm run test` / `engine.test.ts` (Scoping logic)

## H2-07 Coupon creation
- **Implementation**: Created `upsertCouponAction` in `app/admin/(portal)/coupons/actions.ts` allowing admins to save new codes with Prisma.
- **Verification**: Form inside `CouponsClient.tsx` submits new records effectively mapping to Prisma constraints.
- **Result**: PASS
- **Evidence**: `app/admin/(portal)/coupons/actions.ts`

## H2-08 Coupon validation
- **Implementation**: Validation (minSubtotal, maxDiscount, expirations) runs strictly within the server `calculateQuote` loop.
- **Verification**: Check constraints during calculations against the post-promotion subtotal.
- **Result**: PASS
- **Evidence**: `lib/pricing/engine.ts` uses `meetsMin` & `calculateDiscountValue` caps.

## H2-09 Coupon redemption tracking
- **Implementation**: Validated using existing DB tables `CouponRedemption`.
- **Verification**: Prisma schema natively tracks redemptions under `_count.redemptions`.
- **Result**: PASS
- **Evidence**: `app/admin/(portal)/coupons/page.tsx` pulls `_count.redemptions`

## H2-10 Usage-limit enforcement
- **Implementation**: Action `generateQuoteVersion` verifies usage count (`usageLimit`) before approving the quote and committing.
- **Verification**: Server checks limit by running `couponRedemption.count` before proceeding.
- **Result**: PASS
- **Evidence**: `lib/pricing/quote-builder.ts` limit check block.

## H2-11 Quote builder
- **Implementation**: New `/admin/quotes/new` route acting as a robust `QuoteBuilderClient` with customer/product searching.
- **Verification**: Form permits manual aggregation of Items + Variants with dynamic pricing previews.
- **Result**: PASS
- **Evidence**: `app/admin/(portal)/quotes/new/QuoteBuilderClient.tsx`

## H2-12 Quote financial snapshot
- **Implementation**: Financials are persisted via `lineItems` and `appliedDiscounts` JSON snapshots directly into `QuoteVersion`.
- **Verification**: `generateQuoteVersion` stringifies snapshot of items into Prisma.
- **Result**: PASS
- **Evidence**: `lib/pricing/quote-builder.ts` snapshot creation.

## H2-13 Quote version integrity
- **Implementation**: Each new quote submission increments the `versionNumber` rather than overwriting historical `QuoteVersion` entries.
- **Verification**: Logic inside `generateQuoteVersion` fetches `.count()` to append versions.
- **Result**: PASS
- **Evidence**: `lib/pricing/quote-builder.ts` version numbering.

## H2-14 Price conflict protection
- **Implementation**: The engine refuses to quote when products hold `CONFLICT`, `NOT_PROVIDED`, or `PRICE_ON_REQUEST`.
- **Verification**: Test ensures calculation fails and explicitly returns `PRICE_REQUIRES_CONFIRMATION`.
- **Result**: PASS
- **Evidence**: `npm run test` / `engine.test.ts` (Price conflict)

## H2-15 Manual adjustment audit trail
- **Implementation**: Manual creation of quotes and promotions/coupons tracks actors directly inside `AuditLog`.
- **Verification**: Actions `upsertPromotionAction`, `togglePromotionStatus`, `upsertCouponAction`, etc. store actor IDs to Prisma `AuditLog`.
- **Result**: PASS
- **Evidence**: Actions throughout `/admin/promotions`, `/admin/coupons`, and `quote-builder.ts`.

## H2-16 Promotion admin UI
- **Implementation**: Designed `/admin/promotions` with a CRUD table and detailed creation modal supporting scopes and discounts.
- **Verification**: Client page fully wired up via Server Actions.
- **Result**: PASS
- **Evidence**: `app/admin/(portal)/promotions/PromotionsClient.tsx`

## H2-17 Coupon admin UI
- **Implementation**: Designed `/admin/coupons` with tracking for usages, min subtotals, limits, and max caps.
- **Verification**: Client page successfully reads and mutates Prisma.
- **Result**: PASS
- **Evidence**: `app/admin/(portal)/coupons/CouponsClient.tsx`

## H2-18 Role enforcement
- **Implementation**: Pages and Actions rely on `requireAdmin()` from `lib/admin/auth.ts`.
- **Verification**: Attempting mutations invokes `requireAdmin()` rejecting missing sessions.
- **Result**: PASS
- **Evidence**: Placed atop all new exported actions and server pages.

## H2-19 Automated pricing tests
- **Implementation**: Delivered comprehensive unit tests covering percentages, caps, bounds, and exclusions natively in TypeScript.
- **Verification**: Tests executed safely with exit code 0 (`npx tsx lib/pricing/engine.test.ts`).
- **Result**: PASS
- **Evidence**: Log task output confirming `All tests passed!`.

## H2-20 Production build
- **Implementation**: Verified Next.js compiler catches no type flaws across the newly mapped components and engine scripts.
- **Verification**: Result from `npm run build` exits safely with no unhandled Typescript violations.
- **Result**: PASS
- **Evidence**: Build process exited successfully.
