import { projects } from '@/data/projects'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProjectGrid } from '@/components/project/ProjectGrid'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'

export function SelectedWork({ limit }: { limit?: number }) {
  const shown = limit ? projects.slice(0, limit) : projects

  return (
    <section id="selected-work" className="scroll-mt-28 py-section" aria-labelledby="selected-work-heading">
      <div className="shell">
        <SectionHeading
          index="01"
          title={<span id="selected-work-heading">Selected work</span>}
          lede="Digital products and experiences I've designed, each written up as a case study."
          titleClassName="font-sans font-bold uppercase tracking-tight text-accent"
        />

        <div className="mt-14 sm:mt-20">
          <ProjectGrid projects={shown} />
        </div>

        {limit && limit < projects.length && (
          <Reveal className="mt-16 flex justify-center sm:mt-20">
            <Button to="/work" variant="secondary" size="lg" withArrow>
              View all work
            </Button>
          </Reveal>
        )}
      </div>
    </section>
  )
}
