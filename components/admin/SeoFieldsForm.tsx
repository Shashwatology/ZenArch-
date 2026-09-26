'use client'

import React from 'react'

export function SeoFieldsForm({ defaultValues }: { defaultValues: any }) {
  return (
    <div className="space-y-6 bg-[#121212] p-6 rounded-xl border border-white/10">
      <div>
        <h3 className="text-lg font-medium text-white">Search Engine Optimization</h3>
        <p className="text-sm text-gray-400 mt-1">Control how this page appears in search results.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">SEO Title</label>
          <input 
            type="text" 
            name="seoTitle" 
            defaultValue={defaultValues?.seoTitle || ''}
            placeholder="Optimal length 50-60 characters"
            className="w-full bg-[#1A1A1A] text-white border border-white/10 rounded-lg p-2.5 focus:border-[#C8A97E] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">SEO Description</label>
          <textarea 
            name="seoDescription" 
            defaultValue={defaultValues?.seoDescription || ''}
            rows={3}
            placeholder="Optimal length 150-160 characters"
            className="w-full bg-[#1A1A1A] text-white border border-white/10 rounded-lg p-2.5 focus:border-[#C8A97E] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Canonical URL</label>
          <input 
            type="url" 
            name="canonical" 
            defaultValue={defaultValues?.canonical || ''}
            placeholder="https://zenarch.com/..."
            className="w-full bg-[#1A1A1A] text-white border border-white/10 rounded-lg p-2.5 focus:border-[#C8A97E] focus:outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">Leave blank to use the default URL.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">OpenGraph Image URL</label>
          <input 
            type="url" 
            name="ogImage" 
            defaultValue={defaultValues?.ogImage || ''}
            placeholder="https://..."
            className="w-full bg-[#1A1A1A] text-white border border-white/10 rounded-lg p-2.5 focus:border-[#C8A97E] focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-3 pt-2">
          <input 
            type="checkbox" 
            name="noindex"
            id="noindex"
            defaultChecked={defaultValues?.noindex || false}
            className="w-4 h-4 rounded border-gray-600 bg-[#1A1A1A] text-[#C8A97E] focus:ring-[#C8A97E]/50"
          />
          <label htmlFor="noindex" className="text-sm font-medium text-gray-300">
            Hide from Search Engines (noindex)
          </label>
        </div>
      </div>
    </div>
  )
}
