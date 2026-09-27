import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { nav, site } from '@/data/site'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { MobileMenu } from './MobileMenu'

/**
 * Site header.
 * ---------------------------------------------------------------------------
 * Compacts after the first scroll and hides when scrolling down mid-page, so
 * long case studies are not read through a permanent bar. It always returns
 * on the first upward scroll — never trapped out of reach.
 */
export function Navbar() {
  const [compact, setCompact] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const lastY = useRef(0)
  const ticking = useRef(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    // Smooth-scroll libraries (Lenis here) report scroll position as an
    // eased value that isn't perfectly monotonic frame-to-frame — trackpad
    // momentum in particular produces tiny alternating +/- deltas even
    // during one continuous downward scroll. Comparing every frame's y
    // straight to the previous frame's, with no dead zone, flips `hidden`
    // on that noise and the bar visibly flickers in and out. The fix is
    // hysteresis: only accept a direction once it has moved more than a
    // few pixels since the last *accepted* position, and only advance that
    // reference position when a direction is actually accepted — a frame
    // that gets ignored must not silently reset the baseline either.
    const DIRECTION_THRESHOLD = 8

    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true

      requestAnimationFrame(() => {
        const y = Math.max(0, window.scrollY)
        setCompact(y > 24)

        const delta = y - lastY.current
        if (menuOpen || y <= 320) {
          setHidden(false)
          lastY.current = y
        } else if (delta > DIRECTION_THRESHOLD) {
          setHidden(true)
          lastY.current = y
        } else if (delta < -DIRECTION_THRESHOLD) {
          setHidden(false)
          lastY.current = y
        }
        // else: movement was inside the dead zone — leave `hidden` and
        // `lastY` exactly as they were, rather than chasing every frame.

        ticking.current = false
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [menuOpen])

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-foreground focus:px-5 focus:py-3 focus:text-small focus:text-background"
      >
        Skip to content
      </a>

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-70 transition-[transform,background-color,backdrop-filter,border-color] duration-500 ease-out-expo',
          compact ? 'border-b bg-background/85 backdrop-blur-md' : 'border-b border-transparent',
          hidden ? '-translate-y-full' : 'translate-y-0',
        )}
      >
        <div
          className={cn(
            'shell flex items-center justify-between transition-[height] duration-500 ease-out-expo',
            compact ? 'h-16' : 'h-20 sm:h-24',
          )}
        >
          {/* Wordmark */}
          <Link to="/" className="group -ml-1 flex items-center gap-2.5 px-1 py-2" aria-label={`${site.name} — home`}>
            <img
              src="/bee.png"
              alt=""
              aria-hidden="true"
              width={160}
              height={160}
              className="size-7 shrink-0 object-contain transition-transform duration-500 group-hover:-rotate-12"
            />
            <span className="flex flex-col leading-none">
              <span className="text-[0.9375rem] font-semibold tracking-tight">{site.name}</span>
              <span
                className={cn(
                  'eyebrow overflow-hidden text-[0.6875rem] transition-all duration-500 ease-out-expo',
                  compact ? 'mt-0 max-h-0 opacity-0' : 'mt-1 max-h-4 opacity-100',
                )}
              >
                {site.role}
              </span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={!item.matchPrefix}
                className={({ isActive }) =>
                  cn(
                    'group relative px-4 py-2 text-[0.9375rem] transition-colors duration-300',
                    isActive ? 'text-foreground' : 'text-muted hover:text-foreground',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    <span
                      aria-hidden="true"
                      // Only ever one background utility: emitting both
                      // bg-foreground and bg-accent lets stylesheet order, not
                      // class order, decide the colour.
                      className={cn(
                        'absolute inset-x-4 bottom-1 h-px origin-left transition-transform duration-400 ease-out-expo',
                        isActive
                          ? 'scale-x-100 bg-accent'
                          : 'scale-x-0 bg-foreground group-hover:scale-x-100',
                      )}
                    />
                  </>
                )}
              </NavLink>
            ))}
            <Button to="/contact" size="md" className="ml-4" withArrow>
              Let&rsquo;s talk
            </Button>
          </nav>

          {/* Mobile trigger */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="-mr-2 flex size-11 items-center justify-center lg:hidden"
          >
            <span className="sr-only">Open menu</span>
            <span aria-hidden="true" className="flex w-6 flex-col gap-[5px]">
              <span className="h-px w-full bg-foreground" />
              <span className="h-px w-full bg-foreground" />
              <span className="h-px w-2/3 bg-foreground" />
            </span>
          </button>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
