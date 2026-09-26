'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createDirectOrder } from '@/lib/actions/orders'
import { Button } from '@/components/ui/Button'

interface CheckoutClientProps {
  productId: string
  variantId?: string
  price: number
}

export function CheckoutClient({ productId, variantId, price }: CheckoutClientProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    shippingName: '',
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingPincode: '',
    shippingPhone: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const result = await createDirectOrder({
      productId,
      variantId,
      quantity: 1, // Fixed to 1 for now
      ...formData
    })

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
    } else if (result.success) {
      router.push(`/account/orders/${result.orderId}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 border border-zen-border">
      <h3 className="font-serif text-2xl text-zen-black mb-6">Delivery Details</h3>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 text-sm border border-red-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-widest text-zen-taupe font-sans">Full Name</label>
          <input 
            required
            name="shippingName"
            value={formData.shippingName}
            onChange={handleChange}
            className="w-full bg-zen-ivory border border-zen-border px-4 py-2 text-sm focus:outline-none focus:border-zen-black"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-widest text-zen-taupe font-sans">Phone Number</label>
          <input 
            required
            name="shippingPhone"
            value={formData.shippingPhone}
            onChange={handleChange}
            className="w-full bg-zen-ivory border border-zen-border px-4 py-2 text-sm focus:outline-none focus:border-zen-black"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs uppercase tracking-widest text-zen-taupe font-sans">Full Delivery Address</label>
        <input 
          required
          name="shippingAddress"
          value={formData.shippingAddress}
          onChange={handleChange}
          placeholder="House/Flat No, Building, Street, Area"
          className="w-full bg-zen-ivory border border-zen-border px-4 py-2 text-sm focus:outline-none focus:border-zen-black"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-widest text-zen-taupe font-sans">City</label>
          <input 
            required
            name="shippingCity"
            value={formData.shippingCity}
            onChange={handleChange}
            className="w-full bg-zen-ivory border border-zen-border px-4 py-2 text-sm focus:outline-none focus:border-zen-black"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-widest text-zen-taupe font-sans">State</label>
          <input 
            required
            name="shippingState"
            value={formData.shippingState}
            onChange={handleChange}
            className="w-full bg-zen-ivory border border-zen-border px-4 py-2 text-sm focus:outline-none focus:border-zen-black"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-widest text-zen-taupe font-sans">Pincode</label>
          <input 
            required
            name="shippingPincode"
            value={formData.shippingPincode}
            onChange={handleChange}
            className="w-full bg-zen-ivory border border-zen-border px-4 py-2 text-sm focus:outline-none focus:border-zen-black"
          />
        </div>
      </div>

      <div className="pt-6">
        <Button 
          type="submit"
          variant="primary"
          className="w-full py-4 text-sm"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Confirm Order'}
        </Button>
      </div>
    </form>
  )
}
