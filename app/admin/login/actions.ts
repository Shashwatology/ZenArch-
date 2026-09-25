'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error, data: authData } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  if (authData.user) {
    // Check role from DB to ensure this user is actually an admin/staff
    const dbUser = await prisma.user.findUnique({
      where: { email: authData.user.email },
    })

    if (!dbUser || (dbUser.role !== 'ADMIN' && dbUser.role !== 'STAFF' && dbUser.role !== 'SUPER_ADMIN')) {
      // Sign out immediately if not authorized
      await supabase.auth.signOut()
      return { error: 'Unauthorized access. Admins only.' }
    }
  }

  revalidatePath('/admin', 'layout')
  redirect('/admin')
}
