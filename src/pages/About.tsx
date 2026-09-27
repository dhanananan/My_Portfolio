import { useSeo } from '@/lib/seo'
import { site } from '@/data/site'
import { PageHeader } from '@/components/layout/PageHeader'
import { AboutSection } from '@/components/sections/AboutSection'
import { SkillsSection } from '@/components/sections/SkillsSection'
import { ToolsSection } from '@/components/sections/ToolsSection'
import { WorkExperience } from '@/components/sections/WorkExperience'
import { ExperienceTimeline } from '@/components/sections/ExperienceTimeline'
import { BeyondDesign } from '@/components/sections/BeyondDesign'
import { ContactSection } from '@/components/sections/ContactSection'

export default function About() {
  useSeo({
    title: `About — ${site.name}`,
    description:
      'UI/UX designer based in Nepal working across research, interaction design, visual design, prototyping and frontend development.',
    path: '/about',
  })

  return (
    <>
      <PageHeader
        eyebrow="About"
        title={['Design is a', 'thinking job.']}
        lede="I design interfaces, and I care about how they get built. The two are not separate skills — knowing the cost of a decision is part of making a good one."
        meta={[
          { label: 'Based in', value: site.locationLong },
          { label: 'Role', value: site.role },
          { label: 'Availability', value: site.availability },
        ]}
      />

      <AboutSection variant="page" />
      <SkillsSection index="02" />
      <ToolsSection />
      <WorkExperience index="03" />
      <ExperienceTimeline index="04" />
      <BeyondDesign />
      <ContactSection index="05" />
    </>
  )
}
