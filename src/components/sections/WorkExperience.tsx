import { Link } from 'react-router-dom'
import { workProjects } from '@/data/experience'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'

/**
 * Work experience — the projects listed on the CV, one row each.
 * ---------------------------------------------------------------------------
 * Every row has the same four beats (what it was, what was made, which tools,
 * what came of it) in the same four columns, so eight of them scan as a
 * table rather than reading as eight paragraphs. Below `lg` the columns
 * stack; the index number stays as the row's anchor.
 */
export function WorkExperience({ index = '03' }: { index?: string }) {
  return (
    <section className="border-t border-border py-section" aria-labelledby="work-experience-heading">
      <div className="shell">
        <SectionHeading
          index={index}
          title={<span id="work-experience-heading">Experience</span>}
          lede="Design projects I've worked on — what I made, the tools I used, and what came of each."
        />

        <ol className="mt-16 border-b border-border sm:mt-20">
          {workProjects.map((project, i) => (
            <Reveal as="li" key={project.title} delay={Math.min(i, 3) * 60} y={18}>
              <div className="grid gap-x-8 gap-y-5 border-t border-border py-7 sm:py-9 lg:grid-cols-12 lg:items-start">
                <p className="eyebrow tabular-nums lg:col-span-1">{String(i + 1).padStart(2, '0')}</p>

                <div className="lg:col-span-4">
                  <h3 className="text-h4 font-medium">{project.title}</h3>
                  <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tools used">
                    {project.tools.map((tool) => (
                      <li
                        key={tool}
                        className="rounded-full border border-border-strong px-3 py-1 text-[0.75rem] text-muted"
                      >
                        {tool}
                      </li>
                    ))}
                  </ul>
                  {project.caseStudy && (
                    <Link
                      to={project.caseStudy}
                      className="link-underline mt-5 inline-block text-small font-medium"
                    >
                      View case study →
                    </Link>
                  )}
                </div>

                <p className="max-w-prose text-small text-muted lg:col-span-4">{project.description}</p>

                <div className="lg:col-span-3">
                  <p className="eyebrow mb-2">Outcome</p>
                  <p className="text-small text-muted">{project.outcome}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
