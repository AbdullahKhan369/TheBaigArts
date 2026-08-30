const themes = {
  dark: {
    label: 'text-ivory-dim',
    field: 'bg-ink text-ivory border-line focus:border-brass',
  },
  light: {
    label: 'text-ink/60',
    field: 'bg-white text-ink border-line-light focus:border-brass',
  },
}

export default function Select({
  label,
  error,
  required,
  options,
  className = '',
  theme = 'dark',
  ...props
}) {
  const t = themes[theme]

  return (
    <label className="block">
      {label && (
        <span className={`wall-label mb-2 block ${t.label}`}>
          {label} {required && <span className="text-brass">*</span>}
        </span>
      )}
      <select
        className={`w-full border px-3 py-2.5 text-sm outline-none transition-colors ${t.field} ${
          error ? 'border-sold' : ''
        } ${className}`}
        {...props}
      >
        <option value="" disabled>
          Select...
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <span className="mt-1 block text-xs text-sold">{error}</span>}
    </label>
  )
}
