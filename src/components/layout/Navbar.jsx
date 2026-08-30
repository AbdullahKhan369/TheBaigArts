import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const links = [
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Glass navbar: fully transparent at the very top of the page, then fades
  // into a frosted-glass bar as soon as the visitor scrolls — premium,
  // gallery-catalog feel instead of a flat solid bar sitting on every page.
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 24)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'border-b border-line/60 bg-ink/55 backdrop-blur-xl shadow-[0_8px_30px_-15px_rgba(0,0,0,0.6)]'
          : 'border-b border-transparent bg-transparent backdrop-blur-0'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="font-display text-lg tracking-[0.18em] text-ivory" onClick={() => setOpen(false)}>
          THE BAIGARTS
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `wall-label transition-colors ${isActive ? 'text-brass' : 'text-ivory-dim hover:text-ivory'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="wall-label md:hidden text-ivory-dim"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-line/60 bg-ink/90 backdrop-blur-xl px-6 pb-5 md:hidden">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `wall-label py-3 transition-colors ${isActive ? 'text-brass' : 'text-ivory-dim'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
