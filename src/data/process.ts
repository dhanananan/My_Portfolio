export type ProcessStep = {
  index: string
  title: string
  summary: string
  /** Revealed on hover (desktop) or when the row scrolls into view (mobile). */
  detail: string
  activities: string[]
}

export const processSteps: ProcessStep[] = [
  {
    index: '01',
    title: 'Discover',
    summary: 'Understand the users, business goals, and problem space.',
    detail:
      'Before anything gets drawn, I want to know who this is for, what they are actually trying to get done, and what the business needs in return. Assumptions get written down here so they can be tested later instead of shipped by accident.',
    activities: ['Stakeholder conversations', 'User interviews', 'Competitive teardown', 'Context research'],
  },
  {
    index: '02',
    title: 'Define',
    summary: 'Turn research and requirements into clear product opportunities.',
    detail:
      'Research is only useful once it becomes a decision. I narrow findings into a sharp problem statement, map the information architecture, and agree on what success looks like before the first screen exists.',
    activities: ['Problem framing', 'Personas & journeys', 'Information architecture', 'Success criteria'],
  },
  {
    index: '03',
    title: 'Design',
    summary: 'Explore user flows, wireframes, interactions, and visual systems.',
    detail:
      'I work from structure outwards — flows, then wireframes, then interface. Visual decisions are made inside a system of type, spacing and colour so the product stays consistent as it grows.',
    activities: ['User flows', 'Wireframes', 'UI design', 'Design system'],
  },
  {
    index: '04',
    title: 'Test',
    summary: 'Validate concepts and identify usability problems.',
    detail:
      'A prototype exists to be argued with. I put realistic tasks in front of real people, watch where they hesitate, and separate what they say from what they do.',
    activities: ['Prototyping', 'Task-based testing', 'Heuristic review', 'Accessibility checks'],
  },
  {
    index: '05',
    title: 'Iterate',
    summary: 'Refine the experience using feedback and evidence.',
    detail:
      'Findings become a prioritised list, not a wishlist. I fix what blocks people first, then hand off with the detail engineers actually need — states, edge cases, and the reasoning behind each decision.',
    activities: ['Prioritised fixes', 'Interaction detail', 'Developer handoff', 'Post-launch review'],
  },
]
