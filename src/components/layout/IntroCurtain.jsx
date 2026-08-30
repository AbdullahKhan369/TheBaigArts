import { useEffect, useState } from 'react'

const SESSION_KEY = 'baigarts_intro_seen'

/**
 * A one-time "exhibition opening" moment: two curtain panels part to reveal
 * the site, with the wordmark fading in at the center first. Plays once per
 * browser session (sessionStorage-gated) so returning visitors and internal
 * navigation never see it again. Click anywhere to skip ahead. Fully skipped,
 * with no flash at all, for prefers-reduced-motion users.
 */
export default function IntroCurtain() {
  const [phase, setPhase] = useState('idle') // idle | word | opening | done

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem(SESSION_KEY)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (alreadySeen || reducedMotion) {
      sessionStorage.setItem(SESSION_KEY, '1')
      setPhase('done')
      return
    }

    sessionStorage.setItem(SESSION_KEY, '1')

    const t1 = setTimeout(() => setPhase('word'), 250)
    const t2 = setTimeout(() => setPhase('opening'), 1300)
    const t3 = setTimeout(() => setPhase('done'), 2150)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

  function skip() {
    setPhase('opening')
    setTimeout(() => setPhase('done'), 700)
  }

  if (phase === 'done') return null

  const opening = phase === 'opening'

  return (
    <div
      className="fixed inset-0 z-[100] cursor-pointer"
      onClick={skip}
      role="presentation"
      aria-hidden="true"
    >
      {/* Left curtain panel */}
      <div
        className="absolute inset-y-0 left-0 w-1/2 bg-ink transition-transform duration-[800ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
        style={{
          transform: opening ? 'translateX(-100%)' : 'translateX(0)',
          borderRight: '1px solid var(--color-brass)',
        }}
      />
      {/* Right curtain panel */}
      <div
        className="absolute inset-y-0 right-0 w-1/2 bg-ink transition-transform duration-[800ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
        style={{
          transform: opening ? 'translateX(100%)' : 'translateX(0)',
          borderLeft: '1px solid var(--color-brass)',
        }}
      />

      {/* Wordmark reveal, centered, fades out as curtains part */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-4 transition-opacity duration-300"
        style={{ opacity: opening ? 0 : 1 }}
      >
        <p
          className="font-display text-2xl tracking-[0.35em] text-ivory transition-all duration-700 ease-out sm:text-3xl"
          style={{
            opacity: phase === 'idle' ? 0 : 1,
            transform: phase === 'idle' ? 'translateY(8px)' : 'translateY(0)',
          }}
        >
          THE BAIGARTS
        </p>
        <span
          className="h-px w-16 bg-brass transition-all duration-700 ease-out"
          style={{
            opacity: phase === 'idle' ? 0 : 1,
            width: phase === 'idle' ? '0px' : '4rem',
          }}
        />
      </div>
    </div>
  )
}
