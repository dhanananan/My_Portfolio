import { useEffect, useRef } from 'react'
import { site } from '@/data/site'
import { Button } from '@/components/ui/Button'
import { TextReveal } from '@/components/ui/TextReveal'
import { gsap, prefersReducedMotion } from '@/lib/motion'

/**
 * Hero — one focal point and nothing competing with it.
 * ---------------------------------------------------------------------------
 * The name is the whole composition. Around it there is one eyebrow, one line
 * of role and positioning, and the two actions the page exists to prompt:
 * no rules, no ticker, no status badges, no scroll hint. Everything that used
 * to sit here (location and clock, availability, the discipline ticker) still
 * lives where it is more useful — About, Contact, and the closing section —
 * rather than crowding the first screen.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const mastheadRef = useRef<HTMLHeadingElement>(null)

  /* Scroll-linked parallax on the masthead — it drifts up and fades faster
     than the page scrolls, the same layered-depth trick apple.com uses on
     its product pages. `scrub` ties the tween directly to scroll position
     rather than playing once, so it costs nothing when idle. */
  useEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current || !mastheadRef.current) return

    const tween = gsap.to(mastheadRef.current, {
      yPercent: -18,
      opacity: 0.35,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.4,
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative pb-24 pt-36 sm:pb-32 sm:pt-44 lg:pt-52"
      aria-labelledby="hero-heading"
    >
      <div className="shell">
        <p className="eyebrow flex items-center gap-2">
          <span aria-hidden="true" className="text-accent">
            ●
          </span>
          Hello, I&rsquo;m
        </p>

        {/* Masthead */}
        <h1 ref={mastheadRef} id="hero-heading" className="mt-6 will-change-transform sm:mt-8">
          <span className="sr-only">
            {site.name} — {site.role}
          </span>
          {/* Visual copy only — the accessible name is the sr-only span above. */}
          <span aria-hidden="true">
            <TextReveal
              lines={['Dhananjaya', 'Raut.']}
              className="block font-display text-hero uppercase text-accent"
              // Modak sits high in its line box, leaving a loose gap between the
              // two lines; pulling the second up locks them together the way
              // the stacked-wordmark reference does. Safe against clipping:
              // each line's glyphs sit well inside their own overflow box.
              lineClassName="[&:not(:first-child)]:-mt-[0.11em]"
              interactive
              delay={120}
            />
          </span>
        </h1>

        {/* Role + the two actions, on one baseline. Generous space above so
            the name has room to breathe; no rule between them. */}
        <div className="mt-10 flex flex-col gap-8 sm:mt-14 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="max-w-md">
            <p className="text-h3 font-medium tracking-tight">{site.role}</p>
            <p className="mt-3 text-balance text-lead text-muted">
              Designing digital experiences that are simple, intuitive, and meaningful.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button to="/work" size="lg" withArrow magnetic>
              View my work
            </Button>
            <Button to="/contact" variant="ghost" size="lg" withArrow>
              Let&rsquo;s talk
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
