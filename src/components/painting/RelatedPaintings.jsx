import { usePaintings } from '../../hooks/usePaintings'
import PaintingCard from './PaintingCard'

/**
 * Shows up to 3 other paintings from the same category, excluding the current one.
 * Falls back to nothing (renders null) if there's no category or nothing else to show —
 * never shows an awkward empty "Related Paintings" heading with no cards under it.
 */
export default function RelatedPaintings({ currentPainting }) {
  const { paintings, loading } = usePaintings(
    currentPainting.category ? { category: currentPainting.category } : {}
  )

  if (loading || !currentPainting.category) return null

  const related = paintings.filter((p) => p.id !== currentPainting.id).slice(0, 3)

  if (related.length === 0) return null

  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-8 flex items-end justify-between border-b border-line pb-4">
          <h2 className="font-display text-2xl text-ivory">More {currentPainting.category}</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {related.map((painting) => (
            <PaintingCard key={painting.id} painting={painting} />
          ))}
        </div>
      </div>
    </section>
  )
}
