const PARTICLES = [
  { left: '8%', size: 5, duration: 14, delay: 0, variant: 'a' },
  { left: '18%', size: 3, duration: 18, delay: 3, variant: 'b' },
  { left: '32%', size: 4, duration: 16, delay: 6, variant: 'a' },
  { left: '48%', size: 6, duration: 20, delay: 1, variant: 'b' },
  { left: '61%', size: 3, duration: 15, delay: 8, variant: 'a' },
  { left: '74%', size: 5, duration: 19, delay: 4, variant: 'b' },
  { left: '86%', size: 4, duration: 17, delay: 10, variant: 'a' },
  { left: '94%', size: 3, duration: 21, delay: 2, variant: 'b' },
]

export default function AmbientGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <style>{`
        @keyframes baigarts-aurora-1 {
          0%   { transform: translate(-10%, -10%) scale(1); }
          50%  { transform: translate(8%, 6%) scale(1.25); }
          100% { transform: translate(-10%, -10%) scale(1); }
        }
        @keyframes baigarts-aurora-2 {
          0%   { transform: translate(6%, 8%) scale(1.1); }
          50%  { transform: translate(-8%, -6%) scale(1.3); }
          100% { transform: translate(6%, 8%) scale(1.1); }
        }
        .baigarts-aurora-1 { animation: baigarts-aurora-1 26s ease-in-out infinite; }
        .baigarts-aurora-2 { animation: baigarts-aurora-2 32s ease-in-out infinite; }
      `}</style>

      {/* Large soft drifting light wash */}
      <div
        className="baigarts-aurora-1 absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(196,154,82,0.16), transparent 70%)' }}
      />
      <div
        className="baigarts-aurora-2 absolute -right-24 top-1/3 h-[440px] w-[440px] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(169,132,63,0.14), transparent 70%)' }}
      />

      {/* Small floating dust motes, catching the light */}
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className={`absolute bottom-0 rounded-full bg-brass-bright blur-[1px] animate-drift-${p.variant}`}
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}