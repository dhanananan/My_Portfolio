import { useLayoutEffect, useRef, type ElementType } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/cn'

/**
 * Masked line reveal for display type.
 * ---------------------------------------------------------------------------
 * Each line is clipped by its own overflow box and slides up from below, which
 * reads as type being set rather than an element fading in.
 *
 * Accessibility: when lines are split into characters the visual spans are
 * hidden from assistive tech and the full string is exposed via aria-label,
 * so a screen reader hears a name, not a column of letters.
 */

type Props = {
  lines: string[]
  as?: ElementType
  className?: string
  lineClassName?: string
  delay?: number
  /** Split into characters so each can respond to hover. Desktop nicety. */
  interactive?: boolean
  /** Start on mount (hero) rather than on scroll. */
  immediate?: boolean
}

export function TextReveal({
  lines,
  as: Tag = 'span',
  className,
  lineClassName,
  delay = 0,
  interactive = false,
  immediate = true,
}: Props) {
  const ref = useRef<HTMLElement | null>(null)

  /* useLayoutEffect, so the pre-animation state is written before the browser
     paints. The markup itself carries no transform: if JS never runs, the type
     is simply visible rather than parked off-screen forever. */
  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return

    if (prefersReducedMotion()) {
      gsap.set(node.querySelectorAll('[data-line-inner]'), { yPercent: 0, opacity: 1 })
      gsap.set(node.querySelectorAll('[data-char]'), { yPercent: 0, opacity: 1, scale: 1 })
      return
    }

    const scrollTrigger = immediate ? undefined : { trigger: node, start: 'top 85%', once: true }

    // Interactive mode (currently just the hero name) cascades in letter by
    // letter for more presence than a single line sliding as one block —
    // each character is already its own span for the hover effect below, so
    // this reuses that split rather than adding new markup.
    const chars = node.querySelectorAll<HTMLElement>('[data-char]')

    // After the entrance, each letter drifts on its own slow cycle — a few
    // degrees of tilt and a slight squash/stretch, all desynchronised — so
    // the name reads as soft and liquid rather than typeset. Transform-only
    // (no filters), paused whenever the name is off-screen.
    let idle: gsap.core.Timeline | undefined
    let idleTrigger: ScrollTrigger | undefined
    const startIdle = () => {
      idle = gsap.timeline()
      chars.forEach((char) => {
        idle!.to(
          char,
          {
            rotation: gsap.utils.random(-2.6, 2.6),
            scaleX: gsap.utils.random(1.01, 1.04),
            scaleY: gsap.utils.random(0.96, 0.99),
            transformOrigin: '50% 92%',
            duration: gsap.utils.random(2.2, 3.6),
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          },
          gsap.utils.random(0, 1.4),
        )
      })
      idleTrigger = ScrollTrigger.create({
        trigger: node,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => idle?.paused(!self.isActive),
      })
    }

    const tween =
      chars.length > 0
        ? gsap.fromTo(
            chars,
            { yPercent: 130, opacity: 0, scale: 0.82 },
            {
              yPercent: 0,
              opacity: 1,
              scale: 1,
              duration: 0.85,
              ease: 'back.out(1.6)',
              stagger: 0.022,
              delay: delay / 1000,
              // Once the entrance settles, hand these elements back to CSS
              // entirely — otherwise GSAP's inline transform/opacity would
              // outrank the plain-CSS `hover:` transform below it forever.
              clearProps: 'transform,opacity',
              onComplete: startIdle,
              scrollTrigger,
            },
          )
        : gsap.fromTo(
            node.querySelectorAll('[data-line-inner]'),
            { yPercent: 108, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 1.05,
              ease: 'expo.out',
              stagger: 0.09,
              delay: delay / 1000,
              scrollTrigger,
            },
          )

    return () => {
      idleTrigger?.kill()
      idle?.kill()
      tween.scrollTrigger?.kill()
      tween.kill()
    }
    // Keyed on the text itself, not the `lines` array: callers pass a fresh
    // array literal every render, which would otherwise re-run (and replay)
    // the entrance on any parent re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, immediate, lines.join('\n')])

  return (
    <Tag ref={ref} className={cn(className)} aria-label={interactive ? lines.join(' ') : undefined}>
      {lines.map((line, i) => (
        <span key={`${line}-${i}`} className={cn('block overflow-hidden pb-[0.06em]', lineClassName)}>
          <span data-line-inner className="block will-change-transform">
            {interactive ? (
              // nowrap is essential here: each character is its own
              // inline-block, which would otherwise let the browser break a
              // word between any two letters.
              <span aria-hidden="true" className="whitespace-nowrap">
                {Array.from(line).map((char, index) =>
                  char === ' ' ? (
                    <span key={index}>&nbsp;</span>
                  ) : (
                    // Two nested spans, deliberately. The OUTER one owns the
                    // hover (a springy squish — colour is no use on a name that
                    // is already the accent colour) through plain CSS. The INNER
                    // `data-char` one is GSAP's: entrance, then the idle drift.
                    // They can't share an element: once GSAP drives a transform
                    // it writes `translate/scale/rotate: none` inline to take
                    // sole control, which silently overrides any CSS hover rule
                    // on that same element.
                    <span
                      key={index}
                      className="inline-block transition-[translate,scale,rotate] duration-500 ease-spring hover:translate-y-[-0.05em] hover:scale-[1.07] hover:-rotate-3"
                    >
                      <span data-char className="inline-block">
                        {char}
                      </span>
                    </span>
                  ),
                )}
              </span>
            ) : (
              line
            )}
          </span>
        </span>
      ))}
    </Tag>
  )
}
