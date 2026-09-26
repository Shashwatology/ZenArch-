'use client'

import { useState } from 'react'
import { upsertPromotionAction, togglePromotionStatus } from './actions'

export function PromotionsClient({ promotions }: { promotions: any[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [editingPromo, setEditingPromo] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const openModal = (promo = null) => {
    setEditingPromo(promo)
    setIsOpen(true)
  }
  
  const closeModal = () => {
    setIsOpen(false)
    setEditingPromo(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData(e.currentTarget)
      if (editingPromo) {
        formData.append('id', editingPromo.id)
      }
      await upsertPromotionAction(formData)
      closeModal()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async (id: string, currentStatus: boolean) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this promotion?`)) return
    try {
      await togglePromotionStatus(id, !currentStatus)
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-light tracking-wider text-white mb-2">Promotions</h2>
          <p className="text-sm text-gray-400">Manage global and scoped pricing rules</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-[#C8A97E] hover:bg-[#b5956a] text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Create Promotion
        </button>
      </div>

      <div className="bg-[#1E1E1E] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5 text-xs uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Discount</th>
                <th className="px-6 py-4 font-medium">Scope</th>
                <th className="px-6 py-4 font-medium">Active Dates</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {promotions.map((promo) => (
                <tr key={promo.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-white">{promo.name}</span>
                    {promo.description && <p className="text-xs text-gray-500 mt-1">{promo.description}</p>}
                  </td>
                  <td className="px-6 py-4 text-white font-medium">
                    {promo.type === 'PERCENTAGE' ? `${promo.value}%` : `₹${Number(promo.value).toLocaleString()}`}
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">
                    {promo.appliesTo} {promo.targetIds.length > 0 && `(${promo.targetIds.length} targets)`}
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">
                    {new Date(promo.startAt).toLocaleDateString()} - {promo.endAt ? new Date(promo.endAt).toLocaleDateString() : 'Ongoing'}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleToggle(promo.id, promo.isActive)}
                      className={`px-2 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold transition-colors ${
                      promo.isActive ? 'bg-green-500/10 text-green-400 hover:bg-red-500/10 hover:text-red-400 border border-green-500/20' : 'bg-gray-500/10 text-gray-400 hover:bg-green-500/10 hover:text-green-400 border border-gray-500/20'
                    }`}>
                      {promo.isActive ? 'ACTIVE' : 'PAUSED'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openModal(promo)} className="text-[#C8A97E] hover:text-white transition-colors text-sm font-medium">Edit</button>
                  </td>
                </tr>
              ))}
              {promotions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No promotions found. Create one to run a sale or discount.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-[#1E1E1E] border border-white/10 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <h2 className="text-xl font-light text-white mb-4">
                {editingPromo ? 'Edit Promotion' : 'Create Promotion'}
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Name</label>
                  <input type="text" name="name" defaultValue={editingPromo?.name} required className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C8A97E]" />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Description</label>
                  <textarea name="description" defaultValue={editingPromo?.description} rows={2} className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C8A97E]"></textarea>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Discount Type</label>
                  <select name="type" defaultValue={editingPromo?.type || 'PERCENTAGE'} className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C8A97E]">
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Value</label>
                  <input type="number" step="0.01" name="value" defaultValue={editingPromo?.value} required className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C8A97E]" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Scope</label>
                  <select name="appliesTo" defaultValue={editingPromo?.appliesTo || 'GLOBAL'} className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C8A97E]">
                    <option value="GLOBAL">Global</option>
                    <option value="PRODUCT">Specific Products</option>
                    <option value="COLLECTION">Specific Collections</option>
                    <option value="PROJECT_TYPE">Specific Project Types</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Target IDs (Comma separated)</label>
                  <input type="text" name="targetIds" defaultValue={editingPromo?.targetIds?.join(', ')} placeholder="Leave empty for GLOBAL" className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C8A97E]" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Min Order Value (₹)</label>
                  <input type="number" step="0.01" name="minOrderValue" defaultValue={editingPromo?.minOrderValue} className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C8A97E]" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Active</label>
                  <label className="flex items-center space-x-2 mt-2">
                    <input type="checkbox" name="isActive" defaultChecked={editingPromo ? editingPromo.isActive : true} className="w-4 h-4 accent-[#C8A97E]" />
                    <span className="text-sm text-gray-300">Promotion is currently active</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Start Date</label>
                  <input type="datetime-local" name="startAt" defaultValue={editingPromo?.startAt ? new Date(editingPromo.startAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)} required className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C8A97E] [color-scheme:dark]" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">End Date (Optional)</label>
                  <input type="datetime-local" name="endAt" defaultValue={editingPromo?.endAt ? new Date(editingPromo.endAt).toISOString().slice(0, 16) : ''} className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C8A97E] [color-scheme:dark]" />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-white/10">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm text-white hover:bg-white/5 rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="bg-[#C8A97E] hover:bg-[#b5956a] text-black px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save Promotion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
