'use client'

import { useState } from 'react'
import { login } from './actions'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const res = await login(formData)
    if (res?.error) {
      setError(res.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1E1E1E]">
      <div className="bg-[#2A2A2A] p-8 rounded-xl border border-white/10 w-full max-w-md shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-light text-white tracking-wider mb-2">ZEN ARCH</h1>
          <p className="text-sm text-gray-400">Admin Portal</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full bg-[#1E1E1E] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C8A97E] transition-colors"
              placeholder="admin@zenarch.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full bg-[#1E1E1E] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C8A97E] transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C8A97E] hover:bg-[#b5956a] text-black font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <button className="text-sm text-gray-400 hover:text-white transition-colors">
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  )
}
