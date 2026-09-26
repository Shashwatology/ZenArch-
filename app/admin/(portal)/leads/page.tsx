import React from 'react'
import { requireAdmin } from '@/lib/admin/auth'
import prisma from '@/lib/prisma'
import { LeadsClient } from './LeadsClient'

export const dynamic = 'force-dynamic'

export default async function AdminLeadsPage() {
  await requireAdmin()

  const leads = await prisma.lead.findMany({
    include: {
      assignedTo: { select: { id: true, email: true, adminProfile: true, customerProfile: true } },
      activities: { orderBy: { createdAt: 'desc' }, take: 1 }
    },
    orderBy: { updatedAt: 'desc' }
  })

  const staff = await prisma.user.findMany({
    where: { role: { in: ['ADMIN', 'STAFF', 'SUPER_ADMIN'] } },
    select: { id: true, email: true, adminProfile: true, customerProfile: true }
  })

  return <LeadsClient leads={leads} staff={staff} />
}
