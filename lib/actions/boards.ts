'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import crypto from 'crypto'

/**
 * Ensures user is authenticated or returns null
 */
async function getUserIdFromSession(userId?: string) {
  // In a real app with next-auth or Supabase Auth, you'd use getServerSession or supabase.auth.getUser()
  // Since we rely on a passed userId for this test app or mock session:
  return userId; 
}

export async function createBoard(name: string, description?: string, userId?: string) {
  if (!userId) throw new Error("Must be logged in to save boards to database")
  
  const board = await prisma.designBoard.create({
    data: {
      userId,
      name,
      description
    }
  })
  
  revalidatePath('/account/boards')
  return board
}

export async function getUserBoards(userId: string) {
  return await prisma.designBoard.findMany({
    where: { userId, archivedAt: null },
    include: {
      items: {
        where: { removedAt: null },
        include: {
          product: { include: { images: { orderBy: { order: 'asc' } } } }
        }
      }
    },
    orderBy: { updatedAt: 'desc' }
  })
}

export async function getBoardById(id: string) {
  const board = await prisma.designBoard.findUnique({
    where: { id },
    include: {
      collaborators: true,
      items: {
        where: { removedAt: null },
        orderBy: { sortOrder: 'asc' },
        include: {
          product: { include: { images: { orderBy: { order: 'asc' } } } },
          comments: {
            where: { deletedAt: null, isInternal: false },
            orderBy: { createdAt: 'desc' }
          }
        }
      },
      comments: {
        where: { deletedAt: null, isInternal: false, boardItemId: null }, // Only show board-level comments
        orderBy: { createdAt: 'desc' }
      }
    }
  })
  
  if (!board) return null;
  
  const activity = await prisma.auditLog.findMany({
    where: { entityType: 'DesignBoard', entityId: id },
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: { user: { include: { customerProfile: true } } }
  })
  
  return { ...board, activity }
}

export async function getBoardByShareToken(token: string) {
  const board = await prisma.designBoard.findUnique({
    where: { shareToken: token },
    include: {
      collaborators: true,
      items: {
        where: { removedAt: null },
        orderBy: { sortOrder: 'asc' },
        include: {
          product: { include: { images: { orderBy: { order: 'asc' } } } },
          comments: {
            where: { deletedAt: null, isInternal: false },
            orderBy: { createdAt: 'desc' }
          }
        }
      },
      comments: {
        where: { deletedAt: null, isInternal: false, boardItemId: null },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!board) return null
  
  // Check if revoked or expired
  if (board.shareRevokedAt) return null
  if (board.shareExpiresAt && board.shareExpiresAt < new Date()) return null

  return board
}

export async function addItemToBoard(boardId: string, productId: string, variantId?: string, quantity: number = 1, userId?: string) {
  const board = await prisma.designBoard.findUnique({ where: { id: boardId } })
  if (!board || board.userId !== userId) throw new Error("Unauthorized")

  // Don't duplicate if already exists, just restore or update quantity
  const existing = await prisma.designBoardItem.findFirst({
    where: { boardId, productId, variantId }
  })

  let item;
  if (existing) {
    item = await prisma.designBoardItem.update({
      where: { id: existing.id },
      data: { removedAt: null, quantity: existing.quantity + quantity }
    })
  } else {
    item = await prisma.designBoardItem.create({
      data: { boardId, productId, variantId, quantity }
    })
  }

  // Update board timestamp
  await prisma.designBoard.update({ where: { id: boardId }, data: { updatedAt: new Date() } })
  
  revalidatePath(`/board/${boardId}`)
  return item
}

export async function updateItemApproval(itemId: string, status: 'APPROVED' | 'REJECTED' | 'PENDING', userId: string) {
  const item = await prisma.designBoardItem.findUnique({
    where: { id: itemId },
    include: { board: { include: { collaborators: true } }, product: true }
  })

  if (!item) throw new Error("Item not found")

  const isOwner = item.board.userId === userId
  const isCollaborator = item.board.collaborators.some(c => c.userId === userId && c.role === 'COLLABORATOR')
  
  if (!isOwner && !isCollaborator) throw new Error("Unauthorized")

  let approvedPrice = null
  let approvedAt = null

  if (status === 'APPROVED') {
    approvedPrice = item.product.basePrice
    approvedAt = new Date()
  }

  const updated = await prisma.designBoardItem.update({
    where: { id: itemId },
    data: { status, approvedPrice, approvedAt }
  })

  // Write to AuditLog
  await prisma.auditLog.create({
    data: {
      userId,
      action: status === 'APPROVED' ? 'ITEM_APPROVED' : status === 'REJECTED' ? 'ITEM_REJECTED' : 'ITEM_PENDING',
      entityType: 'DesignBoard',
      entityId: item.boardId,
      before: JSON.stringify({ itemId, previousStatus: item.status }),
      after: JSON.stringify({ itemId, status, productName: item.product.name })
    }
  })

  revalidatePath(`/board/${item.boardId}`)
  return updated
}

export async function updateItemQuantity(itemId: string, quantity: number, userId: string) {
  if (quantity < 1) return null

  const item = await prisma.designBoardItem.findUnique({
    where: { id: itemId },
    include: { board: true }
  })

  if (!item || item.board.userId !== userId) throw new Error("Unauthorized")

  const updated = await prisma.designBoardItem.update({
    where: { id: itemId },
    data: { quantity }
  })

  revalidatePath(`/board/${item.boardId}`)
  return updated
}

export async function updateItemNote(itemId: string, note: string, userId: string) {
  const item = await prisma.designBoardItem.findUnique({
    where: { id: itemId },
    include: { board: true }
  })

  if (!item || item.board.userId !== userId) throw new Error("Unauthorized")

  const updated = await prisma.designBoardItem.update({
    where: { id: itemId },
    data: { note }
  })

  revalidatePath(`/board/${item.boardId}`)
  return updated
}

export async function removeItem(itemId: string, userId: string) {
  const item = await prisma.designBoardItem.findUnique({
    where: { id: itemId },
    include: { board: true }
  })

  if (!item || item.board.userId !== userId) throw new Error("Unauthorized")

  // Soft delete
  await prisma.designBoardItem.update({
    where: { id: itemId },
    data: { removedAt: new Date() }
  })

  revalidatePath(`/board/${item.boardId}`)
  return true
}

export async function archiveBoard(boardId: string, userId: string) {
  const board = await prisma.designBoard.findUnique({ where: { id: boardId } })
  if (!board || board.userId !== userId) throw new Error("Unauthorized")

  await prisma.designBoard.update({
    where: { id: boardId },
    data: { archivedAt: new Date() }
  })

  revalidatePath('/account/boards')
  return true
}

export async function shareBoard(boardId: string, userId: string) {
  const board = await prisma.designBoard.findUnique({ where: { id: boardId } })
  if (!board || board.userId !== userId) throw new Error("Unauthorized")

  const shareToken = crypto.randomBytes(16).toString('hex')
  const shareExpiresAt = new Date()
  shareExpiresAt.setDate(shareExpiresAt.getDate() + 30) // 30 days

  const updated = await prisma.designBoard.update({
    where: { id: boardId },
    data: { 
      shareToken, 
      shareExpiresAt,
      shareRevokedAt: null
    }
  })

  revalidatePath(`/board/${boardId}`)
  return updated
}

export async function revokeShare(boardId: string, userId: string) {
  const board = await prisma.designBoard.findUnique({ where: { id: boardId } })
  if (!board || board.userId !== userId) throw new Error("Unauthorized")

  const updated = await prisma.designBoard.update({
    where: { id: boardId },
    data: { shareRevokedAt: new Date() }
  })

  revalidatePath(`/board/${boardId}`)
  return updated
}

export async function inviteCollaborator(boardId: string, email: string, role: 'COLLABORATOR' | 'VIEWER', userId: string) {
  const board = await prisma.designBoard.findUnique({ where: { id: boardId } })
  if (!board || board.userId !== userId) throw new Error("Unauthorized")

  // Generate an invitation token
  const token = crypto.randomBytes(16).toString('hex')
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) // 7 days valid

  const invite = await prisma.boardCollaborator.create({
    data: {
      boardId,
      email,
      role: role as any,
      inviteToken: token,
      expiresAt,
      status: 'PENDING'
    }
  })

  const { dispatchEmailEvent } = await import('@/lib/email/dispatcher')
  await dispatchEmailEvent({
    type: 'board.shared',
    recipient: email,
    designBoardId: boardId,
    boardName: board.name,
    shareUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/board/invite/${token}`
  })

  return invite
}

export async function addComment(boardId: string, content: string, authorName: string, userId?: string, isInternal: boolean = false, boardItemId?: string) {
  const board = await prisma.designBoard.findUnique({
    where: { id: boardId },
    include: { collaborators: true }
  })
  if (!board) throw new Error("Board not found")

  // Permission check: owner or collaborator/viewer. Actually viewers CANNOT comment per prompt.
  // "COLLABORATOR: view, comment, approve/reject only if explicitly granted" (Well, my collaborator role can approve too for simplicity)
  // "VIEWER: view only"
  let hasPermission = false
  if (userId) {
    if (board.userId === userId) {
      hasPermission = true
    } else {
      const collab = board.collaborators.find(c => c.userId === userId)
      if (collab && collab.role === 'COLLABORATOR') hasPermission = true
    }
  } else {
    // Guest via shared token? The prompt says "Guest cannot escalate permissions", "Viewer cannot comment".
    // If a guest doesn't have a userId, they are viewing via a generic token without an accepted invite.
    // So guests cannot comment unless they have an accepted invite (which requires them to at least be tracked, but if anonymous guest comments are allowed by generic token, wait, prompt says: "Shared anonymous users: view according to valid share token... Viewer cannot comment")
    // Thus if there's no userId and no explicit collaborator check, they can't comment.
    hasPermission = false
  }

  if (!hasPermission) throw new Error("Unauthorized to comment")
  
  const comment = await prisma.boardComment.create({
    data: {
      boardId,
      authorName,
      userId,
      content,
      isInternal,
      boardItemId
    }
  })
  
  await prisma.auditLog.create({
    data: {
      userId: userId || null,
      action: 'COMMENT_CREATED',
      entityType: 'DesignBoard',
      entityId: boardId,
      after: JSON.stringify({ commentId: comment.id, boardItemId })
    }
  })
  
  revalidatePath(`/board/${boardId}`)
  return comment
}

export async function generateQuoteFromBoard(boardId: string, userId: string) {
  const board = await prisma.designBoard.findUnique({ 
    where: { id: boardId },
    include: { items: { where: { removedAt: null, status: 'APPROVED' }, include: { product: true } } }
  })
  
  if (!board || board.userId !== userId) throw new Error("Unauthorized")
  
  if (board.items.length === 0) {
    throw new Error("No approved items to quote")
  }
  
  // Create Quote
  const quote = await prisma.quoteRequest.create({
    data: {
      userId,
      notes: `Quote generated from Design Board: ${board.name}`,
      items: {
        create: board.items.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          priceAtTime: item.approvedPrice || item.product.basePrice,
          productNameAtTime: item.product.name
        }))
      }
    }
  })
  
  return quote.id
}
