import furnitureDb from "./furniture_db.json";

export interface ProductVariant {
  name: string;
  priceInr: number | null;
}

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface FurnitureProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  collection: string;
  basePrice: number | null;
  priceStatus: "VERIFIED" | "CONFLICT" | "NOT_PROVIDED";
  dimensions: string | null;
  specifications: ProductSpecification[];
  images: string[];
  variants: ProductVariant[];
  has3dModel: boolean;
}

// Cast the imported JSON to our strongly-typed interface
export const FURNITURE_CATALOGUE: FurnitureProduct[] = furnitureDb as FurnitureProduct[];

export function getProductBySlug(slug: string): FurnitureProduct | undefined {
  return FURNITURE_CATALOGUE.find((item) => item.slug === slug);
}

export function getProductsByCategory(category: string): FurnitureProduct[] {
  if (category === "all") return FURNITURE_CATALOGUE;
  return FURNITURE_CATALOGUE.filter((item) => item.category === category);
}

export function searchProducts(query: string): FurnitureProduct[] {
  const lowercaseQuery = query.toLowerCase();
  return FURNITURE_CATALOGUE.filter(
    (product) =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.collection.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery)
  );
}

export const CATEGORIES = [
  { id: "all", name: "All Collections" },
  { id: "sofas", name: "Sofas & Lounges" },
  { id: "executive", name: "Executive Chairs" },
  { id: "tables-and-stands", name: "Tables & Stands" },
  { id: "puffy", name: "Puffy Collection" },
  { id: "prince", name: "Prince Series" },
];
