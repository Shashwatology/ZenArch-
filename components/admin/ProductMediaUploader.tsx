'use client'

import { useState } from 'react'
import Image from 'next/image'
import { uploadProductImageAction, deleteProductImageAction, setProductCoverImageAction } from '@/lib/actions/media'

export function ProductMediaUploader({ productId, initialImages }: { productId: string, initialImages: any[] }) {
  const [images, setImages] = useState(initialImages)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    
    setUploading(true)
    setError(null)
    
    try {
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append('file', file)
      
      const newImage = await uploadProductImageAction(productId, formData)
      setImages([...images, newImage])
    } catch (err: any) {
      setError(err.message || 'Failed to upload image')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleDelete = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return
    
    setError(null)
    try {
      await deleteProductImageAction(imageId)
      setImages(images.filter(img => img.id !== imageId))
    } catch (err: any) {
      setError(err.message || 'Failed to delete image')
    }
  }

  const handleSetCover = async (imageId: string) => {
    setError(null)
    try {
      await setProductCoverImageAction(productId, imageId)
      setImages(images.map(img => ({ ...img, isCover: img.id === imageId })))
    } catch (err: any) {
      setError(err.message || 'Failed to set cover image')
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Upload Box */}
      <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:bg-white/5 transition-colors cursor-pointer relative">
        <input 
          type="file" 
          accept="image/*" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <div className="space-y-2 pointer-events-none">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="text-sm text-gray-400">
            {uploading ? 'Uploading...' : 'Click or drag image to upload'}
          </div>
        </div>
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {images.map(img => (
            <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group bg-black/50">
              <Image src={img.url} alt="Product Image" fill className="object-cover" unoptimized />
              
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                {!img.isCover && (
                  <button 
                    type="button"
                    onClick={() => handleSetCover(img.id)}
                    className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded"
                  >
                    Set as Cover
                  </button>
                )}
                <button 
                  type="button"
                  onClick={() => handleDelete(img.id)}
                  className="text-xs bg-red-500/20 hover:bg-red-500/40 text-red-300 px-3 py-1.5 rounded"
                >
                  Delete
                </button>
              </div>

              {img.isCover && (
                <span className="absolute top-2 left-2 bg-[#C8A97E] text-black text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                  COVER
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
