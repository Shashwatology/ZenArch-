'use server'

import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin/auth'
import { revalidatePath } from 'next/cache'

export async function upsertPromotionAction(formData: FormData) {
  const { dbUser } = await requireAdmin()

  const id = formData.get('id') as string | null
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const type = formData.get('type') as 'PERCENTAGE' | 'FIXED'
  const value = parseFloat(formData.get('value') as string)
  const appliesTo = formData.get('appliesTo') as any
  const targetIds = (formData.get('targetIds') as string).split(',').map(s => s.trim()).filter(Boolean)
  const minOrderValue = formData.get('minOrderValue') ? parseFloat(formData.get('minOrderValue') as string) : null
  const startAt = new Date(formData.get('startAt') as string)
  const endAt = formData.get('endAt') ? new Date(formData.get('endAt') as string) : null
  const isActive = formData.get('isActive') === 'on'

  const data = {
    name,
    description,
    type,
    value,
    appliesTo,
    targetIds,
    minOrderValue,
    startAt,
    endAt,
    isActive
  }

  let promotion;
  if (id) {
    promotion = await prisma.promotion.update({ where: { id }, data })
    await prisma.auditLog.create({
      data: { action: 'PROMOTION_UPDATED', entityType: 'Promotion', entityId: id, userId: dbUser.id, after: JSON.stringify(data) }
    })
  } else {
    promotion = await prisma.promotion.create({ data })
    await prisma.auditLog.create({
      data: { action: 'PROMOTION_CREATED', entityType: 'Promotion', entityId: promotion.id, userId: dbUser.id, after: JSON.stringify(data) }
    })
  }

  revalidatePath('/admin/promotions')
  return { success: true }
}

export async function togglePromotionStatus(id: string, isActive: boolean) {
  const { dbUser } = await requireAdmin()
  
  await prisma.promotion.update({ where: { id }, data: { isActive } })
  
  await prisma.auditLog.create({
    data: { action: isActive ? 'PROMOTION_ACTIVATED' : 'PROMOTION_DEACTIVATED', entityType: 'Promotion', entityId: id, userId: dbUser.id }
  })
  
  revalidatePath('/admin/promotions')
  return { success: true }
}
