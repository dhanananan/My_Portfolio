import { cn } from '@/lib/cn'

/**
 * Infinite ticker. Pure CSS translate on a duplicated track — no JS, no
 * measurement, no layout thrash. Reduced motion turns it into a static,
 * horizontally scrollable list instead of removing the content.
 */

type Props = {
  items: readonly string[]
  /** Seconds for one full pass. Higher = calmer. */
  duration?: number
  reverse?: boolean
  className?: string
  separator?: string
}

export function Marquee({ items, duration = 48, reverse = false, className, separator = '—' }: Props) {
  const track = (
    <ul
      className="flex shrink-0 items-center gap-8 pr-8 motion-safe:animate-marquee sm:gap-12 sm:pr-12"
      style={{ animationDirection: reverse ? 'reverse' : 'normal' }}
    >
      {items.map((item) => (
        <li key={item} className="flex shrink-0 items-center gap-8 sm:gap-12">
          <span>{item}</span>
          <span aria-hidden="true" className="text-border-strong">
            {separator}
          </span>
        </li>
      ))}
    </ul>
  )

  return (
    <div
      className={cn('relative flex w-full overflow-x-auto motion-safe:overflow-hidden', className)}
      style={{ ['--marquee-duration' as string]: `${duration}s` }}
    >
      {track}
      {/* Duplicate is decorative — the first track is the accessible copy. */}
      <div aria-hidden="true" className="hidden motion-safe:flex">
        {track}
      </div>
    </div>
  )
}
