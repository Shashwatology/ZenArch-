'use server'

import prisma from '@/lib/prisma'
import { requireCustomerAuth } from './customerAuth'
import { revalidatePath } from 'next/cache'

export async function toggleSavedProduct(productId: string) {
  const { dbUser } = await requireCustomerAuth()

  if (!dbUser.customerProfile) {
    throw new Error('Customer profile not found')
  }

  const profileId = dbUser.customerProfile.id

  const existing = await prisma.savedProduct.findUnique({
    where: {
      profileId_productId: {
        profileId,
        productId
      }
    }
  })

  if (existing) {
    await prisma.savedProduct.delete({
      where: { id: existing.id }
    })
    revalidatePath('/account/wishlist')
    return { status: 'removed' }
  } else {
    await prisma.savedProduct.create({
      data: {
        profileId,
        productId
      }
    })
    revalidatePath('/account/wishlist')
    return { status: 'added' }
  }
}

export async function getSavedProducts() {
  const { dbUser } = await requireCustomerAuth()

  if (!dbUser.customerProfile) {
    return []
  }

  const saved = await prisma.savedProduct.findMany({
    where: { profileId: dbUser.customerProfile.id },
    include: {
      product: {
        include: {
          images: { orderBy: { order: 'asc' }, take: 1 },
          category: true,
          collection: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return saved.map(s => s.product)
}
