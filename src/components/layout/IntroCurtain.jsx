import { useEffect, useState } from 'react'

export const SESSION_KEY = 'baigarts_intro_seen'
export const ENTER_GALLERY_EVENT = 'baigarts:enter-gallery'
// Separate from the audio-gesture event — this one always fires, whether
// the curtain shows or not, so Home.jsx has one reliable signal for when
// to start the hero-text reveal.
export const GALLERY_READY_EVENT = 'baigarts:gallery-ready'

export default function IntroCurtain() {
  const [phase, setPhase] = useState('idle') // idle | waiting | opening | done

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem(SESSION_KEY)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (alreadySeen || reducedMotion) {
      setPhase('done')
      // No curtain to wait for — tell Home.jsx the hero is ready right away.
      window.dispatchEvent(new Event(GALLERY_READY_EVENT))
      return
    }

    sessionStorage.setItem(SESSION_KEY, '1')
    const t1 = setTimeout(() => setPhase('waiting'), 250)
    return () => clearTimeout(t1)
  }, [])

  function enter() {
    // Real user click — safe to request audio here.
    window.dispatchEvent(new Event(ENTER_GALLERY_EVENT))
    // Fire the text-reveal signal now too, so the reveal is already under
    // way by the time the curtain finishes parting (800ms) — text arrives
    // in sync with the curtain opening, not after a dead pause.
    window.dispatchEvent(new Event(GALLERY_READY_EVENT))
    setPhase('opening')
    setTimeout(() => setPhase('done'), 800)
  }

  if (phase === 'done' || phase === 'idle') return null

  const opening = phase === 'opening'

  return (
    <div className="fixed inset-0 z-[100]" role="presentation" aria-hidden="true">
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
        <div className="flex flex-col items-center gap-4">
          
          <p className="font-display text-xl tracking-[0.35em] text-ivory sm:text-2xl">
          WELCOME TO
          </p>
          <p className="font-display text-2xl tracking-[0.35em] mt-2.5  text-ivory sm:text-3xl">
            THE BAIGARTS
          
          </p>
          <span className="h-px w-16 bg-brass" />
        </div>

        <button
          onClick={enter}
          className="wall-label border rounded-xl border-brass/60 px-6 py-3 text-brass transition-colors hover:bg-brass hover:text-ink"
        >
          Enter the Gallery
        </button>
      </div>
    </div>
  )
}