import { createElement, useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from 'react'

/**
 * Scroll reveal.
 * ---------------------------------------------------------------------------
 * One shared IntersectionObserver for the whole site rather than a GSAP
 * ScrollTrigger per element — the transition itself is pure CSS, so the main
 * thread does nothing but flip an attribute. GSAP is reserved for the few
 * bespoke animations that genuinely need a timeline.
 *
 * Elements reveal once and are then unobserved.
 */

let observer: IntersectionObserver | null = null

function getObserver() {
  if (observer || typeof window === 'undefined') return observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const target = entry.target as HTMLElement
        target.setAttribute('data-revealed', 'true')
        // A group reveals its registered children on the same frame; each
        // child carries its own --reveal-delay, which produces the stagger.
        target
          .querySelectorAll<HTMLElement>(':scope > [data-reveal]')
          .forEach((child) => child.setAttribute('data-revealed', 'true'))
        observer?.unobserve(target)
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
  )
  return observer
}

type RevealProps = {
  children: ReactNode
  as?: ElementType
  className?: string
  /** Milliseconds. For deliberate sequencing, not decoration. */
  delay?: number
  /** Travel distance in px. 0 gives a pure fade. */
  y?: number
  /** When set, direct children animate in sequence and the wrapper does not. */
  stagger?: number
  /** Merged after the reveal custom properties. */
  style?: CSSProperties
}

export function Reveal({ children, as = 'div', className, delay = 0, y = 24, stagger, style }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.setAttribute('data-revealed', 'true')
      node
        .querySelectorAll<HTMLElement>(':scope > [data-reveal]')
        .forEach((child) => child.setAttribute('data-revealed', 'true'))
      return
    }

    if (stagger) {
      Array.from(node.children).forEach((child, i) => {
        const el = child as HTMLElement
        el.style.setProperty('--reveal-delay', `${delay + i * stagger}ms`)
        el.style.setProperty('--reveal-y', `${y}px`)
        el.setAttribute('data-reveal', '')
      })
    }

    const io = getObserver()
    io?.observe(node)
    return () => io?.unobserve(node)
  }, [delay, stagger, y])

  return createElement(
    as,
    {
      ref,
      className,
      // A staggering wrapper is only a trigger, so it stays visible itself.
      ...(stagger ? { 'data-reveal-group': '' } : { 'data-reveal': '' }),
      style: { '--reveal-y': `${y}px`, '--reveal-delay': `${delay}ms`, ...style } as CSSProperties,
    },
    children,
  )
}
