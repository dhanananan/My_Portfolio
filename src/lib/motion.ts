import { useRef, type PointerEvent } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Read once per call — users can change this preference mid-session. */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** True only where a real pointer exists — gates the custom cursor and parallax. */
export const hasFinePointer = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches

export const EASE = {
  out: 'expo.out',
  inOut: 'power4.inOut',
  soft: 'power3.out',
} as const

/**
 * A small tactile "magnetic" pull toward the pointer — the element nudges
 * a few pixels in the cursor's direction on hover and springs back on
 * leave. Only worth wiring up on the handful of primary CTAs a visitor's
 * eye is meant to land on, not every clickable thing on the page.
 * Fine-pointer + motion-preference gated, same as the rest of this module.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.3) {
  const ref = useRef<T>(null)

  const onPointerMove = (event: PointerEvent<T>) => {
    if (!hasFinePointer() || prefersReducedMotion() || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (event.clientX - rect.left - rect.width / 2) * strength
    const y = (event.clientY - rect.top - rect.height / 2) * strength
    gsap.to(ref.current, { x, y, duration: 0.5, ease: 'power3.out' })
  }

  const onPointerLeave = () => {
    if (!ref.current) return
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
  }

  return { ref, onPointerMove, onPointerLeave }
}

export { gsap, ScrollTrigger }
