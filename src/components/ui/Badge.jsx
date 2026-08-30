const tones = {
  sold: 'bg-sold text-ivory',
  available: 'bg-moss text-ivory',
  pending: 'bg-brass text-ink',
  confirmed: 'bg-moss text-ivory',
  completed: 'bg-line text-ivory',
  rejected: 'bg-sold text-ivory',
  cancelled: 'bg-line text-ivory-dim',
  neutral: 'bg-line text-ivory-dim',
}

export default function Badge({ children, tone = 'neutral', className = '' }) {
  return (
    <span
      className={`wall-label inline-flex items-center px-2.5 py-1 ${tones[tone] ?? tones.neutral} ${className}`}
    >
      {children}
    </span>
  )
}
