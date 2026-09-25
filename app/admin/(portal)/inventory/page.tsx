import prisma from '@/lib/prisma'
import { InventoryTable } from '@/components/admin/InventoryTable'

export const dynamic = 'force-dynamic'

export default async function AdminInventoryPage() {
  const inventoryItems = await prisma.inventoryItem.findMany({
    include: {
      product: true,
      variant: true
    },
    orderBy: {
      product: { name: 'asc' }
    }
  })

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-light tracking-wider text-white mb-2">Inventory</h2>
          <p className="text-sm text-gray-400">Manage your physical stock quantities</p>
        </div>
      </div>

      <InventoryTable inventoryItems={inventoryItems} />
    </div>
  )
}
