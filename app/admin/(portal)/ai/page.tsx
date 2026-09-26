import React from 'react'
import { requireAdmin } from '@/lib/admin/auth'
import prisma from '@/lib/prisma'
import { AiClient } from './AiClient'
import { ZEN_AGENTS } from '@/lib/ai/agents'

export const dynamic = 'force-dynamic'

export default async function AdminAIPage() {
  const { dbUser } = await requireAdmin()

  // Get recent AI audit logs
  const logs = await prisma.aIAuditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      user: { select: { email: true, adminProfile: true } }
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-light tracking-wider text-white mb-2">Specialist AI Agents</h2>
        <p className="text-sm text-gray-400">Interact with ZEN ARCH business agents. All tool executions are strictly secured and logged.</p>
      </div>
      
      <AiClient agents={Object.values(ZEN_AGENTS)} logs={logs} currentUserId={dbUser.id} />
    </div>
  )
}
