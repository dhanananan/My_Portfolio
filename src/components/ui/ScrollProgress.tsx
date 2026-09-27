import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { prefersReducedMotion } from '@/lib/motion'

/**
 * A hairline progress bar fixed under the nav, filling left-to-right with
 * how far down the current page the visitor has scrolled.
 * ---------------------------------------------------------------------------
 * Driven directly by scroll position (no easing lag) so it stays exact —
 * this is an indicator, not a decorative animation, so it renders even
 * under prefers-reduced-motion (it has no motion of its own to reduce).
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    let ticking = false
    const update = () => {
      ticking = false
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - doc.clientHeight
      const pct = scrollable > 0 ? Math.min(1, Math.max(0, doc.scrollTop / scrollable)) : 0
      bar.style.transform = `scaleX(${pct})`
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Reset to empty on every route change rather than reading stale scroll —
  // PageTransition already jumps scroll to 0 on navigation.
  useEffect(() => {
    if (barRef.current) barRef.current.style.transform = 'scaleX(0)'
  }, [location.pathname])

  return (
    // z-[72]: above the navbar (z-70) so the fill is visible over its
    // background, below the mobile menu and page-transition curtain (z-75 /
    // z-80) so it disappears cleanly under either.
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-72 h-0.5 bg-transparent"
    >
      <div
        ref={barRef}
        className="h-full origin-left bg-accent"
        style={{
          transform: 'scaleX(0)',
          transition: prefersReducedMotion() ? 'none' : 'transform 80ms linear',
        }}
      />
    </div>
  )
}
