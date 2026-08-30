import { useParams, Link } from 'react-router-dom'
import { usePaintingBySlug } from '../../hooks/usePaintings'
import { getTransformedImageUrl } from '../../lib/supabaseClient'
import OrderForm from '../../components/order/OrderForm'
import PublicLayout from '../../components/layout/PublicLayout'
import SEO from '../../components/layout/SEO'
import Spinner from '../../components/ui/Spinner'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import NotFound from './NotFound'

export default function Order() {
  const { slug } = useParams()
  const { painting, loading, error } = usePaintingBySlug(slug)

  if (loading) {
    return (
      <PublicLayout>
        <Spinner label="Loading" />
      </PublicLayout>
    )
  }

  if (error || !painting) return <NotFound />

  const thumb = getTransformedImageUrl(painting.image_urls?.[0], { width: 200 })

  return (
    <PublicLayout>
      <SEO title={`Order — ${painting.title}`} description="Request to order a painting from The Baigarts." path={`/order/${painting.slug}`} noIndex />

      <section className="mx-auto max-w-2xl px-6 py-12 sm:py-16">
        <nav className="wall-label mb-8 text-ivory-dim">
          <Link to={`/painting/${painting.slug}`} className="hover:text-brass">{painting.title}</Link>
          <span className="mx-2">/</span>
          <span className="text-ivory">Order</span>
        </nav>

        <h1 className="font-display text-3xl text-ivory">Request This Painting</h1>

        {/* Read-only painting identity block — customer can never be confused what they're ordering */}
        <div className="mt-6 flex items-center gap-4 border border-line bg-ink-soft p-4">
          {thumb && <img src={thumb} alt={painting.title} className="h-20 w-20 object-cover" />}
          <div className="flex-1">
            <p className="font-display text-lg text-ivory">{painting.title}</p>
            <p className="wall-label mt-1">{painting.medium}</p>
          </div>
          <p className="font-display text-lg text-brass">
            Rs. {Number(painting.price).toLocaleString('en-PK')}
          </p>
        </div>

        {painting.status === 'sold' ? (
          <div className="mt-8 border border-sold bg-sold/10 p-6 text-center">
            <Badge tone="sold" className="mb-3">Sold</Badge>
            <p className="text-sm text-ivory">
              This painting has already been sold and can no longer be ordered.
            </p>
            <Link to="/gallery" className="mt-4 inline-block">
              <Button variant="outline">Browse Available Paintings</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-8">
            <OrderForm painting={painting} />
          </div>
        )}
      </section>
    </PublicLayout>
  )
}
