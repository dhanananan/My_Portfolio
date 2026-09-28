import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { TextReveal } from '@/components/ui/TextReveal'
import { Reveal } from '@/components/ui/Reveal'

/**
 * Shared masthead for the secondary pages, so /work, /about and /contact all
 * open on the same rhythm as the home page without repeating the markup.
 */
type Props = {
  eyebrow: string
  /** Each string becomes its own masked line. */
  title: string[]
  lede?: ReactNode
  meta?: { label: string; value: string }[]
  /** Replaces (not appends to — see SectionHeading's titleClassName for why)
      the default `text-h1 font-medium` on the <h1>. */
  titleClassName?: string
}

export function PageHeader({ eyebrow, title, lede, meta, titleClassName }: Props) {
  return (
    <header className="pt-32 pb-16 sm:pt-40 sm:pb-20 lg:pt-44">
      <div className="shell">
        <Reveal className="flex items-baseline justify-between gap-6 border-b border-border pb-5" y={12}>
          <p className="eyebrow">
            <span className="text-accent">●</span>
            <span className="ml-2">{eyebrow}</span>
          </p>
        </Reveal>

        <h1 className={cn('mt-8 text-h1 sm:mt-10', titleClassName ?? 'font-medium')}>
          <TextReveal lines={title} lineClassName="leading-[0.98]" delay={80} />
        </h1>

        {lede && (
          <div className="mt-10 grid lg:grid-cols-12">
            <Reveal className="lg:col-span-6 lg:col-start-7" delay={160}>
              <p className="text-lead text-muted">{lede}</p>
            </Reveal>
          </div>
        )}

        {meta && meta.length > 0 && (
          <Reveal className="mt-14 grid gap-6 border-t border-border pt-6 sm:grid-cols-3" delay={200}>
            {meta.map((item) => (
              <div key={item.label}>
                <p className="eyebrow">{item.label}</p>
                <p className="mt-1.5 text-small text-foreground">{item.value}</p>
              </div>
            ))}
          </Reveal>
        )}
      </div>
    </header>
  )
}
