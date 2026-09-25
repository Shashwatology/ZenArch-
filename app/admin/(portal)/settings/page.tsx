import { requireAdmin } from '@/lib/admin/auth'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const { authUser, dbUser } = await requireAdmin()

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-light tracking-wider text-white mb-2">Settings</h2>
        <p className="text-sm text-gray-400">System and user configuration</p>
      </div>

      <div className="bg-[#1E1E1E] border border-white/10 rounded-xl overflow-hidden p-6 space-y-4">
        <h3 className="text-lg font-medium text-white">Admin Profile</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Email</p>
            <p className="text-sm text-white">{authUser.email}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Role</p>
            <p className="text-sm text-white">{dbUser.role}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#1E1E1E] border border-white/10 rounded-xl overflow-hidden p-6 space-y-4">
        <h3 className="text-lg font-medium text-white">System Information</h3>
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Environment</p>
          <p className="text-sm text-white">{process.env.NODE_ENV}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Data Source</p>
          <p className="text-sm text-white">PostgreSQL (Supabase via Prisma)</p>
        </div>
      </div>
    </div>
  )
}
