import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'

/**
 * Copies a value to the clipboard and confirms it in place.
 * ---------------------------------------------------------------------------
 * `navigator.clipboard` only exists in a secure context (https or localhost).
 * Over a plain-http LAN address — exactly how a site is tested from a phone —
 * it is simply undefined, so a button built on it alone would do nothing and
 * say nothing. The fallback uses a throwaway textarea and `execCommand`,
 * which is deprecated but still universally supported and needs no secure
 * context. If both fail the button stays quiet rather than claiming success.
 */
async function copyText(value: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value)
      return true
    }
  } catch {
    // fall through to the legacy path
  }

  try {
    const area = document.createElement('textarea')
    area.value = value
    area.setAttribute('readonly', '')
    // Off-screen rather than display:none — a hidden element can't be selected.
    area.style.cssText = 'position:fixed;top:0;left:-9999px;opacity:0'
    document.body.appendChild(area)
    area.select()
    area.setSelectionRange(0, value.length) // iOS needs the explicit range
    const ok = document.execCommand('copy')
    document.body.removeChild(area)
    return ok
  } catch {
    return false
  }
}

export function CopyButton({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const onClick = async () => {
    if (!(await copyText(value))) return
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 2200)
  }

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'group/copy inline-flex h-11 items-center gap-3 rounded-full border px-5 text-[0.9375rem] font-medium',
          'transition-[background-color,color,border-color,transform] duration-300 ease-out-expo active:scale-[0.98]',
          copied
            ? 'border-accent bg-accent text-accent-foreground'
            : 'border-border-strong text-foreground hover:border-foreground hover:bg-foreground hover:text-background',
          className,
        )}
      >
        {/* Both icons and both labels occupy the same cell and cross-fade, so
            the button never changes width when it flips state. */}
        <span className="relative grid size-4 place-items-center" aria-hidden="true">
          <svg
            viewBox="0 0 16 16"
            className={cn('col-start-1 row-start-1 size-4 transition-all duration-300', copied && 'scale-50 opacity-0')}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          >
            <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
            <path d="M10.5 3.5v-.5A1.5 1.5 0 0 0 9 1.5H3A1.5 1.5 0 0 0 1.5 3v6A1.5 1.5 0 0 0 3 10.5h.5" />
          </svg>
          <svg
            viewBox="0 0 16 16"
            className={cn('col-start-1 row-start-1 size-4 transition-all duration-300', !copied && 'scale-50 opacity-0')}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m3 8.5 3.2 3.2L13 4.8" />
          </svg>
        </span>

        <span className="grid" aria-hidden="true">
          <span className={cn('col-start-1 row-start-1 transition-all duration-300', copied && '-translate-y-2 opacity-0')}>
            Copy email
          </span>
          <span className={cn('col-start-1 row-start-1 transition-all duration-300', !copied && 'translate-y-2 opacity-0')}>
            Copied
          </span>
        </span>
        <span className="sr-only">Copy email address</span>
      </button>

      {/* Announced to screen readers; the visual confirmation is the button itself. */}
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? 'Email address copied to clipboard' : ''}
      </span>
    </>
  )
}
