'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import crypto from 'crypto'
import { requireCustomerAuth } from './customerAuth'

export async function inviteCollaborator(boardId: string, role: 'COLLABORATOR' | 'VIEWER', email?: string) {
  const { dbUser } = await requireCustomerAuth()
  if (!dbUser) throw new Error("Unauthorized")

  // Check ownership
  const board = await prisma.designBoard.findUnique({ where: { id: boardId } })
  if (!board || board.userId !== dbUser.id) throw new Error("Only the board owner can invite collaborators.")

  const inviteToken = crypto.randomBytes(24).toString('hex')
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  const collab = await prisma.boardCollaborator.create({
    data: {
      boardId,
      email: email || null,
      role,
      status: 'PENDING',
      inviteToken,
      expiresAt
    }
  })

  // Log action
  await prisma.auditLog.create({
    data: {
      userId: dbUser.id,
      action: 'COLLABORATOR_INVITED',
      entityType: 'DesignBoard',
      entityId: boardId,
      after: JSON.stringify({ role, email })
    }
  })

  revalidatePath(`/board/${boardId}`)
  return collab
}

export async function getInvitation(token: string) {
  const collab = await prisma.boardCollaborator.findUnique({
    where: { inviteToken: token },
    include: { board: true }
  })
  if (!collab || collab.status !== 'PENDING') return null
  if (collab.expiresAt && collab.expiresAt < new Date()) return null
  return collab
}

export async function acceptInvitation(token: string, currentUserId?: string) {
  const collab = await getInvitation(token)
  if (!collab) throw new Error("Invalid or expired invitation")

  const accepted = await prisma.boardCollaborator.update({
    where: { id: collab.id },
    data: {
      status: 'ACCEPTED',
      userId: currentUserId || null,
      acceptedAt: new Date(),
      inviteToken: null // Burn the token
    }
  })

  await prisma.auditLog.create({
    data: {
      userId: currentUserId || null, // Might be guest
      action: 'COLLABORATOR_ACCEPTED',
      entityType: 'DesignBoard',
      entityId: collab.boardId,
      after: JSON.stringify({ collabId: collab.id, role: collab.role })
    }
  })

  revalidatePath(`/board/${collab.boardId}`)
  return accepted
}

export async function removeCollaborator(collabId: string, boardId: string) {
  const { dbUser } = await requireCustomerAuth()
  if (!dbUser) throw new Error("Unauthorized")

  const board = await prisma.designBoard.findUnique({ where: { id: boardId } })
  if (!board || board.userId !== dbUser.id) throw new Error("Unauthorized")

  await prisma.boardCollaborator.delete({
    where: { id: collabId }
  })

  await prisma.auditLog.create({
    data: {
      userId: dbUser.id,
      action: 'COLLABORATOR_REMOVED',
      entityType: 'DesignBoard',
      entityId: boardId,
      before: JSON.stringify({ collabId })
    }
  })

  revalidatePath(`/board/${boardId}`)
}
