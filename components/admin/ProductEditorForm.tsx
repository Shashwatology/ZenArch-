'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateProduct } from '@/app/admin/(portal)/products/actions'
import Image from 'next/image'
import { ProductMediaUploader } from './ProductMediaUploader'
import { SeoFieldsForm } from './SeoFieldsForm'

export function ProductEditorForm({ product, collections, categories }: { product: any, collections: any[], categories: any[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('BASIC')

  const tabs = [
    { id: 'BASIC', label: 'Basic Info' },
    { id: 'PRICING', label: 'Pricing' },
    { id: 'DIMENSIONS', label: 'Dimensions' },
    { id: 'SPECS', label: 'Specifications' },
    { id: 'VARIANTS', label: 'Variants' },
    { id: 'MEDIA', label: 'Media' },
    { id: '3D', label: '3D / AR' },
    { id: 'MERCHANDISING', label: 'Merchandising' },
    { id: 'SEO', label: 'SEO' },
    { id: 'PUBLISHING', label: 'Publishing' },
  ]

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
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <form action={handleSubmit} className="flex gap-8">
      {/* Sidebar Tabs */}
      <div className="w-48 flex-shrink-0 space-y-1 border-r border-white/10 pr-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${
              activeTab === tab.id 
                ? 'bg-[#C8A97E]/10 text-[#C8A97E] font-medium' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-6">
        
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

        <div className="bg-[#1E1E1E] border border-white/5 p-6 rounded-xl min-h-[400px]">
          
          {/* TAB 1: BASIC */}
          {activeTab === 'BASIC' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-lg font-medium text-white mb-6">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Name</label>
                  <input type="text" name="name" defaultValue={product.name} required className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C8A97E]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">SKU</label>
                  <input type="text" name="sku" defaultValue={product.sku || ''} className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C8A97E]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Slug</label>
                  <input type="text" name="slug" defaultValue={product.slug} required className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C8A97E]" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          )}

          {/* TAB 2: PRICING */}
          {activeTab === 'PRICING' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-lg font-medium text-white mb-6">Business & Pricing</h3>
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
              </div>
            </div>
          )}

          {/* TAB 3: DIMENSIONS */}
          {activeTab === 'DIMENSIONS' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-lg font-medium text-white mb-6">Dimensions</h3>
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Dimensions String</label>
                <input type="text" name="dimensions" placeholder="e.g. 84&quot;W x 40&quot;D x 34&quot;H" defaultValue={product.dimensions || ''} className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C8A97E]" />
              </div>
            </div>
          )}

          {/* TAB 4: SPECS */}
          {activeTab === 'SPECS' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-lg font-medium text-white mb-6">Specifications</h3>
              <div className="text-sm text-gray-400 mb-4">
                Specifications are currently imported from the source data.
              </div>
              <div className="bg-[#121212] p-4 rounded-lg border border-white/5 space-y-2">
                {product.specifications?.map((spec: any) => (
                  <div key={spec.id} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                    <span className="text-gray-400">{spec.key}</span>
                    <span className="text-white">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: VARIANTS */}
          {activeTab === 'VARIANTS' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-lg font-medium text-white mb-6">Variants</h3>
              <div className="text-sm text-gray-400 mb-4">
                Variants are managed automatically through inventory sources. 
                Do not pretend auto-generated "Standard" variants are distinct catalogue configurations.
              </div>
              <div className="space-y-3">
                {product.variants?.map((v: any) => (
                  <div key={v.id} className="bg-[#121212] p-4 rounded-lg border border-white/5 flex justify-between items-center">
                    <div>
                      <p className="text-white font-medium text-sm">{v.name}</p>
                      <p className="text-xs text-gray-500">SKU: {v.sku || '-'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#C8A97E] text-sm">₹{Number(v.priceInr || 0).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: MEDIA */}
          {activeTab === 'MEDIA' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-lg font-medium text-white mb-6">Media</h3>
              <div className="text-sm text-gray-400 mb-4">
                Upload new media or manage existing images.
              </div>
              <ProductMediaUploader productId={product.id} initialImages={product.images || []} />
            </div>
          )}

          {/* TAB 7: 3D/AR */}
          {activeTab === '3D' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-lg font-medium text-white mb-6">3D & AR Assets</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">3D Asset URL (.glb / .gltf)</label>
                  <input type="text" name="asset3dUrl" defaultValue={product.asset3dUrl || ''} className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C8A97E]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">AR Asset URL (.usdz)</label>
                  <input type="text" name="assetArUrl" defaultValue={product.assetArUrl || ''} className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C8A97E]" />
                </div>
                
                <div className="flex flex-col space-y-4 pt-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" name="has3dModel" defaultChecked={product.has3dModel} className="w-5 h-5 accent-[#C8A97E] bg-[#121212] border-white/10 rounded" />
                    <span className="text-sm font-medium text-white">Enable 3D Viewer</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" name="hasArModel" defaultChecked={product.hasArModel} className="w-5 h-5 accent-[#C8A97E] bg-[#121212] border-white/10 rounded" />
                    <span className="text-sm font-medium text-white">Enable AR Capability</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: MERCHANDISING */}
          {activeTab === 'MERCHANDISING' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-lg font-medium text-white mb-6">Merchandising</h3>
              <div className="space-y-4">
                <label className="flex items-center space-x-3 cursor-pointer p-4 bg-[#121212] border border-white/5 rounded-lg">
                  <input type="checkbox" name="isBestSeller" defaultChecked={product.isBestSeller} className="w-5 h-5 accent-[#C8A97E] bg-[#121212] border-white/10 rounded" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">Best Seller</span>
                    <span className="text-xs text-gray-500">Highlight this product in the Best Sellers section on the homepage.</span>
                  </div>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer p-4 bg-[#121212] border border-white/5 rounded-lg">
                  <input type="checkbox" name="isFeatured" defaultChecked={product.isFeatured} className="w-5 h-5 accent-[#C8A97E] bg-[#121212] border-white/10 rounded" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">Featured Product</span>
                    <span className="text-xs text-gray-500">Prioritize this product in collection views and search results.</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* TAB 9: SEO */}
          {activeTab === 'SEO' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <SeoFieldsForm defaultValues={product} />
            </div>
          )}

          {/* TAB 10: PUBLISHING */}
          {activeTab === 'PUBLISHING' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-lg font-medium text-white mb-6">Publishing</h3>
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Visibility Status</label>
                <select name="status" defaultValue={product.status} className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C8A97E]">
                  <option value="DRAFT">Draft - Hidden from customers</option>
                  <option value="PUBLISHED">Published - Visible on website</option>
                  <option value="ARCHIVED">Archived - Removed from active catalogue</option>
                </select>
              </div>
              <div className="mt-8 pt-6 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => window.open(`/furniture/${product.slug}`, '_blank')}
                  className="text-sm text-[#C8A97E] hover:underline"
                >
                  Preview on public website &nearr;
                </button>
              </div>
            </div>
          )}

        </div>
        
        <div className="flex justify-end pt-4 gap-4 border-t border-white/10 mt-6 pt-6">
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="px-6 py-2 rounded-lg font-medium text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#C8A97E] hover:bg-[#b5956a] text-black px-8 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>
    </form>
  )
}
