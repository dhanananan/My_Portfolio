import { useEffect, useRef } from 'react'
import { gsap, hasFinePointer, prefersReducedMotion } from '@/lib/motion'

/**
 * Custom cursor — a precise dot plus a ring that trails it.
 * ---------------------------------------------------------------------------
 * Only mounts for a real pointer, and never when reduced motion is requested.
 * The dot sits exactly under the pointer so precision is unchanged; the ring
 * carries the personality. Form fields restore the native caret, because a
 * text field without an I-beam is a usability regression, not a flourish.
 *
 * Elements opt into the expanded state with data-cursor="<label>".
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return

    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    if (!dot || !ring || !label) return

    document.body.dataset.customCursor = 'on'
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 })

    // quickTo keeps this on GSAP's single rAF loop — no per-event layout work.
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3.out' })

    let visible = false

    const onMove = (event: PointerEvent) => {
      if (!visible) {
        visible = true
        gsap.to([dot, ring], { opacity: 1, duration: 0.25 })
      }
      dotX(event.clientX)
      dotY(event.clientY)
      ringX(event.clientX)
      ringY(event.clientY)
    }

    const onLeave = () => {
      visible = false
      gsap.to([dot, ring], { opacity: 0, duration: 0.2 })
    }

    const interactive = 'a, button, [role="button"], [data-cursor], summary'
    const editable = 'input, textarea, select, [contenteditable="true"]'

    const onOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null
      if (!target?.closest) return

      if (target.closest(editable)) {
        document.body.dataset.customCursor = 'off'
        gsap.to([dot, ring], { opacity: 0, duration: 0.15 })
        return
      }
      document.body.dataset.customCursor = 'on'

      const hit = target.closest<HTMLElement>(interactive)
      const text = hit?.dataset.cursor

      if (text) {
        label.textContent = text
        gsap.to(ring, { width: 76, height: 76, borderWidth: 0, backgroundColor: 'var(--color-accent)', duration: 0.4, ease: 'expo.out' })
        gsap.to(label, { opacity: 1, duration: 0.3 })
        gsap.to(dot, { opacity: 0, duration: 0.2 })
      } else if (hit) {
        gsap.to(ring, { width: 44, height: 44, borderWidth: 1, backgroundColor: 'transparent', duration: 0.4, ease: 'expo.out' })
        gsap.to(label, { opacity: 0, duration: 0.15 })
        gsap.to(dot, { opacity: visible ? 1 : 0, duration: 0.2 })
      } else {
        gsap.to(ring, { width: 28, height: 28, borderWidth: 1, backgroundColor: 'transparent', duration: 0.4, ease: 'expo.out' })
        gsap.to(label, { opacity: 0, duration: 0.15 })
        gsap.to(dot, { opacity: visible ? 1 : 0, duration: 0.2 })
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    document.addEventListener('pointerleave', onLeave)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerleave', onLeave)
      delete document.body.dataset.customCursor
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-90 hidden pointer-fine:block">
      <div
        ref={ringRef}
        className="absolute left-0 top-0 flex size-7 items-center justify-center rounded-full border border-foreground opacity-0 mix-blend-normal"
      >
        <span
          ref={labelRef}
          className="eyebrow pointer-events-none text-accent-foreground opacity-0"
          style={{ color: 'var(--color-accent-foreground)' }}
        />
      </div>
      <div ref={dotRef} className="absolute left-0 top-0 size-1.5 rounded-full bg-foreground opacity-0" />
    </div>
  )
}
