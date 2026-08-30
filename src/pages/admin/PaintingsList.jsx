import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePaintings, deletePainting, updatePainting } from '../../hooks/usePaintings'
import { getTransformedImageUrl } from '../../lib/supabaseClient'
import AdminLayout from '../../components/layout/AdminLayout'
import SEO from '../../components/layout/SEO'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

export default function PaintingsList() {
  const { paintings, loading, refetch } = usePaintings()
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  async function handleToggleStatus(painting) {
    const nextStatus = painting.status === 'available' ? 'sold' : 'available'
    await updatePainting(painting.id, { status: nextStatus })
    refetch()
  }

  async function handleDelete() {
    setDeleting(true)
    await deletePainting(pendingDelete)
    setDeleting(false)
    setPendingDelete(null)
    refetch()
  }

  return (
    <AdminLayout>
      <SEO title="Manage Paintings" description="Admin paintings management." noIndex />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl text-ink">Paintings</h1>
        <Link to="/admin/paintings/new">
          <Button variant="dark">+ New Painting</Button>
        </Link>
      </div>

      {loading ? (
        <Spinner label="Loading paintings" />
      ) : paintings.length === 0 ? (
        <EmptyState
          title="No paintings yet"
          message="Add your first painting to see it appear here and on the public gallery."
          action={
            <Link to="/admin/paintings/new">
              <Button variant="dark">+ New Painting</Button>
            </Link>
          }
        />
      ) : (
        <>
          {/* Mobile: stacked cards — a wide table is unusable on a phone */}
          <div className="mt-6 flex flex-col gap-3 sm:hidden">
            {paintings.map((p) => (
              <div key={p.id} className="border border-line-light bg-white p-4">
                <div className="flex gap-3">
                  {p.image_urls?.[0] ? (
                    <img
                      src={getTransformedImageUrl(p.image_urls[0], { width: 80 })}
                      alt={p.title}
                      className="h-16 w-16 shrink-0 object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 shrink-0 bg-paper-dim" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink">{p.title}</p>
                    <p className="text-sm text-ink/70">Rs. {Number(p.price).toLocaleString('en-PK')}</p>
                    <button onClick={() => handleToggleStatus(p)} className="mt-1">
                      <Badge tone={p.status === 'sold' ? 'sold' : 'available'}>{p.status}</Badge>
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex justify-end gap-4 border-t border-line-light pt-3">
                  <Link to={`/admin/paintings/${p.id}/edit`} className="text-sm text-ink/70 underline">
                    Edit
                  </Link>
                  <button onClick={() => setPendingDelete(p)} className="text-sm text-sold underline">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop/tablet: full table */}
          <div className="mt-8 hidden overflow-x-auto border border-line-light bg-white sm:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line-light text-ink/50">
                  <th className="wall-label px-4 py-3">Image</th>
                  <th className="wall-label px-4 py-3">Title</th>
                  <th className="wall-label px-4 py-3">Price</th>
                  <th className="wall-label px-4 py-3">Status</th>
                  <th className="wall-label px-4 py-3">Featured</th>
                  <th className="wall-label px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paintings.map((p) => (
                  <tr key={p.id} className="border-b border-line-light last:border-0">
                    <td className="px-4 py-3">
                      {p.image_urls?.[0] ? (
                        <img
                          src={getTransformedImageUrl(p.image_urls[0], { width: 80 })}
                          alt={p.title}
                          className="h-12 w-12 object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-paper-dim" />
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-ink">{p.title}</td>
                    <td className="px-4 py-3">Rs. {Number(p.price).toLocaleString('en-PK')}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggleStatus(p)}>
                        <Badge tone={p.status === 'sold' ? 'sold' : 'available'}>{p.status}</Badge>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-ink/60">{p.is_featured ? 'Yes' : '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-3">
                        <Link to={`/admin/paintings/${p.id}/edit`} className="text-sm text-ink/70 underline hover:text-ink">
                          Edit
                        </Link>
                        <button onClick={() => setPendingDelete(p)} className="text-sm text-sold underline">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this painting?"
        message={`"${pendingDelete?.title}" will be permanently deleted, including its images. This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
        loading={deleting}
      />
    </AdminLayout>
  )
}