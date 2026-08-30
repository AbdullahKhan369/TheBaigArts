const variants = {
  primary: 'bg-brass text-ink hover:bg-brass-bright',
  dark: 'bg-ink text-ivory hover:bg-ink-soft border border-line',
  outline: 'bg-transparent text-ivory border border-line hover:border-brass',
  danger: 'bg-transparent text-sold border border-sold hover:bg-sold hover:text-ivory',
  ghost: 'bg-transparent text-ivory-dim hover:text-ivory',
  // Light-background counterparts — used on the admin panel (paper/white bg),
  // never on the dark public site.
  outlineLight: 'bg-transparent text-ink border border-line-light hover:border-brass',
  ghostLight: 'bg-transparent text-ink/60 hover:text-ink',
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium tracking-wide transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  )
}
