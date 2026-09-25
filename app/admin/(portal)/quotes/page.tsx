import React from 'react'
import Link from 'next/link'
import { getAdminQuotes } from '@/lib/actions/quotes'

export const dynamic = 'force-dynamic'

export default async function AdminQuotesPage() {
  const quotes = await getAdminQuotes()

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-light tracking-wider text-white mb-2">Quote Management</h2>
        <p className="text-sm text-gray-400">Review and process customer quote requests.</p>
      </div>

      <div className="bg-[#1E1E1E] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5 text-xs uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4 font-medium">Ref</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Project</th>
                <th className="px-6 py-4 font-medium">Items</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {quotes.map(quote => (
                <tr key={quote.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-mono text-white">{quote.id.split('-')[0].toUpperCase()}</td>
                  <td className="px-6 py-4 text-gray-400">{new Date(quote.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="text-white">{quote.user.customerProfile?.firstName} {quote.user.customerProfile?.lastName}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{quote.user.email}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{quote.projectType || 'N/A'}</td>
                  <td className="px-6 py-4 text-gray-400">{quote.items.length} items</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-[10px] font-mono tracking-widest uppercase border rounded-full ${
                      quote.status === 'NEW' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                      quote.status === 'CONTACTED' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                      quote.status === 'QUOTED' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      quote.status === 'ACCEPTED' ? 'bg-[#C8A97E]/10 text-[#C8A97E] border-[#C8A97E]/20' :
                      'bg-white/5 text-gray-400 border-white/10'
                    }`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/quotes/${quote.id}`} className="text-xs font-medium text-[#C8A97E] hover:text-white transition-colors">
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
              {quotes.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No quote requests found.
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
