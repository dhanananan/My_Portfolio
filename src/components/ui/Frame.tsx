import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * Media frame with a designed empty state.
 * ---------------------------------------------------------------------------
 * If `src` is absent — or present but fails to load — the frame renders a
 * labelled placeholder instead of a broken image icon or a collapsed box.
 * That keeps the layout honest while real exports are still being produced.
 */

const ratioClass: Record<string, string> = {
  '21/9': 'aspect-[21/9]',
  '16/9': 'aspect-video',
  '4/3': 'aspect-[4/3]',
  '1/1': 'aspect-square',
  '3/4': 'aspect-[3/4]',
}

type Props = {
  label: string
  alt: string
  src?: string
  caption?: string
  ratio?: keyof typeof ratioClass
  className?: string
  /** Drawn artwork to show instead of the generic placeholder. */
  fallback?: ReactNode
  /** Tone of the placeholder surface. */
  tone?: 'default' | 'inverse'
  priority?: boolean
}

export function Frame({
  label,
  alt,
  src,
  caption,
  ratio = '16/9',
  className,
  fallback,
  tone = 'default',
  priority = false,
}: Props) {
  const [failed, setFailed] = useState(false)
  const showImage = Boolean(src) && !failed

  return (
    <figure className={cn('w-full', className)}>
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-card',
          ratioClass[ratio] ?? ratioClass['16/9'],
          tone === 'inverse' ? 'bg-ink-border/40' : 'bg-surface',
          !fallback && 'border border-border',
        )}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
            onError={() => setFailed(true)}
            className="absolute inset-0 size-full object-cover"
          />
        ) : fallback ? (
          <div className="absolute inset-0">{fallback}</div>
        ) : (
          <Placeholder label={label} tone={tone} />
        )}
      </div>

      {caption && (
        <figcaption
          className={cn(
            'mt-3 text-small',
            tone === 'inverse' ? 'text-ink-muted' : 'text-subtle',
          )}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

function Placeholder({ label, tone }: { label: string; tone: 'default' | 'inverse' }) {
  const inverse = tone === 'inverse'
  return (
    <div className="absolute inset-0 flex items-end p-5 sm:p-7">
      <svg
        aria-hidden="true"
        className={cn('absolute inset-0 size-full', inverse ? 'text-ink-muted/30' : 'text-border-strong')}
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <path d="M0 0 L100 100 M100 0 L0 100" stroke="currentColor" strokeWidth="0.25" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className={cn('eyebrow relative', inverse && 'text-ink-muted')}>{label}</span>
    </div>
  )
}
