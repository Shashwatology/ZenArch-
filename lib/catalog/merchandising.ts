import prisma from '@/lib/prisma'
import { cache } from 'react'

export const getFeaturedProducts = cache(async () => {
  return prisma.product.findMany({
    where: {
      status: 'PUBLISHED',
      isFeatured: true
    },
    include: {
      variants: true,
      images: { orderBy: { order: 'asc' }, take: 1 },
      collection: true,
      category: true
    },
    take: 6,
    orderBy: { updatedAt: 'desc' }
  })
})

export const getBestSellers = cache(async () => {
  return prisma.product.findMany({
    where: {
      status: 'PUBLISHED',
      isBestSeller: true
    },
    include: {
      variants: true,
      images: { orderBy: { order: 'asc' }, take: 1 },
      collection: true,
      category: true
    },
    take: 4,
    orderBy: { updatedAt: 'desc' }
  })
})
