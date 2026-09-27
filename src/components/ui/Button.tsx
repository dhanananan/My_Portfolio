import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { useMagnetic } from '@/lib/motion'

/**
 * One button, four intents.
 * ---------------------------------------------------------------------------
 * Radius is systematic, not decorative: interactive controls are pills,
 * surfaces (cards, media, inputs) use the near-sharp --radius-card. Two radii,
 * each with a job.
 */

type Variant = 'primary' | 'secondary' | 'ghost' | 'inverse'
type Size = 'md' | 'lg'

const base =
  'group/btn relative inline-flex items-center justify-center gap-2.5 rounded-full font-medium ' +
  'transition-[background-color,color,border-color,transform] duration-300 ease-out-expo ' +
  'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 whitespace-nowrap'

const variants: Record<Variant, string> = {
  primary: 'bg-foreground text-background hover:bg-accent',
  secondary: 'border border-border-strong text-foreground hover:border-foreground hover:bg-foreground hover:text-background',
  ghost: 'text-foreground hover:text-accent px-0!',
  inverse: 'bg-ink-foreground text-ink hover:bg-accent hover:text-accent-foreground',
}

const sizes: Record<Size, string> = {
  md: 'h-11 px-5 text-[0.9375rem]',
  lg: 'h-13 px-7 text-base',
}

function Arrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={cn('size-4 shrink-0 transition-transform duration-400 ease-out-expo', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
    >
      <path d="M3 8h10M8.5 3.5 13 8l-4.5 4.5" />
    </svg>
  )
}

type CommonProps = {
  children: ReactNode
  variant?: Variant
  size?: Size
  className?: string
  withArrow?: boolean
}

type ButtonProps = CommonProps & {
  /** Internal route. */
  to?: string
  /** External URL — renders an anchor with the right rel/target. */
  href?: string
  /**
   * Forces a real file save instead of a browser navigation — essential for
   * `href` pointing at a same-origin PDF, which Chrome otherwise opens in its
   * built-in viewer tab rather than downloading. `true` keeps the server's
   * filename; a string suggests a different one (still same-origin only).
   */
  download?: boolean | string
  /** Nudges toward the pointer on hover. Reserve for the one or two primary
   *  CTAs per page — see `useMagnetic`'s own note on why not every button. */
  magnetic?: boolean
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  withArrow = false,
  to,
  href,
  download,
  magnetic = false,
  ...rest
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className)
  // Always called (rules of hooks) — the magnetic prop just decides whether
  // its ref ever gets attached below. Cast to a loose record: the hook is
  // deliberately element-agnostic (Link renders an <a>, this renders a
  // <button>, both are valid targets at runtime), which is exactly what
  // TS's ref variance checking is too strict to accept without help.
  const { ref, onPointerMove, onPointerLeave } = useMagnetic<HTMLElement>()
  const magneticProps = (magnetic ? { ref, onPointerMove, onPointerLeave } : {}) as Record<
    string,
    unknown
  >

  const inner = (
    <>
      <span className="relative">{children}</span>
      {withArrow && <Arrow className="group-hover/btn:translate-x-1" />}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...magneticProps}>
        {inner}
      </Link>
    )
  }

  if (href) {
    const external = href.startsWith('http')
    return (
      <a
        href={href}
        className={classes}
        {...(external && !download ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
        {...(download !== undefined ? { download } : {})}
        {...magneticProps}
      >
        {inner}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...magneticProps} {...rest}>
      {inner}
    </button>
  )
}

export { Arrow }
