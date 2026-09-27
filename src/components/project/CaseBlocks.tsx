import type { Block, Project } from '@/data/projects'
import { Frame } from '@/components/ui/Frame'
import { Reveal } from '@/components/ui/Reveal'
import { MockupVisual } from '@/components/project/MockupVisual'
import { cn } from '@/lib/cn'

/** "Wireframe — …" labelled slots render strictly greyscale; everything else
 *  uses the project's own identity palette. */
const mockupTone = (label: string): 'wire' | 'chroma' => (/wireframe/i.test(label) ? 'wire' : 'chroma')

/** Tailwind needs the literal class in source, so this is a lookup rather
 *  than an interpolated `sm:grid-cols-${n}`. */
const definitionCols: Record<number, string> = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
}

/**
 * Case-study block renderer.
 * ---------------------------------------------------------------------------
 * Every case-study section is a list of typed blocks from `projects.ts`.
 * Adding a project means writing data, never markup — and a block type that
 * does not exist yet fails visibly in development rather than silently.
 */

export function CaseBlock({ block, project }: { block: Block; project: Project }) {
  const accent = project.identity.accent

  switch (block.type) {
    case 'lead':
      return (
        <Reveal>
          <p className="max-w-3xl text-h3 font-normal text-foreground">{block.text}</p>
        </Reveal>
      )

    case 'prose':
      return (
        <Reveal>
          <p className="max-w-prose text-lead text-muted">{block.text}</p>
        </Reveal>
      )

    case 'list':
      return (
        <Reveal>
          {block.title && <p className="eyebrow mb-5">{block.title}</p>}
          <ul className="max-w-2xl">
            {block.items.map((item) => (
              <li
                key={item}
                className="flex gap-5 border-t border-border py-4 text-muted last:border-b"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.7em] size-1 shrink-0 rounded-full"
                  style={{ backgroundColor: accent }}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      )

    case 'definitions':
      return (
        <Reveal>
          {/* Column count follows the item count — a fixed 3-column grid with
              2 items leaves the third track empty, which (since the parent
              carries the gap colour as its own background) renders as a
              solid, unlabelled block rather than simply not being there. */}
          <dl
            className={cn(
              'grid max-w-3xl gap-px overflow-hidden border-y border-border bg-border',
              definitionCols[Math.min(block.items.length, 4)] ?? definitionCols[3],
            )}
          >
            {block.items.map((item) => (
              <div key={item.term} className="bg-background p-5 sm:p-6">
                <dt className="eyebrow">{item.term}</dt>
                <dd className="mt-2.5 text-small text-muted">{item.detail}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      )

    case 'personas':
      return (
        <div>
          {block.note && (
            <Reveal>
              <p className="mb-8 max-w-prose text-small text-subtle italic">{block.note}</p>
            </Reveal>
          )}
          <div className="grid gap-6 lg:grid-cols-2">
            {block.items.map((persona, i) => (
              <Reveal key={persona.role} delay={i * 80}>
                <article className="h-full rounded-card border border-border p-6 sm:p-8">
                  <p className="eyebrow" style={{ color: accent }}>
                    {persona.name}
                  </p>
                  <h3 className="mt-4 text-h4 font-medium">{persona.role}</h3>
                  <p className="mt-2 text-small text-muted">{persona.context}</p>

                  <div className="mt-7 grid gap-6 sm:grid-cols-2">
                    <PersonaList title="Goals" items={persona.goals} accent={accent} />
                    <PersonaList title="Frustrations" items={persona.frustrations} />
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      )

    case 'journey':
      return (
        <div>
          {block.note && (
            <Reveal>
              <p className="mb-8 max-w-prose text-small text-subtle italic">{block.note}</p>
            </Reveal>
          )}
          <Reveal>
            <ol className="border-t border-border">
              {block.stages.map((stage) => (
                <li
                  key={stage.stage}
                  className="grid gap-x-8 gap-y-2 border-b border-border py-5 sm:grid-cols-12 sm:items-center"
                >
                  <p className="eyebrow sm:col-span-2">{stage.stage}</p>
                  <p className="text-small text-foreground sm:col-span-4">{stage.doing}</p>
                  <p className="text-small text-muted italic sm:col-span-4">
                    &ldquo;{stage.thinking}&rdquo;
                  </p>
                  <div className="sm:col-span-2 sm:justify-self-end">
                    <Sentiment value={stage.sentiment} accent={accent} />
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      )

    case 'tree':
      return (
        <Reveal>
          <div className="rounded-card border border-border p-6 sm:p-8">
            <p className="eyebrow inline-flex items-center gap-2">
              <span aria-hidden="true" className="size-1.5 rounded-full" style={{ backgroundColor: accent }} />
              {block.root}
            </p>
            <div className="mt-8 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
              {block.branches.map((branch) => (
                <div key={branch.label} className="bg-background p-5">
                  <p className="text-small font-medium text-foreground">{branch.label}</p>
                  <ul className="mt-4 space-y-2.5 border-l border-border pl-4">
                    {branch.children.map((child) => (
                      <li key={child} className="relative text-small text-muted">
                        <span
                          aria-hidden="true"
                          className="absolute -left-4 top-1/2 h-px w-2.5 bg-border"
                        />
                        {child}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      )

    case 'flow':
      return (
        <Reveal>
          {/* An even grid rather than a wrapping flex row: connector arrows
              between free-flowing cards leave a dangling glyph wherever the
              row happens to break, so the cue lives inside each card instead. */}
          <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {block.steps.map((step, i) => (
              <li
                key={step.label}
                className="relative flex flex-col rounded-card border border-border bg-background p-4 pb-9"
              >
                <span className="eyebrow tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <span className="mt-2.5 text-small font-medium text-foreground">{step.label}</span>
                {step.note && <span className="mt-1.5 text-[0.75rem] text-subtle">{step.note}</span>}
                {step.branch && (
                  <span
                    className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-1 text-[0.6875rem]"
                    style={{ backgroundColor: `${accent}14`, color: accent }}
                  >
                    ↳ {step.branch}
                  </span>
                )}
                {i < block.steps.length - 1 && (
                  <svg
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                    className="absolute bottom-3.5 right-4 size-3.5 text-border-strong"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="square"
                  >
                    <path d="M3 8h10M8.5 3.5 13 8l-4.5 4.5" />
                  </svg>
                )}
              </li>
            ))}
          </ol>
        </Reveal>
      )

    case 'media':
      return (
        <Reveal>
          <Frame
            label={block.label}
            alt={block.alt}
            src={block.src}
            caption={block.caption}
            ratio={block.ratio ?? '16/9'}
            fallback={
              <MockupVisual
                seed={`${project.slug}-${block.label}`}
                tone={mockupTone(block.label)}
                identity={project.identity}
              />
            }
          />
        </Reveal>
      )

    case 'mediaPair':
      return (
        <div className="grid gap-6 sm:grid-cols-2">
          {block.items.map((item, i) => (
            <Reveal key={item.label} delay={i * 80}>
              <Frame
                label={item.label}
                alt={item.alt}
                src={item.src}
                caption={item.caption}
                ratio="4/3"
                fallback={
                  <MockupVisual
                    seed={`${project.slug}-${item.label}`}
                    tone={mockupTone(item.label)}
                    identity={project.identity}
                  />
                }
              />
            </Reveal>
          ))}
        </div>
      )

    case 'swatches':
      return (
        <Reveal>
          <ul className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {block.items.map((swatch) => (
              <li key={swatch.name} className="bg-background">
                <span
                  aria-hidden="true"
                  className="block h-24 w-full border-b border-border"
                  style={{ backgroundColor: swatch.value }}
                />
                <span className="block p-5">
                  <span className="block text-small font-medium text-foreground">{swatch.name}</span>
                  <span className="mt-1 block font-mono text-[0.75rem] uppercase text-subtle">
                    {swatch.value}
                  </span>
                  <span className="mt-3 block text-[0.75rem] text-muted">{swatch.usage}</span>
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      )

    case 'iterations':
      return (
        <Reveal>
          <ol className="border-t border-border">
            {block.items.map((item, i) => (
              <li key={i} className="grid gap-4 border-b border-border py-7 lg:grid-cols-12 lg:gap-8">
                <p className="eyebrow tabular-nums lg:col-span-1">{String(i + 1).padStart(2, '0')}</p>

                <div className="lg:col-span-5">
                  <p className="eyebrow mb-2 text-subtle">Before</p>
                  <p className="text-small text-muted line-through decoration-border-strong">
                    {item.before}
                  </p>
                </div>

                <div className="lg:col-span-3">
                  <p className="eyebrow mb-2" style={{ color: accent }}>
                    After
                  </p>
                  <p className="text-small font-medium text-foreground">{item.after}</p>
                </div>

                <div className="lg:col-span-3">
                  <p className="eyebrow mb-2 text-subtle">Why</p>
                  <p className="text-small text-muted">{item.reason}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      )

    default: {
      // Exhaustiveness guard: a new block type will fail to compile here.
      const _never: never = block
      return _never
    }
  }
}

/* ------------------------------------------------------------------------- */

function PersonaList({ title, items, accent }: { title: string; items: string[]; accent?: string }) {
  return (
    <div>
      <p className="eyebrow mb-3">{title}</p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-small text-muted">
            <span
              aria-hidden="true"
              className="mt-[0.65em] size-1 shrink-0 rounded-full"
              style={{ backgroundColor: accent ?? 'var(--color-border-strong)' }}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Sentiment({ value, accent }: { value: number; accent: string }) {
  return (
    <span className="flex items-center gap-1" title={`Sentiment ${value} of 5`}>
      <span className="sr-only">Sentiment {value} of 5</span>
      {[1, 2, 3, 4, 5].map((step) => (
        <span
          key={step}
          aria-hidden="true"
          className={cn('h-4 w-1.5 rounded-full')}
          style={{
            backgroundColor: step <= value ? accent : 'var(--color-border)',
            opacity: step <= value ? 1 : 1,
          }}
        />
      ))}
    </span>
  )
}
