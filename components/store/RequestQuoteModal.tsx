'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createQuoteRequest } from '@/lib/actions/quotes'
import { Button } from '@/components/ui/Button'
import { X } from 'lucide-react'

interface QuoteModalProps {
  productId: string
  productName: string
  variants: any[]
  isOpen: boolean
  onClose: () => void
}

export function RequestQuoteModal({ productId, productName, variants, isOpen, onClose }: QuoteModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  if (!isOpen) return null

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    try {
      const result = await createQuoteRequest(formData)
      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          onClose()
          router.push('/account/quotes')
        }, 1500)
      } else {
        // Handle unexpected structure
        setError('Failed to create quote')
      }
    } catch (e: any) {
      if (e.message.includes('NEXT_REDIRECT') || e.message.includes('Customer profile')) {
        router.push('/login')
      } else {
        setError(e.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg shadow-xl overflow-hidden flex flex-col relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-zen-charcoal hover:text-zen-accent">
          <X size={20} />
        </button>
        
        <div className="p-6 border-b border-zen-border">
          <h2 className="font-serif text-2xl text-zen-black">Request Quote</h2>
          <p className="text-xs text-zen-taupe mt-1">for {productName}</p>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="font-serif text-xl">Quote Requested</h3>
            <p className="text-sm text-zen-taupe">Redirecting to your dashboard...</p>
          </div>
        ) : (
          <form action={handleSubmit} className="p-6 space-y-4">
            <input type="hidden" name="productId" value={productId} />

            {error && (
              <div className="bg-red-50 text-red-600 p-3 text-xs border border-red-100">
                {error}
              </div>
            )}

            {variants && variants.length > 0 && (
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-mono text-zen-charcoal">Configuration</label>
                <select name="variantId" className="w-full border border-zen-border px-3 py-2 text-sm focus:outline-none focus:border-zen-black">
                  <option value="">Standard Model</option>
                  {variants.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-mono text-zen-charcoal">Quantity</label>
                <input type="number" name="quantity" min="1" defaultValue="1" required className="w-full border border-zen-border px-3 py-2 text-sm focus:outline-none focus:border-zen-black" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-mono text-zen-charcoal">Est. Budget (₹)</label>
                <input type="number" name="budget" placeholder="Optional" className="w-full border border-zen-border px-3 py-2 text-sm focus:outline-none focus:border-zen-black" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-mono text-zen-charcoal">Project Type</label>
              <select name="projectType" required className="w-full border border-zen-border px-3 py-2 text-sm focus:outline-none focus:border-zen-black">
                <option value="RESIDENTIAL">Residential</option>
                <option value="COMMERCIAL">Commercial / Office</option>
                <option value="HOSPITALITY">Hospitality</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-mono text-zen-charcoal">Additional Notes</label>
              <textarea name="notes" rows={3} placeholder="Tell us about fabric preferences or custom dimensions..." className="w-full border border-zen-border px-3 py-2 text-sm focus:outline-none focus:border-zen-black resize-none"></textarea>
            </div>

            <Button type="submit" variant="primary" className="w-full mt-4" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
