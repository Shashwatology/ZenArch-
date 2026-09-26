'use client'

import { useState } from 'react'
import Link from 'next/link'
import { updateProductBulkAction } from '@/lib/actions/products'
import { useRouter } from 'next/navigation'

export function ProductsClient({ initialProducts }: { initialProducts: any[] }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isProcessing, setIsProcessing] = useState(false)

  // Filter products locally for speed
  const filteredProducts = initialProducts.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
  )

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProducts.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredProducts.map(p => p.id)))
    }
  }

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setSelectedIds(newSet)
  }

  const handleBulkAction = async (action: string) => {
    if (selectedIds.size === 0) return
    setIsProcessing(true)
    try {
      await updateProductBulkAction(Array.from(selectedIds), action)
      setSelectedIds(new Set())
      router.refresh()
    } catch (e) {
      console.error("Bulk action failed", e)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-light tracking-wider text-white mb-2">Products</h2>
          <p className="text-sm text-gray-400">Manage your catalogue</p>
        </div>
        <Link 
          href="/admin/products/new"
          className="bg-[#C8A97E] hover:bg-[#b5956a] text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Add Product
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#1E1E1E] p-4 rounded-xl border border-white/10">
        <input 
          type="text" 
          placeholder="Search name or SKU..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full sm:w-64 bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#C8A97E] outline-none"
        />
        
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 mr-2">{selectedIds.size} selected</span>
            <select 
              className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#C8A97E] outline-none"
              onChange={(e) => handleBulkAction(e.target.value)}
              value=""
              disabled={isProcessing}
            >
              <option value="" disabled>Bulk Actions</option>
              <option value="PUBLISH">Publish</option>
              <option value="DRAFT">Unpublish (Draft)</option>
              <option value="FEATURED">Mark Featured</option>
              <option value="UNFEATURED">Remove Featured</option>
              <option value="BESTSELLER">Mark Best Seller</option>
              <option value="UNBESTSELLER">Remove Best Seller</option>
              <option value="ARCHIVE">Archive</option>
            </select>
          </div>
        )}
      </div>

      <div className="bg-[#1E1E1E] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5 text-xs uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4 font-medium w-12">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.size > 0 && selectedIds.size === filteredProducts.length}
                    onChange={toggleSelectAll}
                    className="rounded border-white/20 bg-black/50 text-[#C8A97E] focus:ring-[#C8A97E]"
                  />
                </th>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">SKU</th>
                <th className="px-6 py-4 font-medium">Collection</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredProducts.map((product) => {
                const totalStock = product.inventory?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;
                
                return (
                  <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.has(product.id)}
                        onChange={() => toggleSelect(product.id)}
                        className="rounded border-white/20 bg-black/50 text-[#C8A97E] focus:ring-[#C8A97E]"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <Link href={`/admin/products/${product.id}`} className="font-medium text-white hover:text-[#C8A97E] transition-colors">
                          {product.name}
                        </Link>
                        <div className="flex gap-2 mt-1">
                          {product.isFeatured && <span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded">Featured</span>}
                          {product.isBestSeller && <span className="text-[10px] bg-orange-500/10 text-orange-500 px-1.5 py-0.5 rounded">Best Seller</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {product.sku || '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {product.collection?.name || '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {product.basePrice ? `₹${Number(product.basePrice).toLocaleString('en-IN')}` : 'ON REQUEST'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={totalStock === 0 ? 'text-red-400' : totalStock <= 5 ? 'text-orange-400' : 'text-green-400'}>
                        {totalStock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                        product.status === 'ARCHIVED' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500 text-xs">
                      {new Date(product.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No products found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
