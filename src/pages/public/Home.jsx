import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePaintings } from '../../hooks/usePaintings'
import PaintingGallery from '../../components/painting/PaintingGallery'
import { PaintingGallerySkeleton } from '../../components/painting/PaintingCardSkeleton'
import PublicLayout from '../../components/layout/PublicLayout'
import SEO from '../../components/layout/SEO'
import HeroVideo from '../../components/layout/HeroVideo'
import { GALLERY_READY_EVENT, SESSION_KEY } from '../../components/layout/IntroCurtain'
import Button from '../../components/ui/Button'

// Cascading reveal timings (ms) — each hero element arrives slightly after
// the previous one, wave-style, instead of the whole block fading in at once.
const STEPS = {
  eyebrow: 2200,
  heading:3100 ,
  paragraph:4000 ,
  line: 5190,
  buttons:6000 ,
}

function RevealItem({ show, delay, className = '', children }) {
  return (
    <div
      className={`transition-all duration-700 ease-out ${
        show ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-4 opacity-0 blur-sm'
      } ${className}`}
      style={{ transitionDelay: show ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}

export default function Home() {
  const { paintings, loading } = usePaintings({ featuredOnly: true })
  const [textVisible, setTextVisible] = useState(false)

   useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const alreadySeen = sessionStorage.getItem(SESSION_KEY)
    if (reducedMotion || alreadySeen) {
      setTextVisible(true)
      return
    }

    function handleReady() {
      setTextVisible(true)
    }

    window.addEventListener(GALLERY_READY_EVENT, handleReady)
    return () => window.removeEventListener(GALLERY_READY_EVENT, handleReady)
  }, [])

  return (
    <PublicLayout>
      <SEO
        title="Original Handmade Paintings"
        description="THE BAIGARTS — original handmade paintings by a Pakistan-based artist. Browse the gallery and request your piece directly."
        path="/"
      />

      {/* Hero — full-length intro video plays once behind the text */}
      <div className="relative overflow-hidden">
        <HeroVideo />
        <section className="relative mx-auto max-w-6xl px-6 pt-16 pb-20 sm:pt-24">
          <RevealItem show={textVisible} delay={STEPS.eyebrow}>
            <p className="wall-label text-brass">Original — Handmade — One of a Kind</p>
          </RevealItem>

          <RevealItem show={textVisible} delay={STEPS.heading} className="mt-6 max-w-2xl">
            <h1 className="font-display text-4xl leading-[1.1] text-ivory sm:text-6xl">
              Paintings that hold a room's silence.
            </h1>
          </RevealItem>

          <RevealItem show={textVisible} delay={STEPS.paragraph} className="mt-6 max-w-md">
            <p className="text-ivory-dim">
              Every piece here is hand-painted, singular, and made to live somewhere for a very
              long time. Once a painting sells, it does not come back.
            </p>
          </RevealItem>

          <RevealItem show={textVisible} delay={STEPS.line} className="mt-8">
            <span className="block h-px w-16 bg-gradient-to-r from-brass via-brass-bright to-transparent" />
          </RevealItem>

          <RevealItem show={textVisible} delay={STEPS.buttons} className="mt-8">
            <div className="flex flex-wrap gap-4">
              <Link to="/gallery">
                <Button variant="primary">View the Gallery</Button>
              </Link>
              <Link to="/about">
                <Button variant="outline">The Artist</Button>
              </Link>
            </div>
          </RevealItem>
        </section>
      </div>

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