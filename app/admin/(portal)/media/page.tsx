import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

async function uploadMedia(formData: FormData) {
  'use server'
  const file = formData.get('file') as File
  if (!file || file.size === 0) throw new Error('No file provided')
  
  const supabase = await createClient()
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `uploads/${fileName}`

  // Convert File to Buffer/ArrayBuffer
  const arrayBuffer = await file.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)
  
  const { error } = await supabase.storage
    .from('media') // Assumes a 'media' bucket exists
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: true
    })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/media')
}

export default async function AdminMediaPage() {
  const supabase = await createClient()
  
  // List files in the 'media' bucket
  const { data: files, error } = await supabase.storage
    .from('media')
    .list('uploads', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    })

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-light tracking-wider text-white mb-2">Media Library</h2>
        <p className="text-sm text-gray-400">Manage your product and project images</p>
      </div>

      <div className="bg-[#1E1E1E] border border-white/10 rounded-xl overflow-hidden p-6">
        <h3 className="text-lg font-medium text-white mb-4">Upload New Image</h3>
        
        <form action={uploadMedia} className="flex items-center space-x-4">
          <input 
            type="file" 
            name="file" 
            accept="image/*"
            className="block w-full text-sm text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-[#C8A97E]/10 file:text-[#C8A97E]
              hover:file:bg-[#C8A97E]/20 transition-colors cursor-pointer"
          />
          <button 
            type="submit"
            className="bg-[#C8A97E] hover:bg-[#b5956a] text-black px-6 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
          >
            Upload
          </button>
        </form>
      </div>

      <div className="bg-[#1E1E1E] border border-white/10 rounded-xl overflow-hidden p-6">
        <h3 className="text-lg font-medium text-white mb-4">Recent Uploads</h3>
        
        {error ? (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg text-sm">
            Could not fetch media. Ensure the 'media' storage bucket exists in Supabase.
            <br/><br/>
            Error: {error.message}
          </div>
        ) : !files || files.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No media uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {files.map((file) => {
              const { data } = supabase.storage.from('media').getPublicUrl(`uploads/${file.name}`)
              return (
                <div key={file.id} className="group relative aspect-square rounded-lg overflow-hidden bg-[#121212] border border-white/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={data.publicUrl} alt={file.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                    <p className="text-xs text-white text-center break-all">{file.name}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
