import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { usePaintingBySlug } from '../../hooks/usePaintings'
import { getTransformedImageUrl } from '../../lib/supabaseClient'
import PaintingPreview from '../../components/painting/PaintingPreview'
import RelatedPaintings from '../../components/painting/RelatedPaintings'
import PublicLayout from '../../components/layout/PublicLayout'
import SEO from '../../components/layout/SEO'
import Spinner from '../../components/ui/Spinner'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import NotFound from './NotFound'

export default function PaintingDetail() {
  const { slug } = useParams()
  const { painting, loading, error } = usePaintingBySlug(slug)
  const [activeImage, setActiveImage] = useState(0)

  // Reset to the first image whenever we land on a different painting.
  useEffect(() => {
    setActiveImage(0)
  }, [slug])

  if (loading) {
    return (
      <PublicLayout>
        <Spinner label="Loading painting" />
      </PublicLayout>
    )
  }

  if (error || !painting) return <NotFound />

  const allImages = painting.image_urls || []
  const heroImage = getTransformedImageUrl(allImages[activeImage] ?? allImages[0], { width: 1200 })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: painting.title,
    description: painting.description,
    image: heroImage,
    sku: painting.id,
    offers: {
      '@type': 'Offer',
      priceCurrency: painting.currency || 'PKR',
      price: painting.price,
      availability:
        painting.status === 'available'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
  }

  return (
    <PublicLayout>
      <SEO
        title={painting.title}
        description={
          painting.description?.slice(0, 155) ||
          `${painting.title} — original ${painting.medium || 'painting'} by The Baigarts.`
        }
        path={`/painting/${painting.slug}`}
        image={heroImage}
        jsonLd={jsonLd}
      />

      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <nav className="wall-label mb-8 text-ivory-dim">
          <Link to="/gallery" className="hover:text-brass">Gallery</Link>
          <span className="mx-2">/</span>
          <span className="text-ivory">{painting.title}</span>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            {heroImage && <PaintingPreview src={heroImage} alt={`${painting.title} by The Baigarts`} />}

            {allImages.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {allImages.map((img, i) => (
                  <button
                    key={img}
                    onClick={() => setActiveImage(i)}
                    className={`aspect-square overflow-hidden border-2 transition-colors ${
                      i === activeImage ? 'border-brass' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                    aria-label={`View image ${i + 1} of ${painting.title}`}
                  >
                    <img
                      src={getTransformedImageUrl(img, { width: 200 })}
                      alt={`${painting.title} — view ${i + 1}`}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            {painting.status === 'sold' && <Badge tone="sold" className="mb-4">Sold</Badge>}
            {painting.is_featured && painting.status !== 'sold' && (
              <Badge tone="available" className="mb-4">Featured</Badge>
            )}

            <h1 className="font-display text-3xl text-ivory sm:text-4xl">{painting.title}</h1>
            <p className="mt-3 font-display text-2xl text-brass">
              Rs. {Number(painting.price).toLocaleString('en-PK')}
            </p>

            {painting.description && (
              <p className="mt-6 leading-relaxed text-ivory-dim">{painting.description}</p>
            )}

            {/* Museum wall-label metadata block — the signature detail */}
            <dl className="mt-8 space-y-3 border-t border-line pt-6">
              {painting.medium && (
                <div className="flex justify-between">
                  <dt className="wall-label">Medium</dt>
                  <dd className="text-sm text-ivory">{painting.medium}</dd>
                </div>
              )}
              {painting.dimensions && (
                <div className="flex justify-between">
                  <dt className="wall-label">Dimensions</dt>
                  <dd className="text-sm text-ivory">{painting.dimensions}</dd>
                </div>
              )}
              {painting.category && (
                <div className="flex justify-between">
                  <dt className="wall-label">Category</dt>
                  <dd className="text-sm text-ivory">{painting.category}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="wall-label">Status</dt>
                <dd className="text-sm text-ivory capitalize">{painting.status}</dd>
              </div>
            </dl>

            <div className="mt-10">
              {painting.status === 'available' ? (
                <Link to={`/order/${painting.slug}`}>
                  <Button variant="primary">Order This Painting</Button>
                </Link>
              ) : (
                <div>
                  <p className="mb-4 text-sm text-ivory-dim">
                    This piece has found its home. Browse other available paintings below.
                  </p>
                  <Link to="/gallery">
                    <Button variant="outline">Browse Available Paintings</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <RelatedPaintings currentPainting={painting} />
    </PublicLayout>
  )
}
