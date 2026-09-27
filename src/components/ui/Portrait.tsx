import { useState } from 'react'
import { cn } from '@/lib/cn'
import { site } from '@/data/site'

/**
 * Portrait.
 * ---------------------------------------------------------------------------
 * Drop a real photo at /portrait.png (or pass `src`) and it is used. Until
 * then this renders a composed geometric stand-in rather than a grey box or,
 * worse, a stock photo of somebody else.
 *
 * The current /portrait.png is a flat line-art illustration on a white
 * canvas rather than a cropped photo, so it is presented `object-contain`
 * with inset padding — a framed avatar card, not a portrait crop that would
 * cut its edges off.
 */
export function Portrait({ src = '/portrait.png', className }: { src?: string; className?: string }) {
  const [failed, setFailed] = useState(false)

  return (
    <div
      className={cn(
        'relative aspect-3/4 w-full overflow-hidden rounded-card bg-surface-deep',
        className,
      )}
    >
      {!failed ? (
        <img
          src={src}
          alt={`${site.name}, ${site.role}`}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 size-full object-contain p-10 sm:p-14"
        />
      ) : (
        <>
          <svg
            viewBox="0 0 300 400"
            aria-hidden="true"
            className="absolute inset-0 size-full text-border-strong"
            preserveAspectRatio="none"
          >
            {/* Registration grid */}
            <path d="M150 0v400M0 200h300" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />

            {/* Head and shoulders. The shoulder line rises to y=230, leaving a
                believable neck gap under the head (which ends at y=202) — far
                enough apart and the two shapes stop reading as one figure. */}
            <circle cx="150" cy="150" r="52" fill="currentColor" opacity="0.28" />
            <circle cx="150" cy="150" r="52" fill="none" stroke="currentColor" strokeWidth="1.1" />
            <path
              d="M18 400c0-94 59-170 132-170s132 76 132 170"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.1"
            />

            {/* Crop marks — the frame reads as a placeholder on purpose */}
            <g stroke="currentColor" strokeWidth="1.1" opacity="0.9">
              <path d="M18 40V18h22M282 40V18h-22M18 360v22h22M282 360v22h-22" fill="none" />
            </g>
          </svg>
          <span className="eyebrow absolute bottom-5 left-5">[Add portrait]</span>
        </>
      )}
    </div>
  )
}
