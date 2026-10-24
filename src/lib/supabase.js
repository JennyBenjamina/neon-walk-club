import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// When the env vars aren't set yet, the site still runs using the built-in
// fallback content in src/data/fallback.js, and forms explain they aren't connected.
export const supabase = url && key ? createClient(url, key) : null
export const isSupabaseConfigured = Boolean(supabase)

export const GALLERY_BUCKET = 'gallery'

export function photoUrl(path) {
  if (!path) return null
  if (/^https?:\/\//.test(path) || path.startsWith('/')) return path
  if (!supabase) return null
  return supabase.storage.from(GALLERY_BUCKET).getPublicUrl(path).data.publicUrl
}
