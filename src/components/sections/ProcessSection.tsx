import { useState } from 'react'
import { processSteps } from '@/data/process'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/cn'

/**
 * Design process.
 * ---------------------------------------------------------------------------
 * Built on <details>/<summary> rather than a div with a tabindex: the summary
 * is focusable for free, Enter and Space work, and assistive tech announces
 * the expanded state correctly.
 *
 * On a pointer device, hovering a stage opens it and recedes the others.
 * Below `lg` every stage starts open — hiding four lines of text behind an
 * extra tap on a phone buys nothing.
 */
export function ProcessSection() {
  const isDesktop = useMediaQuery('(min-width: 64rem)')
  const canHover = useMediaQuery('(hover: hover) and (pointer: fine)')
  const [open, setOpen] = useState<number | null>(null)

  const isOpen = (i: number) => (isDesktop ? open === i : true)

  return (
    <section className="border-t border-border bg-surface py-section" aria-labelledby="process-heading">
      <div className="shell">
        <SectionHeading
          index="02"
          title={<span id="process-heading">My design process</span>}
          lede="Five stages, used as a direction rather than a ritual. Not every project needs all of them — but skipping one should be a decision, not an accident."
        />

        <ol className="mt-16 sm:mt-20" onMouseLeave={() => canHover && setOpen(null)}>
          {processSteps.map((step, i) => {
            const active = isDesktop && open === i
            const dimmed = isDesktop && open !== null && open !== i

            return (
              <Reveal as="li" key={step.index} delay={i * 60} y={20}>
                <details
                  open={isOpen(i)}
                  onToggle={(event) => {
                    const el = event.currentTarget
                    if (!isDesktop) return
                    setOpen(el.open ? i : (current) => (current === i ? null : current))
                  }}
                  onMouseEnter={() => canHover && isDesktop && setOpen(i)}
                  className={cn(
                    'group border-t border-border transition-opacity duration-500',
                    dimmed ? 'opacity-35' : 'opacity-100',
                    i === processSteps.length - 1 && 'border-b',
                  )}
                >
                  <summary
                    className={cn(
                      'grid cursor-pointer list-none gap-4 py-7 outline-offset-4 sm:py-9',
                      'lg:grid-cols-12 lg:items-baseline lg:gap-8',
                      '[&::-webkit-details-marker]:hidden',
                      !isDesktop && 'cursor-default',
                    )}
                  >
                    <div className="flex items-baseline gap-5 lg:col-span-5">
                      <span
                        className={cn(
                          'eyebrow tabular-nums transition-colors duration-500',
                          active ? 'text-accent' : 'text-subtle',
                        )}
                      >
                        {step.index}
                      </span>
                      <h3 className="text-h3 font-medium transition-transform duration-500 ease-out-expo lg:group-hover:translate-x-2">
                        {step.title}
                      </h3>
                    </div>
                    <p className="max-w-prose text-lead text-muted lg:col-span-7">{step.summary}</p>
                  </summary>

                  <div className="grid gap-4 pb-8 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-7 lg:col-start-6">
                      <p className="max-w-prose text-small text-muted">{step.detail}</p>
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {step.activities.map((activity) => (
                          <li
                            key={activity}
                            className="rounded-full border border-border-strong px-3 py-1.5 text-[0.75rem] text-muted"
                          >
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </details>
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
