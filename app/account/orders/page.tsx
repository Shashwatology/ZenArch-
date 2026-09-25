import React from 'react'
import Link from 'next/link'
import { getCustomerOrders } from '@/lib/actions/orders'

export default async function CustomerOrdersPage() {
  const orders = await getCustomerOrders()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'PROCESSING': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200'
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="p-8 md:p-12 space-y-8">
      <div className="border-b border-zen-border pb-6 flex justify-between items-end">
        <div>
          <h1 className="font-serif text-3xl text-zen-black">Orders</h1>
          <p className="text-sm text-zen-taupe mt-2 font-light">View your order history and current status.</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="py-12 text-center text-zen-taupe text-sm">
          You have no orders yet.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="border border-zen-border p-6 bg-zen-ivory/50">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 border-b border-zen-border/50 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-zen-charcoal block mb-1">
                    Order Reference
                  </span>
                  <span className="font-mono text-sm">{order.id.split('-')[0].toUpperCase()}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-zen-charcoal block mb-1">
                    Date
                  </span>
                  <span className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-zen-charcoal block mb-1">
                    Total
                  </span>
                  <span className="text-sm">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className={`px-3 py-1 text-[10px] uppercase font-mono tracking-widest border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-white p-4 border border-zen-border/50">
                    <div>
                      <Link href={`/furniture/${item.product.slug}`} className="font-serif text-lg text-zen-black hover:text-zen-accent transition-colors">
                        {item.productNameAtTime || item.product.name}
                      </Link>
                      {item.variant && (
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zen-taupe ml-2">
                          / {item.variant.name}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-sm block">Qty: {item.quantity}</span>
                      <span className="text-[10px] font-mono text-zen-taupe">₹{item.priceAtTime.toLocaleString('en-IN')} each</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
