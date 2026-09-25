export interface ProjectCaseStudy {
  id: string;
  slug: string;
  title: string;
  category: "Residential Architecture" | "Commercial & Workspace" | "Luxury Hospitality";
  location: string;
  year: string;
  area: string;
  leadArchitect: string;
  tagline: string;
  overview: string;
  designStory: string;
  materials: string[];
  furnitureFeatured: string[];
  metrics: { label: string; value: string }[];
}

export const PROJECTS_DATA: ProjectCaseStudy[] = [
  {
    id: "proj-juhu-villa",
    slug: "the-juhu-sea-villa",
    title: "The Juhu Sea Villa",
    category: "Residential Architecture",
    location: "Juhu, Mumbai",
    year: "2025 - 2026",
    area: "6,800 sq.ft",
    leadArchitect: "Rohit Pathak",
    tagline: "Fluid living where coastal light meets architectural restraint.",
    overview:
      "A three-storey private coastal sanctuary conceived as a series of cascading travertine terraces overlooking the Arabian Sea. Designed for seamless indoor-outdoor living with bespoke custom acoustics and custom Zen Arch furniture.",
    designStory:
      "The client sought a space that resisted typical Mumbai high-gloss opulence in favor of calm, contemplative architectural permanence. We stripped the spatial envelope to its structural columns, flooding the central double-height salon with daylight filtered through custom fluted louver screens. The furniture was conceived specifically for the floorplan: the curving Zen Arch Arcus sofa anchors the formal reception, while low-profile Benz platforms ground the ocean-facing sunroom.",
    materials: [
      "Honed Roman Travertine",
      "Smoked White Oak Paneling",
      "Brushed Champagne Brass Accents",
      "Seamless Micro-Cement Floors",
      "Raw Textured Linen Upholstery",
    ],
    furnitureFeatured: ["Arcus Curved Sofa", "Albert Sculptural Pouf", "Benz Low Platform", "Novel Oval Bench"],
    metrics: [
      { label: "Completion Time", value: "14 Months" },
      { label: "Bespoke Pieces", value: "18 Handcrafted Items" },
      { label: "Ceiling Height", value: "14.5 Feet" },
    ],
  },
  {
    id: "proj-monolith-hq",
    slug: "atelier-monolith-headquarters",
    title: "Atelier Monolith Headquarters",
    category: "Commercial & Workspace",
    location: "Koregaon Park, Pune",
    year: "2025",
    area: "9,400 sq.ft",
    leadArchitect: "Rohit Pathak",
    tagline: "A meditative studio environment balancing executive clarity and creative warmth.",
    overview:
      "The global headquarters for an international design consultancy, organized around a central skylit atrium, acoustic fluted timber partitions, and modular breakout salons.",
    designStory:
      "Corporate office architecture frequently fails by prioritizing corporate density over acoustic comfort. At Atelier Monolith, we established zoned acoustic sanctuaries utilizing the high-backed Veronica sofa and Corbusier modular configurations to afford spontaneous collaboration without auditory bleed.",
    materials: [
      "Fluted Acoustic Acoustic Walnut",
      "Brushed Gunmetal Partitions",
      "Cast Terrazzo Slab",
      "Hand-Knotted Wool Carpeting",
    ],
    furnitureFeatured: ["Corbusier Modular Suite", "Veronica High-Back Lounge", "Vegas Executive Sofa", "Dior Fluted Poufs"],
    metrics: [
      { label: "Workstations", value: "85 Ergonomic Desks" },
      { label: "Private Breakouts", value: "6 Acoustic Salons" },
      { label: "Acoustic Attenuation", value: "NC-30 Rating" },
    ],
  },
  {
    id: "proj-alibaug-pavilion",
    slug: "the-alibaug-glass-pavilion",
    title: "The Alibaug Glass Pavilion",
    category: "Residential Architecture",
    location: "Awas, Alibaug",
    year: "2026",
    area: "5,200 sq.ft",
    leadArchitect: "Rohit Pathak",
    tagline: "A pavilion in dialogue with ancestral banyan trees and black basalt stone.",
    overview:
      "A single-level steel and glass weekend retreat nestled into a lush orchard. Minimalist floating rooflines create expansive shaded verandas embracing cross breezes.",
    designStory:
      "To honor the coastal Maharashtra landscape, local black basalt was quarried on-site for the structural spine. The interior furniture acts as quiet islands within the glass volume—sculptural Montana sofas in bouclé fabric and Nero ribbed bolsters harmonizing with the natural surroundings.",
    materials: [
      "Local Maharashtra Basalt",
      "Recycled Teakwood Joists",
      "Floor-to-Ceiling Thermal Glazing",
      "Natural Lime Wash",
    ],
    furnitureFeatured: ["Montana Teak Lounge", "Nero Ribbed Bolster Sofa", "Kenzi Walnut Ottomans", "Majesty Bench"],
    metrics: [
      { label: "Site Area", value: "1.5 Acres" },
      { label: "Solar Autonomy", value: "80% Off-Grid" },
      { label: "Bespoke Joinery", value: "100% On-Site" },
    ],
  },
];

export function getProjectBySlug(slug: string): ProjectCaseStudy | undefined {
  return PROJECTS_DATA.find((p) => p.slug === slug);
}
