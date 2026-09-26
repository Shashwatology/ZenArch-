import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export const supabaseAdmin = createClient(supabaseUrl, supabaseKey)

const BUCKET_NAME = 'zenarch_media'

export async function ensureMediaBucket() {
  try {
    await supabaseAdmin.storage.createBucket(BUCKET_NAME, { public: true })
  } catch (e) {
    // Already exists or permission error
  }
}

export async function uploadMedia(file: File, prefix: string = 'general'): Promise<string> {
  await ensureMediaBucket()
  
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const ext = file.name.split('.').pop()
  const fileName = `${prefix}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false
    })

  if (error) {
    console.error("Storage upload error:", error)
    throw new Error("Failed to upload media.")
  }

  const { data: publicUrlData } = supabaseAdmin.storage.from(BUCKET_NAME).getPublicUrl(fileName)
  return publicUrlData.publicUrl
}

export async function deleteMedia(url: string) {
  // Extract path from URL
  try {
    const urlObj = new URL(url)
    const parts = urlObj.pathname.split(`${BUCKET_NAME}/`)
    if (parts.length > 1) {
      const path = parts[1]
      await supabaseAdmin.storage.from(BUCKET_NAME).remove([path])
    }
  } catch (e) {
    console.error('Failed to delete media:', e)
  }
}
