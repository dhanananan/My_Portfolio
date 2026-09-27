import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { useLocation, type Location } from 'react-router-dom'
import { gsap, prefersReducedMotion } from '@/lib/motion'
import { useSmoothScroll } from '@/lib/SmoothScroll'

/**
 * Route transition.
 * ---------------------------------------------------------------------------
 * Four columns sweep up to cover the viewport, the route swaps while covered,
 * then they clear. The outgoing page stays mounted via `displayLocation` so
 * nothing flashes behind the curtain.
 *
 * Total cost is ~0.8s. Reduced motion swaps instantly instead.
 */

const COLUMNS = 4

export function PageTransition({ children }: { children: (location: Location) => ReactNode }) {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const columnsRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const { scrollTo } = useSmoothScroll()
  const isFirstRender = useRef(true)

  /* Park the curtain below the fold before first paint. This is done in JS
     rather than with a `translate-y-full` class because Tailwind's translate
     utilities write the CSS `translate` property while GSAP animates
     `transform` — both would apply, and the panels would never come back. */
  useLayoutEffect(() => {
    if (columnsRef.current) {
      // visibility:hidden as well as off-screen, so an idle curtain is never
      // painted or composited between navigations.
      gsap.set(columnsRef.current.children, { yPercent: 100, visibility: 'hidden' })
    }
  }, [])

  useEffect(() => {
    // Entrance for the very first paint — lighter than a full curtain.
    if (isFirstRender.current) {
      isFirstRender.current = false
      if (!prefersReducedMotion() && contentRef.current) {
        gsap.fromTo(contentRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' })
      }
      return
    }

    if (location.pathname === displayLocation.pathname) return

    const columns = columnsRef.current?.children
    const reduced = prefersReducedMotion()

    if (reduced || !columns) {
      setDisplayLocation(location)
      scrollTo(0, { immediate: true })
      return
    }

    const tl = gsap.timeline({ defaults: { ease: 'power4.inOut' } })

    tl.set(columnsRef.current, { pointerEvents: 'auto' })
      .set(columns, { visibility: 'visible' })
      .fromTo(
        columns,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.42, stagger: 0.045 },
      )
      .add(() => {
        setDisplayLocation(location)
        scrollTo(0, { immediate: true })
      })
      .to(columns, { yPercent: -100, duration: 0.48, stagger: 0.045 }, '+=0.06')
      .set(columnsRef.current, { pointerEvents: 'none' })
      .set(columns, { visibility: 'hidden', yPercent: 100 })
      .fromTo(
        contentRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        '<0.1',
      )

    return () => {
      tl.kill()
    }
    // displayLocation is intentionally omitted: it is set *by* this effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, scrollTo])

  return (
    <>
      <div
        ref={columnsRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-80 flex"
      >
        {Array.from({ length: COLUMNS }).map((_, i) => (
          <div key={i} className="h-full flex-1 bg-ink" />
        ))}
      </div>

      <div ref={contentRef}>{children(displayLocation)}</div>
    </>
  )
}
