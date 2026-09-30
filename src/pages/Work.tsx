import { useSeo } from '@/lib/seo'
import { site } from '@/data/site'
import { projects } from '@/data/projects'
import { PageHeader } from '@/components/layout/PageHeader'
import { ProjectTimeline } from '@/components/project/ProjectTimeline'
import { ContactSection } from '@/components/sections/ContactSection'
import { Reveal } from '@/components/ui/Reveal'

export default function Work() {
  useSeo({
    title: `Work — ${site.name}`,
    description:
      'Selected UI/UX work by Dhananjaya Raut: the live Laxmi Pustak bookstore, Roomora hotel booking, a Chinese language learning app, and the Beautiva skincare storefront.',
    path: '/work',
  })

  return (
    <>
      <PageHeader
        eyebrow="Selected work"
        title={['Case studies,', 'not screenshots.']}
        lede="Written up the way I actually worked on them — the problem first, the interface last, and the parts that had to change in between."
        titleClassName="font-sans font-bold uppercase tracking-tight text-accent"
        meta={[
          { label: 'Projects', value: String(projects.length).padStart(2, '0') },
          { label: 'Disciplines', value: 'Product · UX · UI' },
          { label: 'Status', value: site.availability },
        ]}
      />

      <section className="pb-section" aria-label="Project case studies">
        <ProjectTimeline projects={projects} headingLevel="h2" />

        <div className="shell mt-20 sm:mt-28">
          <Reveal className="border-t border-border pt-8">
            <p className="max-w-prose text-lead text-muted">
              More work is in progress. If you want to see something specific — a flow, a system, or
              the messy middle of a project —{' '}
              <a href={`mailto:${site.email}`} className="link-underline text-foreground">
                just ask
              </a>
              .
            </p>
          </Reveal>
        </div>
      </section>

      <ContactSection index="02" />
    </>
  )
}
