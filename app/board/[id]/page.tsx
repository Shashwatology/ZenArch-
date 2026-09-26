import React from 'react'
import { notFound, redirect } from 'next/navigation'
import { getBoardById } from '@/lib/actions/boards'
import { requireCustomerAuth } from '@/lib/actions/customerAuth'
import BoardClient from './BoardClient'

export default async function BoardPage({ params }: { params: { id: string } }) {
  const { id } = params
  
  if (id === 'local') {
    // For anonymous users, handle entirely in the client component
    return <BoardClient boardId="local" initialBoard={null} />
  }

  const { authUser, dbUser } = await requireCustomerAuth()
  
  const board = await getBoardById(id)
  if (!board) notFound()

  // Security: Owner or Collaborator can view this route. 
  const isOwner = board.userId === dbUser.id;
  const isCollaborator = board.collaborators.some(c => c.userId === dbUser.id && c.status === 'ACCEPTED');

  if (!dbUser || (!isOwner && !isCollaborator)) {
    redirect('/login?returnUrl=/board/' + id)
  }

  return <BoardClient boardId={id} initialBoard={board} currentUserId={dbUser.id} />
}
