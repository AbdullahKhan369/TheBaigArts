import { compressImage } from '../lib/imageCompression'
import { useCallback, useEffect, useState } from 'react'
import { supabase, PAINTINGS_BUCKET } from '../lib/supabaseClient'
import { slugify, withUniqueSuffix } from '../lib/slugify'

/**
 * Fetches paintings with optional filters. Used by public gallery/home and admin list.
 * filters: { status, featuredOnly }
 */
export function usePaintings(filters = {}) {
  const [paintings, setPaintings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPaintings = useCallback(async () => {
    setLoading(true)
    setError(null)
    let query = supabase.from('paintings').select('*').order('created_at', { ascending: false })

    if (filters.status) query = query.eq('status', filters.status)
    if (filters.featuredOnly) query = query.eq('is_featured', true)
    if (filters.category) query = query.eq('category', filters.category)

    const { data, error: fetchError } = await query
    if (fetchError) setError(fetchError.message)
    else setPaintings(data ?? [])
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.featuredOnly, filters.category])

  useEffect(() => {
    fetchPaintings()
  }, [fetchPaintings])

  return { paintings, loading, error, refetch: fetchPaintings }
}

export function usePaintingBySlug(slug) {
  const [painting, setPainting] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    supabase
      .from('paintings')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()
      .then(({ data, error: fetchError }) => {
        if (fetchError) setError(fetchError.message)
        else setPainting(data)
        setLoading(false)
      })
  }, [slug])

  return { painting, loading, error }
}

/** Generates a unique slug by checking for collisions in the DB before insert. */
async function generateUniqueSlug(title) {
  const base = slugify(title)
  const { data } = await supabase.from('paintings').select('id').eq('slug', base).maybeSingle()
  return data ? withUniqueSuffix(base) : base
}

export async function createPainting(paintingData) {
  const slug = await generateUniqueSlug(paintingData.title)
  const { data, error } = await supabase
    .from('paintings')
    .insert([{ ...paintingData, slug }])
    .select()
    .single()
  return { data, error }
}

export async function updatePainting(id, paintingData) {
  const { data, error } = await supabase
    .from('paintings')
    .update(paintingData)
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

export async function deletePainting(painting) {
  const { error } = await supabase.from('paintings').delete().eq('id', painting.id)
  if (error) return { error }

  // DB record delete hone ke baad ab Storage se bhi iski images hata do —
  // warna har delete ki gayi painting apni photos hamesha ke liye "orphan"
  // chhod jati thi jo bucket mein pari rehti thi.
  if (painting.image_urls?.length) {
    await supabase.storage.from(PAINTINGS_BUCKET).remove(painting.image_urls)
  }

  return { error: null }
}

/** Uploads a single image file to Storage and returns its storage path (not full URL). */
export async function uploadPaintingImage(file) {
  const uploadFile = await compressImage(file)
  const path = `${crypto.randomUUID()}.jpg`
  const { error } = await supabase.storage.from(PAINTINGS_BUCKET).upload(path, uploadFile, {
    cacheControl: '31536000',
    upsert: false,
    contentType: 'image/jpeg',
  })
  if (error) return { path: null, error }
  return { path, error: null }
}

export async function deletePaintingImage(path) {
  const { error } = await supabase.storage.from(PAINTINGS_BUCKET).remove([path])
  return { error }
}
