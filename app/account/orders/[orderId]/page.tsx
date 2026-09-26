import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Package, Truck, CheckCircle2, Clock } from 'lucide-react'

export default async function OrderDetailsPage({ params }: { params: { orderId: string } }) {
  const { orderId } = await params
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } })
  if (!dbUser) redirect('/login')

  const order = await prisma.order.findUnique({
    where: { 
      orderId: orderId,
      userId: dbUser.id
    },
    include: {
      items: {
        include: {
          product: true
        }
      }
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
    <div className="min-h-screen bg-zen-ivory text-zen-black pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        <div className="flex items-center justify-between border-b border-zen-border pb-6">
          <div>
            <h1 className="font-serif text-3xl mb-1 text-zen-black">Order {order.orderId}</h1>
            <p className="text-sm text-zen-taupe">Placed on {order.createdAt.toLocaleDateString()}</p>
          </div>
          <Link href="/account/orders" className="text-xs uppercase tracking-widest text-zen-taupe hover:text-zen-accent transition-colors">
            &larr; Back to Orders
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Status Tracker */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white p-6 border border-zen-border space-y-6">
              <h2 className="font-sans text-xs uppercase tracking-widest text-zen-taupe">Status Tracker</h2>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${['CONFIRMED', 'PROCESSING', 'READY_TO_DISPATCH', 'DISPATCHED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status) ? 'bg-zen-accent text-white' : 'bg-zen-ivory border border-zen-border text-zen-taupe'}`}>
                    <CheckCircle2 size={18} />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-mono">Confirmed</span>
                </div>
                <div className={`flex-1 h-[1px] ${['PROCESSING', 'READY_TO_DISPATCH', 'DISPATCHED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status) ? 'bg-zen-accent' : 'bg-zen-border'}`} />
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${['READY_TO_DISPATCH', 'DISPATCHED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status) ? 'bg-zen-accent text-white' : 'bg-zen-ivory border border-zen-border text-zen-taupe'}`}>
                    <Package size={18} />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-mono">Dispatched</span>
                </div>
                <div className={`flex-1 h-[1px] ${['IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status) ? 'bg-zen-accent' : 'bg-zen-border'}`} />
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${['DELIVERED'].includes(order.status) ? 'bg-zen-accent text-white' : 'bg-zen-ivory border border-zen-border text-zen-taupe'}`}>
                    <Truck size={18} />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-mono">Delivered</span>
                </div>
              </div>

              {order.trackingUrl ? (
                <div className="pt-4 mt-4 border-t border-zen-border">
                  <p className="text-sm">Tracking Partner: <span className="font-medium">{order.deliveryPartner}</span></p>
                  <p className="text-sm">Tracking ID: <span className="font-medium">{order.trackingId}</span></p>
                  <a href={order.trackingUrl} target="_blank" rel="noreferrer" className="inline-block mt-2 text-xs uppercase tracking-widest bg-zen-black text-white px-4 py-2 hover:bg-zen-accent transition-colors">
                    Track Shipment
                  </a>
                </div>
              ) : (
                <div className="pt-4 mt-4 border-t border-zen-border">
                  <p className="text-sm text-zen-taupe">Tracking information will be added after dispatch.</p>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="bg-white p-6 border border-zen-border space-y-6">
              <h2 className="font-sans text-xs uppercase tracking-widest text-zen-taupe mb-4">Order Timeline</h2>
              <div className="space-y-4">
                {timelineEvents.map(event => (
                  <div key={event.id} className="flex gap-4">
                    <div className="w-24 shrink-0 text-xs text-zen-taupe font-mono mt-0.5">
                      {new Date(event.date).toLocaleDateString()}<br/>
                      {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                    <div className="border-l-2 border-zen-border pl-4 pb-4">
                      <p className="text-sm">{event.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Items */}
            <div className="bg-white p-6 border border-zen-border space-y-6">
              <h2 className="font-sans text-xs uppercase tracking-widest text-zen-taupe mb-4">Order Items</h2>
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between items-center py-4 border-b border-zen-border last:border-0 last:pb-0">
                  <div>
                    <p className="font-serif text-lg">{item.productNameAtTime}</p>
                    <p className="text-xs text-zen-taupe font-mono mt-1">
                      Qty: {item.quantity} {item.variantNameAtTime ? `| Variant: ${item.variantNameAtTime}` : ''}
                    </p>
                  </div>
                  <p className="font-mono text-sm">₹{Number(item.priceAtTime).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-white p-6 border border-zen-border">
              <h2 className="font-sans text-xs uppercase tracking-widest text-zen-taupe mb-4">Delivery Address</h2>
              <p className="text-sm font-medium mb-1">{order.shippingName}</p>
              <p className="text-sm text-zen-taupe">{order.shippingAddress}</p>
              <p className="text-sm text-zen-taupe">{order.shippingCity}, {order.shippingState} {order.shippingPincode}</p>
              <p className="text-sm text-zen-taupe mt-2">Phone: {order.shippingPhone}</p>
            </div>

            <div className="bg-white p-6 border border-zen-border">
              <h2 className="font-sans text-xs uppercase tracking-widest text-zen-taupe mb-4">Order Total</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zen-taupe">Subtotal</span>
                  <span>₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-bold pt-4 border-t border-zen-border">
                  <span>Total</span>
                  <span className="text-zen-accent">₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
