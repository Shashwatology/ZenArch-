'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function requireCustomerAuth() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/login')
  }

  // Ensure DB user exists and is a CUSTOMER
  let dbUser = await prisma.user.findUnique({
    where: { email: data.user.email },
    include: { customerProfile: true }
  })

  // Auto-provision user if they signed up via Supabase but don't exist in Prisma yet
  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        email: data.user.email!,
        role: 'CUSTOMER',
        customerProfile: {
          create: {}
        }
      },
      include: { customerProfile: true }
    })
  }

  if (dbUser.role !== 'CUSTOMER') {
    // If Admin/Staff tries to access customer portal, technically they shouldn't? Or they can? 
    // Let's allow them, they are admins. But they might not have a CustomerProfile.
    if (!dbUser.customerProfile) {
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          customerProfile: {
            create: {}
          }
        },
        include: { customerProfile: true }
      })
    }
  }

  return { authUser: data.user, dbUser }
}

export async function getCustomerAuth() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    return { authUser: null, dbUser: null }
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: data.user.email },
    include: { customerProfile: true }
  })

  return { authUser: data.user, dbUser }
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/account')
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const phone = formData.get('phone') as string
  
  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const supabase = await createClient()
  
  // Create in Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Create in Prisma
  if (data.user) {
    try {
      const newUser = await prisma.user.create({
        data: {
          email: data.user.email!,
          role: 'CUSTOMER',
          customerProfile: {
            create: {
              firstName,
              lastName,
              phone
            }
          }
        }
      })

      const { dispatchEmailEvent } = await import('@/lib/email/dispatcher')
      await dispatchEmailEvent({
        type: 'welcome',
        recipient: data.user.email!,
        userId: newUser.id,
        name: firstName || 'there'
      })
    } catch (e) {
      // If user already exists in DB, ignore
    }
  }

  redirect('/account')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
