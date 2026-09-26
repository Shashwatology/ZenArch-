'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/admin/auth'

export async function updateProductBulkAction(productIds: string[], action: string) {
  const { authUser, dbUser } = await requireAdmin()
  
  // Create audit log for bulk action
  await prisma.auditLog.create({
    data: {
      userId: dbUser.id,
      action: `BULK_${action}`,
      entityType: 'Product',
      entityId: `Bulk: ${productIds.length} items`,
      before: JSON.stringify({ ids: productIds }),
    }
  })

  switch (action) {
    case 'PUBLISH':
      await prisma.product.updateMany({
        where: { id: { in: productIds } },
        data: { status: 'PUBLISHED' }
      })
      break
    case 'DRAFT':
      await prisma.product.updateMany({
        where: { id: { in: productIds } },
        data: { status: 'DRAFT' }
      })
      break
    case 'ARCHIVE':
      await prisma.product.updateMany({
        where: { id: { in: productIds } },
        data: { status: 'ARCHIVED' }
      })
      break
    case 'FEATURED':
      await prisma.product.updateMany({
        where: { id: { in: productIds } },
        data: { isFeatured: true }
      })
      break
    case 'UNFEATURED':
      await prisma.product.updateMany({
        where: { id: { in: productIds } },
        data: { isFeatured: false }
      })
      break
    case 'BESTSELLER':
      await prisma.product.updateMany({
        where: { id: { in: productIds } },
        data: { isBestSeller: true }
      })
      break
    case 'UNBESTSELLER':
      await prisma.product.updateMany({
        where: { id: { in: productIds } },
        data: { isBestSeller: false }
      })
      break
    default:
      throw new Error("Invalid bulk action")
  }

  revalidatePath('/admin/products')
  revalidatePath('/furniture')
  revalidatePath('/')
  
  return { success: true }
}
