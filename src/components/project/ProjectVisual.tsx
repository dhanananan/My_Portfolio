import { useId } from 'react'
import type { Project } from '@/data/projects'
import { cn } from '@/lib/cn'

/**
 * Generated project artwork.
 * ---------------------------------------------------------------------------
 * These are drawn, not photographed. Each project gets a composition built
 * from its own palette so the three case studies read as distinct products
 * inside one system — and nothing here is a stock photo standing in for work
 * that does not exist.
 *
 * They are vector, so they cost ~2KB, scale to any viewport and stay crisp.
 * When real exports are ready, set `heroImage` on the project and these become
 * the fallback automatically (see ProjectMedia).
 */

type Props = {
  project: Project
  className?: string
  /** `hero` adds the finer secondary detail; `card` stays legible small. */
  density?: 'hero' | 'card'
}

export function ProjectVisual({ project, className, density = 'hero' }: Props) {
  const { identity, visual } = project
  const uid = useId().replace(/:/g, '')
  const detail = density === 'hero'

  // `meet`, not `slice`: the composition is designed, so it should never be
  // cropped by its frame. Leftover space is filled by the same identity
  // background, which makes the letterboxing invisible.
  return (
    <svg
      viewBox="0 0 1200 750"
      role="img"
      aria-label={project.heroAlt}
      preserveAspectRatio="xMidYMid meet"
      className={cn('h-full w-full', className)}
    >
      <defs>
        <clipPath id={`clip-${uid}`}>
          <rect width="1200" height="750" />
        </clipPath>
      </defs>

      <g clipPath={`url(#clip-${uid})`}>
        <rect width="1200" height="750" fill={identity.bg} />
        {visual === 'roomora' && <Roomora identity={identity} detail={detail} />}
        {visual === 'language' && <Language identity={identity} detail={detail} />}
        {visual === 'beautiva' && <Beautiva identity={identity} detail={detail} />}
      </g>
    </svg>
  )
}

type Identity = Project['identity']
type PartProps = { identity: Identity; detail: boolean }

/* -------------------------------------------------------------------------
 * Shared primitives — small drawn stand-ins for UI text and controls.
 * ---------------------------------------------------------------------- */

function Bar({ x, y, w, h = 8, fill, opacity = 1 }: { x: number; y: number; w: number; h?: number; fill: string; opacity?: number }) {
  return <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={fill} opacity={opacity} />
}

function Pill({ x, y, w, h = 30, fill, stroke }: { x: number; y: number; w: number; h?: number; fill: string; stroke?: string }) {
  return <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={fill} stroke={stroke} strokeWidth={stroke ? 1.25 : 0} />
}

/* -------------------------------------------------------------------------
 * 01 — Roomora: overlapping planes. A stay, a summary, a shortlist.
 * ---------------------------------------------------------------------- */

function Roomora({ identity, detail }: PartProps) {
  const { ink, accent, soft } = identity
  const paper = '#FFFFFF'

  return (
    <>
      {/* Property plane */}
      <rect x="64" y="96" width="556" height="590" rx="3" fill={ink} />
      {/* Horizon + sun — an image, reduced to its idea */}
      <circle cx="470" cy="256" r="58" fill={accent} opacity="0.9" />
      <path d="M64 470 L228 372 L352 456 L470 384 L620 470 Z" fill={soft} opacity="0.14" />
      <path d="M64 500 H620" stroke={soft} strokeWidth="1" opacity="0.28" />

      {/* Filter pills sitting on the plane */}
      <Pill x={104} y={608} w={112} fill="transparent" stroke={soft} />
      <Pill x={228} y={608} w={86} fill="transparent" stroke={soft} />
      <Pill x={326} y={608} w={128} fill={soft} />

      {/* Summary card — overlaps the plane */}
      <rect x="524" y="170" width="466" height="212" rx="3" fill={paper} />
      <Bar x={564} y={214} w={188} h={12} fill={ink} />
      <Bar x={564} y={246} w={292} h={8} fill={ink} opacity={0.24} />
      <Bar x={564} y={268} w={236} h={8} fill={ink} opacity={0.24} />
      <rect x="564" y="306" width="132" height="38" rx="19" fill={accent} />
      <Bar x={744} y={320} w={96} h={10} fill={ink} opacity={0.55} />

      {/* Shortlist card */}
      <rect x="656" y="420" width="480" height="266" rx="3" fill={paper} />
      <Bar x={696} y={458} w={120} h={10} fill={ink} opacity={0.5} />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(0 ${i * 62})`}>
          <rect x="696" y="492" width="56" height="44" rx="2" fill={soft} />
          <Bar x={772} y={500} w={168} h={9} fill={ink} opacity={0.7} />
          <Bar x={772} y={520} w={112} h={7} fill={ink} opacity={0.22} />
          <Bar x={1010} y={506} w={62} h={10} fill={i === 0 ? accent : ink} opacity={i === 0 ? 1 : 0.28} />
        </g>
      ))}

      {detail && (
        <>
          {/* Map dot field */}
          <g opacity="0.5">
            {Array.from({ length: 5 }).map((_, row) =>
              Array.from({ length: 8 }).map((__, col) => (
                <circle key={`${row}-${col}`} cx={676 + col * 34} cy={96 + row * 26} r="1.75" fill={ink} opacity={0.35} />
              )),
            )}
          </g>
          <circle cx="880" cy="122" r="7" fill={accent} />
        </>
      )}
    </>
  )
}

/* -------------------------------------------------------------------------
 * 02 — Language: the practice grid, one character, one tone contour.
 * ---------------------------------------------------------------------- */

function Language({ identity, detail }: PartProps) {
  const { ink, accent, soft } = identity
  const paper = '#FFFFFF'

  return (
    <>
      {/* 米字格 practice grid */}
      <rect x="96" y="120" width="470" height="470" rx="3" fill={paper} />
      <g stroke={accent} strokeWidth="1.25" opacity="0.32" strokeDasharray="7 9">
        <path d="M331 120 V590" />
        <path d="M96 355 H566" />
        <path d="M96 120 L566 590" />
        <path d="M566 120 L96 590" />
      </g>
      <rect x="96" y="120" width="470" height="470" rx="3" fill="none" stroke={ink} strokeWidth="1.25" opacity="0.4" />

      <text
        x="331"
        y="355"
        textAnchor="middle"
        dominantBaseline="central"
        fill={ink}
        fontSize="300"
        fontFamily="'Noto Sans SC','PingFang SC','Microsoft YaHei','Hiragino Sans GB',sans-serif"
      >
        学
      </text>

      {/* Tone contour — third tone, the one everyone struggles with */}
      <path d="M648 180 C 690 236, 724 272, 762 272 C 800 272, 836 232, 878 168" fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round" />
      <circle cx="648" cy="180" r="6" fill={accent} />
      <Bar x={648} y={306} w={128} h={11} fill={ink} />
      <Bar x={648} y={334} w={216} h={8} fill={ink} opacity={0.24} />

      {/* Lesson cards */}
      {[0, 1].map((i) => (
        <g key={i} transform={`translate(${i * 0} ${i * 132})`}>
          <rect x="632" y="396" width="472" height="112" rx="3" fill={paper} />
          <rect x="664" y="424" width="56" height="56" rx="2" fill={i === 0 ? accent : soft} />
          <Bar x={744} y={434} w={186} h={10} fill={ink} opacity={0.75} />
          <Bar x={744} y={456} w={124} h={8} fill={ink} opacity={0.22} />
          <Bar x={744} y={476} w={300} h={4} fill={soft} />
          <Bar x={744} y={476} w={i === 0 ? 190 : 78} h={4} fill={accent} />
        </g>
      ))}

      {detail && (
        <g opacity="0.85">
          {['ā', 'á', 'ǎ', 'à'].map((mark, i) => (
            <g key={mark}>
              <rect x={632 + i * 62} y={664} width="48" height="40" rx="2" fill="none" stroke={ink} strokeWidth="1" opacity="0.3" />
              <text
                x={656 + i * 62}
                y={684}
                textAnchor="middle"
                dominantBaseline="central"
                fill={i === 2 ? accent : ink}
                fontSize="22"
                fontFamily="Georgia, serif"
              >
                {mark}
              </text>
            </g>
          ))}
        </g>
      )}
    </>
  )
}

/* -------------------------------------------------------------------------
 * 03 — Beautiva: product as object, information as reassurance.
 * ---------------------------------------------------------------------- */

function Beautiva({ identity, detail }: PartProps) {
  const { ink, accent, soft } = identity
  const paper = '#FFFFFF'

  return (
    <>
      <circle cx="356" cy="356" r="250" fill={soft} />

      {/* Three products, three heights */}
      <g>
        <rect x="216" y="318" width="96" height="248" rx="4" fill={paper} />
        <rect x="246" y="288" width="36" height="34" rx="2" fill={ink} />
        <Bar x={240} y={392} w={48} h={6} fill={ink} opacity={0.35} />
        <Bar x={240} y={410} w={32} h={6} fill={ink} opacity={0.18} />

        <rect x="332" y="256" width="110" height="310" rx="4" fill={ink} />
        <rect x="368" y="222" width="38" height="38" rx="2" fill={accent} />
        <Bar x={360} y={344} w={54} h={7} fill={paper} opacity={0.85} />
        <Bar x={360} y={364} w={36} h={7} fill={paper} opacity={0.4} />

        <rect x="462" y="348" width="88" height="218" rx="4" fill={accent} />
        <rect x="490" y="320" width="32" height="32" rx="2" fill={ink} />
        <Bar x={484} y={414} w={44} h={6} fill={paper} opacity={0.9} />
      </g>
      <path d="M150 566 H620" stroke={ink} strokeWidth="1.25" opacity="0.35" />

      {/* Product detail card */}
      <rect x="668" y="150" width="468" height="450" rx="3" fill={paper} />
      <Bar x={708} y={196} w={92} h={9} fill={accent} />
      <Bar x={708} y={228} w={264} h={16} fill={ink} />
      <Bar x={708} y={260} w={196} h={16} fill={ink} />
      <Bar x={708} y={306} w={356} h={8} fill={ink} opacity={0.2} />
      <Bar x={708} y={328} w={312} h={8} fill={ink} opacity={0.2} />

      {/* Ingredient chips — the answer to "will this suit me?" */}
      <g>
        <Pill x={708} y={372} w={118} h={32} fill="transparent" stroke={ink} />
        <Pill x={838} y={372} w={92} h={32} fill="transparent" stroke={ink} />
        <Pill x={942} y={372} w={122} h={32} fill={soft} />
      </g>

      <rect x="708" y="446" width="180" height="44" rx="22" fill={ink} />
      <Bar x={916} y={462} w={86} h={12} fill={ink} opacity={0.4} />

      {detail && (
        <>
          <path d="M708 528 H1064" stroke={ink} strokeWidth="1" opacity="0.14" />
          <Bar x={708} y={552} w={140} h={7} fill={ink} opacity={0.22} />
          <Bar x={868} y={552} w={104} h={7} fill={ink} opacity={0.22} />
        </>
      )}
    </>
  )
}
