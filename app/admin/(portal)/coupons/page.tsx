import prisma from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-light tracking-wider text-white mb-2">Coupons</h2>
          <p className="text-sm text-gray-400">Manage discount codes for quotes and orders</p>
        </div>
        <button className="bg-[#C8A97E] hover:bg-[#b5956a] text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Create Coupon
        </button>
      </div>

      <div className="bg-[#1E1E1E] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5 text-xs uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4 font-medium">Code</th>
                <th className="px-6 py-4 font-medium">Discount</th>
                <th className="px-6 py-4 font-medium">Scope</th>
                <th className="px-6 py-4 font-medium">Limits</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono bg-black/50 px-2 py-1 rounded text-[#C8A97E]">{coupon.code}</span>
                  </td>
                  <td className="px-6 py-4 text-white font-medium">
                    {coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : `₹${Number(coupon.value).toLocaleString()}`}
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">
                    {coupon.appliesTo}
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">
                    {coupon.usageLimit ? `Max ${coupon.usageLimit} uses` : 'Unlimited'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      coupon.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                    }`}>
                      {coupon.isActive ? 'ACTIVE' : 'PAUSED'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#C8A97E] hover:text-white transition-colors text-sm font-medium">Edit</button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No coupons found. Create one to share with customers.
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
