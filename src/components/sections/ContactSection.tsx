import { site, socials } from '@/data/site'
import { Reveal } from '@/components/ui/Reveal'
import { TextReveal } from '@/components/ui/TextReveal'
import { Button } from '@/components/ui/Button'

/**
 * The closing section. Inverted, full-bleed, and the last thing anyone reads —
 * so it carries the one action the whole site is built around.
 */
export function ContactSection({ index = '04' }: { index?: string }) {
  return (
    <section className="bg-ink text-ink-foreground" aria-labelledby="contact-heading">
      <div className="shell py-section">
        <Reveal className="flex items-baseline justify-between gap-6 border-t border-ink-border pt-4" y={12}>
          <p className="eyebrow text-ink-muted">
            <span className="tabular-nums">{index}</span>
            <span className="mx-2 opacity-40">/</span>
            Contact
          </p>
          <p className="eyebrow flex items-center gap-2 text-ink-muted">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
            {site.availability}
          </p>
        </Reveal>

        <p id="contact-heading" className="eyebrow mt-14 text-ink-muted">
          Have a project in mind?
        </p>

        <h2 className="mt-6 text-h1 font-medium">
          <TextReveal
            lines={['Let’s create something', 'worth remembering.']}
            immediate={false}
            lineClassName="leading-[0.98]"
          />
        </h2>

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <Reveal delay={80}>
              <p className="max-w-prose text-lead text-ink-muted">
                Whether it&rsquo;s a product that needs designing properly, an interface that has
                stopped making sense, or a role you think I&rsquo;d fit — I&rsquo;d like to hear
                about it.
              </p>
            </Reveal>

            <Reveal className="mt-10" delay={140}>
              <a
                href={`mailto:${site.email}`}
                data-cursor="Email"
                className="link-underline inline-block text-h3 font-medium text-ink-foreground transition-colors duration-300 hover:text-accent"
              >
                {site.email}
              </a>
            </Reveal>

            <Reveal className="mt-10 flex flex-wrap gap-3" delay={200}>
              <Button href={`mailto:${site.email}`} variant="inverse" size="lg" withArrow magnetic>
                Let&rsquo;s talk
              </Button>
              <Button
                to="/contact"
                variant="secondary"
                size="lg"
                className="border-ink-border text-ink-foreground hover:border-ink-foreground hover:bg-ink-foreground hover:text-ink"
              >
                Contact page
              </Button>
            </Reveal>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal delay={120}>
              <p className="eyebrow mb-2 text-ink-muted">Elsewhere</p>
              <ul>
                <li>
                  <a
                    href={site.cvUrl}
                    download
                    className="group flex items-center justify-between gap-6 border-b border-ink-border py-4 transition-colors duration-300 hover:text-accent"
                  >
                    <span className="text-h4 font-medium">Download CV</span>
                    <span className="flex items-center gap-3">
                      <span className="hidden text-small text-ink-muted sm:inline">PDF</span>
                      <svg
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                        className="size-4 shrink-0 transition-transform duration-500 ease-out-expo group-hover:translate-y-1"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="square"
                      >
                        <path d="M8 2.5v8M4.5 7l3.5 3.5L11.5 7M3 13.5h10" />
                      </svg>
                    </span>
                  </a>
                </li>
                {socials
                  .filter((social) => social.label !== 'Email')
                  .map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group flex items-center justify-between gap-6 border-b border-ink-border py-4 transition-colors duration-300 hover:text-accent"
                      >
                        <span className="text-h4 font-medium">{social.label}</span>
                        <span className="flex items-center gap-3">
                          <span className="hidden text-small text-ink-muted sm:inline">
                            {social.ready ? social.handle : '[Add link]'}
                          </span>
                          <svg
                            viewBox="0 0 16 16"
                            aria-hidden="true"
                            className="size-4 shrink-0 transition-transform duration-500 ease-out-expo group-hover:translate-x-1 group-hover:-translate-y-1"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="square"
                          >
                            <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" />
                          </svg>
                        </span>
                      </a>
                    </li>
                  ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
