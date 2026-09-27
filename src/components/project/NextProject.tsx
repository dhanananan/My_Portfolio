import { Link } from 'react-router-dom'
import type { Project } from '@/data/projects'
import { ProjectVisual } from './ProjectVisual'
import { Reveal } from '@/components/ui/Reveal'

/** End-of-case-study link to the next project, so the sequence never dead-ends. */
export function NextProject({ project }: { project: Project }) {
  return (
    <section className="border-t border-border py-section" aria-labelledby="next-project-heading">
      <div className="shell">
        <Reveal className="border-t border-border pt-4" y={12}>
          <p id="next-project-heading" className="eyebrow">
            Next project
          </p>
        </Reveal>

        <Link
          to={`/work/${project.slug}`}
          data-cursor="View"
          className="group mt-10 block"
          aria-label={`Next project: ${project.title} — ${project.subtitle}`}
        >
          {/* items-start: centering a short metadata column against a tall
              image pushes the text down with a dead gap above it.
              lg:row-start-1 on both children: CSS Grid's default sparse
              auto-placement never backfills a row once its cursor has passed
              it. If the image (first in DOM order) were ever moved to the
              right-hand columns, the text after it would need columns behind
              that cursor and silently drop to row 2 — shifted down by
              "image height + gap". Pinning both to row 1 makes column order
              free to change without that happening. */}
          <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
            <Reveal className="lg:col-span-5 lg:row-start-1">
              <div
                className="relative aspect-16/10 w-full overflow-hidden rounded-card"
                style={{ backgroundColor: project.identity.bg }}
              >
                <div className="absolute -inset-2 transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]">
                  {project.heroImage ? (
                    <img
                      src={project.heroImage}
                      alt={project.heroAlt}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover"
                    />
                  ) : (
                    <ProjectVisual project={project} density="card" />
                  )}
                </div>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-card ring-1 ring-inset ring-black/[0.07]"
                />
              </div>
            </Reveal>

            <Reveal className="lg:col-span-6 lg:col-start-7 lg:row-start-1" delay={80}>
              <p className="eyebrow flex items-center gap-3">
                <span className="tabular-nums">{project.index}</span>
                <span aria-hidden="true" className="h-px w-8 bg-border-strong" />
                {project.category}
                {project.liveUrl && (
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5"
                    style={{ backgroundColor: `${project.identity.accent}14`, color: project.identity.accent }}
                  >
                    <span aria-hidden="true" className="size-1 rounded-full bg-current" />
                    Live
                  </span>
                )}
              </p>
              <h2 className="mt-5 text-h1 font-medium">
                <span className="link-underline link-retract">{project.title}</span>
              </h2>
              <p className="mt-3 text-h4 font-normal text-subtle">{project.subtitle}</p>
              <span className="mt-8 inline-flex items-center gap-2.5 font-medium">
                View case study
                <svg
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                >
                  <path d="M3 8h10M8.5 3.5 13 8l-4.5 4.5" />
                </svg>
              </span>
            </Reveal>
          </div>
        </Link>
      </div>
    </section>
  )
}
