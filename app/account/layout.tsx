import React from 'react'
import Link from 'next/link'
import { requireCustomerAuth, logout } from '@/lib/actions/customerAuth'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const { authUser, dbUser } = await requireCustomerAuth()

  return (
    <div className="min-h-screen bg-zen-ivory pt-32 pb-24 selection:bg-zen-accent selection:text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-12">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl text-zen-black">{dbUser.customerProfile?.firstName || 'Welcome'},</h2>
              <p className="text-xs font-mono text-zen-taupe">{authUser.email}</p>
            </div>
            
            <nav className="flex flex-col space-y-1">
              <Link href="/account" className="px-4 py-3 text-sm border-l-2 border-transparent hover:border-zen-accent hover:bg-zen-stone/20 transition-colors">
                Profile Overview
              </Link>
              <Link href="/account/wishlist" className="px-4 py-3 text-sm border-l-2 border-transparent hover:border-zen-accent hover:bg-zen-stone/20 transition-colors">
                Saved Products
              </Link>
              <Link href="/account/quotes" className="px-4 py-3 text-sm border-l-2 border-transparent hover:border-zen-accent hover:bg-zen-stone/20 transition-colors">
                Quotations
              </Link>
              <Link href="/account/orders" className="px-4 py-3 text-sm border-l-2 border-transparent hover:border-zen-accent hover:bg-zen-stone/20 transition-colors">
                Orders
              </Link>
              <Link href="/account/settings" className="px-4 py-3 text-sm border-l-2 border-transparent hover:border-zen-accent hover:bg-zen-stone/20 transition-colors">
                Settings
              </Link>
            </nav>
            
            <form action={logout}>
              <button className="text-xs uppercase tracking-widest font-mono text-zen-charcoal hover:text-zen-accent px-4 py-2 border border-zen-border w-full text-center mt-6 transition-colors">
                Sign Out
              </button>
            </form>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-white border border-zen-border shadow-sm">
          {children}
        </main>
      </div>
    </div>
  )
}
