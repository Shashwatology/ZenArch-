'use client'

import { useState } from 'react'
import { updateHomepageContent } from './actions'

export function ContentForm({ initialContent }: { initialContent: any }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    const res = await updateHomepageContent(formData)
    
    if (res.error) {
      setError(res.error)
    } else {
      setSuccess('Content updated successfully. Changes are now live.')
      setTimeout(() => setSuccess(null), 3000)
    }
    setLoading(false)
  }

  const content = initialContent?.content || {}

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

      {/* 1. Hero Section */}
      <div className="bg-[#1E1E1E] border border-white/5 p-6 rounded-xl space-y-6">
        <h3 className="text-lg font-medium text-white border-b border-white/5 pb-4">Hero Section</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Headline</label>
            <input type="text" name="heroHeadline" defaultValue={initialContent?.heroCopy || "Silence & Form"} className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C8A97E]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Subheadline</label>
            <textarea name="heroSubheadline" rows={2} defaultValue={content.heroSubheadline || "Japanese minimalism meets brutalist architecture. Crafting spaces that breathe."} className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C8A97E]" />
          </div>
        </div>
      </div>

      {/* 2. AI Section */}
      <div className="bg-[#1E1E1E] border border-white/5 p-6 rounded-xl space-y-6">
        <h3 className="text-lg font-medium text-white border-b border-white/5 pb-4">Experience Lab (AI)</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Headline</label>
            <input type="text" name="aiHeadline" defaultValue={content.aiHeadline || "Intelligent Curation"} className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C8A97E]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Body Text</label>
            <textarea name="aiBody" rows={3} defaultValue={content.aiBody || "Upload a photo of your space and our spatial intelligence will analyze the DNA of your room to recommend the perfect brutalist pieces."} className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C8A97E]" />
          </div>
        </div>
      </div>

      {/* 3. Studio Content */}
      <div className="bg-[#1E1E1E] border border-white/5 p-6 rounded-xl space-y-6">
        <h3 className="text-lg font-medium text-white border-b border-white/5 pb-4">The Studio</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Headline</label>
            <input type="text" name="studioHeadline" defaultValue={content.studioHeadline || "The Philosophy"} className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C8A97E]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Philosophy Text</label>
            <textarea name="studioBody" rows={4} defaultValue={content.studioBody || "We believe that space shapes thought. By stripping away the unnecessary and embracing raw materials, we create environments that foster clarity and calm."} className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C8A97E]" />
          </div>
        </div>
      </div>

      <div className="bg-[#121212] border border-[#C8A97E]/30 p-4 rounded-xl text-sm text-[#C8A97E]/80">
        <strong>Note:</strong> Sections like "Featured Products", "Best Sellers", "Services", and "Featured Projects" are populated dynamically based on their respective settings in the <a href="/admin/merchandising" className="underline text-[#C8A97E]">Merchandising</a> and Projects tabs.
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#C8A97E] hover:bg-[#b5956a] text-black px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Publish Content'}
        </button>
      </div>
    </form>
  )
}
