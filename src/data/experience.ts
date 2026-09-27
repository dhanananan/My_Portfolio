/**
 * EDIT ME — work experience + background timeline.
 * ---------------------------------------------------------------------------
 * Only add entries you can stand behind. Anything left as `null` simply does
 * not render, so a half-filled entry degrades cleanly instead of showing gaps.
 *
 * Sourced from your CV (Sep 2026). It lists no employer or dates, so:
 *   - `workProjects` is the CV's "Projects Work on" section, entry for entry
 *     and in the CV's own wording — no company or date has been invented.
 *   - `experience` below is education, reverse-chronological, with the
 *     ongoing degree marked `current`.
 * The day there's a real employer, add it as a new section rather than
 * backfilling a company into either list.
 */

export type WorkProject = {
  title: string
  /** What was done — the CV's own first bullet. */
  description: string
  /** Straight from the CV's "Tools Used" line. */
  tools: string[]
  /** The CV's "Outcome" line. */
  outcome: string
  /** Set only when the project also has a case study on this site. */
  caseStudy?: string
}

export const workProjects: WorkProject[] = [
  {
    title: 'Assignment Management Web Platform',
    description:
      'Designed UI for Client, Writer, Customer Service, and Admin dashboards with side menu navigation and responsive layouts.',
    tools: ['Figma', 'Adobe XD'],
    outcome: 'Improved user navigation and productivity through a clean, functional interface.',
  },
  {
    title: 'Writer Dashboard Interface',
    description:
      'Created the “Current Assignment” page with Open (Unassigned), My List, and All List sections for writers.',
    tools: ['Figma'],
    outcome: 'Enhanced workflow efficiency with intuitive assignment management.',
  },
  {
    title: 'Thrift Clothing Website',
    description: 'Designed a modern e-commerce interface for selling thrift clothing online.',
    tools: ['Figma', 'Adobe Photoshop'],
    outcome: 'Increased product visibility and engagement with clear navigation and strong visuals.',
  },
  {
    title: 'E-Commerce Rental Website',
    description: 'Developed wireframes and interface design for an online rental marketplace.',
    tools: ['Figma'],
    outcome: 'Simplified product search and booking with a user-friendly rental process flow.',
  },
  {
    title: 'AI-Powered Hotel Booking System',
    description:
      'Designed a clean, modern booking interface with AI integration for personalized hotel recommendations.',
    tools: ['Figma'],
    outcome: 'Improved booking speed and customer satisfaction through intuitive design.',
    caseStudy: '/work/roomora',
  },
  {
    title: 'Smart Bus Tracking App',
    description:
      'Created a mobile app interface to track buses in real-time with live location and ETA features.',
    tools: ['Figma'],
    outcome: 'Reduced waiting times with a clear, map-based interface.',
  },
  {
    title: 'Portfolio Website (Minimal & Futuristic)',
    description:
      'Designed a personal portfolio with GSAP animations for smooth interactive effects.',
    tools: ['Figma'],
    outcome:
      'Built a strong personal brand identity with a visually striking, responsive design.',
  },
  {
    title: 'Event Management Dashboard (Concept)',
    description:
      'Created a web dashboard for managing events, ticket sales, and analytics.',
    tools: ['Figma', 'Miro'],
    outcome:
      'Provided a clean and organized interface for efficient event tracking and management.',
  },
]

export type ExperienceEntry = {
  period: string
  role: string
  organisation: string
  /** Optional one-liner. Set to null to omit. */
  description: string | null
  /** Optional focus tags shown as a small list. Empty array hides the row. */
  focus: string[]
  current?: boolean
}

export const experience: ExperienceEntry[] = [
  {
    period: 'Ongoing',
    role: 'Bachelor of Computer Science & IT (BCsIT)',
    organisation: 'Himalayan College of Management, Kamalpokhari, Kathmandu',
    description:
      'Completing my degree while designing UI for a series of self-directed and academic projects — see Selected Work.',
    focus: ['UI design', 'Design systems'],
    current: true,
  },
  {
    period: '2022',
    role: '+2 (Science) — GPA 3.26',
    organisation: 'Brillent College, Kathmandu',
    description: null,
    focus: [],
  },
  {
    period: '2020',
    role: 'SEE (Secondary Education Examination) — GPA 3.50',
    organisation: 'National Model Science School, Gongabu, Kathmandu',
    description: null,
    focus: [],
  },
]

/**
 * Kept for the timeline component's structure, but everything real currently
 * lives in `experience` above — leave empty rather than duplicate entries.
 */
export const education: ExperienceEntry[] = []
