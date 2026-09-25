import React from 'react'
import Link from 'next/link'
import { getCustomerQuotes } from '@/lib/actions/quotes'

export default async function CustomerQuotesPage() {
  const quotes = await getCustomerQuotes()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'IN_REVIEW': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'CONTACTED': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'QUOTED': return 'bg-green-100 text-green-800 border-green-200'
      case 'ACCEPTED': return 'bg-zen-black text-white border-zen-black'
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200'
      case 'CLOSED': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="p-8 md:p-12 space-y-8">
      <div className="border-b border-zen-border pb-6 flex justify-between items-end">
        <div>
          <h1 className="font-serif text-3xl text-zen-black">Quotations</h1>
          <p className="text-sm text-zen-taupe mt-2 font-light">Track the status of your requested quotes.</p>
        </div>
      </div>

      {quotes.length === 0 ? (
        <div className="py-12 text-center text-zen-taupe text-sm">
          You have no active quotes.
          <div className="mt-4">
            <Link href="/furniture" className="text-zen-black border-b border-zen-black pb-1 hover:text-zen-accent hover:border-zen-accent transition-colors">
              Explore Collections
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {quotes.map(quote => (
            <div key={quote.id} className="border border-zen-border p-6 bg-zen-ivory/50">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 border-b border-zen-border/50 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-zen-charcoal block mb-1">
                    Quote Reference
                  </span>
                  <span className="font-mono text-sm">{quote.id.split('-')[0].toUpperCase()}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-zen-charcoal block mb-1">
                    Date
                  </span>
                  <span className="text-sm">{new Date(quote.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className={`px-3 py-1 text-[10px] uppercase font-mono tracking-widest border ${getStatusColor(quote.status)}`}>
                    {quote.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="sm:ml-auto">
                  <a 
                    href={`https://wa.me/919372921244?text=${encodeURIComponent(`Hello Zen Arch, I am following up on my quote request (Ref: ${quote.id.split('-')[0].toUpperCase()}) regarding: ${quote.items.map(i => i.productNameAtTime || i.product.name).join(', ')}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] uppercase font-mono tracking-widest border border-green-600 text-green-700 hover:bg-green-50 px-3 py-1.5 transition-colors inline-block"
                  >
                    Discuss on WhatsApp
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                {quote.items.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-white p-4 border border-zen-border/50">
                    <div>
                      <Link href={`/furniture/${item.product.slug}`} className="font-serif text-lg text-zen-black hover:text-zen-accent transition-colors">
                        {item.productNameAtTime || item.product.name}
                      </Link>
                      {item.variant && (
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zen-taupe ml-2">
                          / {item.variant.name}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-sm block">Qty: {item.quantity}</span>
                      {item.priceAtTime && (
                        <span className="text-[10px] font-mono text-zen-taupe">₹{item.priceAtTime.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
