'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { globalAdminSearch } from '@/lib/actions/search'

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any>({ products: [], customers: [], projects: [], orders: [], quotes: [] })
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(open => !open)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults({ products: [], customers: [], projects: [], orders: [], quotes: [] })
        return
      }
      setLoading(true)
      try {
        const data = await globalAdminSearch(query)
        setResults(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(fetchResults, 300)
    return () => clearTimeout(debounce)
  }, [query])

  if (!isOpen) return null

  const totalResults = results.products.length + results.customers.length + results.projects.length + results.orders.length + results.quotes.length

  const handleNavigate = (path: string) => {
    setIsOpen(false)
    router.push(path)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
      <div 
        className="w-full max-w-2xl bg-[#1E1E1E] border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-white/10 bg-[#121212]">
          <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none"
            placeholder="Search products, customers, orders... (Esc to close)"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {loading && <div className="w-4 h-4 border-2 border-[#C8A97E] border-t-transparent rounded-full animate-spin"></div>}
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {query.length > 0 && query.length < 2 && (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              Type at least 2 characters to search
            </div>
          )}
          
          {query.length >= 2 && totalResults === 0 && !loading && (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              No results found for "{query}"
            </div>
          )}

          {results.products.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Products</div>
              {results.products.map((p: any) => (
                <button 
                  key={p.id}
                  onClick={() => handleNavigate(`/admin/products/${p.id}`)}
                  className="w-full text-left px-4 py-2 hover:bg-white/5 flex items-center justify-between group transition-colors"
                >
                  <div>
                    <div className="text-white text-sm font-medium group-hover:text-[#C8A97E]">{p.name}</div>
                    <div className="text-gray-500 text-xs">SKU: {p.sku || '-'}</div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-white/5 rounded text-gray-400">{p.status}</span>
                </button>
              ))}
            </div>
          )}

          {results.projects.length > 0 && (
            <div className="py-2 border-t border-white/5">
              <div className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Projects</div>
              {results.projects.map((p: any) => (
                <button 
                  key={p.id}
                  onClick={() => handleNavigate(`/admin/projects/${p.id}`)}
                  className="w-full text-left px-4 py-2 hover:bg-white/5 flex items-center justify-between group transition-colors"
                >
                  <div className="text-white text-sm font-medium group-hover:text-[#C8A97E]">{p.name}</div>
                  <span className="text-xs px-2 py-1 bg-white/5 rounded text-gray-400">{p.status}</span>
                </button>
              ))}
            </div>
          )}

          {results.customers.length > 0 && (
            <div className="py-2 border-t border-white/5">
              <div className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customers</div>
              {results.customers.map((c: any) => (
                <button 
                  key={c.id}
                  onClick={() => handleNavigate(`/admin/customers/${c.id}`)}
                  className="w-full text-left px-4 py-2 hover:bg-white/5 flex items-center justify-between group transition-colors"
                >
                  <div>
                    <div className="text-white text-sm font-medium group-hover:text-[#C8A97E]">
                      {c.customerProfile ? `${c.customerProfile.firstName || ''} ${c.customerProfile.lastName || ''}`.trim() || 'Unnamed' : 'Unnamed'}
                    </div>
                    <div className="text-gray-500 text-xs">{c.email}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {results.orders.length > 0 && (
            <div className="py-2 border-t border-white/5">
              <div className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Orders</div>
              {results.orders.map((o: any) => (
                <button 
                  key={o.id}
                  onClick={() => handleNavigate(`/admin/orders/${o.id}`)}
                  className="w-full text-left px-4 py-2 hover:bg-white/5 flex items-center justify-between group transition-colors"
                >
                  <div>
                    <div className="text-white text-sm font-medium group-hover:text-[#C8A97E]">Order #{o.id.slice(0,8)}</div>
                    <div className="text-gray-500 text-xs">₹{Number(o.totalAmount).toLocaleString()}</div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-white/5 rounded text-gray-400">{o.status}</span>
                </button>
              ))}
            </div>
          )}

          {results.quotes.length > 0 && (
            <div className="py-2 border-t border-white/5">
              <div className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quotes</div>
              {results.quotes.map((q: any) => (
                <button 
                  key={q.id}
                  onClick={() => handleNavigate(`/admin/quotes/${q.id}`)}
                  className="w-full text-left px-4 py-2 hover:bg-white/5 flex items-center justify-between group transition-colors"
                >
                  <div className="text-white text-sm font-medium group-hover:text-[#C8A97E]">Quote #{q.id.slice(0,8)}</div>
                  <span className="text-xs px-2 py-1 bg-white/5 rounded text-gray-400">{q.status}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-2 border-t border-white/10 bg-[#121212] flex items-center justify-between text-xs text-gray-500">
          <span>Navigate with <kbd className="bg-white/10 px-1 rounded">↑</kbd> <kbd className="bg-white/10 px-1 rounded">↓</kbd> (coming soon)</span>
          <span>Close with <kbd className="bg-white/10 px-1 rounded">Esc</kbd></span>
        </div>
      </div>
    </div>
  )
}
