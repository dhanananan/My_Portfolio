import { skillGroups } from '@/data/skills'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'

/**
 * Skills as an index, not a grid of progress bars. Percentages on a skill are
 * a fiction; a clear list of what I actually do is not.
 */
export function SkillsSection({ index = '04' }: { index?: string }) {
  return (
    <section className="border-t border-border py-section" aria-labelledby="skills-heading">
      <div className="shell">
        <SectionHeading
          index={index}
          title={<span id="skills-heading">Capabilities</span>}
          lede="Where I spend my time, grouped roughly by the part of the process they belong to."
        />

        <div className="mt-16 grid gap-px overflow-hidden border-y border-border bg-border sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group, i) => (
            <Reveal key={group.title} className="bg-background p-7 sm:p-8" delay={i * 70} y={20}>
              <p className="eyebrow tabular-nums">{group.index}</p>
              <h3 className="mt-5 text-h4 font-medium">{group.title}</h3>
              <p className="mt-2 text-small text-subtle">{group.note}</p>

              <ul className="mt-7 space-y-0">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="group/skill flex items-center justify-between border-t border-border py-2.5 text-small text-muted transition-colors duration-300 hover:text-foreground"
                  >
                    <span>{item}</span>
                    <span
                      aria-hidden="true"
                      className="size-1 rounded-full bg-border-strong transition-colors duration-300 group-hover/skill:bg-accent"
                    />
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
