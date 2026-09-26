import React from 'react'
import Link from 'next/link'
import { getAdminOrders } from '@/lib/actions/orders'

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders()

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-light tracking-wider text-white mb-2">Order Management</h2>
          <p className="text-sm text-gray-400">Review and process customer orders.</p>
        </div>
        <a 
          href="/api/admin/orders/export"
          target="_blank"
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs tracking-widest uppercase font-mono border border-white/20 rounded-sm transition-colors"
        >
          Export Excel (CSV)
        </a>
      </div>

      <div className="bg-[#1E1E1E] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5 text-xs uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4 font-medium">Order Ref</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Items</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-mono text-white">{order.id.split('-')[0].toUpperCase()}</td>
                  <td className="px-6 py-4 text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="text-white">{order.user.customerProfile?.firstName} {order.user.customerProfile?.lastName}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{order.user.email}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{order.items.length}</td>
                  <td className="px-6 py-4 text-[#C8A97E] font-mono">₹{Number(order.totalAmount).toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-[10px] font-mono tracking-widest uppercase border rounded-full ${
                      order.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                      order.status === 'CONFIRMED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      order.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      order.status === 'CANCELLED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
