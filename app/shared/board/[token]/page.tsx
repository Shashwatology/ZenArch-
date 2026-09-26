import React from 'react'
import { notFound } from 'next/navigation'
import { getBoardByShareToken } from '@/lib/actions/boards'
import BoardClient from '@/app/board/[id]/BoardClient'

export default async function SharedBoardPage({ params }: { params: { token: string } }) {
  const { token } = params
  
  const board = await getBoardByShareToken(token)
  
  if (!board) {
    return (
      <div className="min-h-screen bg-zen-ivory flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4">
          <h1 className="font-serif text-3xl">Access Denied</h1>
          <p className="text-sm text-zen-charcoal">This board share link is invalid, expired, or has been revoked by the owner.</p>
        </div>
      </div>
    )
  }

  // Render the board in Shared/Read-Only view
  return <BoardClient boardId={board.id} initialBoard={board} currentUserId={null} isSharedView={true} />
}
