'use server'

import prisma from '@/lib/prisma'

export async function getDbProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      variants: true,
      images: { orderBy: { order: 'asc' } },
      specifications: true,
      inventory: true,
      collection: true,
      category: true
    }
  })

  return product
}

export async function getPublicProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug, status: 'PUBLISHED' },
    include: {
      variants: true,
      images: { orderBy: { order: 'asc' } },
      specifications: true,
      collection: true,
      category: true
    }
  })

  if (!product) return null

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    basePrice: product.basePrice,
    priceStatus: product.priceStatus,
    dimensions: product.dimensions,
    category: product.category?.slug || 'unknown',
    collection: product.collection?.name || 'Unknown',
    images: product.images.map(img => img.url),
    variants: product.variants,
    specifications: product.specifications
  }
}

export async function searchPublicProducts(query: string) {
  const searchTerms = query.split(' ').filter(Boolean)
  if (!searchTerms.length) return []
  
  const products = await prisma.product.findMany({
    where: {
      status: 'PUBLISHED',
      OR: searchTerms.map(term => ({
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { collection: { name: { contains: term, mode: 'insensitive' } } },
          { category: { name: { contains: term, mode: 'insensitive' } } },
        ]
      }))
    },
    include: {
      variants: true,
      images: { orderBy: { order: 'asc' } },
      collection: true,
      category: true
    },
    take: 10
  })

  return products.map(product => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    basePrice: product.basePrice,
    priceStatus: product.priceStatus,
    dimensions: product.dimensions,
    category: product.category?.slug || 'unknown',
    collection: product.collection?.name || 'Unknown',
    images: product.images.map(img => img.url),
    variants: product.variants
  }))
}

