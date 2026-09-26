import React from 'react'
import { getInvitation, acceptInvitation } from '@/lib/actions/collaboration'
import { getCustomerAuth } from '@/lib/actions/customerAuth'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default async function InviteAcceptPage({ params }: { params: { token: string } }) {
  const { token } = params
  
  const invitation = await getInvitation(token)
  
  if (!invitation) {
    return (
      <div className="min-h-screen bg-zen-ivory flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4">
          <h1 className="font-serif text-3xl">Invitation Invalid</h1>
          <p className="text-sm text-zen-charcoal">This invitation link is invalid or has expired.</p>
        </div>
      </div>
    )
  }

  const { dbUser } = await getCustomerAuth()

  return (
    <div className="min-h-screen bg-zen-offwhite flex items-center justify-center p-6 selection:bg-zen-accent selection:text-white">
      <div className="max-w-md w-full bg-white border border-zen-border p-10 text-center space-y-6">
        <h1 className="font-serif text-3xl">Design Review Invitation</h1>
        <p className="text-sm text-zen-charcoal">
          You have been invited to collaborate on the board <br/>
          <span className="font-medium text-zen-black">"{invitation.board.name}"</span>
        </p>

        <div className="bg-zen-stone/10 p-4 text-xs font-mono text-zen-taupe text-left space-y-2">
          <p>Role: {invitation.role}</p>
          {invitation.role === 'COLLABORATOR' && <p>Permissions: View, Comment, Review</p>}
          {invitation.role === 'VIEWER' && <p>Permissions: View Only</p>}
        </div>

        {dbUser ? (
          <form action={async () => {
            'use server'
            await acceptInvitation(token, dbUser.id)
            redirect(`/board/${invitation.boardId}`)
          }}>
            <Button type="submit" variant="primary" className="w-full">
              Accept as {dbUser.customerProfile?.firstName || dbUser.email}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-zen-charcoal">Please log in to accept this invitation.</p>
            <div className="flex gap-4">
              <Button href={`/login?returnUrl=/board/invite/${token}`} variant="primary" className="w-full">
                Log In
              </Button>
              <Button href={`/signup?returnUrl=/board/invite/${token}`} variant="outline" className="w-full">
                Sign Up
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
