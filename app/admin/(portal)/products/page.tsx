import prisma from '@/lib/prisma'
import { ProductsClient } from './ProductsClient'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      collection: true,
      category: true,
      inventory: true
    },
    orderBy: { updatedAt: 'desc' }
  })

  // We serialize the dates for the client component
  const serializedProducts = products.map(p => ({
    ...p,
    basePrice: p.basePrice ? p.basePrice.toString() : null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }))

  return <ProductsClient initialProducts={serializedProducts} />
}
