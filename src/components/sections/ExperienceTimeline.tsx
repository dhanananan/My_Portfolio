import { experience, education, type ExperienceEntry } from '@/data/experience'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/cn'

/**
 * Background timeline.
 * ---------------------------------------------------------------------------
 * Entries are rendered from data, and unfilled fields simply do not render —
 * a half-complete entry degrades into a clean, shorter row (no description
 * column) instead of a bracketed "[Add …]" note that would read as broken.
 *
 * Titled "Background" rather than "Experience": there is no employer to list
 * yet, so this is education plus current status. Once there's a real job,
 * add it to `experience` in the data file and this heading can change back.
 */
export function ExperienceTimeline({ index = '05' }: { index?: string }) {
  return (
    <section className="border-t border-border bg-surface py-section" aria-labelledby="experience-heading">
      <div className="shell">
        <SectionHeading
          index={index}
          title={<span id="experience-heading">Background</span>}
          lede="Currently completing my degree, with a growing list of self-directed and academic design projects."
        />

        <div className="mt-16 sm:mt-20">
          <ol>
            {experience.map((entry, i) => (
              <Row key={`${entry.organisation}-${i}`} entry={entry} delay={i * 70} />
            ))}
          </ol>

          {education.length > 0 && (
            <>
              <Reveal className="mt-16 mb-2" y={12}>
                <p className="eyebrow">Education</p>
              </Reveal>
              <ol>
                {education.map((entry, i) => (
                  <Row key={`edu-${i}`} entry={entry} delay={i * 70} />
                ))}
              </ol>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

function Row({ entry, delay }: { entry: ExperienceEntry; delay: number }) {
  // An entry whose role is still a placeholder is styled as one, not hidden.
  const isPlaceholder = entry.role.startsWith('[')

  return (
    <Reveal as="li" delay={delay} y={18}>
      <div
        className={cn(
          'group grid gap-3 border-t border-border py-7 sm:py-9 lg:grid-cols-12 lg:gap-8',
          isPlaceholder && 'opacity-55',
        )}
      >
        <div className="flex items-center gap-3 lg:col-span-3">
          <span className="eyebrow tabular-nums">{entry.period}</span>
          {entry.current && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-wash px-2.5 py-1 text-[0.6875rem] font-medium text-accent">
              <span aria-hidden="true" className="size-1 rounded-full bg-accent" />
              Current
            </span>
          )}
        </div>

        <div className="lg:col-span-5">
          <h3 className="text-h4 font-medium">{entry.role}</h3>
          <p className="mt-1 text-muted">{entry.organisation}</p>
        </div>

        <div className="lg:col-span-4">
          {entry.description && <p className="max-w-prose text-small text-muted">{entry.description}</p>}
          {entry.focus.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {entry.focus.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-border-strong px-3 py-1 text-[0.75rem] text-muted"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Reveal>
  )
}
