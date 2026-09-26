import React from 'react'
import Link from 'next/link'
import { requireCustomerAuth } from '@/lib/actions/customerAuth'
import { getUserBoards, createBoard } from '@/lib/actions/boards'
import { Button } from '@/components/ui/Button'
import { Plus, ArrowRight, CheckCircle2 } from 'lucide-react'
import { BoardSync } from './BoardSync'

export default async function AccountBoardsPage() {
  const { authUser, dbUser } = await requireCustomerAuth()
  
  const boards = await getUserBoards(dbUser.id)

  return (
    <div className="p-8 md:p-12 space-y-8">
      <BoardSync userId={dbUser.id} />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-zen-border pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-zen-accent font-mono block mb-2">
            Experience Lab
          </span>
          <h1 className="font-serif text-3xl md:text-4xl">My Design Boards</h1>
        </div>
        <form action={async (formData) => {
          'use server'
          const name = formData.get('name') as string
          if (name) {
            await createBoard(name, "Personal Design Board", dbUser.id)
          }
        }}>
          <div className="flex gap-2">
            <input 
              type="text" 
              name="name" 
              placeholder="e.g., My Living Room" 
              className="border border-zen-border px-3 py-2 text-sm focus:outline-none focus:border-zen-black"
              required
            />
            <Button type="submit" variant="primary" size="sm" icon={<Plus size={16}/>}>
              New Board
            </Button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {boards.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-zen-stone/10 border border-zen-border border-dashed">
            <p className="text-sm font-mono text-zen-taupe mb-4">No active design boards.</p>
            <p className="text-xs text-zen-charcoal max-w-md mx-auto">Create a board to start planning your space and collecting approved pieces.</p>
          </div>
        ) : (
          boards.map(board => {
            const approvedCount = board.items.filter(i => i.status === 'APPROVED').length;
            return (
              <div key={board.id} className="border border-zen-border bg-white flex flex-col group hover:border-zen-black transition-colors">
                <div className="p-6 flex-grow">
                  <h3 className="font-serif text-xl mb-1">{board.name}</h3>
                  <p className="text-xs font-mono text-zen-taupe mb-6">{board.description || "Design Board"}</p>
                  
                  <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest text-zen-charcoal">
                    <span>{board.items.length} Items</span>
                    {approvedCount > 0 && (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 size={12} /> {approvedCount} Approved
                      </span>
                    )}
                  </div>
                </div>
                <div className="bg-zen-stone/10 border-t border-zen-border p-4 flex justify-between items-center">
                  <span className="text-[10px] font-mono text-zen-taupe">Updated: {board.updatedAt.toLocaleDateString()}</span>
                  <Link href={`/board/${board.id}`} className="text-[10px] uppercase tracking-widest font-medium text-zen-accent flex items-center gap-1 hover:text-zen-black transition-colors">
                    Open Board <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
