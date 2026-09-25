import prisma from '@/lib/prisma'
import { cache } from 'react'

export const getCategories = cache(async () => {
  return prisma.category.findMany({
    orderBy: { name: 'asc' }
  })
})

export const getCategoryBySlug = cache(async (slug: string) => {
  return prisma.category.findUnique({
    where: { slug }
  })
})
