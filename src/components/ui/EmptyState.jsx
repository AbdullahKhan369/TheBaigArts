export default function EmptyState({ title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center px-4">
      <h3 className="font-display text-xl text-ivory">{title}</h3>
      {message && <p className="max-w-sm text-sm text-ivory-dim">{message}</p>}
      {action}
    </div>
  )
}
