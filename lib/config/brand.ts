export interface BrandConfig {
  name: string;
  shortName: string;
  tagline: string;
  subTagline: string;
  founder: string;
  title: string;
  email: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  whatsappDisplay: string;
  address: {
    line1: string;
    line2: string;
    locality: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    formatted: string;
    region: string;
  };
  disclaimers: {
    pricingTerms: string;
    fabricNote: string;
    aiNotice: string;
  };
  navigation: Array<{ name: string; href: string; badge?: string }>;
  socials: Array<{ name: string; href: string }>;
}

export const BRAND: BrandConfig = {
  name: "Zen Arch Interior Solution",
  shortName: "Zen Arch",
  tagline: "Spaces designed around the way you live.",
  subTagline: "Luxury Architectural Studio & Bespoke Furniture Atelier",
  founder: "Rohit Pathak",
  title: "Founder & Creative Director",
  email: "zenarchsolution@gmail.com",
  phone: "+919372921244",
  phoneDisplay: "+91 93729 21244",
  whatsapp: "919372921244",
  whatsappDisplay: "+91 93729 21244",
  address: {
    line1: "Office No. 17, Vijay Building",
    line2: "Vijay Print Bus Stop, Opp. Mehra Compound",
    locality: "Saki Naka",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400072",
    country: "India",
    formatted: "Office No. 17, Vijay Building, Vijay Print Bus Stop, Opp. Mehra Compound, Saki Naka, Mumbai, Maharashtra 400072, India",
    region: "Pan-India Projects",
  },
  disclaimers: {
    pricingTerms: "All Prices are Ex-Warehouse. GST, Packing, Forwarding & Installation Charges extra as per actual.",
    fabricNote: "Standard upholstery fabric rate: ₹500/- per meter included. Custom designer fabrics available upon consultation.",
    aiNotice: "Visual space transformations and renders are conceptual planning and spatial ideation tools, not survey-grade measurements.",
  },
  navigation: [
    { name: "Work", href: "/projects" },
    { name: "Furniture", href: "/furniture" },
    { name: "Services", href: "/services" },
    { name: "AI", href: "/ai", badge: "Studio" },
    { name: "Studio", href: "/about" },
  ],
  socials: [
    { name: "Instagram", href: "https://instagram.com" },
    { name: "LinkedIn", href: "https://linkedin.com" },
    { name: "WhatsApp", href: "https://wa.me/919372921244" },
  ],
};

export function getWhatsAppUrl(message?: string): string {
  const defaultText = encodeURIComponent(
    message || "Hello Rohit, I would like to enquire about Zen Arch interior architectural services and bespoke furniture."
  );
  return `https://wa.me/${BRAND.whatsapp}?text=${defaultText}`;
}

export function getProductWhatsAppUrl(productName: string, variation?: string, price?: number): string {
  const text = encodeURIComponent(
    `Hello Zen Arch, I am interested in the ${productName}${variation ? ` (${variation})` : ""}${price ? ` listed at ₹${price.toLocaleString("en-IN")}` : ""}. Please share catalogue specifications and lead times.`
  );
  return `https://wa.me/${BRAND.whatsapp}?text=${text}`;
}
