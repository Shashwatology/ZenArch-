'use client'

import { useState } from 'react'
import { upsertCouponAction, toggleCouponStatus } from './actions'

export function CouponsClient({ coupons }: { coupons: any[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const openModal = (coupon = null) => {
    setEditingCoupon(coupon)
    setIsOpen(true)
  }
  
  const closeModal = () => {
    setIsOpen(false)
    setEditingCoupon(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData(e.currentTarget)
      if (editingCoupon) {
        formData.append('id', editingCoupon.id)
      }
      await upsertCouponAction(formData)
      closeModal()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async (id: string, currentStatus: boolean) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this coupon?`)) return
    try {
      await toggleCouponStatus(id, !currentStatus)
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-light tracking-wider text-white mb-2">Coupons</h2>
          <p className="text-sm text-gray-400">Manage discount codes and limits</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-[#C8A97E] hover:bg-[#b5956a] text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Create Coupon
        </button>
      </div>

      <div className="bg-[#1E1E1E] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5 text-xs uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4 font-medium">Code</th>
                <th className="px-6 py-4 font-medium">Discount</th>
                <th className="px-6 py-4 font-medium">Limits</th>
                <th className="px-6 py-4 font-medium">Redemptions</th>
                <th className="px-6 py-4 font-medium">Active Dates</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-white tracking-widest">{coupon.code}</span>
                  </td>
                  <td className="px-6 py-4 text-white font-medium">
                    {coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : `₹${Number(coupon.value).toLocaleString()}`}
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs space-y-1">
                    <div>Min: {coupon.minSubtotal ? `₹${coupon.minSubtotal}` : 'None'}</div>
                    {coupon.maxDiscount && <div>Max Disc: ₹{coupon.maxDiscount}</div>}
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">
                    {coupon._count?.redemptions || 0} / {coupon.usageLimit || '∞'}
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">
                    {new Date(coupon.startAt).toLocaleDateString()} - {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : 'Ongoing'}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleToggle(coupon.id, coupon.isActive)}
                      className={`px-2 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold transition-colors ${
                      coupon.isActive ? 'bg-green-500/10 text-green-400 hover:bg-red-500/10 hover:text-red-400 border border-green-500/20' : 'bg-gray-500/10 text-gray-400 hover:bg-green-500/10 hover:text-green-400 border border-gray-500/20'
                    }`}>
                      {coupon.isActive ? 'ACTIVE' : 'PAUSED'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openModal(coupon)} className="text-[#C8A97E] hover:text-white transition-colors text-sm font-medium">Edit</button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No coupons found. Create one to share a discount code.
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
                {editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Code</label>
                  <input type="text" name="code" defaultValue={editingCoupon?.code} required className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-white font-mono uppercase focus:outline-none focus:border-[#C8A97E]" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Discount Type</label>
                  <select name="type" defaultValue={editingCoupon?.type || 'PERCENTAGE'} className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C8A97E]">
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Value</label>
                  <input type="number" step="0.01" name="value" defaultValue={editingCoupon?.value} required className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C8A97E]" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Scope</label>
                  <select name="appliesTo" defaultValue={editingCoupon?.appliesTo || 'GLOBAL'} className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C8A97E]">
                    <option value="GLOBAL">Global</option>
                    <option value="PRODUCT">Specific Products</option>
                    <option value="COLLECTION">Specific Collections</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Target IDs (Comma separated)</label>
                  <input type="text" name="targetIds" defaultValue={editingCoupon?.targetIds?.join(', ')} placeholder="Leave empty for GLOBAL" className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C8A97E]" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Min Order Value (₹)</label>
                  <input type="number" step="0.01" name="minSubtotal" defaultValue={editingCoupon?.minSubtotal} className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C8A97E]" />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Max Discount (₹)</label>
                  <input type="number" step="0.01" name="maxDiscount" defaultValue={editingCoupon?.maxDiscount} className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C8A97E]" />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Total Usage Limit</label>
                  <input type="number" name="usageLimit" defaultValue={editingCoupon?.usageLimit} placeholder="Leave empty for unlimited" className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C8A97E]" />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Per Customer Limit</label>
                  <input type="number" name="perCustomerLimit" defaultValue={editingCoupon?.perCustomerLimit || 1} required className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C8A97E]" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Active</label>
                  <label className="flex items-center space-x-2 mt-2">
                    <input type="checkbox" name="isActive" defaultChecked={editingCoupon ? editingCoupon.isActive : true} className="w-4 h-4 accent-[#C8A97E]" />
                    <span className="text-sm text-gray-300">Coupon is currently active</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Start Date</label>
                  <input type="datetime-local" name="startAt" defaultValue={editingCoupon?.startAt ? new Date(editingCoupon.startAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)} required className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C8A97E] [color-scheme:dark]" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Expiration Date (Optional)</label>
                  <input type="datetime-local" name="expiresAt" defaultValue={editingCoupon?.expiresAt ? new Date(editingCoupon.expiresAt).toISOString().slice(0, 16) : ''} className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C8A97E] [color-scheme:dark]" />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-white/10">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm text-white hover:bg-white/5 rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="bg-[#C8A97E] hover:bg-[#b5956a] text-black px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
