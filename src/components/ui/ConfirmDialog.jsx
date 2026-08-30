import Button from './Button'

/**
 * Blocking confirmation modal — used before any destructive action (delete painting,
 * delete order). Per spec: destructive actions must never be one-click.
 */
export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', onConfirm, onCancel, loading }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-sm border border-line bg-ink-soft p-6">
        <h3 className="font-display text-lg text-ivory">{title}</h3>
        <p className="mt-2 text-sm text-ivory-dim">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
