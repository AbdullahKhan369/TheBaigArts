import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Fails loudly at dev-time rather than silently breaking every query later.
  console.error(
    'Missing Supabase environment variables. Copy .env.example to .env.local and fill in your project values.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Painting images bucket name — kept as a single constant so it's never
// duplicated/typo'd across upload, delete, and read call sites.
export const PAINTINGS_BUCKET = 'paintings'

/**
 * Returns the plain public URL for an image already in Supabase Storage.
 *
 * NOTE: this deliberately does NOT use Supabase Storage's on-the-fly image
 * transformation/resize feature — that requires a paid plan, and requesting
 * it on a Free-tier project silently fails (broken image icons everywhere,
 * no console error). Plain public URLs work identically on every plan.
 * The `width` param is accepted for API-compatibility with existing call
 * sites but is currently unused; if you upgrade to Pro later and want real
 * server-side resizing back, re-add the `transform` option here.
 */
export function getTransformedImageUrl(path, _options = {}) {
  if (!path) return null
  const { data } = supabase.storage.from(PAINTINGS_BUCKET).getPublicUrl(path)
  return data?.publicUrl ?? null
}
