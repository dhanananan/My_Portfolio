import { useEffect, useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { caseSpine, getAdjacentProject, getProject } from '@/data/projects'
import { site } from '@/data/site'
import { useSeo } from '@/lib/seo'
import { useSmoothScroll } from '@/lib/SmoothScroll'
import { ProjectVisual } from '@/components/project/ProjectVisual'
import { ProjectMeta } from '@/components/project/ProjectMeta'
import { CaseBlock } from '@/components/project/CaseBlocks'
import { NextProject } from '@/components/project/NextProject'
import { ContactSection } from '@/components/sections/ContactSection'
import { TextReveal } from '@/components/ui/TextReveal'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/cn'

export default function CaseStudy() {
  const { slug } = useParams()
  const project = getProject(slug)

  // An unknown slug is a 404, not a blank page.
  if (!project) return <Navigate to="/404" replace />

  return <CaseStudyView key={project.slug} project={project} />
}

function CaseStudyView({ project }: { project: NonNullable<ReturnType<typeof getProject>> }) {
  const next = getAdjacentProject(project.slug)
  const { scrollTo } = useSmoothScroll()
  const [active, setActive] = useState<string | null>(null)

  useSeo({
    title: `${project.title} — ${project.subtitle} | ${site.name}`,
    description: project.description,
    path: `/work/${project.slug}`,
    type: 'article',
  })

  // Sections that actually have content. A spine entry with nothing written
  // yet is skipped rather than rendered as an empty heading.
  const sections = useMemo(
    () =>
      caseSpine
        .map((entry, i) => ({
          ...entry,
          number: String(i + 1).padStart(2, '0'),
          content: project.content[entry.id],
        }))
        .filter((entry) => entry.content && entry.content.blocks.length > 0),
    [project],
  )

  /* Track the section in view to highlight the sticky index. */
  useEffect(() => {
    const nodes = sections
      .map((section) => document.getElementById(section.id))
      .filter((node): node is HTMLElement => Boolean(node))
    if (!nodes.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: 0 },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [sections])

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <header
        className="pt-28 sm:pt-36"
        style={{ backgroundColor: project.identity.bg, color: project.identity.ink }}
      >
        <div className="shell pb-14 sm:pb-16">
          <Reveal
            className="flex flex-wrap items-baseline justify-between gap-4 border-b pb-5"
            style={{ borderColor: `${project.identity.ink}22` }}
            y={12}
          >
            <p className="eyebrow" style={{ color: project.identity.ink, opacity: 0.6 }}>
              <span className="tabular-nums">{project.index}</span>
              <span className="mx-2 opacity-40">/</span>
              {project.category}
            </p>
            <p className="eyebrow" style={{ color: project.identity.accent }}>
              Case study
            </p>
          </Reveal>

          <h1 className="mt-10 text-display font-medium uppercase">
            <TextReveal lines={[project.title]} delay={80} />
          </h1>

          <div className="mt-8 grid gap-8 lg:grid-cols-12">
            <Reveal className="lg:col-span-5" delay={140}>
              <p className="text-h3 font-normal" style={{ color: project.identity.ink }}>
                {project.subtitle}
              </p>
            </Reveal>
            <Reveal className="lg:col-span-6 lg:col-start-7" delay={200}>
              <p className="text-lead" style={{ color: project.identity.ink, opacity: 0.7 }}>
                {project.description}
              </p>

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-cursor="Visit"
                  className="mt-6 inline-flex items-center gap-2.5 rounded-full px-5 py-3 text-[0.9375rem] font-medium transition-transform duration-300 hover:-translate-y-0.5"
                  style={{ backgroundColor: project.identity.accent, color: project.identity.bg }}
                >
                  Visit live site
                  <svg
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="square"
                  >
                    <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" />
                  </svg>
                </a>
              )}
            </Reveal>
          </div>
        </div>

        {/* Hero visual, full-bleed within the shell */}
        <div className="shell pb-16 sm:pb-20">
          <Reveal y={32}>
            {/* Matches the generated artwork's own 16:10 ratio so the hero
                composition is shown whole. */}
            <div
              className="relative aspect-16/10 w-full overflow-hidden rounded-card"
              style={{ backgroundColor: project.identity.bg }}
            >
              {project.heroImage ? (
                <img
                  src={project.heroImage}
                  alt={project.heroAlt}
                  fetchPriority="high"
                  decoding="async"
                  className="size-full object-cover"
                />
              ) : (
                <ProjectVisual project={project} />
              )}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-card ring-1 ring-inset ring-black/[0.07]"
              />
            </div>
          </Reveal>
        </div>
      </header>

      {/* --------------------------------------------------------------- Meta */}
      <div className="shell py-12 sm:py-16">
        <ProjectMeta project={project} />
      </div>

      {/* ----------------------------------------------------------- Sections */}
      <div className="shell pb-section">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
          {/* Sticky index — desktop only; on mobile it would just be a list
              of links above content the reader is already scrolling through. */}
          <aside className="hidden lg:col-span-3 lg:block">
            <nav aria-label="Case study sections" className="sticky top-28">
              <p className="eyebrow border-b border-border pb-3">Contents</p>
              <ol className="mt-4 max-h-[60vh] space-y-0.5 overflow-y-auto pr-2">
                {sections.map((section) => (
                  <li key={section.id}>
                    <button
                      type="button"
                      onClick={() => scrollTo(`#${section.id}`, { offset: -100 })}
                      className={cn(
                        'flex w-full items-baseline gap-3 rounded-sm py-1.5 text-left text-small transition-colors duration-300',
                        active === section.id
                          ? 'text-foreground'
                          : 'text-subtle hover:text-foreground',
                      )}
                      aria-current={active === section.id ? 'true' : undefined}
                    >
                      <span
                        className={cn(
                          'font-mono text-[0.6875rem] tabular-nums transition-colors duration-300',
                          active === section.id ? 'text-accent' : 'text-border-strong',
                        )}
                      >
                        {section.number}
                      </span>
                      {section.title}
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <div className="lg:col-span-8 lg:col-start-5">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-28 border-t border-border py-14 first:border-t-0 first:pt-0 sm:py-16"
                aria-labelledby={`${section.id}-heading`}
              >
                <Reveal className="flex items-baseline gap-4" y={12}>
                  <span className="eyebrow tabular-nums" style={{ color: project.identity.accent }}>
                    {section.number}
                  </span>
                  <h2 id={`${section.id}-heading`} className="text-h3 font-medium">
                    {section.title}
                  </h2>
                </Reveal>

                {section.content?.lede && (
                  <Reveal className="mt-6" delay={60}>
                    <p className="max-w-2xl text-h4 font-normal text-foreground">
                      {section.content.lede}
                    </p>
                  </Reveal>
                )}

                <div className="mt-8 space-y-8 sm:mt-10 sm:space-y-10">
                  {section.content?.blocks.map((block, i) => (
                    <CaseBlock key={`${section.id}-${i}`} block={block} project={project} />
                  ))}
                </div>
              </section>
            ))}

            {sections.length === 0 && (
              <div className="rounded-card border border-dashed border-border-strong p-8">
                <p className="eyebrow">No sections yet</p>
                <p className="mt-3 max-w-prose text-muted">
                  This case study has no content blocks. Add them under{' '}
                  <code className="font-mono text-small">content</code> for{' '}
                  <code className="font-mono text-small">{project.slug}</code> in{' '}
                  <code className="font-mono text-small">src/data/projects.ts</code>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <NextProject project={next} />
      <ContactSection index="02" />
    </>
  )
}
