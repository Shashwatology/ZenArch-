# ZEN ARCH — BUSINESS OS ARCHITECTURE

## 1. PROPOSED DATABASE CHANGES
To support the Business OS, the following additions will be made to the Prisma Schema:

- **CRM Models:**
  - `Lead`: id, name, phone, email, source, interest, budget, projectType, assignedTo (relation to User), status, nextAction, nextFollowUpAt, notes.
- **Promotions & Coupons:**
  - `Promotion`: id, type (PERCENTAGE, FIXED), value, appliesTo (Product, Collection, ProjectType), active, startAt, endAt.
  - `Coupon`: code (unique), type, value, minSubtotal, maxDiscount, usageLimit, perCustomerLimit, active, startAt, expiresAt.
  - `CouponRedemption`: relation to Coupon, User, Order/Quote.
- **Quote Enhancements:**
  - `QuoteVersion`: To support quote versioning (Version 1, Version 2) without mutating the original.
  - Line-item notes, applied discounts, and explicit tax configurations.
- **CMS & SEO Models:**
  - `PageContent`: id, route, heroCopy, seoTitle, seoDescription, canonical, ogImage, published.
  - SEO fields added directly to `Product` and `Project` models.
- **Event & Email Logs:**
  - `EmailLog`: id, userId, type (WELCOME, QUOTE_READY), status, opened, clicked.

## 2. PROPOSED ROUTES

**Admin Navigation:**
- `/admin/login`: Secure, dedicated admin auth.
- `/admin`: Overview / Dashboard.
- `/admin/products`: Enhanced CRUD + Media Manager + SEO fields.
- `/admin/inventory`: Stock, low stock alerts, movements.
- `/admin/media`: Dedicated object storage visual interface.
- `/admin/merchandising`: Featured, Best Sellers, Coupons, Promotions.
- `/admin/content`: Homepage CMS, Pages, Projects, Services.
- `/admin/leads`: CRM pipeline, due today, overdue.
- `/admin/quotes`: Quote builder, version history.
- `/admin/analytics`: Unified sales, AI queries, and SEO metrics.

**Public Customer Auth:**
- `/login`, `/signup`, `/forgot-password`: High-end, luxury UI integrating Supabase Auth (Email/Pass + OTP).

## 3. PROPOSED PERMISSIONS
- **SUPER_ADMIN**: Full access to settings, user roles, destructive bulk actions, and raw AI prompts.
- **ADMIN**: Access to catalogue, CRM, CMS, and pricing, but cannot change global security settings.
- **STAFF**: Can manage Leads, Quotes, and Projects, but cannot change catalogue base prices or create global promotions.
- **CUSTOMER**: Can only read their own data, quotes, orders, and spatial sessions.

## 4. PROPOSED EMAIL & EVENT ARCHITECTURE
- **Provider:** Supabase Auth for auth delivery (via custom SMTP); Resend for transactional/marketing emails.
- **Event Bus:** Server Actions will emit structured events:
  - `USER_CREATED`, `EMAIL_VERIFIED`, `QUOTE_CREATED`, `ORDER_CONFIRMED`, `BOARD_INVITED`.
- **React Email:** A unified design system located in `/emails` containing modular components (header, footer, product card).

## 5. PROPOSED AI-AGENT ARCHITECTURE
No autonomous swarms. Agents act as isolated API endpoints with human-in-the-loop workflows:
1. **Sales Ops Agent:** Summarizes leads, drafts WhatsApp follow-ups. (Triggered by staff in CRM).
2. **Market Intelligence Agent:** Analyzes industry trends via search APIs. (On-demand admin tool).
3. **Marketing Agent:** Drafts promotional emails and SEO content. (Admin reviews and clicks "Approve").
4. **SEO Agent:** Audits internal links, missing meta descriptions, and alt text. (Scheduled task / manual run).
5. **Business Insights Agent:** Generates the Daily Brief (Internal business report).

## 6. PROPOSED SEO ARCHITECTURE
- **Structured Data:** Next.js `generateMetadata` and `json-ld` injection for `Product`, `ProductGroup`, `Organization`, `LocalBusiness`, and `BreadcrumbList`.
- **Dynamic Sitemap:** `app/sitemap.ts` pulling live, published products and projects.
- **Admin Control:** Every entity will have explicitly editable SEO fields (Title, Description, Canonical, OG Image), with validations preventing empty or duplicate canonicals.

## 7. PROPOSED IMPLEMENTATION ORDER
- **H0:** Business OS Audit (Current Phase).
- **H1:** Admin Studio Rebuild (Navigation, UX, Media, CMS).
- **H2:** Pricing / Promotions / Coupons.
- **H3:** CRM + Sales Operations (WhatsApp-first Lead Pipeline).
- **H4:** Email + Notification Engine (Resend + React Email).
- **H5:** AI Specialist Agents (Human-in-the-loop).
- **H6:** SEO + Search Intelligence.
- **H7:** Analytics + Attribution.
- **H8:** Security + Production Hardening.

## 8. RISKS & BLOCKERS
- **Database Migrations:** Modifying historical quotes and adding versioning requires careful data preservation for existing records.
- **Object Storage Migration:** If currently relying on Postgres blobs, migrating to Supabase Storage or S3 requires a script to move existing assets and update URLs.
- **Email Deliverability:** Transitioning from Supabase default email to custom SMTP/Resend requires domain verification (SPF/DKIM/DMARC) which must be configured externally by the domain owner.
