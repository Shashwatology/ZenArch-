import { AdminLayout } from '@/components/admin/AdminLayout'
import { requireAdmin } from '@/lib/admin/auth'

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { authUser, dbUser } = await requireAdmin()

  return (
    <AdminLayout user={{ email: authUser.email, role: dbUser.role }}>
      {children}
    </AdminLayout>
  )
}
