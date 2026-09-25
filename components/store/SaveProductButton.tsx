'use client'

import React, { useState } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { toggleSavedProduct } from '@/lib/actions/wishlist'

export function SaveProductButton({ productId, isInitiallySaved = false }: { productId: string, isInitiallySaved?: boolean }) {
  const [isSaved, setIsSaved] = useState(isInitiallySaved)
  const [isLoading, setIsLoading] = useState(false)

  async function handleToggle() {
    setIsLoading(true)
    try {
      const result = await toggleSavedProduct(productId)
      setIsSaved(result.status === 'added')
    } catch (e: any) {
      if (e.message.includes('Customer profile not found') || e.message.includes('NEXT_REDIRECT')) {
        // Redirected to login by the server action
        window.location.href = '/login'
      } else {
        alert('Please login to save products.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button 
      onClick={handleToggle}
      disabled={isLoading}
      className={`px-3 py-1.5 text-[9px] uppercase tracking-widest font-mono transition-colors border flex items-center gap-1 backdrop-blur-md ${
        isSaved
          ? "bg-white text-black border-white"
          : "bg-black/40 text-white/80 border-white/20 hover:border-white/50"
      }`}
    >
      {isSaved ? <BookmarkCheck size={10} /> : <Bookmark size={10} />}
      {isSaved ? 'Saved' : 'Save'}
    </button>
  )
}
