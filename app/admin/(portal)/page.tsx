import prisma from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic' // Ensure we fetch real DB counts on every load

export default async function AdminDashboard() {
  const [
    productsCount,
    outOfStockCount,
    inventoryCount,
    collectionsCount,
    customersCount,
    newQuotesCount,
    pendingQuotesCount,
    openOrdersCount,
    recentActivity
  ] = await Promise.all([
    prisma.product.count(),
    prisma.inventoryItem.count({ where: { quantity: 0 } }),
    prisma.inventoryItem.count(),
    prisma.collection.count(),
    prisma.customerProfile.count(),
    prisma.quoteRequest.count({ where: { status: 'NEW' } }),
    prisma.quoteRequest.count({ where: { status: { in: ['NEW', 'IN_REVIEW', 'CONTACTED'] } } }),
    prisma.order.count({ where: { status: { in: ['PENDING', 'CONFIRMED', 'PROCESSING'] } } }),
    prisma.auditLog.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { user: true } })
  ])

  const stats = [
    { name: 'Products', value: productsCount.toString(), desc: 'Verified public products' },
    { name: 'New Quotes', value: newQuotesCount.toString(), desc: 'Awaiting first response' },
    { name: 'Pending Quotes', value: pendingQuotesCount.toString(), desc: 'In discussion' },
    { name: 'Open Orders', value: openOrdersCount.toString(), desc: 'Being processed' },
    { name: 'Customers', value: customersCount.toString(), desc: 'Registered accounts' },
    { name: 'Collections', value: collectionsCount.toString(), desc: 'Active collections' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-light tracking-wider text-white mb-2">Overview</h2>
        <p className="text-sm text-gray-400">Welcome to the Zen Arch Admin Portal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-[#1E1E1E] border border-white/5 p-6 rounded-xl hover:border-white/10 transition-colors">
            <h3 className="text-sm font-medium text-gray-400 mb-1">{stat.name}</h3>
            <p className="text-3xl font-light text-white mb-2">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-white mb-4">Recent Activity</h3>
        <div className="bg-[#1E1E1E] border border-white/5 rounded-xl p-4 overflow-hidden">
          {recentActivity.length === 0 ? (
            <div className="text-center text-gray-400 p-4">No recent activity to display.</div>
          ) : (
            <ul className="divide-y divide-white/5">
              {recentActivity.map(log => (
                <li key={log.id} className="py-3 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">{log.action}</span>
                    <span className="text-xs text-gray-500">{log.entityType} ({log.entityId.slice(0, 8)})</span>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(log.createdAt).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
