import { getProductsByCategory, PublicProduct } from '@/lib/catalog/products'
import FurnitureClient from './FurnitureClient'
import { CATEGORIES } from '@/lib/data/furniture'

export const dynamic = 'force-dynamic'

function adaptProduct(dbProduct: PublicProduct) {
  return {
    id: dbProduct.id,
    slug: dbProduct.slug,
    name: dbProduct.name,
    basePrice: dbProduct.basePrice,
    priceStatus: dbProduct.priceStatus,
    dimensions: dbProduct.dimensions,
    category: dbProduct.category?.slug || 'unknown',
    collection: dbProduct.collection?.name || 'Unknown Collection',
    images: dbProduct.images.map(img => img.url),
    variants: dbProduct.variants,
    specifications: dbProduct.specifications
  }
}

export default async function FurnitureDirectoryPage() {
  const dbProducts = await getProductsByCategory('all')
  const products = dbProducts.map(adaptProduct)

  return <FurnitureClient initialProducts={products} categories={CATEGORIES} />
}
