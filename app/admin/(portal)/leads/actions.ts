'use server'

import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin/auth'
import { revalidatePath } from 'next/cache'
import { ActivityType, LeadStatus } from '@prisma/client'
import { dispatchEmailEvent } from '@/lib/email/dispatcher'

export async function createLeadAction(data: {
  name: string
  email?: string
  phone?: string
  source?: string
  interest?: string
  budget?: number
  projectType?: string
}) {
  const { dbUser } = await requireAdmin()

  const lead = await prisma.lead.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      source: data.source,
      interest: data.interest,
      budget: data.budget,
      projectType: data.projectType,
      status: 'NEW'
    }
  })

  await prisma.auditLog.create({
    data: {
      userId: dbUser.id,
      action: 'CREATED_LEAD',
      entityType: 'Lead',
      entityId: lead.id,
      after: JSON.stringify(lead)
    }
  })
  
  // Analytics
  const { trackEvent } = await import('@/lib/analytics/tracker')
  await trackEvent('lead_created', { leadId: lead.id, source: data.source }, { userId: dbUser.id, source: 'SERVER' })

  revalidatePath('/admin/leads')
  return lead
}

export async function updateLeadStatusAction(leadId: string, status: LeadStatus) {
  const { dbUser } = await requireAdmin()

  const lead = await prisma.lead.update({
    where: { id: leadId },
    data: { status }
  })

  await prisma.auditLog.create({
    data: {
      userId: dbUser.id,
      action: 'UPDATED_LEAD_STATUS',
      entityType: 'Lead',
      entityId: lead.id,
      after: JSON.stringify({ status })
    }
  })

  revalidatePath('/admin/leads')
  revalidatePath(`/admin/leads/${leadId}`)
}

export async function assignLeadAction(leadId: string, assignedToId: string | null) {
  const { dbUser } = await requireAdmin()

  const lead = await prisma.lead.update({
    where: { id: leadId },
    data: { assignedToId },
    include: { assignedTo: { include: { adminProfile: true } } }
  })

  await prisma.auditLog.create({
    data: {
      userId: dbUser.id,
      action: 'ASSIGNED_LEAD',
      entityType: 'Lead',
      entityId: lead.id,
      after: JSON.stringify({ assignedToId })
    }
  })

  if (assignedToId && lead.assignedTo?.email) {
    await dispatchEmailEvent({
      type: 'lead.assigned',
      recipient: lead.assignedTo.email,
      leadId: lead.id,
      staffName: lead.assignedTo.adminProfile?.firstName || 'Staff',
      leadName: lead.name
    })
  }

  revalidatePath('/admin/leads')
  revalidatePath(`/admin/leads/${leadId}`)
}

export async function addLeadActivityAction(leadId: string, data: {
  type: ActivityType
  description: string
  completedAt?: Date
  nextActionAt?: Date
  nextActionNote?: string
}) {
  const { dbUser } = await requireAdmin()

  const activity = await prisma.leadActivity.create({
    data: {
      leadId,
      actorId: dbUser.id,
      type: data.type,
      description: data.description,
      completedAt: data.completedAt || new Date(),
      nextActionAt: data.nextActionAt,
    }
  })

  // If there's a next action, update the lead
  if (data.nextActionAt) {
    await prisma.lead.update({
      where: { id: leadId },
      data: {
        nextFollowUpAt: data.nextActionAt,
        nextAction: data.nextActionNote || 'Follow up'
      }
    })
  }

  revalidatePath(`/admin/leads/${leadId}`)
  return activity
}

export async function linkLeadAction(leadId: string, linkType: 'CUSTOMER' | 'QUOTE' | 'ORDER' | 'PROJECT' | 'BOARD', targetId: string) {
  const { dbUser } = await requireAdmin()
  
  const updateData: any = {}
  if (linkType === 'CUSTOMER') updateData.customerId = targetId
  if (linkType === 'QUOTE') updateData.quoteRequestId = targetId
  if (linkType === 'ORDER') updateData.orderId = targetId
  if (linkType === 'PROJECT') updateData.clientProjectId = targetId
  if (linkType === 'BOARD') updateData.designBoardId = targetId

  const lead = await prisma.lead.update({
    where: { id: leadId },
    data: updateData
  })

  await prisma.auditLog.create({
    data: {
      userId: dbUser.id,
      action: 'LINKED_LEAD_RECORD',
      entityType: 'Lead',
      entityId: lead.id,
      after: JSON.stringify(updateData)
    }
  })

  revalidatePath(`/admin/leads/${leadId}`)
}
