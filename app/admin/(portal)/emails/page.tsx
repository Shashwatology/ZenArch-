import React from 'react'
import { requireAdmin } from '@/lib/admin/auth'
import prisma from '@/lib/prisma'
import { EmailsClient } from './EmailsClient'

export const dynamic = 'force-dynamic'

export default async function AdminEmailsPage({ searchParams }: { searchParams: { q?: string, status?: string } }) {
  await requireAdmin()

  const where: any = {}
  
  if (searchParams.q) {
    where.OR = [
      { recipientEmail: { contains: searchParams.q, mode: 'insensitive' } },
      { subject: { contains: searchParams.q, mode: 'insensitive' } },
      { eventType: { contains: searchParams.q, mode: 'insensitive' } }
    ]
  }

  if (searchParams.status && searchParams.status !== 'ALL') {
    where.status = searchParams.status
  }

  const logs = await prisma.emailLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      user: { select: { email: true } },
      lead: { select: { id: true, name: true } }
    }
  })

  return <EmailsClient logs={logs} />
}
