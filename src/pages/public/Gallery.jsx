import { useMemo, useState } from 'react'
import { usePaintings } from '../../hooks/usePaintings'
import PaintingGallery from '../../components/painting/PaintingGallery'
import { PaintingGallerySkeleton } from '../../components/painting/PaintingCardSkeleton'
import PublicLayout from '../../components/layout/PublicLayout'
import SEO from '../../components/layout/SEO'

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'available', label: 'Available' },
  { value: 'sold', label: 'Sold' },
]

function FilterPill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`wall-label relative px-3 py-2 transition-all duration-200 ${
        active ? 'text-brass' : 'text-ivory-dim hover:text-ivory'
      }`}
    >
      {children}
      <span
        className={`absolute inset-x-3 -bottom-px h-px bg-brass transition-transform duration-300 origin-left ${
          active ? 'scale-x-100' : 'scale-x-0'
        }`}
      />
    </button>
  )
}

export default function Gallery() {
  const [status, setStatus] = useState('')
  const { paintings, loading } = usePaintings(status ? { status } : {})

  const categories = useMemo(
    () => [...new Set(paintings.map((p) => p.category).filter(Boolean))],
    [paintings]
  )
  const [category, setCategory] = useState('')

  const filtered = useMemo(
    () => (category ? paintings.filter((p) => p.category === category) : paintings),
    [paintings, category]
  )

  const filtersActive = status !== '' || category !== ''

  function clearFilters() {
    setStatus('')
    setCategory('')
  }

  return (
    <PublicLayout>
      <SEO
        title="Gallery"
        description="Browse all original paintings by The Baigarts — available and sold pieces, with prices, dimensions, and medium."
        path="/gallery"
      />

      <section className="mx-auto max-w-6xl px-6 pt-16 pb-8">
        <p className="wall-label text-brass">Full Collection</p>
        <h1 className="mt-4 font-display text-3xl text-ivory sm:text-4xl">Gallery</h1>

        <div className="mt-10 space-y-5 border-b border-line pb-6">
          {/* Status filter — its own clearly-labeled row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="wall-label text-ivory-dim/50 w-20 shrink-0">Status</span>
            <div className="flex flex-wrap gap-1">
              {STATUS_FILTERS.map((f) => (
                <FilterPill key={f.value} active={status === f.value} onClick={() => setStatus(f.value)}>
                  {f.label}
                </FilterPill>
              ))}
            </div>
          </div>

          {/* Category filter — separate row, separate axis, no shared "All" */}
          {categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="wall-label text-ivory-dim/50 w-20 shrink-0">Category</span>
              <div className="flex flex-wrap gap-1">
                <FilterPill active={category === ''} onClick={() => setCategory('')}>
                  All
                </FilterPill>
                {categories.map((c) => (
                  <FilterPill key={c} active={category === c} onClick={() => setCategory(c)}>
                    {c}
                  </FilterPill>
                ))}
              </div>
            </div>
          )}

          {filtersActive && (
            <button
              onClick={clearFilters}
              className="wall-label text-ivory-dim/60 underline decoration-dotted underline-offset-4 hover:text-brass"
            >
              Clear Filters
            </button>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        {loading ? <PaintingGallerySkeleton /> : <PaintingGallery paintings={filtered} />}
      </section>
    </PublicLayout>
  )
}