import { Reveal } from '@/components/ui/Reveal'

/**
 * A small human beat between the credentials and the call to action.
 * One idea, one sentence, no illustration.
 */
export function BeyondDesign() {
  return (
    <section className="border-t border-border py-section" aria-labelledby="beyond-heading">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-3" y={16}>
            <h2 id="beyond-heading" className="eyebrow">
              Beyond design
            </h2>
          </Reveal>

          <Reveal className="lg:col-span-8 lg:col-start-5" delay={80} y={20}>
            <p className="text-h3 font-normal text-foreground">
              When I&rsquo;m not designing interfaces, I&rsquo;m usually experimenting with code,
              exploring new technologies, building side projects, or{' '}
              <span className="font-serif italic text-muted">
                questioning why a perfectly good interface needed another button.
              </span>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
