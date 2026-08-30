import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Spinner from '../components/ui/Spinner'

/**
 * Client-side route guard — UX convenience only. The real security boundary
 * is Supabase RLS; this just prevents the admin UI from flashing before redirect.
 */
export default function AdminRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <Spinner label="Checking session" />
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />

  return children
}
