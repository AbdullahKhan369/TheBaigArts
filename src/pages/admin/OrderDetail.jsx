import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useOrder, updateOrderStatus, deleteOrder } from '../../hooks/useOrders'
import { buildWhatsAppLink } from '../../lib/whatsapp'
import AdminLayout from '../../components/layout/AdminLayout'
import SEO from '../../components/layout/SEO'
import Spinner from '../../components/ui/Spinner'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

const STATUSES = ['pending', 'confirmed', 'completed', 'rejected', 'cancelled']

function Field({ label, value }) {
  if (!value) return null
  return (
    <div>
      <p className="wall-label text-ink/50">{label}</p>
      <p className="mt-1 text-sm text-ink">{value}</p>
    </div>
  )
}

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { order, loading, refetch } = useOrder(id)
  const [updating, setUpdating] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleStatusChange(newStatus) {
    setUpdating(true)
    await updateOrderStatus(id, newStatus)
    await refetch()
    setUpdating(false)
  }

  async function handleDelete() {
    setDeleting(true)
    await deleteOrder(id)
    setDeleting(false)
    navigate('/admin/orders')
  }

  if (loading) {
    return (
      <AdminLayout>
        <Spinner label="Loading order" />
      </AdminLayout>
    )
  }

  if (!order) {
    return (
      <AdminLayout>
        <p className="text-ink">Order not found.</p>
      </AdminLayout>
    )
  }

  const addressLines = [
    order.house_number,
    order.street,
    order.area && `Area: ${order.area}`,
    [order.city, order.province].filter(Boolean).join(', '),
    order.postal_code && `Postal Code: ${order.postal_code}`,
  ].filter(Boolean)

  return (
    <AdminLayout>
      <SEO title={`Order #${order.order_number}`} description="Order detail." noIndex />

      <Link to="/admin/orders" className="wall-label text-ink/50 hover:text-ink">← Back to Orders</Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-ink">Order #{order.order_number}</h1>
          <p className="mt-1 text-sm text-ink/60">
            Placed {new Date(order.created_at).toLocaleString('en-PK')}
          </p>
        </div>
        <Badge tone={order.status}>{order.status}</Badge>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="border border-line-light bg-white p-6">
          <p className="wall-label mb-4 text-brass">Painting</p>
          <Field label="Title" value={order.painting_title_snapshot} />
          <div className="mt-3">
            <Field label="Price at time of order" value={`Rs. ${Number(order.painting_price_snapshot).toLocaleString('en-PK')}`} />
          </div>
        </div>

        <div className="border border-line-light bg-white p-6">
          <p className="wall-label mb-4 text-brass">Customer</p>
          <Field label="Name" value={order.customer_name} />
          <div className="mt-3"><Field label="Phone" value={order.customer_phone} /></div>
        </div>

        <div className="border border-line-light bg-white p-6 md:col-span-2">
          <p className="wall-label mb-4 text-brass">Delivery Address</p>
          <p className="text-sm leading-relaxed text-ink">
            {addressLines.map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </p>
          {order.landmark && <div className="mt-3"><Field label="Landmark" value={order.landmark} /></div>}
          {order.notes && <div className="mt-3"><Field label="Notes" value={order.notes} /></div>}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-line-light pt-6">
        <label className="flex items-center gap-2 text-sm text-ink">
          <span className="wall-label text-ink/60">Update Status</span>
          <select
            value={order.status}
            disabled={updating}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="border border-line-light bg-white px-3 py-2"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>

        <a href={buildWhatsAppLink(order)} target="_blank" rel="noopener noreferrer">
          <Button variant="outlineLight">Reopen WhatsApp Message</Button>
        </a>

        <Button variant="danger" onClick={() => setConfirmDelete(true)}>
          Delete Order
        </Button>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this order?"
        message={`Order #${order.order_number} will be permanently deleted. This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
        loading={deleting}
      />
    </AdminLayout>
  )
}
