'use client'

import React, { useState } from 'react'
import { updateOrderAdmin } from '@/lib/actions/orders'

export function AdminOrderClient({ order }: { order: any }) {
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    status: order.status,
    deliveryPartner: order.deliveryPartner || '',
    trackingId: order.trackingId || '',
    trackingUrl: order.trackingUrl || ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateOrderAdmin(order.id, formData)
      alert('Order updated successfully')
    } catch (error) {
      console.error(error)
      alert('Failed to update order')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-[#1E1E1E] border border-white/10 rounded-xl p-6 space-y-6">
      <h3 className="text-sm text-gray-400 uppercase tracking-widest font-mono mb-4">Management & Tracking</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">Order Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full bg-black border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30"
          >
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="READY_TO_DISPATCH">READY TO DISPATCH</option>
            <option value="DISPATCHED">DISPATCHED</option>
            <option value="IN_TRANSIT">IN TRANSIT</option>
            <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">Delivery Partner</label>
          <input
            name="deliveryPartner"
            value={formData.deliveryPartner}
            onChange={handleChange}
            placeholder="e.g. BlueDart"
            className="w-full bg-black border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">Tracking ID</label>
          <input
            name="trackingId"
            value={formData.trackingId}
            onChange={handleChange}
            placeholder="e.g. AWB123456789"
            className="w-full bg-black border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">Tracking URL</label>
          <input
            name="trackingUrl"
            value={formData.trackingUrl}
            onChange={handleChange}
            placeholder="e.g. https://track.bluedart.com/..."
            className="w-full bg-black border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30"
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-white text-black font-medium text-sm rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
