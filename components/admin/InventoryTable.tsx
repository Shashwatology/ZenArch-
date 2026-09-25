'use client'

import { useState } from 'react'
import { updateInventory } from '@/app/admin/(portal)/inventory/actions'
import { useRouter } from 'next/navigation'

export function InventoryTable({ inventoryItems }: { inventoryItems: any[] }) {
  const router = useRouter()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  async function handleSave(formData: FormData) {
    const id = formData.get('inventoryId') as string
    setLoadingId(id)
    await updateInventory(formData)
    setEditingId(null)
    setLoadingId(null)
    router.refresh()
  }

  return (
    <div className="bg-[#1E1E1E] border border-white/10 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/5 text-xs uppercase tracking-wider text-gray-400">
              <th className="px-6 py-4 font-medium">Product / Variant</th>
              <th className="px-6 py-4 font-medium">SKU</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Available</th>
              <th className="px-6 py-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {inventoryItems.map((item) => {
              const name = item.variant 
                ? `${item.product.name} - ${item.variant.name}` 
                : item.product.name
              const sku = item.variant?.sku || item.product.sku || '-'
              const isEditing = editingId === item.id

              return (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-white">{name}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{sku}</td>
                  <td className="px-6 py-4">
                    {item.quantity === 0 ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                        NOT SET / OUT OF STOCK
                      </span>
                    ) : item.quantity <= item.lowStockThreshold ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                        LOW STOCK
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                        IN STOCK
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {isEditing ? (
                      <form action={handleSave} className="flex items-center justify-end space-x-2">
                        <input type="hidden" name="inventoryId" value={item.id} />
                        <input 
                          type="number" 
                          name="quantity" 
                          defaultValue={item.quantity} 
                          min="0"
                          className="w-20 bg-[#121212] border border-white/10 rounded px-2 py-1 text-white text-right focus:border-[#C8A97E] focus:outline-none"
                        />
                        <button 
                          type="submit" 
                          disabled={loadingId === item.id}
                          className="text-[#C8A97E] hover:text-white px-2 py-1 font-medium disabled:opacity-50 text-xs"
                        >
                          Save
                        </button>
                        <button 
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="text-gray-400 hover:text-white px-2 py-1 font-medium text-xs"
                        >
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <span className="text-white font-medium">{item.quantity}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {!isEditing && (
                      <button 
                        onClick={() => setEditingId(item.id)}
                        className="text-[#C8A97E] hover:text-white transition-colors text-sm font-medium"
                      >
                        Adjust
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
