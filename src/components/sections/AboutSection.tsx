import { site } from '@/data/site'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import { Portrait } from '@/components/ui/Portrait'
import { TextReveal } from '@/components/ui/TextReveal'

/**
 * About — the home-page teaser. The full version lives at /about.
 * `variant="page"` drops the section chrome and the closing CTA.
 */
export function AboutSection({ variant = 'home' }: { variant?: 'home' | 'page' }) {
  const isPage = variant === 'page'

  return (
    <section className="py-section" aria-labelledby="about-heading">
      <div className="shell">
        {!isPage && (
          <SectionHeading
            index="03"
            title={<span id="about-heading">About</span>}
            lede="Short version: I design the thing, then I want to know how it gets built."
          />
        )}

        <div className={`grid gap-12 lg:grid-cols-12 lg:gap-12 ${isPage ? '' : 'mt-16 sm:mt-20'}`}>
          <Reveal className="lg:col-span-5 lg:col-start-1" y={28}>
            <Portrait className="max-w-sm lg:max-w-none" />
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-border pt-6">
              <Fact label="Based in" value={site.location} />
              <Fact label="Local time" value={site.timezone} />
              <Fact label="Focus" value="UI & interface design" />
              <Fact label="Also writes" value="HTML, CSS, JavaScript, React" />
            </dl>
          </Reveal>

          <div className="lg:col-span-6 lg:col-start-7">
            <h2 id={isPage ? 'about-heading' : undefined} className="text-h1 font-medium uppercase">
              <TextReveal
                lines={['Designer.', 'Problem solver.', 'Builder.']}
                immediate={false}
                lineClassName="leading-[0.98]"
              />
            </h2>

            <Reveal className="mt-10 space-y-6 text-lead text-muted" delay={120}>
              <p>
                I&rsquo;m a UI/UX designer who enjoys turning complex problems into simple, intuitive
                digital experiences.
              </p>
              <p>
                I work across research, interaction design, visual design, prototyping, and frontend
                development — and I also enjoy understanding how the interfaces I design are actually
                built. Knowing what a layout costs to implement tends to produce better layouts.
              </p>
            </Reveal>

            <Reveal className="mt-10 border-t border-border pt-8" delay={180}>
              <p className="eyebrow mb-4">Currently</p>
              <ul className="space-y-3 text-muted">
                {/* Dot is nudged to the optical centre of the first line, not
                    the top of the line box. */}
                <li className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.7em] size-1 shrink-0 rounded-full bg-accent" />
                  Completing a Bachelor&rsquo;s in Computer Science &amp; IT at Himalayan College of
                  Management.
                </li>
                <li className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.7em] size-1 shrink-0 rounded-full bg-accent" />
                  Getting deeper into design systems and how they survive contact with a codebase.
                </li>
                <li className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.7em] size-1 shrink-0 rounded-full bg-accent" />
                  Building self-directed projects to keep the gap between design and build narrow.
                </li>
              </ul>
            </Reveal>

            <Reveal className="mt-10 flex flex-wrap gap-3" delay={220}>
              {isPage ? (
                <Button href={site.cvUrl} download variant="secondary" withArrow>
                  Download CV
                </Button>
              ) : (
                <Button to="/about" variant="secondary" withArrow>
                  More about me
                </Button>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="eyebrow">{label}</dt>
      <dd className="mt-1.5 text-small text-foreground">{value}</dd>
    </div>
  )
}
