import prisma from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  // Fetch real database counts
  const [
    productsPublished,
    productsDraft,
    inventoryOutOfStock,
    inventoryLowStock,
    
    leadsNew,
    leadsDueToday,
    leadsOverdue,
    
    quotesNew,
    quotesInReview,
    quotesQuoted,
    quotesAccepted,
    
    ordersOpen,
    ordersProcessing,
    ordersCompleted,
    
    customersTotal,
    customersNew,
    
    recentActivity
  ] = await Promise.all([
    prisma.product.count({ where: { status: 'PUBLISHED' } }),
    prisma.product.count({ where: { status: 'DRAFT' } }),
    prisma.inventoryItem.count({ where: { quantity: 0 } }),
    prisma.inventoryItem.count({ where: { quantity: { gt: 0, lte: 5 } } }),
    
    prisma.lead.count({ where: { status: 'NEW' } }),
    prisma.lead.count({ 
      where: { 
        nextFollowUpAt: {
          gte: new Date(new Date().setHours(0,0,0,0)),
          lt: new Date(new Date().setHours(23,59,59,999))
        }
      } 
    }),
    prisma.lead.count({ 
      where: { 
        nextFollowUpAt: { lt: new Date(new Date().setHours(0,0,0,0)) }
      } 
    }),
    
    prisma.quoteRequest.count({ where: { status: 'NEW' } }),
    prisma.quoteRequest.count({ where: { status: 'IN_REVIEW' } }),
    prisma.quoteRequest.count({ where: { status: 'QUOTED' } }),
    prisma.quoteRequest.count({ where: { status: 'ACCEPTED' } }),
    
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.count({ where: { status: 'PROCESSING' } }),
    prisma.order.count({ where: { status: 'COMPLETED' } }),
    
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.user.count({ 
      where: { 
        role: 'CUSTOMER',
        createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
      } 
    }),
    
    prisma.auditLog.findMany({ take: 8, orderBy: { createdAt: 'desc' }, include: { user: true } })
  ])

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-2xl font-light tracking-wider text-white mb-2">Operational Control Center</h2>
        <p className="text-sm text-gray-400">Real-time metrics for ZEN ARCH business OS.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Products & Inventory */}
        <div className="bg-[#1E1E1E] border border-white/5 p-6 rounded-xl">
          <h3 className="text-sm font-medium text-[#C8A97E] mb-4">CATALOGUE & INVENTORY</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Published</p>
              <p className="text-2xl font-light text-white">{productsPublished}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Drafts</p>
              <p className="text-2xl font-light text-white">{productsDraft}</p>
            </div>
            <div>
              <p className="text-xs text-red-500 uppercase tracking-wider mb-1">Out of Stock</p>
              <p className="text-2xl font-light text-red-400">{inventoryOutOfStock}</p>
            </div>
            <div>
              <p className="text-xs text-orange-500 uppercase tracking-wider mb-1">Low Stock</p>
              <p className="text-2xl font-light text-orange-400">{inventoryLowStock}</p>
            </div>
          </div>
        </div>

        {/* Leads CRM */}
        <div className="bg-[#1E1E1E] border border-white/5 p-6 rounded-xl">
          <h3 className="text-sm font-medium text-[#C8A97E] mb-4">LEADS PIPELINE</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">New Leads</p>
              <p className="text-2xl font-light text-white">{leadsNew}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Due Today</p>
              <p className="text-2xl font-light text-white">{leadsDueToday}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-red-500 uppercase tracking-wider mb-1">Overdue Follow-ups</p>
              <p className="text-2xl font-light text-red-400">{leadsOverdue}</p>
            </div>
          </div>
        </div>

        {/* Quotes */}
        <div className="bg-[#1E1E1E] border border-white/5 p-6 rounded-xl">
          <h3 className="text-sm font-medium text-[#C8A97E] mb-4">QUOTES & PROPOSALS</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">New</p>
              <p className="text-2xl font-light text-white">{quotesNew}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">In Review</p>
              <p className="text-2xl font-light text-white">{quotesInReview}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Quoted</p>
              <p className="text-2xl font-light text-white">{quotesQuoted}</p>
            </div>
            <div>
              <p className="text-xs text-green-500 uppercase tracking-wider mb-1">Accepted</p>
              <p className="text-2xl font-light text-green-400">{quotesAccepted}</p>
            </div>
          </div>
        </div>
        
        {/* Orders */}
        <div className="bg-[#1E1E1E] border border-white/5 p-6 rounded-xl">
          <h3 className="text-sm font-medium text-[#C8A97E] mb-4">ORDERS</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Open</p>
              <p className="text-2xl font-light text-white">{ordersOpen}</p>
            </div>
            <div>
              <p className="text-xs text-blue-500 uppercase tracking-wider mb-1">Processing</p>
              <p className="text-2xl font-light text-blue-400">{ordersProcessing}</p>
            </div>
            <div>
              <p className="text-xs text-green-500 uppercase tracking-wider mb-1">Completed</p>
              <p className="text-2xl font-light text-green-400">{ordersCompleted}</p>
            </div>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-[#1E1E1E] border border-white/5 p-6 rounded-xl">
          <h3 className="text-sm font-medium text-[#C8A97E] mb-4">CUSTOMERS</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Base</p>
              <p className="text-2xl font-light text-white">{customersTotal}</p>
            </div>
            <div>
              <p className="text-xs text-green-500 uppercase tracking-wider mb-1">New (30d)</p>
              <p className="text-2xl font-light text-green-400">+{customersNew}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Audit Log */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Recent System Activity</h3>
          <Link href="/admin/audit" className="text-sm text-[#C8A97E] hover:text-[#C8A97E]/80 transition-colors">View All &rarr;</Link>
        </div>
        <div className="bg-[#1E1E1E] border border-white/5 rounded-xl overflow-hidden">
          {recentActivity.length === 0 ? (
            <div className="text-center text-gray-400 p-8">No recent activity to display.</div>
          ) : (
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="text-xs text-gray-500 uppercase bg-white/5 border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 font-medium">Action</th>
                  <th className="px-6 py-4 font-medium">Entity</th>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentActivity.map(log => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-3 font-medium text-white">{log.action.replace(/_/g, ' ')}</td>
                    <td className="px-6 py-3">{log.entityType} <span className="text-xs text-gray-500 ml-1">({log.entityId.slice(0, 8)})</span></td>
                    <td className="px-6 py-3">{log.user?.email || 'System'}</td>
                    <td className="px-6 py-3">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
