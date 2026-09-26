import { createClient } from '@supabase/supabase-js'
import { PrismaClient } from '@prisma/client'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)
const prisma = new PrismaClient()

async function main() {
  const email = 'admin@zenarch.com'
  const password = 'ZenArchAdmin2026!'

  console.log(`Creating/Verifying admin user: ${email}`)

  // 1. Create or update in Supabase Auth
  let { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError) {
    if (authError.message.includes('already registered')) {
      console.log('User exists in Supabase. Updating password...')
      const { data: listData } = await supabase.auth.admin.listUsers()
      const existingUser = listData.users.find(u => u.email === email)
      if (existingUser) {
        await supabase.auth.admin.updateUserById(existingUser.id, { password })
        authData = { user: existingUser } as any
      }
    } else {
      console.error('Error creating user in Supabase:', authError)
      return
    }
  }

  const userId = authData.user?.id
  if (!userId) {
    console.error('Could not get user ID from Supabase')
    return
  }

  // 2. Upsert in Prisma
  console.log('Upserting user in PostgreSQL...')
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      role: 'ADMIN',
    },
    create: {
      email,
      role: 'ADMIN',
    },
  })

  // 3. Upsert Admin Profile
  await prisma.adminProfile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      firstName: 'System',
      lastName: 'Admin',
    }
  })

  console.log('Successfully configured Admin credentials:')
  console.log('Email:', email)
  console.log('Password:', password)
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
