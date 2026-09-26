import prisma from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      assignedTo: true,
      activities: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    }
  })

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-light tracking-wider text-white mb-2">Leads Pipeline</h2>
          <p className="text-sm text-gray-400">Manage incoming inquiries and follow-ups</p>
        </div>
        <button className="bg-[#C8A97E] hover:bg-[#b5956a] text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Add Lead manually
        </button>
      </div>

      <div className="flex gap-4">
        {['NEW', 'CONTACTED', 'QUOTE_SENT', 'WON'].map(status => (
          <button key={status} className="bg-[#1E1E1E] border border-white/5 px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white transition-colors">
            {status.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="bg-[#1E1E1E] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5 text-xs uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4 font-medium">Lead</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Source</th>
                <th className="px-6 py-4 font-medium">Assigned</th>
                <th className="px-6 py-4 font-medium">Next Action</th>
                <th className="px-6 py-4 font-medium">Follow-Up</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {leads.map((lead) => {
                const isOverdue = lead.nextFollowUpAt && lead.nextFollowUpAt < new Date()
                
                return (
                  <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-white">{lead.name}</span>
                        <span className="text-xs text-gray-500 mt-1">{lead.email || lead.phone || 'No contact info'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        lead.status === 'WON' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                        lead.status === 'LOST' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {lead.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {lead.source || '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {lead.assignedTo?.email || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs max-w-xs truncate">
                      {lead.nextAction || '-'}
                    </td>
                    <td className="px-6 py-4">
                      {lead.nextFollowUpAt ? (
                        <span className={`text-xs ${isOverdue ? 'text-red-400 font-medium' : 'text-gray-400'}`}>
                          {new Date(lead.nextFollowUpAt).toLocaleDateString()}
                          {isOverdue && ' (Overdue)'}
                        </span>
                      ) : (
                        <span className="text-gray-600 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[#C8A97E] hover:text-white transition-colors text-sm font-medium">View</button>
                    </td>
                  </tr>
                )
              })}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No leads found. Incoming inquiries will appear here.
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
