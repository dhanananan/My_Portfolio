import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from './motion'

type ScrollApi = {
  /** Jump or glide to a target. Works with or without Lenis mounted. */
  scrollTo: (target: string | number | HTMLElement, options?: { offset?: number; immediate?: boolean }) => void
  /** Freeze the page behind a modal / mobile menu. */
  stop: () => void
  start: () => void
}

const fallback: ScrollApi = {
  scrollTo: (target, options) => {
    if (typeof window === 'undefined') return
    const behavior = options?.immediate ? 'auto' : 'smooth'
    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior })
      return
    }
    const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY + (options?.offset ?? 0)
    window.scrollTo({ top, behavior })
  },
  stop: () => {},
  start: () => {},
}

const SmoothScrollContext = createContext<ScrollApi>(fallback)

export const useSmoothScroll = () => useContext(SmoothScrollContext)

/**
 * Lenis drives scrolling and feeds GSAP's ScrollTrigger from the same rAF
 * loop, so pinned/parallax elements never drift behind the content.
 * Skipped entirely when the user asks for reduced motion — native scrolling
 * is the correct behaviour there, not a slower version of ours.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const [api, setApi] = useState<ScrollApi>(fallback)

  useEffect(() => {
    if (prefersReducedMotion()) {
      ScrollTrigger.refresh()
      return
    }

    const lenis = new Lenis({
      duration: 1.05,
      // Gentle exponential settle — fast to respond, no floaty overshoot.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    setApi({
      scrollTo: (target, options) =>
        lenis.scrollTo(target, {
          offset: options?.offset ?? 0,
          immediate: options?.immediate ?? false,
          duration: options?.immediate ? 0 : 1.1,
        }),
      stop: () => lenis.stop(),
      start: () => lenis.start(),
    })

    ScrollTrigger.refresh()

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      lenisRef.current = null
      setApi(fallback)
    }
  }, [])

  return <SmoothScrollContext.Provider value={api}>{children}</SmoothScrollContext.Provider>
}
