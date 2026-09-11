import { useEffect, useState } from 'react'

const SESSION_KEY = 'baigarts_intro_seen'
export const ENTER_GALLERY_EVENT = 'baigarts:enter-gallery'
export const GALLERY_READY_EVENT = 'baigarts:gallery-ready'

export default function IntroCurtain() {
  // Decided synchronously, before the first paint — this must NOT live
  // inside a useEffect, otherwise the curtain briefly returns nothing on
  // mount and the hero page underneath flashes through for a frame or two.
  const [shouldShow] = useState(() => {
    const alreadySeen = sessionStorage.getItem(SESSION_KEY)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return !alreadySeen && !reducedMotion
  })

  const [contentReady, setContentReady] = useState(false)
  const [opening, setOpening] = useState(false)
  const [done, setDone] = useState(!shouldShow)

  useEffect(() => {
    if (!shouldShow) {
      window.dispatchEvent(new Event(GALLERY_READY_EVENT))
      return
    }
    sessionStorage.setItem(SESSION_KEY, '1')
    const t = setTimeout(() => setContentReady(true), 250)
    return () => clearTimeout(t)
  }, [shouldShow])

  function enter() {
    window.dispatchEvent(new Event(ENTER_GALLERY_EVENT))
    window.dispatchEvent(new Event(GALLERY_READY_EVENT))
    setOpening(true)
    setTimeout(() => setDone(true), 800)
  }

  if (done) return null

  return (
    <div className="fixed inset-0 z-[100]" role="presentation" aria-hidden="true">
      {/* These two panels render immediately on first paint — full opaque
          cover from the very first frame, no gap where the hero can show through. */}
      <div
        className="absolute inset-y-0 left-0 w-1/2 bg-ink transition-transform duration-[800ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
        style={{
          transform: opening ? 'translateX(-100%)' : 'translateX(0)',
          borderRight: '1px solid var(--color-brass)',
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-1/2 bg-ink transition-transform duration-[800ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
        style={{
          transform: opening ? 'translateX(100%)' : 'translateX(0)',
          borderLeft: '1px solid var(--color-brass)',
        }}
      />

      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-6 transition-opacity duration-300"
        style={{ opacity: opening ? 0 : 1 }}
      >
        <div
          className={`flex flex-col items-center gap-4 transition-opacity duration-500 ${
            contentReady ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className="font-display text-2xl tracking-[0.35em] text-ivory sm:text-3xl">
            THE BAIGARTS
          </p>
          <span className="h-px w-16 bg-brass" />
        </div>

        <button
          onClick={enter}
          className={`wall-label border border-brass/60 px-6 py-3 text-brass transition-opacity duration-500 hover:bg-brass hover:text-ink ${
            contentReady ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          Enter the Gallery
        </button>
      </div>
    </div>
  )
}