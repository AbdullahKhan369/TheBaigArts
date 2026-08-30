import { Link } from 'react-router-dom'
import { usePaintings } from '../../hooks/usePaintings'
import { useOrders } from '../../hooks/useOrders'
import AdminLayout from '../../components/layout/AdminLayout'
import SEO from '../../components/layout/SEO'
import Spinner from '../../components/ui/Spinner'

function StatCard({ label, value, to }) {
  const content = (
    <div className="border border-line-light bg-white p-6 transition-colors hover:border-brass">
      <p className="wall-label text-ink/50">{label}</p>
      <p className="mt-2 font-display text-3xl text-ink">{value}</p>
    </div>
  )
  return to ? <Link to={to}>{content}</Link> : content
}

export default function Dashboard() {
  const { paintings, loading: paintingsLoading } = usePaintings()
  const { orders, loading: ordersLoading } = useOrders()

  if (paintingsLoading || ordersLoading) {
    return (
      <AdminLayout>
        <Spinner label="Loading dashboard" />
      </AdminLayout>
    )
  }

  const available = paintings.filter((p) => p.status === 'available').length
  const sold = paintings.filter((p) => p.status === 'sold').length
  const pendingOrders = orders.filter((o) => o.status === 'pending').length

  return (
    <AdminLayout>
      <SEO title="Admin Dashboard" description="Admin dashboard." noIndex />
      <h1 className="font-display text-2xl text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-ink/60">Quick overview of your catalog and orders.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Paintings" value={paintings.length} to="/admin/paintings" />
        <StatCard label="Available" value={available} to="/admin/paintings" />
        <StatCard label="Sold" value={sold} to="/admin/paintings" />
        <StatCard label="Pending Orders" value={pendingOrders} to="/admin/orders" />
      </div>

      <div className="mt-10 flex gap-4">
        <Link to="/admin/paintings/new" className="wall-label border border-line-light bg-white px-4 py-3 hover:border-brass">
          + Add New Painting
        </Link>
        <Link to="/admin/orders" className="wall-label border border-line-light bg-white px-4 py-3 hover:border-brass">
          View Orders
        </Link>
      </div>
    </AdminLayout>
  )
}
