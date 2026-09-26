import React from 'react'
import { requireAdmin } from '@/lib/admin/auth'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { LeadDetailClient } from './LeadDetailClient'

export const dynamic = 'force-dynamic'

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  await requireAdmin()

  const lead = await prisma.lead.findUnique({
    where: { id: params.id },
    include: {
      assignedTo: { select: { id: true, email: true, adminProfile: true } },
      activities: { 
        orderBy: { createdAt: 'desc' },
        include: { actor: { select: { id: true, email: true, adminProfile: true } } }
      },
      customer: { select: { id: true, email: true, customerProfile: true } },
      quoteRequest: true,
      order: true,
      clientProject: true,
      designBoard: true
    }
  })

  if (!lead) return notFound()

  const staff = await prisma.user.findMany({
    where: { role: { in: ['ADMIN', 'STAFF', 'SUPER_ADMIN'] } },
    select: { id: true, email: true, adminProfile: true }
  })

  return <LeadDetailClient lead={lead} staff={staff} />
}
