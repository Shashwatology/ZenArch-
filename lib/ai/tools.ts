import { requireAdmin } from '@/lib/admin/auth'
import prisma from '@/lib/prisma'

// ----------------------------------------------------------------------------
// AI TOOL SYSTEM (H5.6)
// These functions are exclusively for AI Agents to fetch data safely.
// They enforce H5.7 by internally validating requireAdmin() before executing.
// ----------------------------------------------------------------------------

export async function aiSearchProducts(query: string) {
  await requireAdmin()
  return prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ]
    },
    take: 10,
    select: { id: true, name: true, sku: true, basePrice: true, status: true }
  })
}

export async function aiGetLead(leadId: string) {
  await requireAdmin()
  return prisma.lead.findUnique({
    where: { id: leadId },
    include: { activities: true, assignedTo: { select: { email: true } } }
  })
}

export async function aiGetQuote(quoteId: string) {
  await requireAdmin()
  return prisma.quoteRequest.findUnique({
    where: { id: quoteId },
    include: { items: { include: { product: true } }, user: { select: { email: true } } }
  })
}

export async function aiGetOrder(orderId: string) {
  await requireAdmin()
  return prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } }, user: { select: { email: true } } }
  })
}

export async function aiSearchKnowledge(topic: string) {
  await requireAdmin()
  // Mock knowledge search - typically this would hit a vector DB or an FAQ table.
  // For ZEN ARCH MVP, we can return some fixed policies if it matches, or query CMS.
  return prisma.pageContent.findMany({
    where: {
      OR: [
        { title: { contains: topic, mode: 'insensitive' } },
        { heroCopy: { contains: topic, mode: 'insensitive' } }
      ]
    },
    take: 3,
    select: { title: true, heroCopy: true }
  })
}

export async function aiGetRecentAnalytics() {
  await requireAdmin()
  // Just aggregate some high level stats to prove concept
  const totalLeads = await prisma.lead.count()
  const totalOrders = await prisma.order.count()
  const totalRevenue = await prisma.order.aggregate({ _sum: { totalAmount: true } })
  
  return {
    totalLeads,
    totalOrders,
    totalRevenue: totalRevenue._sum.totalAmount?.toNumber() || 0
  }
}
