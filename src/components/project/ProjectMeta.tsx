import type { Project } from '@/data/projects'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/cn'

/**
 * The credits block under a case-study hero.
 * ---------------------------------------------------------------------------
 * A field still holding an editable `[Add …]` placeholder is skipped rather
 * than rendered — a bracketed TODO under the hero of a live case study reads
 * as a broken site, not a work-in-progress note. The grid's column count
 * follows however many fields actually survive that filter (a fixed 5-column
 * grid with one real cell would leave four-fifths of the row empty).
 */
export function ProjectMeta({ project }: { project: Project }) {
  const items = [
    { label: 'Role', value: project.role },
    { label: 'Timeline', value: project.timeline },
    { label: 'Year', value: project.year },
    { label: 'Platform', value: project.platform },
    { label: 'Tools', value: project.tools.join(', ') },
  ].filter((item) => !item.value.trim().startsWith('['))

  if (items.length === 0) return null

  // Tailwind needs the full class name present in source to generate it, so
  // this is a lookup rather than an interpolated `lg:grid-cols-${n}`.
  const colsForCount: Record<number, string> = {
    1: 'sm:grid-cols-1 lg:grid-cols-1',
    2: 'sm:grid-cols-2 lg:grid-cols-2',
    3: 'sm:grid-cols-3 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
    5: 'sm:grid-cols-2 lg:grid-cols-5',
  }

  return (
    <Reveal>
      <dl
        className={cn(
          'grid gap-px overflow-hidden border-y border-border bg-border',
          colsForCount[items.length],
        )}
      >
        {items.map((item) => (
          <div key={item.label} className="bg-background px-5 py-6 sm:px-6">
            <dt className="eyebrow">{item.label}</dt>
            <dd className="mt-2.5 text-small text-foreground">{item.value}</dd>
          </div>
        ))}
      </dl>
    </Reveal>
  )
}
