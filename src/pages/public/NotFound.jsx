import { Link } from 'react-router-dom'
import PublicLayout from '../../components/layout/PublicLayout'
import SEO from '../../components/layout/SEO'
import Button from '../../components/ui/Button'

export default function NotFound() {
  return (
    <PublicLayout>
      <SEO title="Page Not Found" description="This page doesn't exist." noIndex />
      <div className="flex flex-col items-center justify-center gap-4 px-6 py-32 text-center">
        <p className="wall-label text-brass">404</p>
        <h1 className="font-display text-3xl text-ivory">This piece isn't hanging here.</h1>
        <p className="max-w-sm text-ivory-dim">
          The page you're looking for may have moved, or the painting may no longer exist.
        </p>
        <Link to="/gallery">
          <Button variant="outline" className="mt-4">Back to Gallery</Button>
        </Link>
      </div>
    </PublicLayout>
  )
}
