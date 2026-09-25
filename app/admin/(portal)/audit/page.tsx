import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminAuditPage() {
  const logs = await prisma.auditLog.findMany({
    include: {
      user: true
    },
    orderBy: { createdAt: 'desc' },
    take: 100
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-light tracking-wider text-white mb-2">Audit Log</h2>
          <p className="text-sm text-gray-400">Track all operational changes in the system</p>
        </div>
      </div>

      <div className="bg-[#1E1E1E] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5 text-xs uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4 font-medium">Timestamp</th>
                <th className="px-6 py-4 font-medium">Actor</th>
                <th className="px-6 py-4 font-medium">Action</th>
                <th className="px-6 py-4 font-medium">Entity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-white">{log.user?.email || 'System'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#C8A97E]/10 text-[#C8A97E] border border-[#C8A97E]/20">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {log.entityType} ({log.entityId.slice(0, 8)}...)
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No logs found.
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
