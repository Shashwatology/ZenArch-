import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminCustomersPage() {
  const customers = await prisma.customerProfile.findMany({
    include: { 
      user: {
        include: {
          quotes: true,
          orders: true
        }
      },
      savedProducts: true 
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-light tracking-wider text-white mb-2">Customers</h2>
        <p className="text-sm text-gray-400">View registered customers and their activity.</p>
      </div>

      <div className="bg-[#1E1E1E] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5 text-xs uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Registered</th>
                <th className="px-6 py-4 font-medium text-center">Saved Items</th>
                <th className="px-6 py-4 font-medium text-center">Quotes</th>
                <th className="px-6 py-4 font-medium text-center">Orders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-white font-medium">{c.firstName} {c.lastName}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{c.user.email}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{c.phone || 'N/A'}</td>
                  <td className="px-6 py-4 text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center bg-white/5 border border-white/10 text-gray-300 px-2 py-0.5 rounded-full text-xs">
                      {c.savedProducts.length}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full text-xs">
                      {c.user.quotes.length}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center bg-green-500/10 border border-green-500/20 text-green-400 px-2 py-0.5 rounded-full text-xs">
                      {c.user.orders.length}
                    </span>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No customers found.
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
