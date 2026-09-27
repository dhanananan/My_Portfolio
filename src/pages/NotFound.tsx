import { Link, useLocation } from 'react-router-dom'
import { useSeo } from '@/lib/seo'
import { site } from '@/data/site'
import { projects } from '@/data/projects'
import { Button } from '@/components/ui/Button'
import { TextReveal } from '@/components/ui/TextReveal'
import { Reveal } from '@/components/ui/Reveal'

export default function NotFound() {
  const location = useLocation()

  useSeo({
    title: `Page not found — ${site.name}`,
    description: 'That page does not exist. Here are the ones that do.',
    path: location.pathname,
  })

  return (
    <section className="pt-32 pb-section sm:pt-40">
      <div className="shell">
        <Reveal className="flex items-baseline justify-between gap-6 border-b border-border pb-5" y={12}>
          <p className="eyebrow">
            <span className="text-accent">●</span>
            <span className="ml-2">Error 404</span>
          </p>
          <p className="eyebrow truncate">{location.pathname}</p>
        </Reveal>

        <h1 className="mt-10 text-display font-medium uppercase">
          <TextReveal lines={['Nothing', 'here.']} delay={80} />
        </h1>

        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-5" delay={160}>
            <p className="text-lead text-muted">
              This page either moved, never existed, or was quietly removed during a redesign. All
              three happen.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/" size="lg" withArrow>
                Back to home
              </Button>
              <Button to="/work" variant="secondary" size="lg">
                See the work
              </Button>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-6 lg:col-start-7" delay={220}>
            <p className="eyebrow border-t border-border pt-4">Try one of these</p>
            <ul className="mt-2">
              {projects.map((project) => (
                <li key={project.slug}>
                  <Link
                    to={`/work/${project.slug}`}
                    className="group flex items-baseline justify-between gap-6 border-b border-border py-4 transition-colors duration-300 hover:text-accent"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="eyebrow tabular-nums">{project.index}</span>
                      <span className="text-h4 font-medium">{project.title}</span>
                    </span>
                    <svg
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                      className="size-4 shrink-0 self-center transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="square"
                    >
                      <path d="M3 8h10M8.5 3.5 13 8l-4.5 4.5" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
