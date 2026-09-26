import React from 'react'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin/auth'
import { AdminOrderClient } from './AdminOrderClient'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  await requireAdmin()
  const { id } = await params

  // In our URL, we might pass the DB ID or the Order ID (ZNA-xxx).
  // Let's try finding by orderId first, fallback to id.
  const order = await prisma.order.findFirst({
    where: {
      OR: [
        { id },
        { orderId: id }
      ]
    },
    include: {
      user: { include: { customerProfile: true } },
      items: { include: { product: true, variant: true } }
    }
  })

  if (!order) notFound()

  const auditLogs = await prisma.auditLog.findMany({
    where: {
      entityType: 'Order',
      entityId: order.id,
      action: {
        in: ['ORDER_CREATED', 'ORDER_STATUS_CHANGED', 'ORDER_UPDATED']
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  // Basic Timeline Reconstruction
  const timelineEvents = auditLogs.map(log => {
    let note = ''
    try {
      const before = JSON.parse(log.before || '{}')
      const after = JSON.parse(log.after || '{}')
      if (after.status && before.status !== after.status) {
        note = `Status updated to ${after.status}`
      }
      if (after.trackingId && before.trackingId !== after.trackingId) {
        note = `Tracking information added`
      }
    } catch(e) {}

    return {
      id: log.id,
      date: log.createdAt,
      note: note || log.action
    }
  })

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/orders" className="text-xs text-gray-400 hover:text-white uppercase tracking-widest font-mono mb-4 inline-block">
            &larr; Back to Orders
          </Link>
          <h2 className="text-2xl font-light tracking-wider text-white mb-2">Order {order.orderId || order.id}</h2>
          <p className="text-sm text-gray-400">Placed on {new Date(order.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#1E1E1E] border border-white/10 rounded-xl p-6">
            <h3 className="text-sm text-gray-400 uppercase tracking-widest font-mono mb-6">Order Items</h3>
            <div className="space-y-4">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0 last:pb-0">
                  <div>
                    <p className="text-white">{item.productNameAtTime}</p>
                    <p className="text-xs text-gray-500 font-mono mt-1">
                      Qty: {item.quantity} {item.variantNameAtTime ? `| ${item.variantNameAtTime}` : ''}
                    </p>
                  </div>
                  <p className="text-[#C8A97E] font-mono">₹{Number(item.priceAtTime).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-between font-medium">
              <span className="text-white">Total</span>
              <span className="text-[#C8A97E] font-mono">₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <AdminOrderClient order={order} />
        </div>

        <div className="space-y-6">
          <div className="bg-[#1E1E1E] border border-white/10 rounded-xl p-6">
            <h3 className="text-sm text-gray-400 uppercase tracking-widest font-mono mb-4">Customer Details</h3>
            <div className="space-y-2 text-sm">
              <p className="text-white">{order.user.customerProfile?.firstName} {order.user.customerProfile?.lastName}</p>
              <p className="text-gray-400">{order.user.email}</p>
              <p className="text-gray-400">{order.user.customerProfile?.phone || '-'}</p>
            </div>
          </div>

          <div className="bg-[#1E1E1E] border border-white/10 rounded-xl p-6">
            <h3 className="text-sm text-gray-400 uppercase tracking-widest font-mono mb-4">Shipping Address</h3>
            <div className="space-y-1 text-sm text-gray-400">
              <p className="text-white">{order.shippingName}</p>
              <p>{order.shippingAddress}</p>
              <p>{order.shippingCity}, {order.shippingState} {order.shippingPincode}</p>
              <p className="mt-2">Phone: {order.shippingPhone}</p>
            </div>
          </div>

          <div className="bg-[#1E1E1E] border border-white/10 rounded-xl p-6">
            <h3 className="text-sm text-gray-400 uppercase tracking-widest font-mono mb-4">Timeline</h3>
            <div className="space-y-4">
              {timelineEvents.map(event => (
                <div key={event.id} className="flex gap-4 text-sm text-gray-400 border-l border-white/10 pl-4 pb-4">
                  <div className="w-20 shrink-0 font-mono text-xs">
                    {new Date(event.date).toLocaleDateString()}<br/>
                    {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                  <div>
                    <p className="text-white">{event.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
