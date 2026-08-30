import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-display text-lg tracking-[0.18em] text-ivory">THE BAIGARTS</p>
            <p className="mt-2 max-w-xs text-sm text-ivory-dim">
              Original handmade paintings. Each piece is one of a kind — once it's sold, it doesn't come back.
            </p>
          </div>

          <div className="flex gap-12">
            <div>
              <p className="wall-label mb-3">Explore</p>
              <ul className="space-y-2 text-sm text-ivory-dim">
                <li><Link to="/gallery" className="hover:text-ivory">Gallery</Link></li>
                <li><Link to="/about" className="hover:text-ivory">About</Link></li>
                <li><Link to="/contact" className="hover:text-ivory">Contact</Link></li>
              </ul>
            </div>
            <div>
              <p className="wall-label mb-3">Admin</p>
              <ul className="space-y-2 text-sm text-ivory-dim">
                {/* <li><Link to="/admin/login" className="hover:text-ivory">Sign in</Link></li> */}
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-10 text-xs text-ivory-dim/60">
          © {new Date().getFullYear()} The Baigarts. All artwork is original and handmade.
        </p>
      </div>
    </footer>
  )
}
