import { isValidElement, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Reveal } from './Reveal'

/**
 * The small mono label above the heading. Titles are usually passed as
 * `<span id="…">Text</span>` (so a section can point `aria-labelledby` at
 * it), which used to fall through to a generic "Section" label on every
 * heading. Read the text back out of that element instead.
 */
function labelFor(title: ReactNode): string {
  if (typeof title === 'string') return title
  if (isValidElement(title)) {
    const children = (title.props as { children?: unknown }).children
    if (typeof children === 'string') return children
  }
  return 'Section'
}

/**
 * The editorial section header used site-wide: a mono index on a hairline
 * rule, the title, and an optional lede held to a readable measure.
 */

type Props = {
  index?: string
  title: ReactNode
  lede?: ReactNode
  /** Sits opposite the title on wide screens — a link or small note. */
  aside?: ReactNode
  className?: string
  /** Extra classes on the title element itself — e.g. a section that wants
      a bolder, condensed treatment instead of the default serif/medium one. */
  titleClassName?: string
  tone?: 'default' | 'inverse'
  as?: 'h2' | 'h3'
}

export function SectionHeading({
  index,
  title,
  lede,
  aside,
  className,
  titleClassName,
  tone = 'default',
  as: Tag = 'h2',
}: Props) {
  const inverse = tone === 'inverse'

  return (
    <header className={cn('w-full', className)}>
      <Reveal
        className={cn(
          'flex items-baseline justify-between gap-6 border-t pt-4',
          inverse ? 'border-ink-border' : 'border-border',
        )}
        y={12}
      >
        <span className={cn('eyebrow', inverse && 'text-ink-muted')}>
          {index && <span className="tabular-nums">{index}</span>}
          {index && <span className="mx-2 opacity-40">/</span>}
          {labelFor(title)}
        </span>
        {aside && <div className="hidden shrink-0 md:block">{aside}</div>}
      </Reveal>

      <div className="mt-8 grid gap-x-12 gap-y-6 md:mt-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-7" delay={60}>
          <Tag
            className={cn(
              'text-h2',
              inverse ? 'text-ink-foreground' : 'text-foreground',
              // Replaces, not appends: font-weight/family/case utilities
              // conflict with the default, and this joiner doesn't dedupe
              // (see cn.ts) — so a caller opting into its own treatment
              // must fully replace it, not layer on top of it.
              titleClassName ?? 'font-medium',
            )}
          >
            {title}
          </Tag>
        </Reveal>

        {lede && (
          <Reveal className="max-w-prose lg:col-span-5 lg:pt-2" delay={120}>
            <p className={cn('text-lead', inverse ? 'text-ink-muted' : 'text-muted')}>{lede}</p>
          </Reveal>
        )}
      </div>

      {aside && <div className="mt-8 md:hidden">{aside}</div>}
    </header>
  )
}
