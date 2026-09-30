import { projects } from '@/data/projects'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProjectTimeline } from '@/components/project/ProjectTimeline'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'

export function SelectedWork({ limit }: { limit?: number }) {
  const shown = limit ? projects.slice(0, limit) : projects

  return (
    <section id="selected-work" className="scroll-mt-28 pt-section" aria-labelledby="selected-work-heading">
      <div className="shell">
        <SectionHeading
          index="01"
          title={<span id="selected-work-heading">Selected work</span>}
          lede="Digital products and experiences I've designed, each written up as a case study."
          titleClassName="font-sans font-bold uppercase tracking-tight text-accent"
        />
      </div>

      {/* Full-bleed, not inside .shell — the pinned horizontal track needs
          to run past the shell's max-width to have anywhere to scroll to. */}
      <div className="mt-8 sm:mt-10">
        <ProjectTimeline projects={shown} />
      </div>

      <div className="shell pb-section">
        {limit && limit < projects.length && (
          <Reveal className="flex justify-center pt-4 sm:pt-6">
            <Button to="/work" variant="secondary" size="lg" withArrow>
              View all work
            </Button>
          </Reveal>
        )}
      </div>
    </section>
  )
}
