export default function PaintingCardSkeleton() {
  return (
    <div className="mb-6 animate-pulse break-inside-avoid">
      <div className="aspect-[4/5] w-full bg-ink-soft" />
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-ink-soft" />
          <div className="h-2.5 w-1/3 bg-ink-soft" />
        </div>
        <div className="h-4 w-14 bg-ink-soft" />
      </div>
    </div>
  )
}

export function PaintingGallerySkeleton({ count = 6 }) {
  return (
    <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
      {Array.from({ length: count }).map((_, i) => (
        <PaintingCardSkeleton key={i} />
      ))}
    </div>
  )
}
