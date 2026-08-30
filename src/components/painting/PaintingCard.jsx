import { Link } from 'react-router-dom'
import { getTransformedImageUrl } from '../../lib/supabaseClient'
import Badge from '../ui/Badge'

export default function PaintingCard({ painting, priority = false }) {
  const cover = getTransformedImageUrl(painting.image_urls?.[0], { width: 640 })

  return (
    <Link
      to={`/painting/${painting.slug}`}
      className="group block break-inside-avoid"
    >
      <div className="relative overflow-hidden border border-line bg-ink-soft transition-shadow duration-300 group-hover:shadow-[0_25px_50px_-25px_rgba(0,0,0,0.7)]">
        {cover ? (
          <img
            src={cover}
            alt={`${painting.title} — ${painting.medium || 'painting'} by The Baigarts`}
            loading={priority ? 'eager' : 'lazy'}
            fetchpriority={priority ? 'high' : 'auto'}
            className="block h-auto max-h-[480px] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="aspect-[4/5] w-full bg-ink-soft" />
        )}

        {painting.status === 'sold' && (
          <Badge tone="sold" className="absolute left-3 top-3">
            Sold
          </Badge>
        )}
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base text-ivory">{painting.title}</h3>
          <p className="wall-label mt-1">{painting.medium || 'Mixed media'}</p>
        </div>
        <p className="whitespace-nowrap font-display text-sm text-brass">
          Rs. {Number(painting.price).toLocaleString('en-PK')}
        </p>
      </div>
    </Link>
  )
}