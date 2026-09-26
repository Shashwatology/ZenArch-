'use client'

import { useState } from 'react'
import { uploadGeneralMediaAction, deleteGeneralMediaAction } from '@/lib/actions/media'

export default function AdminMediaPage() {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFiles(Array.from(e.target.files))
    }
  }

  const processFiles = async (fileList: File[]) => {
    setUploading(true)
    try {
      for (const file of fileList) {
        const formData = new FormData()
        formData.append('file', file)
        const publicUrl = await uploadGeneralMediaAction(formData)
        
        setFiles(prev => [{
          id: Math.random().toString(),
          name: file.name,
          size: file.size,
          type: file.type,
          url: publicUrl,
          progress: 100,
          storageState: 'UPLOADED'
        }, ...prev])
      }
    } catch (e: any) {
      console.error(e)
      alert(e.message || 'Failed to upload media')
    }
    setUploading(false)
  }

  const removeFile = async (id: string, url: string) => {
    if (!confirm('Are you sure you want to delete this media?')) return
    try {
      await deleteGeneralMediaAction(url)
      setFiles(files.filter(f => f.id !== id))
    } catch (e: any) {
      alert(e.message || 'Failed to delete media')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-light tracking-wider text-white mb-2">Media Manager</h2>
        <p className="text-sm text-gray-400">Centralized object storage for ZEN ARCH media assets</p>
      </div>

      <div 
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
          isDragging ? 'border-[#C8A97E] bg-[#C8A97E]/5' : 'border-white/10 bg-[#1E1E1E]'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <svg className="w-12 h-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <div className="text-sm text-gray-400">
            {uploading ? (
              <span className="text-[#C8A97E] animate-pulse">Uploading...</span>
            ) : (
              <>
                <span className="font-medium text-white">Drag and drop</span> files here, or{' '}
                <label className="text-[#C8A97E] cursor-pointer hover:underline">
                  browse
                  <input type="file" multiple className="hidden" onChange={handleFileSelect} accept="image/*,model/gltf-binary,model/gltf+json,model/vnd.usdz+zip" disabled={uploading} />
                </label>
              </>
            )}
          </div>
          <p className="text-xs text-gray-500">Supports JPG, PNG, WEBP, GLB, GLTF, USDZ (Max 50MB)</p>
        </div>
      </div>

      <div className="bg-[#1E1E1E] border border-white/10 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-sm font-medium text-white">Recent Uploads</h3>
          <span className="text-xs text-gray-500">Storage Bucket: zenarch_media</span>
        </div>
        
        {files.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No media files uploaded yet in this session.
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {files.map(file => (
              <li key={file.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded bg-black overflow-hidden flex-shrink-0 relative">
                    {file.type.startsWith('image/') ? (
                      <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs font-bold bg-white/5">3D</div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white truncate max-w-xs">{file.name}</span>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                      <span>{(file.size / 1024).toFixed(1)} KB</span>
                      <span>•</span>
                      <span>{file.type || 'Unknown type'}</span>
                      <span>•</span>
                      <span className="text-green-400">Stored (Supabase)</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col space-y-2">
                    <button className="text-xs text-gray-400 hover:text-white" onClick={() => { navigator.clipboard.writeText(file.url); alert('URL copied') }}>Copy URL</button>
                  </div>
                  <button onClick={() => removeFile(file.id, file.url)} className="text-gray-500 hover:text-red-400 transition-colors p-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
