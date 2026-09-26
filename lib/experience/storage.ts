import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);
const BUCKET_NAME = 'experience_lab';

export async function uploadExperienceImage(base64: string, mimeType: string, prefix: string = 'rooms'): Promise<string> {
  // ensure bucket exists or fails gracefully
  try {
    await supabase.storage.createBucket(BUCKET_NAME, { public: false });
  } catch (e) {
    // ignore
  }

  // base64 to Buffer
  let dataToUpload = base64;
  if (base64.startsWith('data:')) {
    const matches = base64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (matches) {
      dataToUpload = matches[2];
    }
  }

  const buffer = Buffer.from(dataToUpload, 'base64');
  const fileName = `${prefix}/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;

  const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(fileName, buffer, {
    contentType: mimeType || 'image/jpeg',
    upsert: false
  });

  if (error) {
    console.error("Storage upload error:", error);
    throw new Error("Failed to upload image securely.");
  }

  return fileName;
}

export async function getExperienceImageSignedUrl(path: string, expiresIn: number = 3600): Promise<string> {
  if (!path) return '';
  const { data, error } = await supabase.storage.from(BUCKET_NAME).createSignedUrl(path, expiresIn);
  if (error || !data) {
    return '';
  }
  return data.signedUrl;
}
