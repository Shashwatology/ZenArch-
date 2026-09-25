'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin/auth'

export async function updateProduct(formData: FormData) {
  try {
    const { dbUser } = await requireAdmin()

    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const slug = formData.get('slug') as string
    const description = formData.get('description') as string
    const basePrice = formData.get('basePrice') ? Number(formData.get('basePrice')) : null
    const priceStatus = formData.get('priceStatus') as any
    const status = formData.get('status') as any
    const collectionId = formData.get('collectionId') as string || null
    const categoryId = formData.get('categoryId') as string || null
    
    const isBestSeller = formData.get('isBestSeller') === 'on'
    const isFeatured = formData.get('isFeatured') === 'on'

    const oldProduct = await prisma.product.findUnique({ where: { id } })
    if (!oldProduct) throw new Error('Product not found')

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        basePrice,
        priceStatus,
        status,
        collectionId,
        categoryId,
        isBestSeller,
        isFeatured
      }
    })

    await prisma.auditLog.create({
      data: {
        action: 'PRODUCT_UPDATED',
        entityType: 'PRODUCT',
        entityId: id,
        userId: dbUser.id,
        before: JSON.stringify({
          basePrice: oldProduct.basePrice,
          status: oldProduct.status,
          isBestSeller: oldProduct.isBestSeller,
          isFeatured: oldProduct.isFeatured
        }),
        after: JSON.stringify({
          basePrice: product.basePrice,
          status: product.status,
          isBestSeller: product.isBestSeller,
          isFeatured: product.isFeatured
        })
      }
    })

    revalidatePath(`/furniture/${slug}`)
    revalidatePath('/furniture')
    revalidatePath('/ai')
    revalidatePath('/')
    
    return { success: true }
  } catch (error: any) {
    console.error('Failed to update product:', error)
    return { error: error.message || 'Failed to update product.' }
  }
}
