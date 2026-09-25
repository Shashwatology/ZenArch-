import prisma from '@/lib/prisma'
import { cache } from 'react'
import { Prisma } from '@prisma/client'

export type PublicProduct = Prisma.ProductGetPayload<{
  include: {
    variants: true,
    images: { orderBy: { order: 'asc' } },
    specifications: true,
    inventory: true,
    collection: true,
    category: true
  }
}>

// 4. PRODUCT PAGE
export const getProductBySlug = cache(async (slug: string): Promise<PublicProduct | null> => {
  return prisma.product.findUnique({
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
})

export const getProductsByCategory = cache(async (categorySlug: string): Promise<PublicProduct[]> => {
  const whereClause: Prisma.ProductWhereInput = {
    status: 'PUBLISHED',
  }
  
  if (categorySlug !== 'all') {
    whereClause.category = { slug: categorySlug }
  }

  return prisma.product.findMany({
    where: whereClause,
    include: {
      variants: true,
      images: { orderBy: { order: 'asc' } },
      specifications: true,
      inventory: true,
      collection: true,
      category: true
    },
    orderBy: { updatedAt: 'desc' }
  })
})

export const searchProducts = cache(async (query: string): Promise<PublicProduct[]> => {
  const searchTerms = query.split(' ').filter(Boolean)
  if (!searchTerms.length) return []
  
  // Basic search across name, collection, and category
  // More advanced text search could be added later
  return prisma.product.findMany({
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
      specifications: true,
      inventory: true,
      collection: true,
      category: true
    },
    take: 20
  })
})
