export type SkillGroup = {
  index: string
  title: string
  note: string
  items: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    index: '01',
    title: 'UX Design',
    note: 'Deciding what to build, and why.',
    items: [
      'User Research',
      'User Flows',
      'Information Architecture',
      'Wireframing',
      'Usability Testing',
      'Interaction Design',
    ],
  },
  {
    index: '02',
    title: 'UI Design',
    note: 'Making it clear, consistent and considered.',
    items: [
      'Visual Design',
      'Typography',
      'Color Systems',
      'Design Systems',
      'Responsive Design',
      'Prototyping',
    ],
  },
  {
    index: '03',
    title: 'Product',
    note: 'Connecting design work to outcomes.',
    items: ['Problem Solving', 'Product Thinking', 'Design Strategy', 'Developer Collaboration'],
  },
  {
    index: '04',
    title: 'Development',
    note: 'Understanding how the work gets built.',
    items: ['HTML & CSS', 'JavaScript', 'React', 'Python'],
  },
]
