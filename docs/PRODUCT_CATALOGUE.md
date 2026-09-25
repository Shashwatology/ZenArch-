# ZEN ARCH COMPLETE PRODUCT CATALOGUE AUDIT
**Date:** 2026-09-17 (Updated 2026-09-24 for V1.2 AI Architecture)

## 1. SOURCE DOCUMENTS AUDITED
1. ZEN EXECUTIVE SERIES - PRICELIST MAY 26_.pdf (35 Pages)
2. ZEN TABLE & STAND SERIES - PRICELIST MAY 2026.pdf (41 Pages)
3. ZEN PRINCE SERIES 2 - PRICELIST WEF 1STMAY 2026.pdf (32 Pages)
4. _ZEN SOFA LIFESTYLE PRICELIST_ AUG26.pdf (40 Pages)
5. ZEN SOFA SERIES - PRICELIST MAY 2026.pdf (21 Pages)
6. ZEN PUFFY SERIES 2 -PRICELIST WEF 1ST MAY 2026.pdf (29 Pages)

**TOTAL SOURCE DOCUMENTS:** 6
**TOTAL PAGES:** 198

## 2. LEDGER VS VERIFIED AI CATALOGUE RECONCILIATION
*CRITICAL ARCHITECTURE NOTE: Do NOT alter this logic or reintroduce flagged records.*

The raw extraction `MASTER_PRODUCT_LEDGER.csv` contains exactly **343 parent products** (+ 40 variants, totaling 383 rows if flattened). 

However, **only 330 products** are compiled into the active `furniture_db.json` and exposed to the ZEN ARCH AI and Showroom UI.

**Why 330 instead of 343?**
Exactly 13 records from the raw OCR extraction were flagged as `NEEDS_REVIEW` during the V1.1 data sanitization phase. These are not real furniture pieces; they are visual/textual artifacts from the PDF catalogs that the OCR engine incorrectly mapped as products.

The 13 quarantined artifacts are:
1. `AVAILABLE IN :`
2. `IND`
3. `COLOUR :`
4. `540*510`
5. `SHS SET - 38000/-`
6. `ST 52`
7. `750 Ø X 750 h`
8. `T18`
9. `N-M`
10. `Height Adjustable (with Top)`
11. `FRAME : Z207 | Z208`
12. `DOUBLE MOTOR`
13. `MY CHAIR MY PRIDE`

The build script `generate_db.py` explicitly drops these 13 records. **Never attempt to "fix" the missing 13 records by modifying `generate_db.py` to include `NEEDS_REVIEW` rows, as it will cause the AI to hallucinate text artifacts as physical inventory.**

## 3. BREAKDOWN BY CATEGORY

- **SOFAS:** 39
- **PUFFY:** 28
- **EXECUTIVE:** 55
- **TABLE & STANDS:** 165
- **PRINCE:** 30
- **OTHER:** 0

**ASSET & DATA STATUS:**
- **TOTAL WITH IMAGES:** 330 (Extracted and mapped)
- **TOTAL WITH PRICES:** 330 (Some may have `priceStatus: CONFLICT` which the AI correctly handles)
- **TOTAL WITH DIMENSIONS:** 204 (Sofas and Tables have dimensions; Executive, Puffy, and Prince lack exact measurements in the PDFs)
- **TOTAL WITH SPECIFICATIONS:** 166 (Sofas, Tables, Executive; Prince and Puffy lack material specs)

## 4. DATA INTEGRITY

- **DUPLICATES:** 0 (Names like Zara, June, and Oxy appearing across different categories have been assigned unique `id` hashes like `zara-prince` and `zara-sofas`).
- **PRICE CONFLICTS:** 4 Detected (AI handles these gracefully via `PRICE ON REQUEST`)
  1. **FORTUNE (IMP) Sofa:** May 2026 Edition lists 30k/42k/56k. Aug 2026 Edition lists 34k/48k/62k.
  2. **TIARA Sofa:** May 2026 Edition lists 44k/58k/72k. Aug 2026 Edition lists 32k/54k/68k.
  3. **TOKYO Sofa:** Typo in May 2026 Edition lists 284000/- vs Aug 2026 Edition lists 28000/-
  4. **MAPPLE Sofa:** Typo in May 2026 Edition lists 2945000/- vs Aug 2026 Edition lists 29500/-

## 5. DETAILED COLLECTION INVENTORY

### SOFAS (39)
NOVA, ARCUS, CANVAS, VEGAS, LOPEZ, FLAME, ZURICH, NEW VOGUE, CHESTER, HERITAGE, IMPERIAL, GLAMOUR, FORTUNE (IMP), LIBERTY, LIBERTY GOLD, TOKYO, MAPPLE, ZARA, OXY, SPENCER (IMP), JUNE, DREAM, MERIDIAN, CALIFORNIA, SAPHIRE, CURVE, TIARA, FLORANCE, MONTANA, CORBUSIER, BARCELONA, KITKAT, HAVOC, FUTON, VERONICA, BENZ, CRYSTAL, NERO, AERO.

### PUFFY (28)
ALBERT, LIBRA, TORRY, KENZI, VITRO, EVA, GOLD, RENO, OPAL, ASTRO, DIOR, FLOW, MERRY, MOON, CAPSULE, MUSHROOM, VIBE, SNUG, LUME, BLOOMINGTON, BOLT, HUSH, DRIFT, ZOYA, MAJESTY, LOUIS, DRUM, NOVEL.

### EXECUTIVE (55)
FREEDOM, FALCON ELITE, NORWAY, ROOSTER, DESTINY, BASSEL, MUSE, GAMMA, GALAXY, ZOY, ACOSTA, CROSS, PERTH, SPARK, TROY, WISDOM, WINNER, ERGON MESH, ERGON CUSH, GLAZE MESH, GLAZE CUSHION, DECA, HEXA, TRIO, OCTA, KARINA DLX, OMEGA, ATOM DLX, EON DLX, MARQUIS, ATTITUDE, BENTLEY, CALVIN, MARTIN, OYSTER, MAGNET, WINSTER, JAGUAR, TRUST, HERITAGE, LEGACY, DAISY, EPSON, MAVERICK, STANLEY, BOSS, AUSTIN, DACOTA, OXFORD, DUSTER, VIRGO, VENICE, LUCY, ELITE SLEEK, SLEEK.

### TABLE & STANDS
Extensive sub-catalogue consisting of Centre Tables, Side Tables, Consoles, Cafe Tables, and Table/Frame combinations.

### PRINCE (30)
Quartz, Paradox, Ferrari, Valour, Soho, Tiago, Allure, Pebble, Crafty, Marina, Osaka, Azzura, Cassina, Meraki, Scorpio, Tiesto, Avita, June, Rolf, Symphony, Lancer, Zara, Zara without arms, Oxy, Finista, Ethan, Antonia, Mackanzy, mustang, Maharaja.
