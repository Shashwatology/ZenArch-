# Technical Architecture & Project Documentation: Zen Arch Interior Solution

**Sole Technical Owner & Architect:** Antigravity (Google DeepMind)  
**Version:** 2.0.0 — Single-Agent Architecture  

---

## 1. Project Context & Charter

Zen Arch is now a single-agent implementation project.

Antigravity is the sole development agent responsible for:
- UX/UI
- frontend
- 3D
- Framer Motion
- backend
- database
- CMS
- CRM
- AI/RAG
- integrations
- analytics
- SEO
- QA
- deployment

`AGENT_COORDINATION.md` is treated strictly as project documentation, not as a coordination mechanism with another coding agent. All architectural contracts and interface boundaries exist to guarantee clean modular separation within the backend integration / server layer and client presentation layer.

---

## 2. Approved Brand Coordinates

- **Brand:** Zen Arch Interior Solution
- **Founder & Creative Director:** Rohit Pathak
- **Email:** zenarchsolution@gmail.com
- **Phone:** +91 93729 21244
- **WhatsApp:** +919372921244
- **Studio Location:**  
  Office No. 17,  
  Vijay Building,  
  Vijay Print Bus Stop,  
  Opp. Mehra Compound,  
  Saki Naka,  
  Mumbai,  
  Maharashtra 400072,  
  India  
*(Notice: Zen Arch operates Pan-India from Mumbai. No overseas or Dubai references).*

---

## 3. Architecture & Core Stack

- **Framework:** Next.js 16.3.3 (App Router with Turbopack)
- **UI & Logic:** React 19.2.8, TypeScript 5
- **Styling:** Tailwind CSS v4, Vanilla CSS design tokens
- **Motion & Interaction:** Framer Motion 13
- **Spatial 3D:** Three.js 0.185 + React Three Fiber 9 + React Three Drei 10 (architectural, product-grounded, progressive loading)
- **Data & Persistence:** Prisma 8 with SQLite / PostgreSQL, normalized catalogue data structures
- **AI Suite:** Grounded conversational consultant (`/ai`) and spatial planner (`/ai/transform-space`) strictly bounded to verified catalogue dimensions, materials, and pricing terms.

---

## 4. Complete Catalogue Ingestion Requirement

Zen Arch catalogues and all verified source materials are normalized into a unified schema:
- Sofas & Lounges (Vegas, Flame, Lopez, etc.)
- Puffy Collection & Sculptural Benches (Gold, Zoya, Majesty, Drum, Novel, etc.)
- Executive Collection
- Table & Stand Collection
- Prince Collection
- All additional verified items from supplied catalogues and legitimate sources.

Every product record preserves:
- Product name, slug, category, subcategory
- High-fidelity imagery & 3D asset status
- Exact dimensions (length, depth, height, seat height in inches/ft)
- Configuration / seater options (Single, Two, Three, Sectional, Custom)
- Meterage requirements (fabric / leather)
- Material and structural specifications (kiln-dried teak, high-density foam, brass hardware)
- Pricing, GST terms, and Ex-Warehouse shipping notes
- Source catalogue name, publication date, and page reference
- Admin-controlled active price resolution for any historical price discrepancies.

---

## 5. Execution Roadmap

| Phase | Milestone Scope | Status |
| :--- | :--- | :--- |
| **Milestone 1** | **Design System, Navigation, 3D Infrastructure, and Completely Rebuilt Homepage** (ENTER → BREATHE → DISCOVER → EXPLORE → INTERACT → IMAGINE → ENQUIRE) | **ACTIVE** |
| **Milestone 2** | Complete Catalogue Ingestion (Sofas, Puffy, Executive, Table & Stand, Prince) & Catalogue Exploration (`/furniture`, `/furniture/[category]`, `/furniture/[slug]`) | Queued |
| **Milestone 3** | Projects Gallery & Architectural Services Portfolios (`/projects`, `/services`) | Queued |
| **Milestone 4** | 8-Step Interactive Consultation Suite (`/consultation`) with WhatsApp & Lead Routing | Queued |
| **Milestone 5** | Grounded Zen Arch AI Studio & Spatial Visualizer (`/ai`, `/ai/transform-space`) | Queued |
| **Milestone 6** | Backend Integration / Server Layer, Prisma Persistence, CRM & Leads API | Queued |
| **Milestone 7** | End-to-End Browser QA, Accessibility, SEO & Lighthouse Performance Polish | Queued |
