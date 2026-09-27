/**
 * Shown while a lazily-loaded route chunk is in flight. Sized to the viewport
 * so the footer does not jump up and then back down as the chunk lands.
 */
export function RouteFallback() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center" role="status" aria-live="polite">
      <span className="flex items-center gap-3">
        <span className="flex gap-1" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-1.5 rounded-full bg-border-strong motion-safe:animate-bounce"
              style={{ animationDelay: `${i * 120}ms` }}
            />
          ))}
        </span>
        <span className="eyebrow">Loading</span>
      </span>
    </div>
  )
}
