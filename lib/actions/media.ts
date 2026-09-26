'use server'

import { requireAdmin } from '@/lib/admin/auth'
import { uploadMedia, deleteMedia } from '@/lib/admin/media'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function uploadProductImageAction(productId: string, formData: FormData) {
  const { dbUser } = await requireAdmin()
  const file = formData.get('file') as File
  if (!file) throw new Error("No file uploaded")

  const publicUrl = await uploadMedia(file, `products/${productId}`)

  // Get current images to determine order
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: true }
  })
  
  const order = product?.images.length || 0

  const newImage = await prisma.productImage.create({
    data: {
      productId,
      url: publicUrl,
      order,
      isCover: order === 0
    }
  })

  await prisma.auditLog.create({
    data: {
      action: 'IMAGE_UPLOADED',
      entityType: 'Product',
      entityId: productId,
      userId: dbUser.id,
      after: JSON.stringify({ url: publicUrl })
    }
  })

  revalidatePath(`/admin/products/${productId}`)
  return newImage
}

export async function deleteProductImageAction(imageId: string) {
  const { dbUser } = await requireAdmin()
  
  const image = await prisma.productImage.findUnique({ where: { id: imageId } })
  if (!image) throw new Error("Image not found")

  await deleteMedia(image.url)

  await prisma.productImage.delete({ where: { id: imageId } })

  await prisma.auditLog.create({
    data: {
      action: 'IMAGE_DELETED',
      entityType: 'Product',
      entityId: image.productId,
      userId: dbUser.id,
      before: JSON.stringify({ url: image.url })
    }
  })

  revalidatePath(`/admin/products/${image.productId}`)
  return { success: true }
}

export async function setProductCoverImageAction(productId: string, imageId: string) {
  const { dbUser } = await requireAdmin()

  await prisma.productImage.updateMany({
    where: { productId },
    data: { isCover: false }
  })

  await prisma.productImage.update({
    where: { id: imageId },
    data: { isCover: true }
  })

  revalidatePath(`/admin/products/${productId}`)
  return { success: true }
}

export async function uploadGeneralMediaAction(formData: FormData) {
  await requireAdmin()
  const file = formData.get('file') as File
  if (!file) throw new Error("No file uploaded")
  const publicUrl = await uploadMedia(file, 'general')
  return publicUrl
}

export async function deleteGeneralMediaAction(url: string) {
  await requireAdmin()
  await deleteMedia(url)
  return { success: true }
}
