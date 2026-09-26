# ZEN ARCH — BUSINESS OS AUDIT

## 1. CURRENT STATE & GAPS

### A. Current Admin Editable Fields
- **Products:** Basic listing exists, but detailed editing (specifications, dimension parsing, categories, tags) is largely missing or brittle.
- **Inventory:** Basic inventory counts are tracked, but full stock movement auditing and low-stock alerts are minimal.
- **Customers & Quotes:** Read-only views for quotes and orders. State mutations (approving quotes) are present but lack versioning or discount applications.

### B. Public Fields Missing Admin Control
- **Hero & Homepage Content:** Currently hardcoded React components.
- **Best Sellers / Featured Flags:** Hardcoded or missing explicit merchandising toggles.
- **Services:** Hardcoded.
- **Public Projects:** Some data structure exists for `Project`, but no robust CMS UI to upload multi-image galleries, reorder them, or control SEO metadata.
- **Product Details:** Dimensions are often unstructured strings (`dimensions: String?`); no dedicated admin UI for parsing AR capabilities, variant pricing, or specific merchandising tags.

### C. Missing Media Control
- Currently, images are just strings pointing to URLs in Postgres.
- **No Media Manager:** Admins cannot drag/drop, replace, or set alt text easily. 

### D. Hardcoded Project / Work Sections
- `app/projects` and `app/services` rely on static or minimal database fetching without a robust CMS backend. 

### E. Merchandising & Merchandising Gaps
- Best sellers and featured products are missing proper DB triggers or admin manual controls.

### F. Pricing & Discount Gaps
- No `Promotion`, `Coupon`, or `Discount` models exist in Prisma.
- `Quote` models exist but cannot apply line-item or global discounts.

### G. Coupon Capability
- Completely missing.

### H. Customer Authentication UX
- Exists basically through Supabase SSR, but lacks a polished, luxury "ZEN ARCH" styled flow for `/login`, `/signup`, `/forgot-password`, or OTP magic links.

### I. CRM & Pipeline Gaps
- **Missing `Lead` Model:** No structured tracking for inbound leads (WhatsApp, AI, website forms).
- Quotes are the only "pipeline" object, but a Quote is a late-stage artifact, not an early-stage Lead.

### J. Lead / Follow-Up Capabilities
- No assigned owners, no `nextAction`, no `nextFollowUpAt`, no "Due Today" dashboard.

### K. Transactional Email Gaps
- Entirely missing custom templates (React Email). Supabase default templates are used. No event-driven workflow for `QUOTE_CREATED`, `ORDER_CONFIRMED`, `BOARD_INVITED`.

### L. Marketing Automation Gaps
- No segmentation, no newsletter opt-in tracking, no campaign management.

### M. SEO Gaps
- No dynamic XML sitemaps, no `LocalBusiness` Schema.org JSON-LD, missing explicit admin fields for Canonical, Meta Description, and OG Images.

### N. Analytics Gaps
- No tracking for `AI_query`, `reality_check_run`, `whatsapp_clicked`, or sales attribution (UTMs).

### O. Security Gaps
- `requireAdmin()` exists, but granular roles (Staff vs Super Admin) are not enforced on individual fields or actions. AI endpoints lack strict rate-limiting.

---

## 2. RECOMMENDED IMPLEMENTATION ORDER

As requested, the transition to the Business OS will follow strict sub-phases.

1. **H1 - ADMIN STUDIO REBUILD:** Implement the new sidebar, routing, and robust CRUD for Products, Projects, and CMS content.
2. **H2 - PRICING / PROMOTIONS / COUPONS:** Add database models for coupons and discounts, and integrate them safely into Quotes and Orders without mutating historical prices.
3. **H3 - CRM + SALES OPERATIONS:** Build the Leads pipeline, ownership assignment, and WhatsApp handoff flow.
4. **H4 - EMAIL + NOTIFICATION ENGINE:** Integrate Resend/React Email for transactional and marketing communications.
5. **H5 - AI SPECIALIST AGENTS:** Deploy controlled agents (Sales Ops, Marketing, SEO) with human-in-the-loop approval.
6. **H6 - SEO + SEARCH INTELLIGENCE:** Dynamic sitemaps, JSON-LD structured data, and local SEO optimizations.
7. **H7 - ANALYTICS + ATTRIBUTION:** Unified tracking events.
8. **H8 - SECURITY + PRODUCTION HARDENING:** Final audits, rate limits, and deployment QA.
