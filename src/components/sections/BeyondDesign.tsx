import { useEffect, useLayoutEffect, useRef } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import { gsap, prefersReducedMotion } from '@/lib/motion'

/**
 * A small human beat between the credentials and the call to action.
 * One idea, one sentence — set large, and lit up on scroll rather than just
 * faded in, so it reads as a pull-quote rather than another paragraph of
 * body copy. The actual sweep effect (`.reveal-sweep`, driven by the
 * `--reveal` custom property this sets) lives in styles/index.css.
 */
export function BeyondDesign() {
  const pRef = useRef<HTMLParagraphElement>(null)

  /* Park it dim before first paint — same reasoning as ProjectCard's clipped
     frame: setting the 0% state in a plain useEffect would paint one frame
     fully revealed (the CSS default) first, then visibly snap dim. */
  useLayoutEffect(() => {
    if (!prefersReducedMotion() && pRef.current) {
      gsap.set(pRef.current, { '--reveal': 0 })
    }
  }, [])

  useEffect(() => {
    if (prefersReducedMotion() || !pRef.current) return

    const state = { reveal: 0 }
    const tween = gsap.to(state, {
      reveal: 1,
      ease: 'none',
      onUpdate: () => pRef.current?.style.setProperty('--reveal', String(state.reveal)),
      scrollTrigger: {
        trigger: pRef.current,
        start: 'top 85%',
        end: 'top 40%',
        scrub: 0.3,
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  return (
    <section className="border-t border-border py-section" aria-labelledby="beyond-heading">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-3" y={16}>
            <h2 id="beyond-heading" className="eyebrow">
              Beyond design
            </h2>
          </Reveal>

          <Reveal className="lg:col-span-8 lg:col-start-5" delay={80} y={20}>
            <p ref={pRef} className="reveal-sweep text-h2 font-normal">
              When I&rsquo;m not designing interfaces, I&rsquo;m usually experimenting with code,
              exploring new technologies, building side projects, or{' '}
              <span
                className="reveal-sweep font-serif italic"
                style={{ ['--sweep-to' as string]: 'var(--color-muted)', ['--sweep-from' as string]: 'var(--color-border)' }}
              >
                questioning why a perfectly good interface needed another button.
              </span>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
