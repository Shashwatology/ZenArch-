'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { login } from '@/lib/actions/customerAuth'
import { Button } from '@/components/ui/Button'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zen-ivory flex items-center justify-center p-6 pt-32">
      <div className="w-full max-w-md bg-white border border-zen-border p-8 shadow-sm">
        <h1 className="font-serif text-3xl mb-2 text-center text-zen-black">Welcome Back</h1>
        <p className="text-sm text-zen-taupe text-center mb-8">Access your saved products and quotes.</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-mono uppercase tracking-widest text-zen-charcoal">Email</label>
            <input 
              name="email" 
              type="email" 
              required 
              className="w-full border border-zen-border px-4 py-3 text-sm focus:outline-none focus:border-zen-black transition-colors"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-mono uppercase tracking-widest text-zen-charcoal">Password</label>
            <input 
              name="password" 
              type="password" 
              required 
              className="w-full border border-zen-border px-4 py-3 text-sm focus:outline-none focus:border-zen-black transition-colors"
            />
          </div>
          
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-[10px] uppercase font-mono tracking-widest text-zen-taupe hover:text-zen-accent">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" variant="primary" className="w-full mt-4" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-8 text-center text-xs text-zen-taupe">
          Don't have an account?{' '}
          <Link href="/signup" className="text-zen-black font-medium hover:text-zen-accent transition-colors">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  )
}
