import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase, getTransformedImageUrl } from '../../lib/supabaseClient'
import {
  createPainting,
  updatePainting,
  uploadPaintingImage,
  deletePaintingImage,
} from '../../hooks/usePaintings'
import { PAINTING_CATEGORIES } from '../../lib/constants'
import AdminLayout from '../../components/layout/AdminLayout'
import SEO from '../../components/layout/SEO'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'

const emptyForm = {
  title: '',
  description: '',
  price: '',
  dimensions: '',
  medium: '',
  category: '',
  status: 'available',
  is_featured: false,
}

export default function PaintingForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState(emptyForm)
  const [imagePaths, setImagePaths] = useState([]) // storage paths, first = primary
  const [initialImagePaths, setInitialImagePaths] = useState([]) // paths already saved to DB on load
  const [pendingDeletes, setPendingDeletes] = useState([]) // saved paths removed this session — only deleted from storage on actual Save
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    supabase
      .from('paintings')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error: fetchError }) => {
        if (fetchError) {
          setError(fetchError.message)
        } else if (data) {
          setForm({
            title: data.title,
            description: data.description || '',
            price: data.price,
            dimensions: data.dimensions || '',
            medium: data.medium || '',
            category: data.category || '',
            status: data.status,
            is_featured: data.is_featured,
          })
          setImagePaths(data.image_urls || [])
          setInitialImagePaths(data.image_urls || [])
        }
        setLoading(false)
      })
  }, [id, isEdit])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setUploading(true)
    const newPaths = []
    for (const file of files) {
      const { path, error: uploadError } = await uploadPaintingImage(file)
      if (uploadError) {
        setError(`Image upload failed: ${uploadError.message}`)
        continue
      }
      newPaths.push(path)
    }
    setImagePaths((prev) => [...prev, ...newPaths])
    setUploading(false)
  }

  // Removing an image only deletes from Storage immediately if it was uploaded THIS
  // session and was never saved to the DB (nothing references it yet, safe to clean up).
  // If it was already part of the saved painting, we only stage it for deletion —
  // the actual storage delete happens after a successful Save, so hitting Cancel
  // never leaves the saved record pointing at a file that no longer exists.
  function handleRemoveImage(path) {
    setImagePaths((prev) => prev.filter((p) => p !== path))
    if (initialImagePaths.includes(path)) {
      setPendingDeletes((prev) => [...prev, path])
    } else {
      deletePaintingImage(path)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.title.trim()) return setError('Title is required.')
    if (!form.price || Number(form.price) < 0) return setError('Enter a valid price.')
    if (imagePaths.length === 0) return setError('Upload at least one image.')

    setSaving(true)
    const payload = {
      ...form,
      price: Number(form.price),
      image_urls: imagePaths,
    }

    const { error: saveError } = isEdit
      ? await updatePainting(id, payload)
      : await createPainting(payload)

    setSaving(false)

    if (saveError) {
      setError(saveError.message)
      return
    }

    // DB save confirmed — now safe to permanently delete any images the admin
    // removed during this edit. Fire-and-forget: the painting record itself is
    // already correctly saved regardless of whether this cleanup succeeds.
    if (pendingDeletes.length > 0) {
      Promise.all(pendingDeletes.map((path) => deletePaintingImage(path))).catch(() => {})
    }

    navigate('/admin/paintings')
  }

  if (loading) {
    return (
      <AdminLayout>
        <Spinner label="Loading painting" />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <SEO title={isEdit ? 'Edit Painting' : 'New Painting'} description="Admin painting form." noIndex />
      <h1 className="font-display text-2xl text-ink">{isEdit ? 'Edit Painting' : 'New Painting'}</h1>

      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-6">
        {error && <div className="border border-sold bg-sold/10 px-4 py-3 text-sm text-sold">{error}</div>}

        <Input theme="light" label="Title" required value={form.title} onChange={(e) => update('title', e.target.value)} />

        <div className="grid grid-cols-2 gap-5">
          <Input
            theme="light"
            label="Price (PKR)"
            type="number"
            min="0"
            required
            value={form.price}
            onChange={(e) => update('price', e.target.value)}
          />
          <Input theme="light" label="Dimensions" placeholder='e.g. 24 x 36 in' value={form.dimensions} onChange={(e) => update('dimensions', e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <Input theme="light" label="Medium" placeholder="e.g. Oil on canvas" value={form.medium} onChange={(e) => update('medium', e.target.value)} />
          <Select
            theme="light"
            label="Category"
            options={PAINTING_CATEGORIES}
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
          />
        </div>

        <Input theme="light" label="Description" textarea value={form.description} onChange={(e) => update('description', e.target.value)} />

        <div className="flex items-center gap-8">
          <label className="flex items-center gap-2 text-sm text-ink">
            <span className="wall-label text-ink/60">Status</span>
            <select
              value={form.status}
              onChange={(e) => update('status', e.target.value)}
              className="border border-line-light bg-white px-3 py-2"
            >
              <option value="available">Available</option>
              <option value="sold">Sold</option>
            </select>
          </label>

          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => update('is_featured', e.target.checked)}
            />
            <span className="wall-label text-ink/60">Featured on home page</span>
          </label>
        </div>

        <div>
          <span className="wall-label mb-2 block text-ink/60">Images</span>
          <div className="flex flex-wrap gap-3">
            {imagePaths.map((path) => (
              <div key={path} className="relative">
                <img
                  src={getTransformedImageUrl(path, { width: 120 })}
                  alt="Uploaded painting"
                  className="h-24 w-24 object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(path)}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-sold text-xs text-white"
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
            <label className="flex h-24 w-24 cursor-pointer items-center justify-center border border-dashed border-line-light text-xs text-ink/50 hover:border-brass">
              {uploading ? '...' : '+ Add'}
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} />
            </label>
          </div>
          <p className="mt-2 text-xs text-ink/50">First image is used as the cover/thumbnail everywhere.</p>
        </div>

        <div className="flex gap-4 pt-2">
          <Button type="submit" variant="dark" loading={saving}>
            {isEdit ? 'Save Changes' : 'Create Painting'}
          </Button>
          <Button type="button" variant="ghostLight" onClick={() => navigate('/admin/paintings')}>
            Cancel
          </Button>
        </div>
      </form>
    </AdminLayout>
  )
}
