// @ts-nocheck
import { z } from "zod";
import { tool } from "ai";
import { searchProducts, getProductBySlug, getProductsByCategory, CATEGORIES } from "@/lib/data/furniture";

// --- Tool Definitions ---

export const catalogTools = {
  
  // 1. searchProducts
  searchProducts: tool({
    description: "Search the Zen Arch verified catalogue by natural language, keyword, or exact product name.",
    parameters: z.object({
      query: z.string().describe("The search term (e.g. 'Vegas', 'leather sofa', 'executive chair')"),
      maxResults: z.number().optional().describe("Maximum number of results to return (default 5, max 10)")
    }),
    execute: async ({ query, maxResults = 5 }: { query: string; maxResults?: number }) => {
      console.log(`[AI TOOL] Executing searchProducts: ${query}`);
      const results = searchProducts(query);
      return {
        count: results.length,
        query,
        products: results.slice(0, maxResults).map(p => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          collection: p.collection,
          category: p.category,
          basePrice: p.basePrice,
          priceStatus: p.priceStatus,
          variantsCount: p.variants.length,
          dimensions: p.dimensions
        }))
      };
    },
  }),

  // 2. getProductDetails
  getProductDetails: tool({
    description: "Retrieve complete detailed information for a specific product using its slug. Use this when the user asks for dimensions, specifications, variants, or price of a specific item.",
    parameters: z.object({
      slug: z.string().describe("The product slug (e.g. 'vegas-sofas', 'freedom-executive')")
    }),
    execute: async ({ slug }: { slug: string }) => {
      console.log(`[AI TOOL] Executing getProductDetails: ${slug}`);
      const product = getProductBySlug(slug);
      if (!product) {
        return { error: `Product with slug '${slug}' not found in the verified catalogue.` };
      }
      return {
        product: {
          slug: product.slug,
          name: product.name,
          collection: product.collection,
          category: product.category,
          basePrice: product.basePrice,
          priceStatus: product.priceStatus,
          dimensions: product.dimensions,
          specifications: product.specifications,
          variants: product.variants.map(v => ({ name: v.name, price: v.priceInr })),
          has3dModel: product.has3dModel
        }
      };
    },
  }),

  // 3. filterProducts
  filterProducts: tool({
    description: "Filter the catalogue based on budget, category, or collection.",
    parameters: z.object({
      category: z.enum(["all", "sofas", "executive", "tables-and-stands", "puffy", "prince"]).optional(),
      maxBudgetInr: z.number().optional().describe("Maximum budget in INR"),
      minBudgetInr: z.number().optional().describe("Minimum budget in INR")
    }),
    execute: async ({ category = "all", maxBudgetInr, minBudgetInr }: { category?: string; maxBudgetInr?: number; minBudgetInr?: number }) => {
      console.log(`[AI TOOL] Executing filterProducts: cat=${category} max=${maxBudgetInr} min=${minBudgetInr}`);
      let results = getProductsByCategory(category);
      
      if (maxBudgetInr !== undefined) {
        results = results.filter(p => p.basePrice !== null && p.basePrice <= maxBudgetInr);
      }
      if (minBudgetInr !== undefined) {
        results = results.filter(p => p.basePrice !== null && p.basePrice >= minBudgetInr);
      }
      
      return {
        count: results.length,
        filtersApplied: { category, maxBudgetInr, minBudgetInr },
        products: results.slice(0, 8).map(p => ({
          slug: p.slug,
          name: p.name,
          collection: p.collection,
          basePrice: p.basePrice,
          priceStatus: p.priceStatus
        }))
      };
    },
  }),

  // 4. compareProducts
  compareProducts: tool({
    description: "Compare two to three products side-by-side using their slugs.",
    parameters: z.object({
      slugs: z.array(z.string()).min(2).max(3).describe("Array of product slugs to compare")
    }),
    execute: async ({ slugs }: { slugs: string[] }) => {
      console.log(`[AI TOOL] Executing compareProducts: ${slugs.join(", ")}`);
      const products = slugs.map((s: string) => getProductBySlug(s)).filter(Boolean);
      
      return {
        comparison: products.map((p: any) => ({
          slug: p!.slug,
          name: p!.name,
          basePrice: p!.basePrice,
          dimensions: p!.dimensions,
          specifications: p!.specifications
        }))
      };
    },
  }),

  // 5. requestQuotation
  requestQuotation: tool({
    description: "Capture the user's intent to request a formal quotation or book a consultation.",
    parameters: z.object({
      intentType: z.enum(["QUOTE", "CONSULTATION", "WHATSAPP"]),
      productSlugs: z.array(z.string()).optional().describe("Products the user is interested in"),
      budget: z.string().optional(),
      projectType: z.string().optional().describe("E.g. Home, Office, Commercial")
    }),
    execute: async (args: any) => {
      console.log(`[AI TOOL] Executing requestQuotation: ${JSON.stringify(args)}`);
      return {
        success: true,
        actionRequired: "CLIENT_UI_HANDOFF",
        details: args
      };
    },
  }),
  
  // 6. showProductCard
  showProductCard: tool({
    description: "Renders an interactive visual product card in the chat UI. Always call this tool when recommending a specific product to the user.",
    parameters: z.object({
      slug: z.string().describe("The exact product slug to render")
    }),
    execute: async ({ slug }: { slug: string }) => {
      console.log(`[AI TOOL] Executing showProductCard: ${slug}`);
      const product = getProductBySlug(slug);
      if (!product) return { error: `Product ${slug} not found` };
      
      // We return the full product so the UI can render it
      return {
        product: {
          id: product.id,
          slug: product.slug,
          name: product.name,
          collection: product.collection,
          category: product.category,
          basePrice: product.basePrice,
          priceStatus: product.priceStatus,
          dimensions: product.dimensions,
          images: product.images,
          has3dModel: product.has3dModel
        }
      };
    }
  })
};
