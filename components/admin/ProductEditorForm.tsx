'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateProduct } from '@/app/admin/(portal)/products/actions'

export function ProductEditorForm({ product, collections, categories }: { product: any, collections: any[], categories: any[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    formData.append('id', product.id)
    const res = await updateProduct(formData)
    
    if (res?.error) {
      setError(res.error)
    } else {
      setSuccess('Product updated successfully.')
      router.refresh() // Refreshes server components to get latest data
    }
    setLoading(false)
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-lg text-sm">
          {success}
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-[#1E1E1E] border border-white/5 p-6 rounded-xl space-y-6">
        <h3 className="text-lg font-medium text-white border-b border-white/5 pb-4">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Name</label>
            <input type="text" name="name" defaultValue={product.name} required className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C8A97E]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Slug</label>
            <input type="text" name="slug" defaultValue={product.slug} required className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C8A97E]" />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Collection</label>
            <select name="collectionId" defaultValue={product.collectionId || ''} className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C8A97E]">
              <option value="">No Collection</option>
              {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Category</label>
            <select name="categoryId" defaultValue={product.categoryId || ''} className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C8A97E]">
              <option value="">No Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Description</label>
          <textarea name="description" defaultValue={product.description || ''} rows={4} className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C8A97E]"></textarea>
        </div>
      </div>

      {/* Pricing & Status */}
      <div className="bg-[#1E1E1E] border border-white/5 p-6 rounded-xl space-y-6">
        <h3 className="text-lg font-medium text-white border-b border-white/5 pb-4">Business & Pricing</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Base Price (₹)</label>
            <input type="number" name="basePrice" defaultValue={product.basePrice || ''} className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C8A97E]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Price Status</label>
            <select name="priceStatus" defaultValue={product.priceStatus} className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C8A97E]">
              <option value="VERIFIED">Verified</option>
              <option value="CONFLICT">Conflict (Requires Review)</option>
              <option value="NOT_PROVIDED">Not Provided</option>
              <option value="PRICE_ON_REQUEST">Price on Request</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Publish Status</label>
            <select name="status" defaultValue={product.status} className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C8A97E]">
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" name="isBestSeller" defaultChecked={product.isBestSeller} className="w-5 h-5 accent-[#C8A97E] bg-[#121212] border-white/10 rounded" />
              <span className="text-sm font-medium text-white">Best Seller</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" name="isFeatured" defaultChecked={product.isFeatured} className="w-5 h-5 accent-[#C8A97E] bg-[#121212] border-white/10 rounded" />
              <span className="text-sm font-medium text-white">Featured Product</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#C8A97E] hover:bg-[#b5956a] text-black px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Product'}
        </button>
      </div>
    </form>
  )
}
