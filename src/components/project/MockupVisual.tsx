import { useId, useMemo } from 'react'
import { float, int, pick, seededRandom, type Rng } from '@/lib/prng'

/**
 * Generated UI-mockup placeholder.
 * ---------------------------------------------------------------------------
 * Case-study "wireframe" and "screen" slots need *something* in them before
 * real exports exist. A literal stock photo there reads as a mistake — a
 * caption like "Wireframe — search results" next to a photo of a staircase
 * looks broken, not placeholder. Instead this draws an abstract browser-chrome
 * mockup: a plausible, on-brand composition with no claimed content.
 *
 * `seed` picks the layout (hero / list / detail) and jitters every
 * measurement deterministically, so each block gets a different-looking
 * mockup — genuinely varied, like the "random" placeholder the brief asked
 * for — while staying stable across re-renders.
 *
 * `tone="wire"` renders strictly greyscale (for sections that say the work
 * "stayed greyscale"); `tone="chroma"` uses the project's own identity
 * palette (for finished-UI slots), so the placeholder still belongs to the
 * same visual system as the rest of the case study.
 */

type Identity = { bg: string; ink: string; accent: string; soft: string }

type Props = {
  seed: string
  tone: 'wire' | 'chroma'
  identity: Identity
  className?: string
}

const LAYOUTS = ['hero', 'list', 'detail'] as const

export function MockupVisual({ seed, tone, identity, className }: Props) {
  const uid = useId().replace(/:/g, '')

  const colors = useMemo(
    () =>
      tone === 'wire'
        ? {
            bg: '#F6F5F2',
            chrome: '#ECEAE4',
            panel: '#FFFFFF',
            border: '#DEDAD0',
            line: '#D2CDC2',
            lineStrong: '#AFA99C',
            cta: '#3A3833',
            ctaText: '#F6F5F2',
          }
        : {
            bg: identity.bg,
            chrome: identity.soft,
            panel: '#FFFFFF',
            border: `${identity.ink}1A`,
            line: `${identity.ink}26`,
            lineStrong: `${identity.ink}59`,
            cta: identity.accent,
            ctaText: '#FFFFFF',
          },
    [tone, identity],
  )

  const layout = useMemo(() => {
    const rand = seededRandom(seed)
    return { kind: pick(rand, LAYOUTS), rand }
  }, [seed])

  return (
    <svg
      viewBox="0 0 640 420"
      role="img"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
      className={className ?? 'h-full w-full'}
    >
      <defs>
        <clipPath id={`mock-clip-${uid}`}>
          <rect width="640" height="420" />
        </clipPath>
      </defs>
      <g clipPath={`url(#mock-clip-${uid})`}>
        <rect width="640" height="420" fill={colors.bg} />
        <Chrome colors={colors} rand={layout.rand} />
        {layout.kind === 'hero' && <HeroLayout colors={colors} rand={layout.rand} />}
        {layout.kind === 'list' && <ListLayout colors={colors} rand={layout.rand} />}
        {layout.kind === 'detail' && <DetailLayout colors={colors} rand={layout.rand} />}
      </g>
    </svg>
  )
}

type Colors = {
  bg: string
  chrome: string
  panel: string
  border: string
  line: string
  lineStrong: string
  cta: string
  ctaText: string
}

function Bar({ x, y, w, h = 8, fill }: { x: number; y: number; w: number; h?: number; fill: string }) {
  return <rect x={x} y={y} width={w} height={h} rx={Math.min(h / 2, 3)} fill={fill} />
}

/** Browser-style chrome: window dots, address pill, a short nav, one CTA. */
function Chrome({ colors, rand }: { colors: Colors; rand: Rng }) {
  const navCount = int(rand, 2, 3)
  return (
    <>
      <rect width="640" height="36" fill={colors.chrome} />
      {[20, 36, 52].map((cx) => (
        <circle key={cx} cx={cx} cy={18} r={4} fill={colors.lineStrong} opacity={0.6} />
      ))}
      <rect x={90} y={10} width={200} height={16} rx={8} fill={colors.panel} opacity={0.8} />

      <rect x={24} y={50} width={26} height={12} rx={2} fill={colors.lineStrong} />
      {Array.from({ length: navCount }).map((_, i) => (
        <Bar key={i} x={280 + i * 62} y={54} w={int(rand, 34, 52)} h={7} fill={colors.line} />
      ))}
      <rect x={560} y={46} width={56} height={20} rx={10} fill={colors.cta} />

      <line x1={0} y1={76} x2={640} y2={76} stroke={colors.border} strokeWidth={1} />
    </>
  )
}

/** Hero block + a row of cards — a landing / overview-style screen. */
function HeroLayout({ colors, rand }: { colors: Colors; rand: Rng }) {
  const heroTitleW = int(rand, 170, 230)
  return (
    <>
      <rect x={24} y={96} width={592} height={118} rx={4} fill={colors.chrome} />
      <Bar x={56} y={124} w={64} h={6} fill={colors.cta} />
      <Bar x={56} y={140} w={heroTitleW} h={14} fill={colors.lineStrong} />
      <Bar x={56} y={160} w={int(rand, 110, 170)} h={14} fill={colors.lineStrong} />
      <Bar x={56} y={186} w={int(rand, 140, 200)} h={8} fill={colors.line} />
      <rect x={56} y={206} width={100} height={26} rx={13} fill={colors.cta} />
      <rect x={378} y={116} width={202} height={82} rx={3} fill={colors.border} />

      {Array.from({ length: 3 }).map((_, i) => {
        const cardW = (592 - 2 * 16) / 3
        const x = 24 + i * (cardW + 16)
        const y = 234
        return (
          <g key={i}>
            <rect x={x} y={y} width={cardW} height={148} rx={3} fill={colors.panel} stroke={colors.border} />
            <rect x={x + 14} y={y + 14} width={cardW - 28} height={62} rx={2} fill={colors.border} />
            <Bar x={x + 14} y={y + 92} w={cardW * float(rand, 0.5, 0.65)} h={8} fill={colors.lineStrong} />
            <Bar x={x + 14} y={y + 108} w={cardW * float(rand, 0.3, 0.45)} h={6} fill={colors.line} />
          </g>
        )
      })}
    </>
  )
}

/** Sidebar + a short list of result rows — search results / dashboards. */
function ListLayout({ colors, rand }: { colors: Colors; rand: Rng }) {
  const rows = int(rand, 3, 4)
  return (
    <>
      <rect x={24} y={96} width={132} height={300} rx={3} fill={colors.panel} stroke={colors.border} />
      {Array.from({ length: 5 }).map((_, j) => {
        const y = 124 + j * 34
        return (
          <g key={j}>
            <rect x={40} y={y} width={14} height={14} rx={2} fill={j === 0 ? colors.cta : colors.border} />
            <Bar x={64} y={y + 4} w={60} h={7} fill={j === 0 ? colors.lineStrong : colors.line} />
          </g>
        )
      })}

      <rect x={172} y={96} width={444} height={36} rx={18} fill={colors.panel} stroke={colors.border} />
      <circle cx={192} cy={114} r={6} fill={colors.border} />
      <Bar x={210} y={110} w={140} h={8} fill={colors.line} />

      {Array.from({ length: rows }).map((_, i) => {
        const y = 148 + i * 66
        return (
          <g key={i}>
            <rect x={172} y={y} width={444} height={56} rx={3} fill={colors.panel} stroke={colors.border} />
            <rect x={184} y={y + 12} width={44} height={32} rx={2} fill={colors.border} />
            <Bar x={240} y={y + 16} w={int(rand, 140, 220)} h={9} fill={colors.lineStrong} />
            <Bar x={240} y={y + 32} w={int(rand, 90, 150)} h={7} fill={colors.line} />
            <rect
              x={172 + 444 - 76}
              y={y + 17}
              width={60}
              height={20}
              rx={10}
              fill={i === 0 ? colors.cta : 'transparent'}
              stroke={i === 0 ? 'none' : colors.border}
            />
          </g>
        )
      })}
    </>
  )
}

/** Large image block + stacked detail column — product / property detail. */
function DetailLayout({ colors, rand }: { colors: Colors; rand: Rng }) {
  const hasSecondTitle = rand() > 0.4
  const titleY = 100
  const secondTitleY = titleY + 26
  const tagY = hasSecondTitle ? secondTitleY + 32 : titleY + 32
  const dividerY = tagY + 40
  const bodyStartY = dividerY + 26

  return (
    <>
      <rect x={24} y={96} width={276} height={300} rx={4} fill={colors.border} />
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={162 - 16 + i * 16}
          cy={366}
          r={3}
          fill={i === 1 ? colors.cta : colors.panel}
          opacity={i === 1 ? 1 : 0.7}
        />
      ))}

      <Bar x={324} y={titleY} w={int(rand, 160, 220)} h={16} fill={colors.lineStrong} />
      {hasSecondTitle && <Bar x={324} y={secondTitleY} w={int(rand, 100, 170)} h={16} fill={colors.lineStrong} />}
      <rect x={324} y={tagY} width={90} height={24} rx={12} fill={colors.cta} />

      <line x1={324} y1={dividerY} x2={616} y2={dividerY} stroke={colors.border} strokeWidth={1} />

      {[292, 260, 200].map((w, i) => (
        <Bar key={i} x={324} y={bodyStartY + i * 22} w={int(rand, w - 30, w)} h={8} fill={colors.line} />
      ))}

      <rect x={324} y={352} width={200} height={36} rx={18} fill={colors.cta} />
    </>
  )
}
