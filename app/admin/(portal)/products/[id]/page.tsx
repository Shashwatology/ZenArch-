import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ProductEditorForm } from '@/components/admin/ProductEditorForm'

export const dynamic = 'force-dynamic'

export default async function AdminProductPage({ params }: { params: { id: string } }) {
  const { id } = params
  
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      collection: true,
      category: true,
      variants: true,
      images: {
        orderBy: { order: 'asc' }
      },
      specifications: true,
      inventory: true
    }
  })

  if (!product) {
    notFound()
  }

  const collections = await prisma.collection.findMany()
  const categories = await prisma.category.findMany()

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-light tracking-wider text-white mb-2">Edit Product</h2>
        <p className="text-sm text-gray-400">{product.name} ({product.slug})</p>
      </div>

      <ProductEditorForm 
        product={product} 
        collections={collections}
        categories={categories}
      />
    </div>
  )
}
