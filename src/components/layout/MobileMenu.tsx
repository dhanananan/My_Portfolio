import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { gsap, prefersReducedMotion } from '@/lib/motion'
import { useSmoothScroll } from '@/lib/SmoothScroll'
import { nav, site, socials } from '@/data/site'
import { projects } from '@/data/projects'
import { cn } from '@/lib/cn'

/**
 * Full-screen mobile navigation.
 * ---------------------------------------------------------------------------
 * Handles the three things overlay menus usually get wrong: the page behind it
 * still scrolls, focus escapes to the content underneath, and Escape does
 * nothing. All three are covered here.
 */

type Props = {
  open: boolean
  onClose: () => void
}

export function MobileMenu({ open, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<HTMLDivElement>(null)
  const { stop, start } = useSmoothScroll()
  const previouslyFocused = useRef<HTMLElement | null>(null)

  /* Open / close animation ------------------------------------------------ */
  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    const reduced = prefersReducedMotion()

    if (open) {
      previouslyFocused.current = document.activeElement as HTMLElement
      stop()
      document.body.style.overflow = 'hidden'

      gsap.set(panel, { display: 'flex', pointerEvents: 'auto' })
      if (reduced) {
        gsap.set(panel, { opacity: 1, clipPath: 'inset(0% 0 0 0)' })
      } else {
        gsap
          .timeline()
          .fromTo(panel, { clipPath: 'inset(0% 0 100% 0)' }, { clipPath: 'inset(0% 0 0% 0)', duration: 0.55, ease: 'power4.inOut' })
          .fromTo(
            itemsRef.current?.children ?? [],
            { y: 36, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'expo.out' },
            '-=0.25',
          )
      }

      // Move focus into the panel so keyboard users land where they expect.
      requestAnimationFrame(() => panel.querySelector<HTMLElement>('a, button')?.focus())
    } else {
      start()
      document.body.style.overflow = ''
      if (reduced) {
        gsap.set(panel, { display: 'none', pointerEvents: 'none' })
      } else {
        gsap.to(panel, {
          clipPath: 'inset(0% 0 100% 0)',
          duration: 0.4,
          ease: 'power4.inOut',
          onComplete: () => gsap.set(panel, { display: 'none', pointerEvents: 'none' }),
        })
      }
      previouslyFocused.current?.focus?.()
    }
  }, [open, start, stop])

  /* Escape + focus trap --------------------------------------------------- */
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      )
      if (!focusables?.length) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  return (
    <div
      ref={panelRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className="fixed inset-0 z-75 hidden flex-col bg-ink text-ink-foreground lg:hidden"
      style={{ pointerEvents: 'none' }}
      // React 19 takes `inert` as a real boolean. While closed this keeps the
      // menu's links out of the tab order even mid close-animation.
      inert={!open}
    >
      <div className="shell flex h-20 shrink-0 items-center justify-between">
        <span className="eyebrow text-ink-muted">Menu</span>
        <button
          type="button"
          onClick={onClose}
          className="-mr-2 flex size-11 items-center justify-center rounded-full text-ink-foreground transition-colors duration-300 hover:text-accent"
          aria-label="Close menu"
        >
          <svg viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M5 5l10 10M15 5L5 15" />
          </svg>
        </button>
      </div>

      <div className="shell flex min-h-0 flex-1 flex-col justify-between overflow-y-auto pb-[max(2rem,env(safe-area-inset-bottom))] pt-4">
        <nav ref={itemsRef} aria-label="Primary">
          <NavRow to="/" label="Index" onClose={onClose} />
          {nav.map((item) => (
            <NavRow key={item.href} to={item.href} label={item.label} onClose={onClose} />
          ))}
        </nav>

        <div className="mt-12 space-y-8">
          <div>
            <p className="eyebrow mb-4 text-ink-muted">Selected work</p>
            <ul className="space-y-2.5">
              {projects.map((project) => (
                <li key={project.slug}>
                  <NavLink
                    to={`/work/${project.slug}`}
                    onClick={onClose}
                    className="flex items-baseline gap-3 text-ink-foreground/80 transition-colors duration-300 hover:text-accent"
                  >
                    <span className="eyebrow text-ink-muted">{project.index}</span>
                    <span className="text-h4">{project.title}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-ink-border pt-6">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer noopener"
                    className="link-underline text-small text-ink-muted transition-colors duration-300 hover:text-ink-foreground"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-small text-ink-muted">
              {site.locationLong} · {site.timezone}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function NavRow({ to, label, onClose }: { to: string; label: string; onClose: () => void }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      onClick={onClose}
      className={({ isActive }) =>
        cn(
          'group flex items-center justify-between border-b border-ink-border py-5 text-h2 font-medium transition-colors duration-300',
          isActive ? 'text-accent' : 'text-ink-foreground hover:text-accent',
        )
      }
    >
      {label}
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        className="size-5 shrink-0 -translate-x-2 opacity-0 transition-all duration-400 ease-out-expo group-hover:translate-x-0 group-hover:opacity-100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      >
        <path d="M3 8h10M8.5 3.5 13 8l-4.5 4.5" />
      </svg>
    </NavLink>
  )
}
