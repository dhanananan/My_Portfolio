/**
 * Deterministic seeded randomness.
 * ---------------------------------------------------------------------------
 * Used to generate "random" mockup layouts that stay stable across renders
 * and between server/client — the same seed always produces the same
 * composition, so a page never flashes a different mockup on hydration.
 */

function hashString(input: string): number {
  let h = 1779033703 ^ input.length
  for (let i = 0; i < input.length; i++) {
    h = Math.imul(h ^ input.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return h >>> 0
}

/** mulberry32 — small, fast, good enough distribution for layout jitter. */
export function seededRandom(seed: string) {
  let a = hashString(seed)
  return function next(): number {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export type Rng = ReturnType<typeof seededRandom>

/** Integer in [min, max], inclusive. */
export const int = (rand: Rng, min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min

/** Float in [min, max). */
export const float = (rand: Rng, min: number, max: number) => min + rand() * (max - min)

/** Pick one item deterministically. */
export const pick = <T,>(rand: Rng, items: readonly T[]): T => items[Math.floor(rand() * items.length)]
