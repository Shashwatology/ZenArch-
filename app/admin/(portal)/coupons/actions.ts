'use server'

import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin/auth'
import { revalidatePath } from 'next/cache'

export async function upsertCouponAction(formData: FormData) {
  const { dbUser } = await requireAdmin()

  const id = formData.get('id') as string | null
  const code = (formData.get('code') as string).toUpperCase().trim()
  const type = formData.get('type') as 'PERCENTAGE' | 'FIXED'
  const value = parseFloat(formData.get('value') as string)
  const appliesTo = formData.get('appliesTo') as any
  const targetIds = (formData.get('targetIds') as string).split(',').map(s => s.trim()).filter(Boolean)
  const minSubtotal = formData.get('minSubtotal') ? parseFloat(formData.get('minSubtotal') as string) : null
  const maxDiscount = formData.get('maxDiscount') ? parseFloat(formData.get('maxDiscount') as string) : null
  const usageLimit = formData.get('usageLimit') ? parseInt(formData.get('usageLimit') as string) : null
  const perCustomerLimit = formData.get('perCustomerLimit') ? parseInt(formData.get('perCustomerLimit') as string) : 1
  const startAt = new Date(formData.get('startAt') as string)
  const expiresAt = formData.get('expiresAt') ? new Date(formData.get('expiresAt') as string) : null
  const isActive = formData.get('isActive') === 'on'

  const data = {
    code,
    type,
    value,
    appliesTo,
    targetIds,
    minSubtotal,
    maxDiscount,
    usageLimit,
    perCustomerLimit,
    startAt,
    expiresAt,
    isActive
  }

  let coupon;
  if (id) {
    coupon = await prisma.coupon.update({ where: { id }, data })
    await prisma.auditLog.create({
      data: { action: 'COUPON_UPDATED', entityType: 'Coupon', entityId: id, userId: dbUser.id, after: JSON.stringify(data) }
    })
  } else {
    // Check duplicate
    const existing = await prisma.coupon.findUnique({ where: { code } })
    if (existing) throw new Error("Coupon code already exists")
    
    coupon = await prisma.coupon.create({ data })
    await prisma.auditLog.create({
      data: { action: 'COUPON_CREATED', entityType: 'Coupon', entityId: coupon.id, userId: dbUser.id, after: JSON.stringify(data) }
    })
  }

  revalidatePath('/admin/coupons')
  return { success: true }
}

export async function toggleCouponStatus(id: string, isActive: boolean) {
  const { dbUser } = await requireAdmin()
  
  await prisma.coupon.update({ where: { id }, data: { isActive } })
  
  await prisma.auditLog.create({
    data: { action: isActive ? 'COUPON_ACTIVATED' : 'COUPON_DEACTIVATED', entityType: 'Coupon', entityId: id, userId: dbUser.id }
  })
  
  revalidatePath('/admin/coupons')
  return { success: true }
}
