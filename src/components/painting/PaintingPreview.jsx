import { useRef, useState, useCallback } from 'react'

/**
 * Premium "on the wall" preview: subtle perspective tilt that follows the
 * pointer, plus a layered shadow that simulates the canvas lifting slightly
 * off the wall. Pure CSS transforms + one mousemove handler — no Three.js,
 * no WebGL, no extra bundle weight. Tilt is disabled on touch devices
 * (checked via pointer type) so mobile gets a clean static presentation
 * instead of a fake/laggy tilt.
 */
export default function PaintingPreview({ src, alt }) {
  const frameRef = useRef(null)
  const [transform, setTransform] = useState('rotateX(0deg) rotateY(0deg)')
  const [shadow, setShadow] = useState('0 30px 60px -20px rgba(0,0,0,0.5)')

  const handleMouseMove = useCallback((e) => {
    if (e.pointerType === 'touch') return
    const rect = frameRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    const maxTilt = 6
    setTransform(`rotateX(${(-y * maxTilt).toFixed(2)}deg) rotateY(${(x * maxTilt).toFixed(2)}deg)`)
    setShadow(
      `${(-x * 40).toFixed(0)}px ${(40 - y * 20).toFixed(0)}px 60px -20px rgba(0,0,0,0.55)`
    )
  }, [])

  const handleLeave = useCallback(() => {
    setTransform('rotateX(0deg) rotateY(0deg)')
    setShadow('0 30px 60px -20px rgba(0,0,0,0.5)')
  }, [])

  return (
    <div
      className="w-full"
      style={{ perspective: '1200px' }}
      onPointerMove={handleMouseMove}
      onPointerLeave={handleLeave}
    >
      <div
        ref={frameRef}
        className="transition-transform duration-200 ease-out will-change-transform"
        style={{ transform, boxShadow: shadow }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full select-none object-cover"
          draggable={false}
        />
      </div>
    </div>
  )
}
