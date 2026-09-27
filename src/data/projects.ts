/**
 * PROJECT CONTENT
 * ===========================================================================
 * Everything a case study renders lives here. Components never hard-code copy.
 *
 * To add a project:
 *   1. append an object to `projects`
 *   2. give it a unique `slug` (that becomes /work/<slug>)
 *   3. fill in as many `content` sections as you have — a section with no
 *      `blocks` simply doesn't render, so a case study degrades to "shorter"
 *      rather than "visibly unfinished."
 *
 * Honesty rules baked into this file:
 *   - No invented statistics, clients, testimonials or research results.
 *   - Nothing not yet gathered gets a `[Add …]`-style stand-in in rendered
 *     copy — that reads as a broken CMS, not a placeholder, to a visitor.
 *     Leave the section out, or word it honestly without inventing the
 *     missing fact (see `outcome` blocks below for the pattern).
 *   - Personas and journeys are labelled as assumptions until validated.
 *   - Project-level fields (`year`, `timeline`, `role`, `tools`) that are
 *     still unconfirmed keep a bracketed `[Add …]` value here in the data —
 *     `ProjectMeta` knows to skip rendering that grid cell rather than
 *     showing the bracket, so it's safe to leave unfilled without it ever
 *     reaching a visitor.
 */

/* ---------------------------------------------------------------------------
 * The 16-part case-study spine. Shared by every project so numbering,
 * ordering and anchor links stay consistent site-wide.
 * ------------------------------------------------------------------------- */

export const caseSpine = [
  { id: 'overview', title: 'Overview' },
  { id: 'problem', title: 'The Problem' },
  { id: 'research', title: 'Research' },
  { id: 'personas', title: 'User Personas' },
  { id: 'journey', title: 'User Journey' },
  { id: 'ia', title: 'Information Architecture' },
  { id: 'flow', title: 'User Flow' },
  { id: 'wireframes', title: 'Wireframes' },
  { id: 'exploration', title: 'Design Exploration' },
  { id: 'system', title: 'Design System' },
  { id: 'ui', title: 'Final UI' },
  { id: 'prototype', title: 'Prototype' },
  { id: 'testing', title: 'Usability Testing' },
  { id: 'iterations', title: 'Iterations' },
  { id: 'outcome', title: 'Outcome' },
  { id: 'learnings', title: 'Learnings' },
] as const

export type CaseSectionId = (typeof caseSpine)[number]['id']

/* ---------------------------------------------------------------------------
 * Content blocks — the renderer switches on `type`.
 * ------------------------------------------------------------------------- */

export type Block =
  | { type: 'lead'; text: string }
  | { type: 'prose'; text: string }
  | { type: 'list'; title?: string; items: string[] }
  | { type: 'definitions'; items: { term: string; detail: string }[] }
  | {
      type: 'personas'
      note?: string
      items: {
        name: string
        role: string
        context: string
        goals: string[]
        frustrations: string[]
      }[]
    }
  | {
      type: 'journey'
      note?: string
      stages: { stage: string; doing: string; thinking: string; sentiment: 1 | 2 | 3 | 4 | 5 }[]
    }
  | { type: 'tree'; root: string; branches: { label: string; children: string[] }[] }
  | { type: 'flow'; steps: { label: string; note?: string; branch?: string }[] }
  | {
      type: 'media'
      label: string
      caption?: string
      ratio?: '16/9' | '4/3' | '1/1' | '3/4' | '21/9'
      /** Drop a real export in /public and point here; falls back if missing. */
      src?: string
      alt: string
    }
  | {
      type: 'mediaPair'
      items: { label: string; caption?: string; src?: string; alt: string }[]
    }
  | { type: 'swatches'; items: { name: string; value: string; usage: string }[] }
  | { type: 'iterations'; items: { before: string; after: string; reason: string }[] }

export type CaseSection = {
  lede?: string
  blocks: Block[]
}

/* ------------------------------------------------------------------------- */

export type Project = {
  slug: string
  index: string
  title: string
  subtitle: string
  category: string
  description: string
  year: string
  role: string
  timeline: string
  platform: string
  tools: string[]
  /** Optional real hero export — falls back to the generated visual. */
  heroImage?: string
  heroAlt: string
  /**
   * Set only for a project that is a real, currently-live product — renders
   * a "Visit live site" link on the case study and a small badge on the
   * project row. Omit entirely for concept / redesign explorations.
   */
  liveUrl?: string
  /** Per-project palette. Keeps each case study distinct inside one system. */
  identity: {
    bg: string
    ink: string
    accent: string
    soft: string
  }
  /** Which generated visual to draw when no image is supplied. Omit when a
   *  real `heroImage` always exists, so a placeholder is never drawn for a
   *  real product. */
  visual?: 'roomora' | 'language' | 'beautiva'
  content: Partial<Record<CaseSectionId, CaseSection>>
}

/* ===========================================================================
 * 01 — LAXMI PUSTAK
 * ---------------------------------------------------------------------------
 * The one real, currently-live shipped product in this portfolio — everything
 * else here is concept / redesign work. Role and tools are left as editable
 * placeholders rather than guessed, since that is a fact only the owner of
 * the work can confirm accurately.
 * ========================================================================= */

const laxmiPustak: Project = {
  slug: 'laxmi-pustak',
  index: '01',
  title: 'Laxmi Pustak',
  subtitle: 'Online Bookstore & Stationery',
  category: 'Web Design & Development',
  description:
    'A live online bookstore and stationery store for a real business in Nepal — shipped and in use, not a concept.',
  year: '[Add year]',
  role: '[Add your role — design, development, or both]',
  timeline: '[Add timeline]',
  platform: 'Responsive web',
  tools: ['[Add tools]'],
  heroImage: '/work/laxmi-pustak/hero.webp',
  heroAlt:
    'Laxmi Pustak online bookstore homepage — hero banner, shop-by-category, and product listings.',
  liveUrl: 'https://laxmipustak.com/',
  identity: { bg: '#F5F1EA', ink: '#152238', accent: '#C6720A', soft: '#E7E1D3' },
  content: {
    overview: {
      lede: 'A working storefront, not a mockup — the link below goes to the real thing.',
      blocks: [
        {
          type: 'prose',
          text: 'Laxmi Pustak Bhandar is a bookstore and stationery business in Nepal. The site handles browsing by category, product listings with live pricing and discounts, and checkout — built and shipped for real customers rather than presented as a concept.',
        },
        {
          type: 'definitions',
          items: [
            { term: 'Product type', detail: 'E-commerce — books & stationery' },
            { term: 'Status', detail: 'Live and in production' },
          ],
        },
      ],
    },
    ui: {
      lede: 'Homepage and product discovery, as they run in production today.',
      blocks: [
        {
          type: 'media',
          label: 'Homepage',
          ratio: '16/9',
          caption: 'Hero banner, category entry point, and live promotions',
          alt: 'Laxmi Pustak homepage with hero banner and shop-by-category section.',
          src: '/work/laxmi-pustak/hero.webp',
        },
        {
          type: 'media',
          label: 'Product listings',
          ratio: '16/9',
          caption: 'Top products with live pricing and discount badges',
          alt: 'Laxmi Pustak product grid showing books with prices and discount badges.',
          src: '/work/laxmi-pustak/products.webp',
        },
      ],
    },
    outcome: {
      blocks: [
        {
          type: 'prose',
          text: 'The store is live and handling real browsing and purchases today rather than sitting in a prototype file.',
        },
      ],
    },
  },
}

/* ===========================================================================
 * 02 — ROOMORA
 * ========================================================================= */

const roomora: Project = {
  slug: 'roomora',
  index: '02',
  title: 'Roomora',
  subtitle: 'Hotel Booking & Recommendation System',
  category: 'Product Design / UX / UI',
  description:
    'A smarter hotel discovery and booking experience designed around traveler preferences and a more intuitive booking journey.',
  year: '[Add year]',
  role: 'UI Design, AI-personalised recommendations',
  timeline: '[Add timeline]',
  platform: 'Responsive web',
  tools: ['Figma'],
  heroImage: '/work/roomora/hero.webp',
  heroAlt: 'Roomora hotel booking homepage — hero search bar with location, dates and guest fields, and partner stats.',
  identity: { bg: '#EDEBE4', ink: '#12211C', accent: '#1F6B54', soft: '#D8E2DB' },
  visual: 'roomora',
  content: {
    overview: {
      lede: 'Booking a hotel is a decision made under pressure — too many options, too little signal.',
      blocks: [
        {
          type: 'prose',
          text: 'Roomora is a hotel discovery and booking concept built around a simple idea: most booking platforms are very good at listing hotels and very bad at helping you choose one. The design work focused on turning an overwhelming list into a guided decision.',
        },
        {
          type: 'definitions',
          items: [
            { term: 'Product type', detail: 'Travel booking platform with preference-based recommendations' },
            { term: 'My role', detail: 'End-to-end — research framing, IA, flows, UI, prototype' },
            { term: 'Scope', detail: 'Search, recommendation, property detail, booking and confirmation' },
          ],
        },
      ],
    },
    problem: {
      lede: 'Travelers are not short of options. They are short of confidence.',
      blocks: [
        {
          type: 'prose',
          text: 'The core friction is not finding hotels — it is comparing them. Filters return hundreds of near-identical results, every property claims to be excellent, and the reasons one option suits a particular trip are buried in review text nobody reads to the end.',
        },
        {
          type: 'list',
          title: 'Problems the design set out to address',
          items: [
            'Results that are ranked by the platform rather than by the traveler',
            'Comparison that forces users to hold details in their head across tabs',
            'Trust signals that are generic instead of relevant to this trip',
            'A checkout flow that reveals real cost only at the final step',
          ],
        },
      ],
    },
    research: {
      lede: 'What I planned to learn, and how.',
      blocks: [
        {
          type: 'prose',
          text: 'The research plan was built to answer one question: how do travelers actually narrow a shortlist? Everything else — filters, layout, ranking — depends on that answer.',
        },
        {
          type: 'list',
          title: 'Methods',
          items: [
            'Semi-structured interviews with recent bookers',
            'Competitive teardown of mainstream booking platforms',
            'Review-content analysis to find which attributes get mentioned unprompted',
            'Heuristic evaluation of existing booking flows',
          ],
        },
      ],
    },
    personas: {
      lede: 'Two proto-personas framed the decisions. Both are assumptions until tested.',
      blocks: [
        {
          type: 'personas',
          note: 'Proto-personas — built from desk research and competitor analysis, written to be disproved by real interviews.',
          items: [
            {
              name: 'Proto-persona A',
              role: 'The deadline traveler',
              context: 'Books late, often on a phone, usually for work.',
              goals: ['Decide fast without regret', 'Know the real total cost', 'Predictable location and check-in'],
              frustrations: ['Too many similar results', 'Fees appearing at checkout', 'Reviews that answer the wrong question'],
            },
            {
              name: 'Proto-persona B',
              role: 'The considered planner',
              context: 'Researches for weeks, compares across devices, plans around experiences.',
              goals: ['Build a shortlist they can return to', 'Match the stay to the trip', 'Feel confident before paying'],
              frustrations: ['Losing a shortlist between sessions', 'No way to compare side by side', 'Generic recommendations'],
            },
          ],
        },
      ],
    },
    journey: {
      lede: 'Where the current experience loses people.',
      blocks: [
        {
          type: 'journey',
          note: 'Hypothesised journey — sentiment is a design assumption to be validated in testing.',
          stages: [
            { stage: 'Trigger', doing: 'Dates and destination are set', thinking: 'This should be quick.', sentiment: 4 },
            { stage: 'Search', doing: 'Opens a platform, applies filters', thinking: 'Why are there still 400 results?', sentiment: 3 },
            { stage: 'Compare', doing: 'Opens tabs, scans reviews', thinking: 'These all look the same.', sentiment: 2 },
            { stage: 'Decide', doing: 'Picks one, second-guesses it', thinking: 'Am I missing a better option?', sentiment: 2 },
            { stage: 'Book', doing: 'Enters details, sees final price', thinking: 'That is not the price I saw.', sentiment: 1 },
            { stage: 'Confirm', doing: 'Receives confirmation', thinking: 'Hope this was right.', sentiment: 3 },
          ],
        },
      ],
    },
    ia: {
      lede: 'Structure first — the interface follows the map.',
      blocks: [
        {
          type: 'tree',
          root: 'Roomora',
          branches: [
            { label: 'Discover', children: ['Search', 'Recommended for you', 'Destinations', 'Saved'] },
            { label: 'Property', children: ['Gallery', 'Rooms & rates', 'Location', 'Reviews', 'Policies'] },
            { label: 'Booking', children: ['Guest details', 'Add-ons', 'Payment', 'Confirmation'] },
            { label: 'Account', children: ['Trips', 'Preferences', 'Payment methods', 'Support'] },
          ],
        },
        {
          type: 'prose',
          text: 'Preferences were pulled out of the account area and surfaced inside discovery. A preference the traveler cannot see while browsing is a preference that does not influence the decision.',
        },
      ],
    },
    flow: {
      lede: 'The shortest honest path from intent to confirmation.',
      blocks: [
        {
          type: 'flow',
          steps: [
            { label: 'Enter destination & dates' },
            { label: 'Set trip preferences', note: 'Optional — skippable, remembered' },
            { label: 'Ranked results', branch: 'Refine filters' },
            { label: 'Compare shortlist', note: 'Up to 3 side by side' },
            { label: 'Property detail' },
            { label: 'Select room & rate', note: 'Total cost shown here, not later' },
            { label: 'Guest details & payment' },
            { label: 'Confirmation' },
          ],
        },
      ],
    },
    wireframes: {
      lede: 'Low fidelity, fast, deliberately ugly.',
      blocks: [
        {
          type: 'prose',
          text: 'Wireframes stayed greyscale until the structure held up. The goal at this stage was to argue about hierarchy and sequence, not about corner radius.',
        },
        {
          type: 'mediaPair',
          items: [
            {
              label: 'Wireframe — search & results',
              caption: 'Ranking logic made visible',
              alt: 'Greyscale wireframe of the Roomora search results screen.',
            },
            {
              label: 'Wireframe — property detail',
              caption: 'Rates above reviews',
              alt: 'Greyscale wireframe of the Roomora property detail screen.',
            },
          ],
        },
      ],
    },
    exploration: {
      lede: 'Three directions, one question each.',
      blocks: [
        {
          type: 'list',
          title: 'Directions explored',
          items: [
            'Editorial — large imagery, magazine-style property storytelling',
            'Utility — dense, comparison-first, closest to existing platforms',
            'Guided — conversational preference capture that shapes the results',
          ],
        },
        {
          type: 'prose',
          text: 'The final direction borrows the calm of the editorial route and the density of the utility route. Guided preference capture survived as an optional, skippable step rather than a gate.',
        },
        {
          type: 'media',
          label: 'Direction study',
          ratio: '16/9',
          caption: 'Three visual directions side by side',
          alt: 'Three visual design directions explored for Roomora.',
        },
      ],
    },
    system: {
      lede: 'A small system, built to stay consistent as the product grows.',
      blocks: [
        {
          type: 'swatches',
          items: [
            { name: 'Canvas', value: '#EDEBE4', usage: 'Page background' },
            { name: 'Ink', value: '#12211C', usage: 'Primary text' },
            { name: 'Pine', value: '#1F6B54', usage: 'Primary action, confirmed state' },
            { name: 'Mist', value: '#D8E2DB', usage: 'Cards, dividers, inactive' },
          ],
        },
        {
          type: 'list',
          title: 'System scope',
          items: [
            'Type scale with four display steps and two body steps',
            '8pt spacing grid with a 4pt sub-step for dense controls',
            'Component states: default, hover, focus, active, loading, error, empty',
            'Result card as a single component across search, saved and compare',
          ],
        },
      ],
    },
    ui: {
      lede: 'The interface, once the decisions were settled.',
      blocks: [
        {
          type: 'media',
          label: 'Search & recommendations',
          ratio: '16/9',
          caption: 'Ranked results with visible reasoning',
          alt: 'Roomora search results with preference-based recommendations.',
        },
        {
          type: 'mediaPair',
          items: [
            {
              label: 'Property detail',
              caption: 'Rates, location and policy in one scroll',
              alt: 'Roomora property detail screen.',
            },
            {
              label: 'Booking & confirmation',
              caption: 'Total cost held constant throughout',
              alt: 'Roomora booking and confirmation screens.',
            },
          ],
        },
      ],
    },
    prototype: {
      lede: 'Clickable, and realistic enough to fail honestly.',
      blocks: [
        {
          type: 'prose',
          text: 'The prototype covered the full path from search to confirmation, including the states that usually get skipped — no results, price change on refresh, and a payment error.',
        },
      ],
    },
    testing: {
      lede: 'Tasks, not opinions.',
      blocks: [
        {
          type: 'list',
          title: 'Test tasks',
          items: [
            'Find a stay for a specific trip within a budget',
            'Compare two shortlisted properties and justify a choice',
            'Complete a booking and identify the total amount charged',
          ],
        },
      ],
    },
    iterations: {
      lede: 'What changed, and why.',
      blocks: [
        {
          type: 'iterations',
          items: [
            { before: 'Preference capture as a required first step', after: 'Optional, skippable, editable from results', reason: 'A gate before any results is a gate users leave through.' },
            { before: 'Nightly rate shown on result cards', after: 'Nightly rate plus total for the selected dates', reason: 'Cost surprise at checkout was the sharpest friction in the journey.' },
            { before: 'Reviews as a long chronological list', after: 'Reviews grouped by the attributes people filter on', reason: 'Review text was being used as a filter, so it should behave like one.' },
          ],
        },
      ],
    },
    outcome: {
      blocks: [
        {
          type: 'prose',
          text: 'The result is a booking flow where the ranking is explainable, the cost is constant, and comparison is a first-class feature rather than a browser-tab workaround.',
        },
      ],
    },
    learnings: {
      blocks: [
        {
          type: 'list',
          items: [
            'Personalisation only helps when the user can see why a result was ranked where it was.',
            'Removing steps is less valuable than removing surprises.',
            'Designing the empty and error states early changed the layout of the happy path.',
          ],
        },
      ],
    },
  },
}

/* ===========================================================================
 * 03 — LANGUAGE LEARNING APP
 * ========================================================================= */

const language: Project = {
  slug: 'language-learning',
  index: '03',
  title: 'Language Learning App',
  subtitle: 'Learn Chinese From Zero',
  category: 'Product Design / UX / UI',
  description:
    'A beginner-friendly language learning experience designed to make learning Chinese feel simple, structured, and engaging.',
  year: '[Add year]',
  role: 'UX Research, Interaction Design, UI Design',
  timeline: '[Add timeline]',
  platform: 'iOS · Android',
  tools: ['Figma', 'FigJam', 'Photoshop'],
  heroImage: '/work/language-learning/hero.webp',
  heroAlt: '"Learn Chinese Easily" app landing page with dragon boat illustration, App Store / Google Play badges, and lesson screen previews.',
  identity: { bg: '#F2EDE7', ink: '#221512', accent: '#C8442E', soft: '#EBDDD6' },
  visual: 'language',
  content: {
    overview: {
      lede: 'Most people who start learning Chinese quit in the first two weeks.',
      blocks: [
        {
          type: 'prose',
          text: 'This is a beginner-first learning app for absolute zero starters. The design problem is not teaching Chinese — it is designing the first fourteen days so that a complete beginner is still there on day fifteen.',
        },
        {
          type: 'definitions',
          items: [
            { term: 'Audience', detail: 'Adults starting from no prior exposure to Chinese' },
            { term: 'My role', detail: 'Research framing, IA, interaction design, UI, prototype' },
            { term: 'Scope', detail: 'Onboarding, lesson loop, character practice, progress, review' },
          ],
        },
      ],
    },
    problem: {
      lede: 'Chinese front-loads difficulty. Most apps front-load it further.',
      blocks: [
        {
          type: 'prose',
          text: 'A beginner meets three unfamiliar systems at once — tones, characters, and a new sentence structure. Learning apps typically respond by adding more: more streaks, more notifications, more gamification. That adds pressure on top of difficulty.',
        },
        {
          type: 'list',
          title: 'Problems the design set out to address',
          items: [
            'Everything introduced at once, with no obvious first step',
            'Characters presented as shapes to memorise rather than parts to assemble',
            'Progress measured in streaks instead of in ability',
            'Sessions too long for the moments when people actually study',
          ],
        },
      ],
    },
    research: {
      lede: 'Understanding where beginners stop.',
      blocks: [
        {
          type: 'list',
          title: 'Methods',
          items: [
            'Interviews with beginners and lapsed learners',
            'Teardown of mainstream language apps, focused on the first session',
            'Review mining for the point at which users report quitting',
            'Desk research on spaced repetition and chunking',
          ],
        },
      ],
    },
    personas: {
      blocks: [
        {
          type: 'personas',
          note: 'Proto-personas — assumptions to validate, not research output.',
          items: [
            {
              name: 'Proto-persona A',
              role: 'The curious beginner',
              context: 'Learns in short gaps — commute, queue, before bed.',
              goals: ['See progress quickly', 'Understand rather than memorise', 'Short sessions that still count'],
              frustrations: ['Feeling behind on day three', 'Tones that never get explained', 'Lessons that assume prior knowledge'],
            },
            {
              name: 'Proto-persona B',
              role: 'The returning learner',
              context: 'Has tried before and stopped, carries some guilt about it.',
              goals: ['Restart without going back to zero', 'Fix specific weak spots', 'Build a sustainable habit'],
              frustrations: ['Broken streaks that feel like failure', 'No way to skip what they know', 'Repetitive drills'],
            },
          ],
        },
      ],
    },
    journey: {
      blocks: [
        {
          type: 'journey',
          note: 'Hypothesised first-two-weeks journey — to be validated.',
          stages: [
            { stage: 'Download', doing: 'Installs after a recommendation', thinking: 'This time I will keep going.', sentiment: 5 },
            { stage: 'Day 1', doing: 'Completes onboarding and first lesson', thinking: 'That was manageable.', sentiment: 4 },
            { stage: 'Day 3', doing: 'Meets tones and first characters', thinking: 'I cannot hear the difference.', sentiment: 2 },
            { stage: 'Day 7', doing: 'Review queue has grown', thinking: 'I am behind already.', sentiment: 2 },
            { stage: 'Day 10', doing: 'Misses a day, breaks the streak', thinking: 'What was the point.', sentiment: 1 },
            { stage: 'Day 14', doing: 'Opens the app or does not', thinking: 'Can I still catch up?', sentiment: 2 },
          ],
        },
        {
          type: 'prose',
          text: 'The design response targets days three to ten directly: explain tones before testing them, cap the review queue, and make a missed day recoverable rather than punitive.',
        },
      ],
    },
    ia: {
      blocks: [
        {
          type: 'tree',
          root: 'Learn Chinese',
          branches: [
            { label: 'Learn', children: ['Today', 'Path', 'Lesson', 'Checkpoint'] },
            { label: 'Practice', children: ['Characters', 'Tones', 'Listening', 'Review queue'] },
            { label: 'Progress', children: ['Ability', 'Characters known', 'Weak spots', 'History'] },
            { label: 'Profile', children: ['Goal & pace', 'Reminders', 'Settings'] },
          ],
        },
        {
          type: 'prose',
          text: 'Progress is organised around what the learner can now do, not how many consecutive days they have opened the app.',
        },
      ],
    },
    flow: {
      blocks: [
        {
          type: 'flow',
          steps: [
            { label: 'Set goal & pace', note: 'Two minutes, three questions' },
            { label: 'Placement — optional', branch: 'Start from zero' },
            { label: "Today's session", note: 'Sized to the pace chosen' },
            { label: 'Teach', note: 'Concept explained before it is tested' },
            { label: 'Practice', note: 'Recognise → recall → produce' },
            { label: 'Checkpoint' },
            { label: 'Progress update', note: 'Framed as ability gained' },
          ],
        },
      ],
    },
    wireframes: {
      blocks: [
        {
          type: 'prose',
          text: 'The lesson loop was wireframed as a single repeating unit first. If the loop is not right, no amount of interface polish will save the fifth session.',
        },
        {
          type: 'mediaPair',
          items: [
            {
              label: 'Wireframe — lesson loop',
              caption: 'Teach, practice, check',
              alt: 'Greyscale wireframe of the lesson loop.',
            },
            {
              label: 'Wireframe — character practice',
              caption: 'Components before whole characters',
              alt: 'Greyscale wireframe of character practice.',
            },
          ],
        },
      ],
    },
    exploration: {
      blocks: [
        {
          type: 'list',
          title: 'Directions explored',
          items: [
            'Playful — heavy gamification, mascot-led',
            'Textbook — structured, formal, progress-by-chapter',
            'Calm — quiet interface, focus on the character itself',
          ],
        },
        {
          type: 'prose',
          text: 'The calm direction won on a simple test: it was the only one that still felt acceptable on day ten. Characters are given room to be looked at, and vermilion is reserved for the moment something is correct.',
        },
        {
          type: 'media',
          label: 'Direction study',
          ratio: '16/9',
          caption: 'Playful, textbook and calm directions',
          alt: 'Three visual directions explored for the language learning app.',
        },
      ],
    },
    system: {
      blocks: [
        {
          type: 'swatches',
          items: [
            { name: 'Paper', value: '#F2EDE7', usage: 'Lesson background' },
            { name: 'Ink', value: '#221512', usage: 'Characters and primary text' },
            { name: 'Vermilion', value: '#C8442E', usage: 'Correct state, primary action' },
            { name: 'Clay', value: '#EBDDD6', usage: 'Cards, inactive, stroke guides' },
          ],
        },
        {
          type: 'list',
          title: 'System scope',
          items: [
            'A dedicated character display scale, separate from the UI type scale',
            'Tone marks with a consistent colour and position across every context',
            'Four practice-card variants sharing one layout skeleton',
            'Feedback states that never use colour alone to signal right or wrong',
          ],
        },
      ],
    },
    ui: {
      blocks: [
        {
          type: 'media',
          label: 'Lesson & practice',
          ratio: '16/9',
          caption: 'One concept per screen',
          alt: 'Language learning app lesson and practice screens.',
        },
        {
          type: 'mediaPair',
          items: [
            {
              label: 'Character detail',
              caption: 'Components, stroke order, meaning',
              alt: 'Character detail screen.',
            },
            {
              label: 'Progress',
              caption: 'Ability over streaks',
              alt: 'Progress screen showing ability.',
            },
          ],
        },
      ],
    },
    prototype: {
      blocks: [
        {
          type: 'prose',
          text: 'The prototype runs a complete day-one session and a day-seven session, so the review-queue pressure could be felt rather than described.',
        },
      ],
    },
    testing: {
      blocks: [
        {
          type: 'list',
          title: 'Test tasks',
          items: [
            'Complete a first session with no prior exposure to Chinese',
            'Explain what a tone is after the teaching screen',
            'Return after a simulated missed day and resume',
          ],
        },
      ],
    },
    iterations: {
      blocks: [
        {
          type: 'iterations',
          items: [
            { before: 'Tones tested in the first lesson', after: 'Tones taught, heard, then tested two lessons later', reason: 'Testing an unexplained concept reads as failure, not challenge.' },
            { before: 'Uncapped daily review queue', after: 'Queue capped, overflow rescheduled automatically', reason: 'A growing backlog was the strongest predictor of abandonment in review mining.' },
            { before: 'Streak counter on the home screen', after: 'Characters known and ability level', reason: 'Progress should survive a missed day.' },
          ],
        },
      ],
    },
    outcome: {
      blocks: [
        {
          type: 'prose',
          text: 'The app teaches before it tests, sizes sessions to real life, and measures progress in ability rather than attendance.',
        },
      ],
    },
    learnings: {
      blocks: [
        {
          type: 'list',
          items: [
            'Motivation design fails when it punishes. Recoverability beats streaks.',
            'Difficulty is fine. Unexplained difficulty is not.',
            'Designing for day ten produces different decisions than designing for day one.',
          ],
        },
      ],
    },
  },
}

/* ===========================================================================
 * 04 — BEAUTIVA
 * ========================================================================= */

const beautiva: Project = {
  slug: 'beautiva',
  index: '04',
  title: 'Beautiva',
  subtitle: 'Skincare E-commerce Experience',
  category: 'UX / UI / E-commerce',
  description:
    'A clean skincare shopping experience focused on product discovery, trust, and frictionless purchasing.',
  year: '[Add year]',
  role: 'UX Design, UI Design, Design System',
  timeline: '[Add timeline]',
  platform: 'Responsive web',
  tools: ['Figma', 'Illustrator', 'React'],
  heroAlt: 'Beautiva skincare store — product discovery, product detail and checkout screens.',
  identity: { bg: '#F3EAE6', ink: '#241A19', accent: '#B0654F', soft: '#E8D7D0' },
  visual: 'beautiva',
  content: {
    overview: {
      lede: 'Skincare is a category where the buyer has to become an expert before they can buy.',
      blocks: [
        {
          type: 'prose',
          text: 'Beautiva is a skincare storefront built around the real question shoppers are asking, which is rarely "what is on sale" and almost always "is this right for my skin, and can I trust it?".',
        },
        {
          type: 'definitions',
          items: [
            { term: 'Product type', detail: 'Direct-to-consumer skincare storefront' },
            { term: 'My role', detail: 'UX, UI, design system, frontend collaboration' },
            { term: 'Scope', detail: 'Discovery, product detail, cart, checkout, account' },
          ],
        },
      ],
    },
    problem: {
      lede: 'Ingredient lists are not an answer. They are homework.',
      blocks: [
        {
          type: 'prose',
          text: 'Skincare stores tend to fail in one of two directions — too little information to build trust, or so much clinical detail that the shopper leaves to research elsewhere and buys elsewhere too.',
        },
        {
          type: 'list',
          title: 'Problems the design set out to address',
          items: [
            'Category pages that sort by price when shoppers are sorting by suitability',
            'Product pages that list ingredients without explaining them',
            'Trust signals arriving after the decision rather than during it',
            'Checkout friction on a purchase that is already a leap of faith',
          ],
        },
      ],
    },
    research: {
      blocks: [
        {
          type: 'list',
          title: 'Methods',
          items: [
            'Interviews with recent skincare buyers',
            'Competitive teardown across mass-market and indie skincare',
            'Review analysis to find which questions repeat before purchase',
            'Checkout heuristic evaluation',
          ],
        },
      ],
    },
    personas: {
      blocks: [
        {
          type: 'personas',
          note: 'Proto-personas — assumptions to validate.',
          items: [
            {
              name: 'Proto-persona A',
              role: 'The cautious first-timer',
              context: 'Has sensitive skin and a bad experience behind them.',
              goals: ['Avoid a reaction', 'Understand what is in it', 'Start with one product, not a routine'],
              frustrations: ['Unfamiliar ingredient names', 'Bundles pushed too early', 'No clear returns policy'],
            },
            {
              name: 'Proto-persona B',
              role: 'The routine builder',
              context: 'Already has a routine and is replacing or upgrading one step.',
              goals: ['Check compatibility with what they use', 'Reorder quickly', 'Compare within a category'],
              frustrations: ['Cannot filter by concern or ingredient', 'Reordering takes too many steps', 'Stock uncertainty'],
            },
          ],
        },
      ],
    },
    journey: {
      blocks: [
        {
          type: 'journey',
          note: 'Hypothesised purchase journey — to be validated.',
          stages: [
            { stage: 'Trigger', doing: 'Product runs out or a concern appears', thinking: 'I need something for this.', sentiment: 3 },
            { stage: 'Browse', doing: 'Lands on a category page', thinking: 'Which of these is for me?', sentiment: 3 },
            { stage: 'Evaluate', doing: 'Opens product, scans ingredients', thinking: 'I do not know what half of this means.', sentiment: 2 },
            { stage: 'Verify', doing: 'Leaves to search reviews elsewhere', thinking: 'Is this safe for sensitive skin?', sentiment: 2 },
            { stage: 'Purchase', doing: 'Returns, adds to cart, checks out', thinking: 'Hope the returns policy is real.', sentiment: 3 },
            { stage: 'Receive', doing: 'Uses it, waits for results', thinking: 'Will I remember to reorder?', sentiment: 4 },
          ],
        },
        {
          type: 'prose',
          text: 'The "verify" stage is where the sale leaks. The design brings that verification onto the product page instead of sending shoppers away to find it.',
        },
      ],
    },
    ia: {
      blocks: [
        {
          type: 'tree',
          root: 'Beautiva',
          branches: [
            { label: 'Shop', children: ['By concern', 'By category', 'By ingredient', 'New & restocked'] },
            { label: 'Product', children: ['Gallery', 'What it does', 'Ingredients explained', 'How to use', 'Reviews'] },
            { label: 'Checkout', children: ['Cart', 'Delivery', 'Payment', 'Confirmation'] },
            { label: 'Account', children: ['Orders', 'Reorder', 'Skin profile', 'Returns'] },
          ],
        },
        {
          type: 'prose',
          text: 'Browsing by concern sits above browsing by category, because "dryness" is how shoppers describe the problem and "serum" is only how the industry files the solution.',
        },
      ],
    },
    flow: {
      blocks: [
        {
          type: 'flow',
          steps: [
            { label: 'Enter by concern or category' },
            { label: 'Filtered results', note: 'Concern, skin type, ingredient' },
            { label: 'Product detail', branch: 'Compare within category' },
            { label: 'Ingredients explained', note: 'Plain language, in place' },
            { label: 'Add to cart' },
            { label: 'Checkout', note: 'Guest by default' },
            { label: 'Confirmation & reorder reminder' },
          ],
        },
      ],
    },
    wireframes: {
      blocks: [
        {
          type: 'prose',
          text: 'The product page was wireframed around a question order rather than a content order: what is it for, will it suit me, what is in it, how do I use it, what do others say.',
        },
        {
          type: 'mediaPair',
          items: [
            {
              label: 'Wireframe — category',
              caption: 'Concern-led filtering',
              alt: 'Greyscale wireframe of the category page.',
            },
            {
              label: 'Wireframe — product detail',
              caption: 'Answers in question order',
              alt: 'Greyscale wireframe of the product detail page.',
            },
          ],
        },
      ],
    },
    exploration: {
      blocks: [
        {
          type: 'list',
          title: 'Directions explored',
          items: [
            'Clinical — white, technical, ingredient-forward',
            'Warm editorial — tactile, photographic, product as object',
            'Minimal retail — dense grid, speed-first',
          ],
        },
        {
          type: 'prose',
          text: 'Warm editorial set the tone; clinical clarity was kept for the parts that carry trust — ingredients, suitability and returns. Restraint in the visual language leaves the product photography to do the selling.',
        },
        {
          type: 'media',
          label: 'Direction study',
          ratio: '16/9',
          caption: 'Clinical, warm editorial and minimal retail',
          alt: 'Three visual directions explored for Beautiva.',
        },
      ],
    },
    system: {
      blocks: [
        {
          type: 'swatches',
          items: [
            { name: 'Shell', value: '#F3EAE6', usage: 'Page background' },
            { name: 'Ink', value: '#241A19', usage: 'Primary text' },
            { name: 'Terracotta', value: '#B0654F', usage: 'Primary action, sale state' },
            { name: 'Sand', value: '#E8D7D0', usage: 'Cards, dividers' },
          ],
        },
        {
          type: 'list',
          title: 'System scope',
          items: [
            'One product card used across grid, cart, reorder and recommendations',
            'Ingredient chip with a plain-language definition on tap or hover',
            'Full commerce state coverage: out of stock, low stock, backorder, discontinued',
            'Form patterns shared between checkout and account',
          ],
        },
      ],
    },
    ui: {
      blocks: [
        {
          type: 'media',
          label: 'Discovery',
          ratio: '16/9',
          caption: 'Concern-led browsing',
          alt: 'Beautiva discovery and category screens.',
        },
        {
          type: 'mediaPair',
          items: [
            {
              label: 'Product detail',
              caption: 'Ingredients explained in place',
              alt: 'Beautiva product detail page.',
            },
            {
              label: 'Cart & checkout',
              caption: 'Guest checkout by default',
              alt: 'Beautiva cart and checkout.',
            },
          ],
        },
      ],
    },
    prototype: {
      blocks: [
        {
          type: 'prose',
          text: 'The prototype covers discovery through to confirmation, including out-of-stock and returns-policy paths, since both affect the decision to buy.',
        },
      ],
    },
    testing: {
      blocks: [
        {
          type: 'list',
          title: 'Test tasks',
          items: [
            'Find a product suitable for a stated skin concern',
            'Determine whether a product contains a specific ingredient',
            'Complete checkout as a guest and locate the returns policy',
          ],
        },
      ],
    },
    iterations: {
      blocks: [
        {
          type: 'iterations',
          items: [
            { before: 'Full ingredient list in technical names', after: 'Key actives first, plain-language explanation inline', reason: 'The list was being scanned for reassurance, not read for chemistry.' },
            { before: 'Account required before checkout', after: 'Guest checkout with optional account after purchase', reason: 'Account creation before a first purchase asks for commitment too early.' },
            { before: 'Reviews at the bottom of the page', after: 'Reviews filtered by skin type, surfaced next to suitability', reason: 'Shoppers were leaving the site to find exactly this information.' },
          ],
        },
      ],
    },
    outcome: {
      blocks: [
        {
          type: 'prose',
          text: 'A storefront that answers the suitability question on the page where the decision happens, and a checkout that stops asking for things it does not need yet.',
        },
      ],
    },
    learnings: {
      blocks: [
        {
          type: 'list',
          items: [
            'Trust is an information-architecture problem before it is a visual one.',
            'Every question a product page fails to answer is a tab the shopper opens elsewhere.',
            'Reducing checkout fields matters less than reducing checkout commitment.',
          ],
        },
      ],
    },
  },
}

/* ========================================================================= */

export const projects: Project[] = [laxmiPustak, roomora, language, beautiva]

export const getProject = (slug?: string): Project | undefined =>
  projects.find((project) => project.slug === slug)

export const getAdjacentProject = (slug: string): Project => {
  const current = projects.findIndex((project) => project.slug === slug)
  return projects[(current + 1) % projects.length]
}
