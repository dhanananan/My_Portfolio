import { Link } from 'react-router-dom'
import { nav, site, socials } from '@/data/site'
import { projects } from '@/data/projects'
import { useSmoothScroll } from '@/lib/SmoothScroll'

export function Footer() {
  const { scrollTo } = useSmoothScroll()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="shell border-t border-ink-border py-14 sm:py-16">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <p className="text-h4 font-medium">{site.name}</p>
            <p className="eyebrow mt-2 text-ink-muted">{site.role}</p>
            <p className="mt-6 max-w-xs text-small text-ink-muted">
              {site.locationLong} · {site.timezone}
            </p>
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <p className="eyebrow mb-5 text-ink-muted">Navigate</p>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="link-underline text-small text-ink-foreground/80 hover:text-ink-foreground">
                  Index
                </Link>
              </li>
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="link-underline text-small text-ink-foreground/80 hover:text-ink-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-2">
            <p className="eyebrow mb-5 text-ink-muted">Work</p>
            <ul className="space-y-3">
              {projects.map((project) => (
                <li key={project.slug}>
                  <Link
                    to={`/work/${project.slug}`}
                    className="link-underline text-small text-ink-foreground/80 hover:text-ink-foreground"
                  >
                    {project.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="eyebrow mb-5 text-ink-muted">Elsewhere</p>
            <ul className="space-y-3">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer noopener"
                    className="link-underline text-small text-ink-foreground/80 hover:text-ink-foreground"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse gap-6 border-t border-ink-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-small text-ink-muted">
            © {year} {site.name}. Designed and built in Nepal — probably twice.
          </p>
          <button
            type="button"
            onClick={() => scrollTo(0)}
            className="group flex items-center gap-2 self-start text-small text-ink-muted transition-colors duration-300 hover:text-ink-foreground sm:self-auto"
          >
            Back to top
            <svg
              viewBox="0 0 16 16"
              aria-hidden="true"
              className="size-4 transition-transform duration-400 ease-out-expo group-hover:-translate-y-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
            >
              <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  )
}
