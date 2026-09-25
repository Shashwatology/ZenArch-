'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin/auth'

export async function updateInventory(formData: FormData) {
  try {
    const { dbUser } = await requireAdmin()

    const inventoryId = formData.get('inventoryId') as string
    const newQtyStr = formData.get('quantity') as string
    const reason = formData.get('reason') as string || 'Manual adjustment'

    if (!newQtyStr) throw new Error('Quantity required')
    const newQty = parseInt(newQtyStr, 10)

    // Execute in transaction to safely record history
    await prisma.$transaction(async (tx) => {
      const inv = await tx.inventoryItem.findUnique({ where: { id: inventoryId } })
      if (!inv) throw new Error('Inventory record not found')

      const prevQty = inv.quantity

      if (prevQty === newQty) return // No change

      // Update quantity
      await tx.inventoryItem.update({
        where: { id: inventoryId },
        data: { quantity: newQty }
      })

      // Record movement
      await tx.inventoryMovement.create({
        data: {
          inventoryId,
          previousQty: prevQty,
          changeQty: newQty - prevQty,
          newQty,
          reason,
          adminUserId: dbUser.id
        }
      })

      // Log in global audit
      await tx.auditLog.create({
        data: {
          action: 'STOCK_UPDATED',
          entityType: 'INVENTORY_ITEM',
          entityId: inventoryId,
          userId: dbUser.id,
          before: JSON.stringify({ quantity: prevQty }),
          after: JSON.stringify({ quantity: newQty })
        }
      })
    })

    revalidatePath('/admin/inventory')
    revalidatePath('/products')
    
    return { success: true }
  } catch (error: any) {
    console.error('Failed to update inventory:', error)
    return { error: error.message || 'Failed to update inventory' }
  }
}
