/**
 * Site-wide profile, navigation and contact details.
 * ---------------------------------------------------------------------------
 * EDIT ME: every value below is placeholder-safe. Replace the URLs marked
 * `# TODO` with real ones — nothing else in the codebase hard-codes them.
 */

export type NavItem = {
  label: string
  href: string
  /** Matches nested routes too (e.g. /work/roomora highlights "Work"). */
  matchPrefix?: boolean
}

export type SocialLink = {
  label: string
  href: string
  /** Shown next to the label in lists — e.g. the handle or domain. */
  handle: string
  /** Set false for links you have not filled in yet. */
  ready: boolean
}

export const site = {
  name: 'Dhananjaya Raut',
  shortName: 'Dhananjaya',
  role: 'UI/UX Designer',
  location: 'Kathmandu, Nepal',
  locationLong: 'Based in Kathmandu, Nepal',
  availability: 'Open to new opportunities',
  positioning:
    'UI/UX Designer focused on creating simple, intuitive, and meaningful digital experiences.',
  /** Used for canonical URLs, sitemap and Open Graph. Replace on deploy. */
  url: 'https://dhananjayaraut.com',
  email: 'binanjaya23@gmail.com',
  /** Optional — leave empty to hide the phone row in the contact page. */
  phone: '+977 9863212048',
  timezone: 'GMT+5:45',
  /** Served from /public. Replace the file to update the downloadable CV. */
  cvUrl: '/Dhananjaya-Raut-CV.pdf',
  /**
   * Contact-form delivery. There is no server behind this site, so messages
   * are relayed to `email` by Web3Forms. The access key is meant to be public
   * (it can only *send to* the address it was issued for), and comes from the
   * `VITE_WEB3FORMS_KEY` environment variable — see README "Contact form".
   * While it is empty the form falls back to opening the visitor's mail app.
   */
  formEndpoint: 'https://api.web3forms.com/submit',
  formAccessKey: (import.meta.env.VITE_WEB3FORMS_KEY as string | undefined) ?? '',
} as const

export const nav: NavItem[] = [
  { label: 'Work', href: '/work', matchPrefix: true },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export const socials: SocialLink[] = [
  {
    label: 'Email',
    href: `mailto:${site.email}`,
    handle: site.email,
    ready: true,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/dhananjaya-raut-1aa086393/',
    handle: '/in/dhananjaya-raut-1aa086393',
    ready: true,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/dhanananan',
    handle: '@dhanananan',
    ready: true,
  },
]

/** Capabilities listed in the hero marquee and the about page. */
export const disciplines = [
  'UX Research',
  'User Flows',
  'Information Architecture',
  'Wireframing',
  'Interaction Design',
  'UI Design',
  'Design Systems',
  'Prototyping',
  'Usability Testing',
  'Responsive Design',
  'Frontend Development',
] as const
