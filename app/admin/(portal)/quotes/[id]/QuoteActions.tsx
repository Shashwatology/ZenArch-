'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateQuoteStatus } from '@/lib/actions/quotes'

export function QuoteActions({ quoteId, currentStatus }: { quoteId: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const [isLoading, setIsLoading] = useState(false)
  const [isOrderLoading, setIsOrderLoading] = useState(false)
  const router = useRouter()

  const statuses = [
    'NEW', 'IN_REVIEW', 'CONTACTED', 'QUOTED', 'ACCEPTED', 'REJECTED', 'CLOSED'
  ]

  async function handleUpdate() {
    setIsLoading(true)
    try {
      await updateQuoteStatus(quoteId, status)
      router.refresh()
    } catch (e: any) {
      alert(e.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCreateOrder() {
    if (!confirm('Create a confirmed order from this quote?')) return
    setIsOrderLoading(true)
    try {
      // The action was exported in lib/actions/orders.ts but we can just import from there
      const { createOrderFromQuote } = await import('@/lib/actions/orders')
      const res = await createOrderFromQuote(quoteId)
      if (res.success) {
        router.push('/admin/orders')
      }
    } catch (e: any) {
      alert(e.message)
    } finally {
      setIsOrderLoading(false)
    }
  }

  return (
    <div className="flex gap-4 items-center">
      {currentStatus === 'ACCEPTED' && (
        <button 
          onClick={handleCreateOrder}
          disabled={isOrderLoading}
          className="bg-[#C8A97E] text-[#121212] px-4 py-2 text-sm font-medium hover:bg-white transition-colors disabled:opacity-50"
        >
          {isOrderLoading ? 'Creating...' : 'Convert to Order'}
        </button>
      )}

      <div className="flex bg-[#1E1E1E] border border-white/10 rounded-sm overflow-hidden">
        <select 
          value={status} 
          onChange={(e) => setStatus(e.target.value)}
          className="bg-transparent text-white px-4 py-2 text-sm focus:outline-none focus:bg-white/5"
        >
          {statuses.map(s => (
            <option key={s} value={s} className="bg-[#1E1E1E] text-white">{s}</option>
          ))}
        </select>
        <button 
          onClick={handleUpdate} 
          disabled={isLoading || status === currentStatus}
          className="border-l border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition-colors disabled:opacity-50 text-white"
        >
          {isLoading ? '...' : 'Update'}
        </button>
      </div>
    </div>
  )
}
