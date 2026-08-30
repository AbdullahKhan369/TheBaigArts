import PaintingCard from './PaintingCard'
import EmptyState from '../ui/EmptyState'
import Reveal from '../ui/Reveal'

/**
 * Responsive masonry-ish grid via CSS columns — no library needed.
 * Same PaintingCard used everywhere paintings are listed (home + gallery + admin preview).
 * Each card fades up into view on scroll via Reveal, with a small stagger.
 */
export default function PaintingGallery({ paintings, emptyMessage = 'No paintings to show yet.' }) {
  if (!paintings || paintings.length === 0) {
    return <EmptyState title="Nothing here yet" message={emptyMessage} />
  }

  return (
    <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
      {paintings.map((painting, i) => (
        <Reveal key={painting.id} delay={(i % 6) * 80} className="mb-6">
          <PaintingCard painting={painting} priority={i < 2} />
        </Reveal>
      ))}
    </div>
  )
}
