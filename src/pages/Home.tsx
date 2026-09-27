import { useSeo } from '@/lib/seo'
import { site } from '@/data/site'
import { Hero } from '@/components/sections/Hero'
import { SelectedWork } from '@/components/sections/SelectedWork'
import { ProcessSection } from '@/components/sections/ProcessSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { BeyondDesign } from '@/components/sections/BeyondDesign'
import { ContactSection } from '@/components/sections/ContactSection'

export default function Home() {
  useSeo({
    title: `${site.name} — ${site.role}`,
    description:
      'Dhananjaya Raut is a UI/UX designer based in Nepal, designing digital experiences that are simple, intuitive, and meaningful.',
    path: '/',
  })

  return (
    <>
      {/* Home stays work-led: the range is stated once in the hero ticker,
          and the full capability / tools / experience detail lives on /about
          rather than being repeated in two places. */}
      <Hero />
      <SelectedWork limit={3} />
      <ProcessSection />
      <AboutSection />
      <BeyondDesign />
      <ContactSection index="04" />
    </>
  )
}
