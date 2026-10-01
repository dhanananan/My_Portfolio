import { Reveal } from '@/components/ui/Reveal'

/** A short, quiet note between the credentials and the call to action. */
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
            <p className="max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
              Outside of design work, I experiment with code, try out new technologies and build
              side projects.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
