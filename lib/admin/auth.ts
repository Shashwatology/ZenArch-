import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function requireAuth() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/admin/login')
  }

  return data.user
}

export async function requireAdmin() {
  const user = await requireAuth()
  
  // We use the email from Supabase to look up the DB user profile and role
  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
  })

  if (!dbUser || (dbUser.role !== 'ADMIN' && dbUser.role !== 'SUPER_ADMIN')) {
    redirect('/unauthorized') // Create a clean 403 or 401 page later
  }

  return { authUser: user, dbUser }
}
