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

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params
  const isCategory = CATEGORIES.some(c => c.id === slug)
  if (isCategory) {
    const categoryLabel = CATEGORIES.find(c => c.id === slug)?.name
    return { title: `${categoryLabel} | ZEN ARCH` }
  }

  const dbProduct = await getProductBySlug(slug)
  if (!dbProduct) return { title: 'Product Not Found' }

  return {
    title: dbProduct.seoTitle || `${dbProduct.name} | ZEN ARCH`,
    description: dbProduct.seoDescription,
    alternates: {
      canonical: dbProduct.canonical || `${process.env.NEXT_PUBLIC_SITE_URL}/furniture/${dbProduct.slug}`,
    },
    openGraph: {
      images: [dbProduct.ogImage || dbProduct.images[0]?.url || ''],
    },
    robots: {
      index: !dbProduct.noindex,
      follow: !dbProduct.noindex,
    }
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": dbProduct.name,
    "image": dbProduct.images.map(img => img.url),
    "description": dbProduct.description,
    "sku": dbProduct.sku,
    "offers": {
      "@type": "Offer",
      "url": `${process.env.NEXT_PUBLIC_SITE_URL}/furniture/${dbProduct.slug}`,
      "priceCurrency": "INR",
      "price": dbProduct.basePrice ? dbProduct.basePrice.toString() : "0",
      "availability": dbProduct.inventory.length > 0 && dbProduct.inventory[0].quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<div className="min-h-screen bg-[#0F0F0F]" />}>
        <ProductClient 
          isCategory={false} 
          product={product} 
          relatedProducts={relatedProducts}
          isSaved={isSaved}
        />
      </Suspense>
    </>
  )
}
