import React from 'react'
import { requireCustomerAuth } from '@/lib/actions/customerAuth'

export default async function AccountPage() {
  const { dbUser } = await requireCustomerAuth()

  return (
    <div className="p-8 md:p-12 space-y-8">
      <div className="border-b border-zen-border pb-6">
        <h1 className="font-serif text-3xl text-zen-black">Dashboard</h1>
        <p className="text-sm text-zen-taupe mt-2 font-light">View your recent activity and saved items.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-zen-border p-6 bg-zen-stone/10">
          <span className="text-[10px] uppercase tracking-widest font-mono text-zen-charcoal block mb-2">Saved Products</span>
          <span className="font-serif text-3xl text-zen-black">
            {/* Will wire to DB later */}
            0
          </span>
        </div>
        <div className="border border-zen-border p-6 bg-zen-stone/10">
          <span className="text-[10px] uppercase tracking-widest font-mono text-zen-charcoal block mb-2">Active Quotes</span>
          <span className="font-serif text-3xl text-zen-black">
            0
          </span>
        </div>
        <div className="border border-zen-border p-6 bg-zen-stone/10">
          <span className="text-[10px] uppercase tracking-widest font-mono text-zen-charcoal block mb-2">Orders</span>
          <span className="font-serif text-3xl text-zen-black">
            0
          </span>
        </div>
      </div>
      
      <div className="pt-6">
        <h2 className="font-serif text-xl mb-4">Recent Quotes</h2>
        <p className="text-sm text-zen-taupe">You have no recent quotes.</p>
      </div>
    </div>
  )
}
