import { Link } from 'react-router-dom'
import { usePaintings } from '../../hooks/usePaintings'
import PaintingGallery from '../../components/painting/PaintingGallery'
import { PaintingGallerySkeleton } from '../../components/painting/PaintingCardSkeleton'
import PublicLayout from '../../components/layout/PublicLayout'
import SEO from '../../components/layout/SEO'
import GallerySpotlight from '../../components/layout/GallerySpotlight'
import AmbientGlow from '../../components/layout/AmbientGlow'
import Button from '../../components/ui/Button'

export default function Home() {
  const { paintings, loading } = usePaintings({ featuredOnly: true })

  return (
    <PublicLayout>
      <SEO
        title="Original Handmade Paintings"
        description="THE BAIGARTS — original handmade paintings by a Pakistan-based artist. Browse the gallery and request your piece directly."
        path="/"
      />

      {/* Hero — spotlight follows the cursor, ambient light motes drift continuously */}
      <GallerySpotlight className="overflow-hidden">
        <AmbientGlow />
        <section className="relative mx-auto max-w-6xl px-6 pt-16 pb-20 sm:pt-24">
          <p className="wall-label text-brass">Original — Handmade — One of a Kind</p>
          <h1 className="mt-6 max-w-2xl font-display text-4xl leading-[1.1] text-ivory sm:text-6xl">
            Paintings that hold a room's silence.
          </h1>
          <p className="mt-6 max-w-md text-ivory-dim">
            Every piece here is hand-painted, singular, and made to live somewhere for a very
            long time.Dont Order in bulk the Painting are uniqe.
          </p>
          <span className="mt-8 block h-px animate-draw-line bg-gradient-to-r from-brass via-brass-bright to-transparent" style={{ animationDelay: '0.3s' }} />
          <div className="mt-8 flex gap-4">
            <Link to="/gallery">
              <Button variant="primary">View the Gallery</Button>
            </Link>
            <Link to="/about">
              <Button variant="outline">The Artist</Button>
            </Link>
          </div>
        </section>
      </GallerySpotlight>

      {/* Featured Gallery */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-8 flex items-end justify-between border-b border-line pb-4">
          <h2 className="font-display text-2xl text-ivory">Featured Work</h2>
          <Link to="/gallery" className="wall-label text-ivory-dim hover:text-brass">
            View All →
          </Link>
        </div>

        {loading ? (
          <PaintingGallerySkeleton count={3} />
        ) : (
          <PaintingGallery
            paintings={paintings}
            emptyMessage="Featured paintings will appear here once added from the admin dashboard."
          />
        )}
      </section>

      {/* About teaser */}
      <section className="border-t border-line bg-ink-soft">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="wall-label text-brass">The Artist</p>
          <h2 className="mt-4 max-w-xl font-display text-2xl text-ivory sm:text-3xl">
            Every canvas starts blank, and ends up carrying a small piece of somewhere real.
          </h2>
          <Link to="/about" className="mt-6 inline-block wall-label text-ivory-dim hover:text-brass">
            Read the Story →
          </Link>
        </div>
      </section>
    </PublicLayout>
  )
}
