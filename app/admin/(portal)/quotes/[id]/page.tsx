import React from 'react'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { QuoteActions } from './QuoteActions'
import { ArrowLeft } from 'lucide-react'
import { requireAdmin } from '@/lib/admin/auth'

export default async function AdminQuoteDetailPage({ params }: { params: { id: string } }) {
  await requireAdmin()
  const { id } = await params

  const quote = await prisma.quoteRequest.findUnique({
    where: { id },
    include: {
      user: {
        include: { customerProfile: true }
      },
      items: {
        include: {
          product: { include: { images: true } },
          variant: true
        }
      }
    }
  })

  if (!quote) notFound()

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <Link href="/admin/quotes" className="text-[10px] font-mono uppercase tracking-widest text-gray-500 hover:text-white flex items-center gap-2 mb-4 transition-colors">
          <ArrowLeft size={12} /> Back to Quotes
        </Link>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-light text-white tracking-wider">Quote {quote.id.split('-')[0].toUpperCase()}</h1>
            <p className="text-sm text-gray-400 mt-1">Requested on {new Date(quote.createdAt).toLocaleString()}</p>
          </div>
          <QuoteActions quoteId={quote.id} currentStatus={quote.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-[#1E1E1E] border border-white/10 p-6 rounded-xl">
            <h2 className="text-xl font-light text-white border-b border-white/10 pb-4 mb-6">Requested Items</h2>
            <div className="space-y-6">
              {quote.items.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-24 h-24 bg-[#121212] border border-white/5 flex items-center justify-center rounded-lg overflow-hidden">
                    {item.product.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.product.images[0].url} alt="" className="object-cover w-full h-full opacity-80" />
                    ) : (
                      <span className="text-[10px] font-mono text-gray-600">No Img</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg text-white font-medium">{item.productNameAtTime || item.product.name}</h3>
                    {item.variant && <p className="text-xs font-mono text-[#C8A97E] uppercase tracking-widest mt-1">{item.variant.name}</p>}
                    <div className="mt-4 flex justify-between text-sm text-gray-400">
                      <span>Qty: {item.quantity}</span>
                      <span>{item.priceAtTime ? `Snapshot: ₹${Number(item.priceAtTime).toLocaleString('en-IN')}` : 'Price on request'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#1E1E1E] border border-white/10 p-6 rounded-xl">
            <h2 className="text-xl font-light text-white mb-4">Customer Details</h2>
            <div className="space-y-4 text-sm text-gray-300">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-gray-500 block mb-1">Name</span>
                {quote.user.customerProfile?.firstName} {quote.user.customerProfile?.lastName}
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-gray-500 block mb-1">Email</span>
                <a href={`mailto:${quote.user.email}`} className="text-[#C8A97E] hover:text-white transition-colors">{quote.user.email}</a>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-gray-500 block mb-1">Phone</span>
                {quote.user.customerProfile?.phone || 'N/A'}
              </div>
            </div>
          </div>

          <div className="bg-[#1E1E1E] border border-white/10 p-6 rounded-xl">
            <h2 className="text-xl font-light text-white mb-4">Request Context</h2>
            <div className="space-y-4 text-sm text-gray-300">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-gray-500 block mb-1">Project Type</span>
                {quote.projectType || 'N/A'}
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-gray-500 block mb-1">Est. Budget</span>
                {quote.budget ? <span className="text-[#C8A97E]">₹{Number(quote.budget).toLocaleString('en-IN')}</span> : 'N/A'}
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-gray-500 block mb-1">Customer Notes</span>
                <p className="whitespace-pre-wrap text-gray-400 bg-white/5 p-3 rounded-md border border-white/5">
                  {quote.notes || 'None provided'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
