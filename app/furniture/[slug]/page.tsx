import { ProductClient } from './ProductClient'
import { getProductBySlug, getProductsByCategory, PublicProduct } from '@/lib/catalog/products'
import { CATEGORIES } from '@/lib/data/furniture'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

function adaptProduct(dbProduct: PublicProduct | null) {
  if (!dbProduct) return null
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

export default async function FurniturePage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  
  const isCategory = CATEGORIES.some(c => c.id === slug)
  
  if (isCategory) {
    const categoryLabel = CATEGORIES.find(c => c.id === slug)?.name
    const dbCategoryProducts = await getProductsByCategory(slug)
    const categoryProducts = dbCategoryProducts.map(adaptProduct)
    
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#0F0F0F]" />}>
        <ProductClient 
          isCategory={true} 
          categoryLabel={categoryLabel} 
          categoryProducts={categoryProducts} 
        />
      </Suspense>
    )
  }

  // Not a category, treat as a single product
  const dbProduct = await getProductBySlug(slug)
  if (!dbProduct || dbProduct.status !== 'PUBLISHED') {
    notFound()
  }

  const product = adaptProduct(dbProduct)
  
  // Fetch related products from the same category
  const dbRelated = await getProductsByCategory(product?.category || 'all')
  const relatedProducts = dbRelated
    .filter(p => p.slug !== slug)
    .slice(0, 4)
    .map(adaptProduct)

  // Check if product is saved
  let isSaved = false
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    
    if (data?.user) {
      const { default: prisma } = await import('@/lib/prisma')
      const profile = await prisma.customerProfile.findUnique({
        where: { userId: data.user.id }
      })
      if (profile) {
        const saved = await prisma.savedProduct.findUnique({
          where: {
            profileId_productId: {
              profileId: profile.id,
              productId: dbProduct.id
            }
          }
        })
        isSaved = !!saved
      }
    }
  } catch (e) {
    // Ignore auth errors on public pages
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F0F0F]" />}>
      <ProductClient 
        isCategory={false} 
        product={product} 
        relatedProducts={relatedProducts}
        isSaved={isSaved}
      />
    </Suspense>
  )
}
