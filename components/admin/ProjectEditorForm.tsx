'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { upsertProject } from '@/app/admin/(portal)/projects/actions'

export function ProjectEditorForm({ project }: { project: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const isNew = project.id === 'new'

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    formData.append('id', project.id)
    const res = await upsertProject(formData)
    
    if (res?.error) {
      setError(res.error)
    } else {
      setSuccess('Project saved successfully.')
      if (isNew && res.project) {
        router.push(`/admin/projects/${res.project.id}`)
      } else {
        router.refresh()
      }
    }
    setLoading(false)
  }

  return (
    <form action={handleSubmit} className="space-y-8 max-w-4xl">
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

      <div className="bg-[#1E1E1E] border border-white/5 p-6 rounded-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Project Name</label>
            <input type="text" name="name" defaultValue={project.name || ''} required className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C8A97E]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Slug</label>
            <input type="text" name="slug" defaultValue={project.slug || ''} required className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C8A97E]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Location</label>
            <input type="text" name="location" defaultValue={project.location || ''} className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C8A97E]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Year</label>
            <input type="number" name="year" defaultValue={project.year || new Date().getFullYear()} className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C8A97E]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Category</label>
            <input type="text" name="category" defaultValue={project.category || ''} placeholder="e.g. Commercial HQ" className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C8A97E]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Status</label>
            <select name="status" defaultValue={project.status} className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C8A97E]">
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Description</label>
          <textarea name="description" defaultValue={project.description || ''} rows={4} className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C8A97E]"></textarea>
        </div>
      </div>

      {!isNew && (
        <div className="bg-[#1E1E1E] border border-white/5 p-6 rounded-xl space-y-6">
          <h3 className="text-lg font-medium text-white mb-4">Project Gallery</h3>
          <p className="text-sm text-gray-400 mb-4">
            Upload images for this project. Use the centralized Media Manager or project-specific upload (coming soon).
          </p>
          {/* We will embed ProjectMediaUploader here later if needed */}
          <div className="bg-[#121212] p-4 rounded-lg border border-white/5 text-sm text-gray-500 text-center">
            [ Project Media Upload Coming Soon. Use Media Manager for now. ]
          </div>
        </div>
      )}

      <div className="flex justify-end pt-4 gap-4">
        <button
          type="button"
          onClick={() => router.push('/admin/projects')}
          className="px-6 py-2 rounded-lg font-medium text-white hover:bg-white/5 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#C8A97E] hover:bg-[#b5956a] text-black px-8 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Project'}
        </button>
      </div>
    </form>
  )
}
