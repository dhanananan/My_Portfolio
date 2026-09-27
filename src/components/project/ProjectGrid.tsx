import type { Project } from '@/data/projects'
import { ProjectCard } from './ProjectCard'

/**
 * Lays projects out as: the first one large across the full width, the rest in
 * pairs — and if that leaves one orphan, it goes full width too rather than
 * sitting alone in half a row. The rhythm (big, two, two, big) is what keeps a
 * list of near-identical cards from reading as a wall of thumbnails.
 *
 *   1 project  → [ 1 ]
 *   2          → [ 1 ] [ 2 ]
 *   3          → [ 1 ] [ 2 | 3 ]
 *   4          → [ 1 ] [ 2 | 3 ] [ 4 ]
 */
export function ProjectGrid({
  projects,
  headingLevel = 'h3',
}: {
  projects: Project[]
  headingLevel?: 'h2' | 'h3'
}) {
  const last = projects.length - 1
  const orphanLast = last >= 1 && (projects.length - 1) % 2 === 1

  return (
    <div className="grid gap-x-6 gap-y-14 sm:gap-y-20 md:grid-cols-2 lg:gap-x-8">
      {projects.map((project, i) => (
        <ProjectCard
          key={project.slug}
          project={project}
          featured={i === 0 || (orphanLast && i === last)}
          priority={i === 0}
          headingLevel={headingLevel}
        />
      ))}
    </div>
  )
}
