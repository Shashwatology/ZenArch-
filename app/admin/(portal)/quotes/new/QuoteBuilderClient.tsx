'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { previewQuoteCalculation } from '@/lib/pricing/preview'
import { createAdminQuoteAction } from './actions'

type SelectedItem = {
  productId: string,
  variantId: string | null,
  quantity: number
}

export function QuoteBuilderClient({ customers, products, promotions, coupons }: { customers: any[], products: any[], promotions: any[], coupons: any[] }) {
  const router = useRouter()
  const [selectedUser, setSelectedUser] = useState('')
  const [items, setItems] = useState<SelectedItem[]>([])
  const [selectedPromo, setSelectedPromo] = useState('')
  const [selectedCoupon, setSelectedCoupon] = useState('')
  const [couponCodeInput, setCouponCodeInput] = useState('')
  const [notes, setNotes] = useState('')
  
  const [preview, setPreview] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Derive products for search
  const [search, setSearch] = useState('')
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase()))

  useEffect(() => {
    if (items.length > 0) {
      handlePreview()
    } else {
      setPreview(null)
    }
  }, [items, selectedPromo, selectedCoupon])

  const handlePreview = async () => {
    setLoading(true)
    try {
      const res = await previewQuoteCalculation({
        items,
        promotionCode: selectedPromo || undefined,
        couponCode: selectedCoupon || undefined
      })
      setPreview(res)
    } catch (e: any) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const addItem = (productId: string, variantId: string | null = null) => {
    setItems(prev => {
      const exists = prev.find(i => i.productId === productId && i.variantId === variantId)
      if (exists) {
        return prev.map(i => i === exists ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { productId, variantId, quantity: 1 }]
    })
  }

  const updateQuantity = (idx: number, qty: number) => {
    if (qty < 1) {
      setItems(prev => prev.filter((_, i) => i !== idx))
      return
    }
    setItems(prev => prev.map((item, i) => i === idx ? { ...item, quantity: qty } : item))
  }

  const applyCoupon = () => {
    const found = coupons.find(c => c.code === couponCodeInput.toUpperCase())
    if (found) {
      setSelectedCoupon(couponCodeInput.toUpperCase())
    } else {
      alert("Invalid coupon code")
    }
  }

  const handleSave = async () => {
    if (!selectedUser) return alert("Select a customer")
    if (items.length === 0) return alert("Add at least one item")
    if (preview?.priceState === 'PRICE_REQUIRES_CONFIRMATION') {
      return alert("Cannot build quote: Price conflict exists. Resolve pricing on product page first.")
    }
    
    setSaving(true)
    try {
      const res = await createAdminQuoteAction({
        userId: selectedUser,
        items,
        promotionCode: selectedPromo || undefined,
        couponCode: selectedCoupon || undefined,
        notes
      })
      router.push(`/admin/quotes/${res.quoteId}`)
    } catch (e: any) {
      alert(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Build Tools */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Customer Select */}
        <div className="bg-[#1E1E1E] p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-light text-white mb-4">1. Select Customer</h2>
          <select 
            value={selectedUser} 
            onChange={e => setSelectedUser(e.target.value)}
            className="w-full bg-[#121212] text-white border border-white/10 p-3 rounded-lg focus:outline-none focus:border-[#C8A97E]"
          >
            <option value="">-- Choose Customer --</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>
                {c.customerProfile?.firstName} {c.customerProfile?.lastName} ({c.email})
              </option>
            ))}
          </select>
        </div>

        {/* Product Search & Select */}
        <div className="bg-[#1E1E1E] p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-light text-white mb-4">2. Add Products</h2>
          <input 
            type="text" 
            placeholder="Search products by name or SKU..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#121212] text-white border border-white/10 p-3 rounded-lg mb-4 focus:outline-none focus:border-[#C8A97E]"
          />
          <div className="max-h-64 overflow-y-auto space-y-2">
            {filteredProducts.slice(0, 50).map(p => (
              <div key={p.id} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/5 transition-colors">
                <div>
                  <div className="text-white font-medium">{p.name}</div>
                  <div className="text-xs text-gray-500 font-mono">{p.sku} | ₹{Number(p.basePrice || 0).toLocaleString()}</div>
                </div>
                {p.variants.length > 0 ? (
                  <select 
                    onChange={(e) => {
                      if (e.target.value) addItem(p.id, e.target.value)
                      e.target.value = "" // reset
                    }}
                    className="bg-[#121212] text-xs text-white border border-white/10 p-2 rounded focus:outline-none"
                  >
                    <option value="">Select Variant +</option>
                    {p.variants.map((v: any) => (
                      <option key={v.id} value={v.id}>{v.name} (₹{Number(v.priceInr || p.basePrice || 0).toLocaleString()})</option>
                    ))}
                  </select>
                ) : (
                  <button 
                    onClick={() => addItem(p.id)}
                    className="bg-white/5 hover:bg-[#C8A97E] hover:text-black text-white px-3 py-1 rounded text-xs transition-colors"
                  >
                    Add
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Discounts */}
        <div className="bg-[#1E1E1E] p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-light text-white mb-4">3. Apply Discounts</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Promotion</label>
              <select 
                value={selectedPromo}
                onChange={e => setSelectedPromo(e.target.value)}
                className="w-full bg-[#121212] text-white border border-white/10 p-3 rounded-lg focus:outline-none focus:border-[#C8A97E]"
              >
                <option value="">None</option>
                {promotions.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Coupon Code</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={couponCodeInput}
                  onChange={e => setCouponCodeInput(e.target.value)}
                  placeholder="Enter code"
                  className="w-full bg-[#121212] text-white border border-white/10 p-3 rounded-lg font-mono uppercase focus:outline-none focus:border-[#C8A97E]"
                />
                <button onClick={applyCoupon} className="bg-white/10 hover:bg-white/20 text-white px-4 rounded-lg transition-colors">Apply</button>
              </div>
              {selectedCoupon && <div className="text-xs text-green-400 mt-2">Applied: {selectedCoupon} <button onClick={() => setSelectedCoupon('')} className="text-white hover:text-red-400 ml-2">✕</button></div>}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Preview & Summary */}
      <div className="space-y-6">
        <div className="bg-[#121212] p-6 rounded-xl border border-[#C8A97E]/30 sticky top-6">
          <h2 className="text-xl font-light text-white mb-6">Quote Summary</h2>
          
          <div className="space-y-4 mb-6">
            {items.map((item, idx) => {
              const product = products.find(p => p.id === item.productId)
              const variant = product?.variants.find((v: any) => v.id === item.variantId)
              const previewItem = preview?.items?.find((i: any) => i.productId === item.productId && i.variantId === item.variantId)
              
              return (
                <div key={idx} className="flex justify-between text-sm">
                  <div className="flex-1">
                    <div className="text-white truncate pr-2">{product?.name}</div>
                    {variant && <div className="text-xs text-[#C8A97E]">{variant.name}</div>}
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => updateQuantity(idx, item.quantity - 1)} className="text-gray-500 hover:text-white">-</button>
                      <span className="text-gray-300 w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(idx, item.quantity + 1)} className="text-gray-500 hover:text-white">+</button>
                    </div>
                  </div>
                  <div className="text-right">
                    {previewItem ? (
                      <>
                        <div className="text-white">₹{Number(previewItem.finalLineTotal).toLocaleString()}</div>
                        {(Number(previewItem.promotionDiscount) > 0 || Number(previewItem.couponDiscount) > 0) && (
                          <div className="text-xs text-gray-500 line-through">₹{Number(previewItem.lineSubtotal).toLocaleString()}</div>
                        )}
                      </>
                    ) : (
                      <div className="text-gray-500">Calculating...</div>
                    )}
                  </div>
                </div>
              )
            })}
            {items.length === 0 && <div className="text-sm text-gray-500 italic">No items added</div>}
          </div>

          <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span>₹{Number(preview?.subtotal || 0).toLocaleString()}</span>
            </div>
            {Number(preview?.promotionDiscount) > 0 && (
              <div className="flex justify-between text-green-400">
                <span>Promotion Discount</span>
                <span>-₹{Number(preview.promotionDiscount).toLocaleString()}</span>
              </div>
            )}
            {Number(preview?.couponDiscount) > 0 && (
              <div className="flex justify-between text-green-400">
                <span>Coupon Discount</span>
                <span>-₹{Number(preview.couponDiscount).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-white text-lg pt-2 font-medium">
              <span>Total</span>
              <span>₹{Number(preview?.finalTotal || 0).toLocaleString()}</span>
            </div>
          </div>
          
          {preview?.priceState === 'PRICE_REQUIRES_CONFIRMATION' && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg">
              One or more items have an unresolved price conflict. You must confirm pricing in the catalogue before quoting.
            </div>
          )}

          <div className="mt-6">
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Internal Notes</label>
            <textarea 
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-[#1E1E1E] border border-white/10 p-3 rounded-lg text-sm text-white focus:outline-none focus:border-[#C8A97E] resize-none h-24"
              placeholder="Private notes..."
            ></textarea>
          </div>

          <button 
            onClick={handleSave}
            disabled={saving || items.length === 0 || !selectedUser || preview?.priceState === 'PRICE_REQUIRES_CONFIRMATION'}
            className="w-full mt-6 bg-[#C8A97E] text-black font-medium py-3 rounded-lg hover:bg-white transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving Quote...' : 'Create Quote'}
          </button>
        </div>
      </div>
    </div>
  )
}
