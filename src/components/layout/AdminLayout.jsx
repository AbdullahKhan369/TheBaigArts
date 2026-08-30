import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const links = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/paintings', label: 'Paintings' },
  { to: '/admin/orders', label: 'Orders' },
]

export default function AdminLayout({ children }) {
  const { session, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* Mobile top bar — sidebar below is desktop-only, mobile needs its own nav trigger */}
      <div className="flex items-center justify-between border-b border-line-light bg-paper px-5 py-4 md:hidden">
        <div>
          <p className="font-display text-base tracking-[0.14em]">THE BAIGARTS</p>
          <p className="wall-label text-ink/50">Admin</p>
        </div>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="wall-label border border-line-light px-3 py-2 text-ink/70"
          aria-expanded={menuOpen}
          aria-label="Toggle admin menu"
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-b border-line-light bg-paper px-5 py-4 md:hidden">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `rounded px-3 py-2 text-sm transition-colors ${
                  isActive ? 'bg-ink text-ivory' : 'text-ink/70 hover:bg-paper-dim'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="mt-3 border-t border-line-light pt-3">
            <p className="truncate text-xs text-ink/50">{session?.user?.email}</p>
            <button onClick={signOut} className="mt-2 text-xs text-sold underline">
              Sign out
            </button>
          </div>
        </nav>
      )}

      <div className="flex">
        <aside className="hidden w-56 shrink-0 border-r border-line-light bg-paper px-5 py-8 md:block">
          <p className="font-display text-base tracking-[0.14em]">THE BAIGARTS</p>
          <p className="wall-label mt-1 text-ink/50">Admin</p>

          <nav className="mt-10 flex flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/admin'}
                className={({ isActive }) =>
                  `rounded px-3 py-2 text-sm transition-colors ${
                    isActive ? 'bg-ink text-ivory' : 'text-ink/70 hover:bg-paper-dim'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-12 border-t border-line-light pt-4">
            <p className="truncate text-xs text-ink/50">{session?.user?.email}</p>
            <button onClick={signOut} className="mt-2 text-xs text-sold underline">
              Sign out
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1 px-5 py-6 sm:px-6 md:px-10 md:py-8">{children}</div>
      </div>
    </div>
  )
}