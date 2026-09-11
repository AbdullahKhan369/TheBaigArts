import { useEffect, useRef, useState } from 'react'
import { ENTER_GALLERY_EVENT } from './IntroCurtain'

const VIDEO_SRC = '/media/hero-gallery.mp4'
const FALLBACK_IMAGE_SRC = '/media/hero-fallback.jpg'

/**
 * Plays the hero intro video ONCE, then crossfades into a static fallback
 * image. Starts muted (required for autoplay). If the visitor just clicked
 * "Enter the Gallery" on IntroCurtain, that click is a real user gesture —
 * this listens for the event it fires and unmutes immediately, so most
 * first-time visitors get sound automatically. On a repeat visit in the
 * same session (curtain skipped, no gesture), it plays muted with a manual
 * mute toggle the visitor can tap themselves.
 */
export default function HeroVideo() {
  const videoRef = useRef(null)
  const [ended, setEnded] = useState(false)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.play().catch(() => {})

    function handleEnterGallery() {
      video.muted = false
      setMuted(false)
      video.play().catch(() => {})
    }

    window.addEventListener(ENTER_GALLERY_EVENT, handleEnterGallery)
    return () => window.removeEventListener(ENTER_GALLERY_EVENT, handleEnterGallery)
  }, [])

  function toggleMute() {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-ink" aria-hidden="true">
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ease-out ${
          ended ? 'opacity-0' : 'opacity-100'
        }`}
        src={VIDEO_SRC}
        muted={muted}
        autoPlay
        playsInline
        preload="auto"
        onEnded={() => setEnded(true)}
      />

      <img
        src={FALLBACK_IMAGE_SRC}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ease-out ${
          ended ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/55 to-ink" />

      {!ended && (
        <button
          onClick={toggleMute}
          aria-label={muted ? 'Unmute video' : 'Mute video'}
          className="absolute bottom-6 right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-ivory/30 bg-ink/50 text-ivory backdrop-blur-sm transition-colors hover:border-brass hover:text-brass"
        >
          {muted ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
        </button>
      )}
    </div>
  )
}