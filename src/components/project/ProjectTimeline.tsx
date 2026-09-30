import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import type { Project } from '@/data/projects'
import { gsap, SplitText, prefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/cn'
import { ProjectGrid } from './ProjectGrid'
import { ProjectVisual } from './ProjectVisual'

/**
 * Selected work, as a pinned horizontal scroll — a project's line draws in,
 * its title and description peel up into place, as it reaches centre.
 * ---------------------------------------------------------------------------
 * Adapted from a pasted reference (a "Product Storyline" demo component)
 * rather than used as shipped. Two things about the source didn't fit real
 * use and were rebuilt rather than copied:
 *
 * 1. Its horizontal travel distance and every item's trigger position were
 *    hand-tuned percentages that only balance for its exact 7-item, one
 *    static-image layout. This site shows 3 projects on the home page and
 *    4 on /work, each with its own image — a fixed-count layout doesn't
 *    apply. This measures the track's actual rendered width at runtime
 *    (`track.scrollWidth`) and uses GSAP's `containerAnimation` to key each
 *    item's reveal to its own horizontal position, so it's correct for any
 *    number of items without new tuning.
 * 2. The source still slides the whole track under reduced motion and only
 *    skips the decorative flourishes on top. The scroll-jacking *is* the
 *    motion reduced-motion is opting out of, not just an extra on top of
 *    it, so this skips the pinned mode entirely and renders the plain grid
 *    — full-motion sighted users get the storytelling scroll; reduced-
 *    motion and (because the plain grid is what stays keyboard-friendly to
 *    tab through in visual order) keyboard-first users get the direct,
 *    fully accessible version. That's a real trade-off, not a nicety.
 */

type Props = {
  projects: Project[]
  headingLevel?: 'h2' | 'h3'
}

export function ProjectTimeline({ projects, headingLevel = 'h3' }: Props) {
  // Scroll-jacking two or three items reads as overkill, not storytelling —
  // same floor the reduced-motion path uses, for the same reason.
  if (prefersReducedMotion() || projects.length < 3) {
    return <ProjectGrid projects={projects} headingLevel={headingLevel} />
  }
  return <PinnedTimeline projects={projects} headingLevel={headingLevel} />
}

function PinnedTimeline({ projects, headingLevel: Heading }: Required<Props>) {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Array<HTMLDivElement | null>>([])

  useLayoutEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const ctx = gsap.context(() => {
      // The distance the track needs to travel — measured, not guessed, so
      // it's correct whether this renders 3 cards or 4, on a phone or an
      // ultrawide. `invalidateOnRefresh` re-measures on resize/font-load.
      const travel = () => Math.max(0, track.scrollWidth - window.innerWidth)

      // How much vertical scroll the pin holds for is deliberately NOT just
      // `travel()`: with few, narrow cards that overflow the viewport by
      // only a little, that distance is tiny, so the pin released after a
      // couple of scroll ticks — before this was fixed, an 8-tick scroll
      // test blew straight through the whole section into the one after
      // it, no reveal ever visible. Each item gets roughly one viewport of
      // dwell time instead, so the scrub has room to actually play out.
      const runway = () => window.innerHeight * Math.max(projects.length, 2)

      const master = gsap.to(track, {
        x: () => -travel(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${runway()}`,
          scrub: 0.6,
          pin: true,
          invalidateOnRefresh: true,
        },
      })

      const titleSplits: SplitText[] = []
      const descSplits: SplitText[] = []

      projects.forEach((_project, i) => {
        const item = itemRefs.current[i]
        if (!item) return

        const line = item.querySelector<HTMLElement>('[data-line]')
        const dot = item.querySelector<HTMLElement>('[data-dot]')
        const titleEl = item.querySelector<HTMLElement>('[data-title]')
        const descEl = item.querySelector<HTMLElement>('[data-desc]')
        if (!line || !dot || !titleEl || !descEl) return

        const titleSplit = SplitText.create(titleEl, { type: 'lines', mask: 'lines' })
        const descSplit = SplitText.create(descEl, { type: 'lines', mask: 'lines' })
        titleSplits.push(titleSplit)
        descSplits.push(descSplit)

        gsap.set(line, { scaleY: 0, transformOrigin: 'top' })
        gsap.set(dot, { scale: 0 })
        gsap.set([titleSplit.lines, descSplit.lines], { yPercent: 100 })

        gsap
          .timeline({
            scrollTrigger: {
              trigger: item,
              containerAnimation: master,
              start: 'left 85%',
              end: 'left 45%',
              scrub: true,
            },
          })
          .to(line, { scaleY: 1, duration: 0.4 })
          .to(dot, { scale: 1, duration: 0.4 }, '<')
          .to(titleSplit.lines, { yPercent: 0, stagger: 0.03, duration: 0.5 }, '<0.1')
          .to(descSplit.lines, { yPercent: 0, stagger: 0.03, duration: 0.5 }, '<0.05')
      })

      return () => {
        titleSplits.forEach((s) => s.revert())
        descSplits.forEach((s) => s.revert())
      }
    }, section)

    return () => ctx.revert()
  }, [projects])

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      <div ref={trackRef} className="flex h-full w-max items-center gap-[7vw] py-16 pl-gutter pr-[22vw]">
        {projects.map((project, i) => (
          <div
            key={project.slug}
            ref={(el) => {
              itemRefs.current[i] = el
            }}
            className={cn('flex w-[76vw] shrink-0 flex-col sm:w-[52vw] lg:w-[34vw]', i % 2 === 1 && 'sm:mt-16')}
          >
            <Link
              to={`/work/${project.slug}`}
              data-cursor="View"
              className="group block"
              aria-label={`${project.title} — ${project.subtitle}. View case study.`}
            >
              <div className="aspect-4/3 w-full overflow-hidden rounded-card bg-surface ring-1 ring-inset ring-black/[0.07]">
                {project.heroImage ? (
                  <img
                    src={project.heroImage}
                    alt={project.heroAlt}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover object-top transition-[scale] duration-700 ease-out-expo group-hover:scale-[1.04]"
                  />
                ) : (
                  <ProjectVisual project={project} density="card" className="size-full" />
                )}
              </div>

              <div className="mt-6 flex items-start gap-3">
                <span aria-hidden="true" className="mt-1 flex w-px shrink-0 flex-col items-center">
                  <span data-dot className="size-1.5 shrink-0 rounded-full bg-accent" />
                  <span data-line className="mt-1.5 h-10 w-px bg-accent/30" />
                </span>

                <div className="min-w-0">
                  <p className="eyebrow flex items-center gap-2">
                    <span className="tabular-nums">{project.index}</span>
                    <span className="opacity-40">/</span>
                    {project.category}
                  </p>
                  <Heading data-title className="mt-1.5 overflow-hidden text-h4 font-medium">
                    {project.title}
                  </Heading>
                  <p data-desc className="mt-1.5 overflow-hidden text-muted">
                    {project.subtitle}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
