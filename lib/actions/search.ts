'use server'

import prisma from '@/lib/prisma'

export async function globalAdminSearch(query: string) {
  if (!query || query.length < 2) return { products: [], customers: [], projects: [], orders: [], quotes: [] }
  
  const search = `%${query}%`

  const [products, customers, projects, orders, quotes] = await Promise.all([
    prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { sku: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: 5,
      select: { id: true, name: true, sku: true, status: true }
    }),
    prisma.user.findMany({
      where: {
        role: 'CUSTOMER',
        OR: [
          { email: { contains: query, mode: 'insensitive' } },
          { customerProfile: { firstName: { contains: query, mode: 'insensitive' } } },
          { customerProfile: { lastName: { contains: query, mode: 'insensitive' } } }
        ]
      },
      take: 5,
      select: { id: true, email: true, customerProfile: { select: { firstName: true, lastName: true } } }
    }),
    prisma.project.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' }
      },
      take: 5,
      select: { id: true, name: true, status: true }
    }),
    prisma.order.findMany({
      where: {
        id: { contains: query, mode: 'insensitive' }
      },
      take: 5,
      select: { id: true, status: true, totalAmount: true }
    }),
    prisma.quoteRequest.findMany({
      where: {
        id: { contains: query, mode: 'insensitive' }
      },
      take: 5,
      select: { id: true, status: true }
    })
  ])

  return { products, customers, projects, orders, quotes }
}
