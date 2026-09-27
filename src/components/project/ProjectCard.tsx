import { useEffect, useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import type { Project } from '@/data/projects'
import { cn } from '@/lib/cn'
import { gsap, hasFinePointer, prefersReducedMotion } from '@/lib/motion'
import { Reveal } from '@/components/ui/Reveal'
import { ProjectVisual } from './ProjectVisual'

/**
 * One project, as one card: the image itself, and only a title and a short
 * line underneath.
 * ---------------------------------------------------------------------------
 * No panel, tint or frame behind the image — the work is the card. Website
 * screenshots are cropped to the card's shape from the top (`object-top`), so
 * the header and hero, which are the recognisable part of a page, always
 * survive the crop. The one thing laid over an image is the "View project"
 * chip — opaque and blurred rather than bare text, so it stays legible
 * regardless of what's under it (screenshots are mostly white; a plain label
 * would wash out).
 *
 * Everything a visitor would otherwise scan a paragraph for (what it is, which
 * tools, what came of it) is one click away on the case study, so it is not
 * repeated here.
 */

type Props = {
  project: Project
  /** Spans both columns on wider screens. */
  featured?: boolean
  priority?: boolean
  /** h3 under the home page's section heading, h2 as top-level content on /work. */
  headingLevel?: 'h2' | 'h3'
}

export function ProjectCard({
  project,
  featured = false,
  priority = false,
  headingLevel: Heading = 'h3',
}: Props) {
  const frameRef = useRef<HTMLDivElement>(null)
  const driftRef = useRef<HTMLDivElement>(null)

  /* Park the frame closed before first paint, then wipe it open on scroll.
     The closed state lives only in JS: a CSS clip-path would fight the tween
     that opens it (same reasoning as the page-transition curtain). */
  useLayoutEffect(() => {
    if (!prefersReducedMotion() && frameRef.current) {
      gsap.set(frameRef.current, { clipPath: 'inset(0 0 100% 0)' })
    }
  }, [])

  useEffect(() => {
    if (prefersReducedMotion() || !frameRef.current) return

    const tween = gsap.to(frameRef.current, {
      clipPath: 'inset(0 0 0% 0)',
      duration: 1.1,
      ease: 'expo.out',
      scrollTrigger: { trigger: frameRef.current, start: 'top 88%', once: true },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  /* A gentle drift of the image against its frame as the pointer moves. GSAP
     owns this wrapper only; the hover zoom below lives on an inner element,
     because a GSAP-driven transform writes `translate/scale: none` inline and
     would silently cancel any CSS hover rule on the same node. */
  const onPointerMove = (event: React.PointerEvent) => {
    if (!hasFinePointer() || prefersReducedMotion() || !driftRef.current || !frameRef.current) return
    const rect = frameRef.current.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    gsap.to(driftRef.current, { x: x * 18, y: y * 14, duration: 0.9, ease: 'power3.out' })
  }

  const onPointerLeave = () => {
    if (driftRef.current) gsap.to(driftRef.current, { x: 0, y: 0, duration: 1, ease: 'power3.out' })
  }

  return (
    <article className={cn('group/project relative', featured && 'md:col-span-2')}>
      <Link
        to={`/work/${project.slug}`}
        data-cursor="View"
        className="block focus-visible:outline-none"
        aria-label={`${project.title} — ${project.subtitle}. View case study.`}
      >
        <div
          ref={frameRef}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          className={cn(
            'relative w-full overflow-hidden rounded-card bg-surface',
            // Wider than 4:3 on purpose: website screenshots are ~2:1, and a
            // squarer frame slices the page's own nav off at both corners.
            featured ? 'aspect-4/3 md:aspect-2/1' : 'aspect-3/2',
          )}
          // Drawn artwork keeps its own background, so a frame wider than the
          // artwork is filled in the same colour rather than showing bars.
          style={project.heroImage ? undefined : { backgroundColor: project.identity.bg }}
        >
          {/* Oversized by 12px a side so the pointer drift never exposes an edge. */}
          <div ref={driftRef} className="absolute -inset-3">
            <div className="size-full transition-[scale] duration-700 ease-out-expo group-hover/project:scale-[1.04]">
              {project.heroImage ? (
                <img
                  src={project.heroImage}
                  alt={project.heroAlt}
                  loading={priority ? 'eager' : 'lazy'}
                  decoding="async"
                  fetchPriority={priority ? 'high' : 'auto'}
                  className="size-full object-cover object-top"
                />
              ) : (
                <ProjectVisual project={project} />
              )}
            </div>
          </div>

          {/* Hairline edge, so a white screenshot doesn't dissolve into the page. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-card ring-1 ring-inset ring-black/[0.07]"
          />

          {/* Decorative only — the whole card is already one link (aria-label
              carries "View case study"), so this can't be a second focusable
              element. Always present, not hover-only: hover has no equivalent
              on a touch screen, and a chip that only desktop ever sees would
              make the two feel like different products. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-background/85 px-4 py-2 text-[0.6875rem] font-medium tracking-[0.08em] text-foreground uppercase shadow-[0_1px_2px_rgba(21,20,18,0.08)] backdrop-blur-sm transition-transform duration-500 ease-out-expo group-hover/project:-translate-y-1"
          >
            View project
            <svg viewBox="0 0 10 10" aria-hidden="true" className="size-2.5">
              <path d="M2 8 8 2M3 2h5v5" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </span>
        </div>

        <Reveal className="mt-5" delay={80} y={16}>
          <p className="eyebrow flex items-center gap-2">
            <span className="tabular-nums">{project.index}</span>
            <span className="opacity-40">/</span>
            {project.category}
          </p>

          <div className="mt-2 min-w-0">
            <Heading
              className={cn(
                'flex flex-wrap items-center gap-x-3 gap-y-1 font-medium',
                featured ? 'text-h2' : 'text-h3',
              )}
            >
              <span className="link-underline link-retract">{project.title}</span>
              {project.liveUrl && (
                <span
                  className="eyebrow inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.6875rem]"
                  style={{ backgroundColor: `${project.identity.accent}1f`, color: project.identity.accent }}
                >
                  <span aria-hidden="true" className="size-1 rounded-full bg-current" />
                  Live
                </span>
              )}
            </Heading>
            <p className="mt-1.5 text-muted">{project.subtitle}</p>
          </div>
        </Reveal>
      </Link>
    </article>
  )
}
