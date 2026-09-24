export interface ProductVariation {
  seater: "Single Seater" | "Two Seater" | "Three Seater" | "Standard" | "Custom";
  fabricMeters?: number | null;
  sizeFt?: string | number | null;
  priceInr: number;
  sourceEdition?: string;
}

export interface FurnitureProduct {
  id: string;
  slug: string;
  name: string;
  category: "sofas" | "puffy-collection" | "benches";
  categoryLabel: string;
  tagline: string;
  description: string;
  variations: ProductVariation[];
  basePrice: number;
  fabricRateNote?: string;
  isImported?: boolean;
  has3dModel?: boolean;
  specifications: {
    frameMaterial?: string;
    cushioning?: string;
    legFinish?: string;
    customizable?: boolean;
  };
  sourceCatalogue: {
    catalogueName: string;
    page: number;
    effectiveDate?: string;
  };
  pricingTerms: string;
}

export const FURNITURE_CATALOGUE: FurnitureProduct[] = [
  // ==========================================
  // SOFAS & LOUNGES
  // ==========================================
  {
    id: "sofa-vegas",
    slug: "vegas",
    name: "Vegas",
    category: "sofas",
    categoryLabel: "Sofas & Lounges",
    tagline: "Timeless design. Unmatched comfort.",
    description: "An architectural statement sofa featuring rounded enveloping arms, brass pipe hardware accents, and high-density pocketed coil cushioning.",
    basePrice: 56000,
    fabricRateNote: "Fabric: 500/- Mtr",
    has3dModel: true,
    variations: [
      { seater: "Single Seater", fabricMeters: 5.0, sizeFt: "3.50 ft", priceInr: 56000, sourceEdition: "2026 Catalogue" },
      { seater: "Two Seater", fabricMeters: 7.0, sizeFt: "5.25 ft", priceInr: 74000, sourceEdition: "2026 Catalogue" },
      { seater: "Three Seater", fabricMeters: 9.0, sizeFt: "7.25 ft", priceInr: 92000, sourceEdition: "2026 Catalogue" },
    ],
    specifications: {
      frameMaterial: "Solid kiln-dried hardwood structure",
      cushioning: "Dual-density high resilience foam with Dacron wrap",
      legFinish: "Brushed champagne gold metal legs",
      customizable: true,
    },
    sourceCatalogue: {
      catalogueName: "ZENARCH 2026 / Sofa Catalogue",
      page: 2,
    },
    pricingTerms: "All Prices are Ex-Warehouse. GST, Packing, Forwarding & Installation Charges extra as per actual.",
  },
  {
    id: "sofa-flame",
    slug: "flame",
    name: "Flame",
    category: "sofas",
    categoryLabel: "Sofas & Lounges",
    tagline: "Timeless design. Unmatched comfort.",
    description: "Horizontal channel-quilted armrests and deep-seated proportions resting on dual architectural brass column legs.",
    basePrice: 48500,
    fabricRateNote: "Fabric: 500/- Mtr",
    has3dModel: true,
    variations: [
      { seater: "Single Seater", fabricMeters: 5.0, sizeFt: "3.50 ft", priceInr: 48500, sourceEdition: "2026 Catalogue" },
      { seater: "Two Seater", fabricMeters: 7.5, sizeFt: "5.25 ft", priceInr: 68000, sourceEdition: "2026 Catalogue" },
      { seater: "Three Seater", fabricMeters: 9.0, sizeFt: "7.00 ft", priceInr: 82000, sourceEdition: "2026 Catalogue" },
    ],
    specifications: {
      frameMaterial: "Reinforced treated teak & ply substrate",
      cushioning: "40 Density ultra-flex foam",
      legFinish: "Double columnar gold legs",
      customizable: true,
    },
    sourceCatalogue: {
      catalogueName: "ZENARCH 2026",
      page: 4,
    },
    pricingTerms: "All Prices are Ex-Warehouse. GST, Packing, Forwarding & Installation Charges extra as per actual.",
  },
  {
    id: "sofa-lopez",
    slug: "lopez",
    name: "Lopez",
    category: "sofas",
    categoryLabel: "Sofas & Lounges",
    tagline: "Curves that welcome. Comfort that stays.",
    description: "Sculptural asymmetric curved backrest with contrasting dual-tone upholstery and organic cylindrical walnut feet.",
    basePrice: 36500,
    fabricRateNote: "Fabric: 500/- Mtr",
    has3dModel: true,
    variations: [
      { seater: "Single Seater", fabricMeters: 5.0, sizeFt: "3.50 ft", priceInr: 36500 },
      { seater: "Two Seater", fabricMeters: 7.0, sizeFt: "5.00 ft", priceInr: 50000 },
      { seater: "Three Seater", fabricMeters: 8.0, sizeFt: "6.50 ft", priceInr: 62000 },
    ],
    specifications: {
      frameMaterial: "Curvilinear steam-bent frame",
      cushioning: "Memory foam blend with down wrap",
      legFinish: "Dark walnut turned wood legs",
      customizable: true,
    },
    sourceCatalogue: {
      catalogueName: "ZENARCH 2026",
      page: 5,
    },
    pricingTerms: "All Prices are Ex-Warehouse. GST, Packing, Forwarding & Installation Charges extra as per actual.",
  },
  {
    id: "sofa-montana",
    slug: "montana",
    name: "Montana",
    category: "sofas",
    categoryLabel: "Sofas & Lounges",
    tagline: "Crafted with wood. Designed for timeless living.",
    description: "Generous deep lounge sofa distinguished by exposed solid curved wood sled arm skids hugging the tailored bouclé body.",
    basePrice: 42000,
    fabricRateNote: "Fabric: 500/- Mtr",
    has3dModel: false,
    variations: [
      { seater: "Single Seater", fabricMeters: 5.0, sizeFt: "3.50 ft", priceInr: 42000 },
      { seater: "Two Seater", fabricMeters: 7.0, sizeFt: "5.00 ft", priceInr: 58000 },
      { seater: "Three Seater", fabricMeters: 9.0, sizeFt: "6.50 ft", priceInr: 72000 },
    ],
    specifications: {
      frameMaterial: "Solid natural American walnut / teak framing",
      cushioning: "High comfort deep lounge feather-touch core",
      legFinish: "Integrated curved wood skids",
      customizable: true,
    },
    sourceCatalogue: {
      catalogueName: "ZENARCH 2026",
      page: 6,
    },
    pricingTerms: "All Prices are Ex-Warehouse. GST, Packing, Forwarding & Installation Charges extra as per actual.",
  },
  {
    id: "sofa-arcus",
    slug: "arcus",
    name: "Arcus",
    category: "sofas",
    categoryLabel: "Sofas & Lounges",
    tagline: "Timeless design. Enduring comfort.",
    description: "An enveloping arched cocoon silhouette accented with tailored architectural spherical bolster pillows.",
    basePrice: 33500,
    fabricRateNote: "Fabric: 500/- Mtr",
    has3dModel: true,
    variations: [
      { seater: "Single Seater", fabricMeters: 5.5, sizeFt: "3.25 ft", priceInr: 33500 },
      { seater: "Two Seater", fabricMeters: 8.0, sizeFt: "5.00 ft", priceInr: 50000 },
      { seater: "Three Seater", fabricMeters: 9.5, sizeFt: "6.50 ft", priceInr: 64000 },
    ],
    specifications: {
      frameMaterial: "Engineered curved hardwood structure",
      cushioning: "Multi-layered high resilience polyurethane foam",
      legFinish: "Low profile recessed architectural plinth",
      customizable: true,
    },
    sourceCatalogue: {
      catalogueName: "ZENARCH 2026",
      page: 7,
    },
    pricingTerms: "All Prices are Ex-Warehouse. GST, Packing, Forwarding & Installation Charges extra as per actual.",
  },
  {
    id: "sofa-zara",
    slug: "zara",
    name: "Zara",
    category: "sofas",
    categoryLabel: "Sofas & Lounges",
    tagline: "Timeless design. Enduring comfort.",
    description: "Refined linear structure with dual cushion back, slender brushed gold cradle undercarriage, and dual tone upholstery options.",
    basePrice: 40000,
    fabricRateNote: "Fabric: 500/- Mtr",
    has3dModel: false,
    variations: [
      { seater: "Single Seater", fabricMeters: 4.0, sizeFt: "2.50 ft", priceInr: 40000 },
      { seater: "Two Seater", fabricMeters: 6.0, sizeFt: "4.50 ft", priceInr: 62000 },
      { seater: "Three Seater", fabricMeters: 8.0, sizeFt: "6.50 ft", priceInr: 84000 },
    ],
    specifications: {
      frameMaterial: "Hardwood with steel reinforcement",
      cushioning: "Pocket spring with premium foam toppers",
      legFinish: "Continuous brushed gold metal perimeter base",
      customizable: true,
    },
    sourceCatalogue: {
      catalogueName: "ZENARCH 2026",
      page: 8,
    },
    pricingTerms: "All Prices are Ex-Warehouse. GST, Packing, Forwarding & Installation Charges extra as per actual.",
  },
  {
    id: "sofa-liberty",
    slug: "liberty",
    name: "Liberty",
    category: "sofas",
    categoryLabel: "Sofas & Lounges",
    tagline: "Timeless Elegance. Crafted for Generations.",
    description: "Available with solid hand-carved wooden arms or brushed gold hardware accents. Piped borders and tailored cushions.",
    basePrice: 62000,
    fabricRateNote: "Fabric: 500/- Mtr",
    has3dModel: false,
    variations: [
      { seater: "Single Seater", fabricMeters: 5.0, sizeFt: "3.75 ft", priceInr: 62000 },
      { seater: "Two Seater", fabricMeters: 7.0, sizeFt: "5.50 ft", priceInr: 82000 },
      { seater: "Three Seater", fabricMeters: 9.0, sizeFt: "7.25 ft", priceInr: 98000 },
    ],
    specifications: {
      frameMaterial: "Solid seasoned teak framework",
      cushioning: "Supreme 45-density orthopaedic foam",
      legFinish: "Solid tapered wood legs with brass ferrules",
      customizable: true,
    },
    sourceCatalogue: {
      catalogueName: "ZENARCH 2026",
      page: 9,
    },
    pricingTerms: "All Prices are Ex-Warehouse. GST, Packing, Forwarding & Installation Charges extra as per actual.",
  },
  {
    id: "sofa-curve",
    slug: "curve",
    name: "Curve",
    category: "sofas",
    categoryLabel: "Sofas & Lounges",
    tagline: "Where comfort meets elegance.",
    description: "Dramatic crescent moon sweeping silhouette designed for grand conversational living spaces.",
    basePrice: 54000,
    fabricRateNote: "Fabric: 500/- Mtr",
    has3dModel: true,
    variations: [
      { seater: "Two Seater", fabricMeters: 7.0, sizeFt: "5.50 ft", priceInr: 54000 },
      { seater: "Three Seater", fabricMeters: 9.0, sizeFt: "7.00 ft", priceInr: 68000 },
    ],
    specifications: {
      frameMaterial: "Continuous CNC sculpted curved wood structure",
      cushioning: "High-density molded foam shell",
      legFinish: "Stiletto brass-tipped wooden legs",
      customizable: true,
    },
    sourceCatalogue: {
      catalogueName: "ZENARCH 2026",
      page: 12,
    },
    pricingTerms: "All Prices are Ex-Warehouse. GST, Packing, Forwarding & Installation Charges extra as per actual.",
  },
  {
    id: "sofa-meridian",
    slug: "meridian",
    name: "Meridian",
    category: "sofas",
    categoryLabel: "Sofas & Lounges",
    tagline: "Sophisticated Comfort. Timeless Design.",
    description: "Deep vertical fluted channel tufting with external bronze tubular loop armatures wrapping the entire structure.",
    basePrice: 46000,
    fabricRateNote: "Fabric: 500/- Mtr",
    has3dModel: true,
    variations: [
      { seater: "Single Seater", fabricMeters: 4.5, sizeFt: "3.00 ft", priceInr: 46000 },
      { seater: "Two Seater", fabricMeters: 6.5, sizeFt: "5.00 ft", priceInr: 64000 },
      { seater: "Three Seater", fabricMeters: 8.0, sizeFt: "6.50 ft", priceInr: 82000 },
    ],
    specifications: {
      frameMaterial: "Solid hardwood with tubular metal loop frame",
      cushioning: "Architectural channel quilting with dual core foam",
      legFinish: "Continuous tubular antique bronze armature",
      customizable: true,
    },
    sourceCatalogue: {
      catalogueName: "ZENARCH 2026",
      page: 13,
    },
    pricingTerms: "All Prices are Ex-Warehouse. GST, Packing, Forwarding & Installation Charges extra as per actual.",
  },
  {
    id: "sofa-tiara",
    slug: "tiara",
    name: "Tiara",
    category: "sofas",
    categoryLabel: "Sofas & Lounges",
    tagline: "Timeless Design. Enduring Comfort.",
    description: "Fluted textured outer arm detail with brass trim accents and soft plush seating cushions.",
    basePrice: 32000,
    fabricRateNote: "Fabric: 500/- Mtr",
    has3dModel: false,
    variations: [
      { seater: "Single Seater", fabricMeters: 4.0, sizeFt: "2.50 ft", priceInr: 32000, sourceEdition: "2026 Approved" },
      { seater: "Two Seater", fabricMeters: 6.0, sizeFt: "4.50 ft", priceInr: 54000, sourceEdition: "2026 Approved" },
      { seater: "Three Seater", fabricMeters: 8.0, sizeFt: "6.50 ft", priceInr: 68000, sourceEdition: "2026 Approved" },
    ],
    specifications: {
      frameMaterial: "Solid seasoned wood & acoustic composite",
      cushioning: "Comfort foam core with polyfill wrap",
      legFinish: "Brushed rose gold stiletto legs",
      customizable: true,
    },
    sourceCatalogue: {
      catalogueName: "ZENARCH 2026",
      page: 14,
    },
    pricingTerms: "All Prices are Ex-Warehouse. GST, Packing, Forwarding & Installation Charges extra as per actual.",
  },
  {
    id: "sofa-fortune",
    slug: "fortune",
    name: "Fortune (IMP)",
    category: "sofas",
    categoryLabel: "Sofas & Lounges",
    tagline: "Refined comfort. Elevated living.",
    description: "Imported luxury leatherette / genuine leather sofa with slim track arms and gunmetal stiletto legs. Grey & Tan options.",
    basePrice: 30000,
    isImported: true,
    has3dModel: false,
    variations: [
      { seater: "Single Seater", fabricMeters: null, sizeFt: "Import Spec", priceInr: 30000 },
      { seater: "Two Seater", fabricMeters: null, sizeFt: "Import Spec", priceInr: 42000 },
      { seater: "Three Seater", fabricMeters: null, sizeFt: "Import Spec", priceInr: 56000 },
    ],
    specifications: {
      frameMaterial: "Cold-cure molded foam on steel skeleton",
      cushioning: "High-grade leatherette / imported top-grain leather",
      legFinish: "Gunmetal dark powder coated stiletto feet",
      customizable: false,
    },
    sourceCatalogue: {
      catalogueName: "ZENARCH 2026",
      page: 15,
    },
    pricingTerms: "All Prices are Ex-Warehouse. GST, Packing, Forwarding & Installation Charges extra as per actual.",
  },
  {
    id: "sofa-chester",
    slug: "chester",
    name: "Chester",
    category: "sofas",
    categoryLabel: "Sofas & Lounges",
    tagline: "Timeless Elegance. Crafted for Generations.",
    description: "Classic deep-tufted diamond chesterfield sofa with rolled arms, brass nailhead trim, and turned wood bun feet.",
    basePrice: 36500,
    fabricRateNote: "Fabric: 500/- Mtr",
    has3dModel: true,
    variations: [
      { seater: "Single Seater", fabricMeters: 5.0, sizeFt: "3.50 ft", priceInr: 36500 },
      { seater: "Two Seater", fabricMeters: 6.75, sizeFt: "5.25 ft", priceInr: 50000 },
      { seater: "Three Seater", fabricMeters: 7.75, sizeFt: "7.00 ft", priceInr: 65000 },
    ],
    specifications: {
      frameMaterial: "Heavy-duty seasoned beech wood",
      cushioning: "Hand-tied button tufting with high density foam",
      legFinish: "Carved antique walnut bun feet",
      customizable: true,
    },
    sourceCatalogue: {
      catalogueName: "ZENARCH 2026",
      page: 16,
    },
    pricingTerms: "All Prices are Ex-Warehouse. GST, Packing, Forwarding & Installation Charges extra as per actual.",
  },
  {
    id: "sofa-corbusier",
    slug: "corbusier",
    name: "Corbusier",
    category: "sofas",
    categoryLabel: "Sofas & Lounges",
    tagline: "Timeless Design. Enduring Comfort.",
    description: "Iconic modernist design with an external tubular chrome or black metal cage embracing individual cushioned blocks.",
    basePrice: 35000,
    fabricRateNote: "Fabric: 500/- Mtr",
    has3dModel: true,
    variations: [
      { seater: "Single Seater", fabricMeters: 4.0, sizeFt: "2.75 ft", priceInr: 35000 },
      { seater: "Two Seater", fabricMeters: 5.5, sizeFt: "4.50 ft", priceInr: 48500 },
      { seater: "Three Seater", fabricMeters: 7.0, sizeFt: "6.25 ft", priceInr: 63000 },
    ],
    specifications: {
      frameMaterial: "Tubular steel external cage frame",
      cushioning: "High-resilience box cushions with leather welt",
      legFinish: "Mirror polished stainless steel / matte black",
      customizable: true,
    },
    sourceCatalogue: {
      catalogueName: "ZENARCH 2026",
      page: 28,
    },
    pricingTerms: "All Prices are Ex-Warehouse. GST, Packing, Forwarding & Installation Charges extra as per actual.",
  },
  {
    id: "sofa-aero",
    slug: "aero",
    name: "Aero",
    category: "sofas",
    categoryLabel: "Sofas & Lounges",
    tagline: "Elevate your space. Lift your everyday.",
    description: "Sculptural organic bench sofa with contrasting asymmetric disc and pill bolster back supports on steel pins.",
    basePrice: 34500,
    fabricRateNote: "Fabric: 500/- Mtr",
    has3dModel: true,
    variations: [
      { seater: "Two Seater", fabricMeters: 4.0, sizeFt: "4.50 ft", priceInr: 34500 },
      { seater: "Three Seater", fabricMeters: 5.5, sizeFt: "6.00 ft", priceInr: 42000 },
    ],
    specifications: {
      frameMaterial: "Structural steel tube internal skeleton",
      cushioning: "Molded cold foam",
      legFinish: "Matte black architectural tubular legs",
      customizable: true,
    },
    sourceCatalogue: {
      catalogueName: "ZENARCH 2026",
      page: 35,
    },
    pricingTerms: "All Prices are Ex-Warehouse. GST, Packing, Forwarding & Installation Charges extra as per actual.",
  },
  {
    id: "sofa-nero",
    slug: "nero",
    name: "Nero",
    category: "sofas",
    categoryLabel: "Sofas & Lounges",
    tagline: "Bold by design. Made to leave an impression.",
    description: "Vertical ribbed base cushion paired with a floating horizontal cylindrical bolster back in rich rust velvet or bouclé.",
    basePrice: 40000,
    fabricRateNote: "Fabric: 500/- Mtr",
    has3dModel: true,
    variations: [
      { seater: "Two Seater", fabricMeters: 6.0, sizeFt: "4.00 ft", priceInr: 40000 },
      { seater: "Three Seater", fabricMeters: 8.0, sizeFt: "6.00 ft", priceInr: 58000 },
    ],
    specifications: {
      frameMaterial: "Reinforced architectural framework",
      cushioning: "Sculpted segmented high-density foam",
      legFinish: "Concealed floating plinth base",
      customizable: true,
    },
    sourceCatalogue: {
      catalogueName: "ZENARCH 2026",
      page: 37,
    },
    pricingTerms: "All Prices are Ex-Warehouse. GST, Packing, Forwarding & Installation Charges extra as per actual.",
  },

  // ==========================================
  // PUFFY COLLECTION (SCULPTURAL OTTOMANS & POUFS)
  // W.E.F. 1st May 2026
  // ==========================================
  {
    id: "puffy-albert",
    slug: "albert",
    name: "Albert",
    category: "puffy-collection",
    categoryLabel: "Puffy Collection",
    tagline: "Sculptural design. Timeless comfort.",
    description: "A monumental pedestal pouf shaped like an architectural column with a gently flared concave saddle seat.",
    basePrice: 6500,
    has3dModel: true,
    variations: [
      { seater: "Standard", sizeFt: "Dia 18\" x H 18\"", priceInr: 6500 },
    ],
    specifications: {
      frameMaterial: "Internal reinforced molded cone",
      cushioning: "High density foam in ivory bouclé fabric",
      legFinish: "Textured monolithic base",
      customizable: true,
    },
    sourceCatalogue: {
      catalogueName: "PUFFY COLLECTION (W.E.F. 1st May 2026)",
      page: 4,
    },
    pricingTerms: "+ GST Extra. All Prices are Ex-Warehouse.",
  },
  {
    id: "puffy-libra",
    slug: "libra",
    name: "Libra",
    category: "puffy-collection",
    categoryLabel: "Puffy Collection",
    tagline: "Timeless comfort. Sculpted for elegance.",
    description: "An elegant low-profile curved armchair pouf with wrap-around petal back in ivory textured bouclé.",
    basePrice: 12500,
    has3dModel: true,
    variations: [
      { seater: "Standard", sizeFt: "W 24\" x D 24\" x H 28\"", priceInr: 12500 },
    ],
    specifications: {
      frameMaterial: "Curvilinear plywood frame",
      cushioning: "Molded cold foam with bouclé upholstery",
      legFinish: "Concealed swivel or stationary plinth",
      customizable: true,
    },
    sourceCatalogue: {
      catalogueName: "PUFFY COLLECTION (W.E.F. 1st May 2026)",
      page: 2,
    },
    pricingTerms: "+ GST Extra. All Prices are Ex-Warehouse.",
  },
  {
    id: "puffy-torry",
    slug: "torry",
    name: "Torry",
    category: "puffy-collection",
    categoryLabel: "Puffy Collection",
    tagline: "Compact charm. Endless comfort.",
    description: "A square textured pouf bound by a rich saddle leather carrying cradle handle and contrasting top pad.",
    basePrice: 7750,
    has3dModel: false,
    variations: [
      { seater: "Standard", sizeFt: "W 18\" x D 18\" x H 16\"", priceInr: 7750 },
    ],
    specifications: {
      frameMaterial: "Solid hardwood core",
      cushioning: "Dense seating foam with leatherette cradle",
      legFinish: "Curved leatherette base harness",
      customizable: true,
    },
    sourceCatalogue: {
      catalogueName: "PUFFY COLLECTION (W.E.F. 1st May 2026)",
      page: 3,
    },
    pricingTerms: "+ GST Extra. All Prices are Ex-Warehouse.",
  },
  {
    id: "puffy-kenzi",
    slug: "kenzi",
    name: "Kenzi",
    category: "puffy-collection",
    categoryLabel: "Puffy Collection",
    tagline: "Modern elegance. Everyday function.",
    description: "Round storage ottoman with lift-off upholstered lid nestled inside an exposed dark walnut architectural cross base.",
    basePrice: 11000,
    has3dModel: false,
    variations: [
      { seater: "Standard", sizeFt: "Dia 20\" x H 18\"", priceInr: 11000 },
    ],
    specifications: {
      frameMaterial: "Solid walnut wood cross base with internal storage container",
      cushioning: "Upholstered textured lid",
      legFinish: "Dark walnut matte lacquer",
      customizable: true,
    },
    sourceCatalogue: {
      catalogueName: "PUFFY COLLECTION (W.E.F. 1st May 2026)",
      page: 5,
    },
    pricingTerms: "+ GST Extra. All Prices are Ex-Warehouse.",
  },
  {
    id: "puffy-vitro",
    slug: "vitro",
    name: "Vitro",
    category: "puffy-collection",
    categoryLabel: "Puffy Collection",
    tagline: "Bold form. Effortless style.",
    description: "Deep indigo textured cube ottoman held aloft by four slender architectural corner brass stiletto legs.",
    basePrice: 10250,
    has3dModel: false,
    variations: [
      { seater: "Standard", sizeFt: "W 18\" x D 18\" x H 18\"", priceInr: 10250 },
    ],
    specifications: {
      frameMaterial: "Hardwood cube frame",
      cushioning: "High-density polyurethane block",
      legFinish: "External corner brass metal stiletto legs",
      customizable: true,
    },
    sourceCatalogue: {
      catalogueName: "PUFFY COLLECTION (W.E.F. 1st May 2026)",
      page: 6,
    },
    pricingTerms: "+ GST Extra. All Prices are Ex-Warehouse.",
  },
  {
    id: "puffy-eva",
    slug: "eva",
    name: "Eva",
    category: "puffy-collection",
    categoryLabel: "Puffy Collection",
    tagline: "Minimal form. Maximum character.",
    description: "Sleek matte charcoal concrete/fabric cylinder girdled by a sweeping diagonal brushed copper metallic sash.",
    basePrice: 5500,
    has3dModel: true,
    variations: [
      { seater: "Standard", sizeFt: "Dia 16\" x H 18\"", priceInr: 5500 },
    ],
    specifications: {
      frameMaterial: "Heavy-duty cylindrical core",
      cushioning: "Firm perimeter foam",
      legFinish: "Diagonal brushed copper belt",
      customizable: true,
    },
    sourceCatalogue: {
      catalogueName: "PUFFY COLLECTION (W.E.F. 1st May 2026)",
      page: 7,
    },
    pricingTerms: "+ GST Extra. All Prices are Ex-Warehouse.",
  },
  {
    id: "puffy-gold",
    slug: "gold",
    name: "Gold",
    category: "puffy-collection",
    categoryLabel: "Puffy Collection",
    tagline: "Minimal form. Maximum character.",
    description: "Pure cream woven bouclé cylindrical ottoman grounded upon a luminous brushed brass plinth ring.",
    basePrice: 6250,
    has3dModel: true,
    variations: [
      { seater: "Standard", sizeFt: "Dia 16\" x H 18\"", priceInr: 6250 },
    ],
    specifications: {
      frameMaterial: "Engineered timber core",
      cushioning: "High comfort dome foam top",
      legFinish: "Brushed champagne gold bottom plinth ring",
      customizable: true,
    },
    sourceCatalogue: {
      catalogueName: "PUFFY COLLECTION (W.E.F. 1st May 2026)",
      page: 8,
    },
    pricingTerms: "+ GST Extra. All Prices are Ex-Warehouse.",
  },
  {
    id: "puffy-zoya",
    slug: "zoya",
    name: "Zoya",
    category: "puffy-collection",
    categoryLabel: "Puffy Collection",
    tagline: "Smart design. Everyday ease.",
    description: "Circular ottoman paired with an integrated cantilevered black tubular steel swivel drink and book table.",
    basePrice: 7500,
    has3dModel: false,
    variations: [
      { seater: "Standard", sizeFt: "Dia 18\" + Attached Table Dia 14\"", priceInr: 7500 },
    ],
    specifications: {
      frameMaterial: "Tubular steel arm with solid wood table top",
      cushioning: "Center button-tufted bouclé cushion",
      legFinish: "Continuous black steel ring",
      customizable: true,
    },
    sourceCatalogue: {
      catalogueName: "PUFFY COLLECTION (W.E.F. 1st May 2026)",
      page: 25,
    },
    pricingTerms: "+ GST Extra. All Prices are Ex-Warehouse.",
  },
  {
    id: "puffy-majesty",
    slug: "majesty",
    name: "Majesty",
    category: "benches",
    categoryLabel: "Sculptural Benches",
    tagline: "Compact luxury. Everyday elegance.",
    description: "Architectural channel-fluted velvet bench supported by twin curved horseshoe brass legs.",
    basePrice: 14000,
    has3dModel: true,
    variations: [
      { seater: "Standard", sizeFt: "L 48\" x W 18\" x H 18\"", priceInr: 14000 },
    ],
    specifications: {
      frameMaterial: "Solid hardwood internal bench frame",
      cushioning: "Fluted channel velvet cushioning",
      legFinish: "Curved arch gold metallic legs",
      customizable: true,
    },
    sourceCatalogue: {
      catalogueName: "PUFFY COLLECTION (W.E.F. 1st May 2026)",
      page: 26,
    },
    pricingTerms: "+ GST Extra. All Prices are Ex-Warehouse.",
  },
  {
    id: "puffy-drum",
    slug: "drum",
    name: "Drum",
    category: "benches",
    categoryLabel: "Sculptural Benches",
    tagline: "Compact luxury. Everyday elegance.",
    description: "Grand circular low lounge pouf (4ft diameter) in two-tone architectural fabric for salon and living spaces.",
    basePrice: 14000,
    has3dModel: false,
    variations: [
      { seater: "Standard", sizeFt: "Dia 36\" to 48\" x H 16\"", priceInr: 14000 },
    ],
    specifications: {
      frameMaterial: "Large diameter reinforced framework",
      cushioning: "Dense lounge foam core",
      legFinish: "Charcoal contrast perimeter kick",
      customizable: true,
    },
    sourceCatalogue: {
      catalogueName: "PUFFY COLLECTION (W.E.F. 1st May 2026)",
      page: 28,
    },
    pricingTerms: "+ GST Extra. All Prices are Ex-Warehouse.",
  },
  {
    id: "puffy-novel",
    slug: "novel",
    name: "Novel",
    category: "benches",
    categoryLabel: "Sculptural Benches",
    tagline: "Compact luxury. Everyday elegance.",
    description: "Charcoal textured oval bench suspended within an architectural black tubular steel cradle frame.",
    basePrice: 14000,
    has3dModel: false,
    variations: [
      { seater: "Standard", sizeFt: "L 44\" x W 22\" x H 18\"", priceInr: 14000 },
    ],
    specifications: {
      frameMaterial: "Welded steel tube chassis with timber sub-frame",
      cushioning: "Heavy duty upholstery foam",
      legFinish: "Matte black architectural tubular cradle",
      customizable: true,
    },
    sourceCatalogue: {
      catalogueName: "PUFFY COLLECTION (W.E.F. 1st May 2026)",
      page: 29,
    },
    pricingTerms: "+ GST Extra. All Prices are Ex-Warehouse.",
  },
];

export function getProductBySlug(slug: string): FurnitureProduct | undefined {
  return FURNITURE_CATALOGUE.find((item) => item.slug === slug);
}

export function getProductsByCategory(category: string): FurnitureProduct[] {
  if (category === "all") return FURNITURE_CATALOGUE;
  return FURNITURE_CATALOGUE.filter((item) => item.category === category);
}
