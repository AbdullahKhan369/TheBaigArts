import { useEffect, useRef } from 'react'

/**
 * A soft, warm radial "track light" that follows the pointer over the wrapped
 * section — like walking through a gallery where spotlights pick out the art
 * as you move. Desktop/mouse only (checked via matchMedia hover:hover) so
 * touch devices get a clean static section instead of a dead, un-followed glow.
 * Position is written directly to a CSS variable via a ref on every move —
 * no React state, no re-renders, so it stays smooth even on a slow machine.
 */
export default function GallerySpotlight({ children, className = '' }) {
  const wrapperRef = useRef(null)

  useEffect(() => {
    const node = wrapperRef.current
    if (!node) return
    if (!window.matchMedia('(hover: hover)').matches) return

    function handleMove(e) {
      const rect = node.getBoundingClientRect()
      node.style.setProperty('--spot-x', `${e.clientX - rect.left}px`)
      node.style.setProperty('--spot-y', `${e.clientY - rect.top}px`)
      node.style.setProperty('--spot-opacity', '1')
    }
    function handleLeave() {
      node.style.setProperty('--spot-opacity', '0')
    }

    node.addEventListener('mousemove', handleMove)
    node.addEventListener('mouseleave', handleLeave)
    return () => {
      node.removeEventListener('mousemove', handleMove)
      node.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500"
        style={{
          opacity: 'var(--spot-opacity, 0)',
          background:
            'radial-gradient(600px circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in srgb, var(--color-brass-bright) 16%, transparent), transparent 60%)',
          mixBlendMode: 'soft-light',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
