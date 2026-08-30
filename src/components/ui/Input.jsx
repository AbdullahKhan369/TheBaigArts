const themes = {
  dark: {
    label: 'text-ivory-dim',
    field:
      'bg-transparent text-ivory placeholder:text-ivory-dim/50 border-line focus:border-brass',
  },
  light: {
    label: 'text-ink/60',
    field: 'bg-white text-ink placeholder:text-ink/30 border-line-light focus:border-brass',
  },
}

export default function Input({
  label,
  error,
  required,
  className = '',
  textarea,
  theme = 'dark',
  ...props
}) {
  const Tag = textarea ? 'textarea' : 'input'
  const t = themes[theme]

  return (
    <label className="block">
      {label && (
        <span className={`wall-label mb-2 block ${t.label}`}>
          {label} {required && <span className="text-brass">*</span>}
        </span>
      )}
      <Tag
        className={`w-full border px-3 py-2.5 text-sm outline-none transition-colors ${t.field} ${
          error ? 'border-sold' : ''
        } ${className}`}
        rows={textarea ? 3 : undefined}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-sold">{error}</span>}
    </label>
  )
}
