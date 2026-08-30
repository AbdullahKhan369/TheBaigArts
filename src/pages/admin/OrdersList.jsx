import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useOrders } from '../../hooks/useOrders'
import AdminLayout from '../../components/layout/AdminLayout'
import SEO from '../../components/layout/SEO'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import Badge from '../../components/ui/Badge'

const STATUS_FILTERS = ['', 'pending', 'confirmed', 'completed', 'rejected', 'cancelled']

export default function OrdersList() {
  const [status, setStatus] = useState('')
  const { orders, loading } = useOrders(status ? { status } : {})

  return (
    <AdminLayout>
      <SEO title="Orders" description="Admin order management." noIndex />
      <h1 className="font-display text-2xl text-ink">Orders</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s || 'all'}
            onClick={() => setStatus(s)}
            className={`wall-label px-3 py-2 ${status === s ? 'bg-ink text-ivory' : 'bg-white text-ink/60 border border-line-light'}`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner label="Loading orders" />
      ) : orders.length === 0 ? (
        <EmptyState title="No orders yet" message="Orders submitted from the public site will appear here." />
      ) : (
        <>
          {/* Mobile: stacked cards */}
          <div className="mt-6 flex flex-col gap-3 sm:hidden">
            {orders.map((o) => (
              <Link
                key={o.id}
                to={`/admin/orders/${o.id}`}
                className="block border border-line-light bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-ink">#{o.order_number}</p>
                    <p className="truncate text-sm text-ink/70">{o.painting_title_snapshot}</p>
                    <p className="truncate text-sm text-ink/60">{o.customer_name} · {o.city}</p>
                  </div>
                  <Badge tone={o.status}>{o.status}</Badge>
                </div>
                <p className="mt-2 text-xs text-ink/50">
                  {new Date(o.created_at).toLocaleDateString('en-PK')}
                </p>
              </Link>
            ))}
          </div>

          {/* Desktop/tablet: full table */}
          <div className="mt-6 hidden overflow-x-auto border border-line-light bg-white sm:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line-light text-ink/50">
                  <th className="wall-label px-4 py-3">Order #</th>
                  <th className="wall-label px-4 py-3">Painting</th>
                  <th className="wall-label px-4 py-3">Customer</th>
                  <th className="wall-label px-4 py-3">City</th>
                  <th className="wall-label px-4 py-3">Status</th>
                  <th className="wall-label px-4 py-3">Date</th>
                  <th className="wall-label px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-line-light last:border-0">
                    <td className="px-4 py-3 font-medium text-ink">#{o.order_number}</td>
                    <td className="px-4 py-3 text-ink">{o.painting_title_snapshot}</td>
                    <td className="px-4 py-3 text-ink">{o.customer_name}</td>
                    <td className="px-4 py-3 text-ink/70">{o.city}</td>
                    <td className="px-4 py-3">
                      <Badge tone={o.status}>{o.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-ink/60">
                      {new Date(o.created_at).toLocaleDateString('en-PK')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/admin/orders/${o.id}`} className="text-sm text-ink/70 underline hover:text-ink">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminLayout>
  )
}