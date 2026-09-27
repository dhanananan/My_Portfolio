# Dhananjaya Raut — Portfolio

Personal portfolio site. React + Vite + TypeScript + Tailwind CSS v4, with GSAP and
Lenis for motion.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build to dist/
npm run preview    # serve the production build locally
npm run typecheck  # types only
```

---

## Where everything lives

```
src/
  data/            ← all editable content. Start here.
    site.ts          name, role, email, social links
    projects.ts      the three case studies (and the 16-section spine)
    process.ts       design process stages
    skills.ts        capability groups
    tools.ts         tools list (each `icon` keys into the inlined brand marks
                     in components/ui/ToolIcon.tsx — add the mark there first)
    experience.ts    workProjects (the CV's project experience) + education timeline
  components/
    layout/        Navbar, MobileMenu, Footer, PageHeader, PageTransition, ErrorBoundary
    sections/      Hero, SelectedWork, ProcessSection, AboutSection, SkillsSection,
                   ToolsSection, ExperienceTimeline, BeyondDesign, ContactSection
    project/       ProjectCard, ProjectGrid, ProjectVisual, ProjectMeta, CaseBlocks, NextProject
    ui/            Button, SectionHeading, Reveal, TextReveal, Marquee, Frame,
                   Portrait, CustomCursor, RouteFallback
  pages/           Home, Work, CaseStudy, About, Contact, NotFound
  lib/             seo.ts, motion.ts, SmoothScroll.tsx, cn.ts
  styles/index.css ← all design tokens
```

Content never lives in components. If you want to change words, numbers or links,
you almost certainly want a file in `src/data/`.

---

## Placeholders to replace

Everything below is deliberately unfinished, because inventing it would have meant
inventing facts. **None of it is visible on the live site** — a bracketed value in
the data below simply makes the component that would show it skip rendering that
field entirely (see "How unfinished data stays invisible"), rather than printing a
`[Add …]` note that would read as a broken site to a visitor. Search the repo for
`[Add` to find every one of these in the source.

| What | Where |
| --- | --- |
| Deployed URL (canonical, OG, sitemap) | `src/data/site.ts` → `site.url`, plus `public/robots.txt` and `public/sitemap.xml` |
| Project year, timeline (all 4 projects); role, tools (Laxmi Pustak only) | `src/data/projects.ts` → each project's top-level fields |
| Research findings, interview insights, usability results, outcome metrics | Left out of `src/data/projects.ts` entirely rather than stubbed — add a `prose` or `list` block to the relevant section when you have them |
| Prototype links | `src/data/projects.ts` → `prototype` sections (currently omitted on every project) |
| Case-study images | `src/data/projects.ts` → `media`/`mediaPair` blocks currently render a generated UI-mockup placeholder (see below); set `src` to swap in a real export |
| CV | `public/Dhananjaya-Raut-CV.pdf` — replace the file to update every "Download CV" link (`site.cvUrl` in `src/data/site.ts`) |

Email, LinkedIn, GitHub and the CV are already filled in. Behance and Dribbble were
intentionally removed from `socials` — add them back the same way if you want them.

### How unfinished data stays invisible

- **Project meta fields** (`year`, `timeline`, `role`, `tools`): `ProjectMeta`
  filters out any field whose value starts with `[` before rendering the grid,
  and sizes the grid's column count to however many survive — so a project with
  only `platform` confirmed shows one clean cell, not four bracketed ones.
- **Case-study sections**: there's no `placeholder` block type any more. A
  section you haven't written yet is simply absent from that project's
  `content` object — the page skips straight to the next one, exactly like any
  other section that doesn't apply to a given project.
- **Background/education rows** (`src/data/experience.ts`): an entry with
  neither `description` nor `focus` set just renders a shorter row — no
  "[Add description]" filler.
- **`socials` entries** with `ready: false` render `[Add link]` next to that
  channel rather than a dead link that pretends to work — all three current
  entries (Email, LinkedIn, GitHub) are `ready: true`, so this never shows today.

---

## Adding a project

1. Add an object to `projects` in `src/data/projects.ts`.
2. Give it a unique `slug` — that becomes `/work/<slug>` automatically.
3. Fill in whatever `content` sections you have. **Missing sections are skipped**,
   so a half-written case study still looks deliberate.
4. Add a `<url>` entry to `public/sitemap.xml`.

Case-study sections are composed from typed blocks, so you write data, not markup:

`lead` · `prose` · `list` · `definitions` · `personas` · `journey` ·
`tree` · `flow` · `media` · `mediaPair` · `swatches` · `iterations`

Adding a new block type to the `Block` union will make `CaseBlocks.tsx` fail to
compile until you render it — that's intentional.

### Images

**Hero:** every project renders a generated SVG composition (`ProjectVisual`) built
from its own `identity` palette — a real drawn artwork, not a placeholder.

**In-section media** (`media` / `mediaPair` blocks — wireframes, direction studies,
final-UI screens): when no `src` is set, these render a generated abstract
UI-mockup (`MockupVisual`) instead of an empty box — a browser-chrome frame with
one of three layouts (hero / list / detail), randomised per block from a seed so
every slot looks different, but deterministic so it doesn't shuffle on re-render.
Blocks whose label contains "Wireframe" render strictly greyscale; everything else
uses the project's own identity colours. This intentionally avoids stock photography
— a photo of a staircase next to the caption "Wireframe — search results" reads as
a bug, not a placeholder.

To use real exports instead:

- **Hero:** set `heroImage: '/work/<slug>/hero.webp'` on the project.
- **In-section media:** set `src` on any `media` / `mediaPair` block.

Images fall back to the generated mockup (sections) or artwork (hero) if the file
is missing or fails to load, so a broken path never breaks the layout.

---

## Design tokens

All of them are in `src/styles/index.css` under `@theme`. Tailwind generates both
the CSS custom properties and the matching utilities, so `--color-accent` gives you
`bg-accent`, `text-accent`, `border-accent`, and so on. Change the value once.

**Colour** — neutral-first, one accent used sparingly. Contrast against the
`#FBFAF8` background:

| Token | Value | Contrast | Use |
| --- | --- | --- | --- |
| `--color-foreground` | `#151412` | 17.6:1 | Primary text |
| `--color-muted` | `#6B6660` | 5.6:1 | Body / secondary text |
| `--color-subtle` | `#8C877F` | 3.6:1 | Labels, non-essential only |
| `--color-accent` | `#1F35E6` | 7.5:1 | Links, active state, one CTA |

`--color-ink*` is the inverted surface used by the contact section and footer.

**Type** — the system-font stack (`-apple-system, BlinkMacSystemFont, …`) for
everything structural. San Francisco is proprietary to Apple and can't be
self-hosted, so this is the same technique apple.com itself uses to get it: real
SF Pro on macOS/iOS, each other OS's own native UI font elsewhere, no font request
either way. `--font-serif` is aliased to the same stack (`font-serif italic` for
the rare emphasis just renders italic system font — there's no separate serif
family loading). `JetBrains Mono` — the one Google Fonts request left — is for
eyebrows, indices and metadata. Every size is a `clamp()` so there are no
per-breakpoint font-size rules.

`--text-hero` is separate from `--text-display` on purpose: the hero wordmark is one
long unbreakable word, so it scales from the viewport (`11.5vw`) to stay on one line
down to 320px.

**Radius** is systematic, not decorative — two values with distinct jobs:
interactive controls are pills (`rounded-full`), surfaces use `--radius-card` (2px).

---

## Motion

- `Reveal` handles scroll reveals with a **single shared IntersectionObserver** and a
  pure-CSS transition, so revealing costs one attribute write. GSAP is reserved for
  the few animations that genuinely need a timeline.
- Lenis drives smooth scrolling and feeds GSAP's ScrollTrigger from the same rAF
  loop.
- `prefers-reduced-motion: reduce` disables Lenis entirely, reveals all content
  immediately, and skips the page-transition curtain. Native scrolling is the
  correct behaviour there, not a slower version of ours.
- The custom cursor only mounts for a fine pointer, and restores the native caret
  over form fields.
- A hairline scroll-progress bar (`ScrollProgress`) fills the top of the viewport
  with real scroll position — no easing lag, since it's an indicator, not a
  decorative animation, so it's one of the few things that still renders under
  reduced motion.
- The hero masthead has a scroll-linked parallax (`ScrollTrigger` + `scrub`) —
  it drifts up and fades a little faster than the page scrolls, the layered-depth
  technique apple.com uses on its product pages.
- Project cards wipe open with a `clip-path` mask (`ProjectCard`)
  rather than a plain fade — plays once, on scroll into view.
- `useMagnetic` (`src/lib/motion.ts`) gives a button a small pointer-following
  pull via `Button`'s `magnetic` prop. Used on 3–4 primary CTAs sitewide, not
  everywhere — a magnetic effect on every button stops reading as an accent.

Elements opt into the expanded cursor with `data-cursor="View"`.

---

## Accessibility notes

Worth knowing before you change things:

- One `<h1>` per page, no skipped heading levels. `ProjectCard` / `ProjectGrid` take a
  `headingLevel` prop so it can be `h3` under a section heading on the home page and
  `h2` as top-level content on `/work`.
- The process section uses real `<details>`/`<summary>` elements — a focusable `div`
  with `aria-expanded` is not a substitute.
- The mobile menu traps focus, closes on Escape, restores focus to the trigger, and
  is `inert` while closed.
- The contact form validates on submit, links errors with `aria-describedby`, marks
  fields `aria-invalid`, and moves focus to the first invalid field. After a
  successful send, focus moves to the confirmation (`role="status"`); a failed send
  is announced through a `role="alert"` message.
- Focus rings are visible (`:focus-visible`, 2px accent outline) — don't remove them.

---

## Contact form

The site is static — there is no server to receive a form post — so messages are
relayed to `site.email` by [Web3Forms](https://web3forms.com) (free tier, no account
or password: you just verify the address).

**One-time setup**

1. Go to web3forms.com, enter `binanjaya23@gmail.com` and press *Create Access Key*.
   The key is emailed to that address (check spam).
2. **Locally:** copy `.env.example` to `.env.local` and paste the key after
   `VITE_WEB3FORMS_KEY=`. Restart `npm run dev`.
3. **On Vercel:** Project → Settings → Environment Variables → add
   `VITE_WEB3FORMS_KEY` (all environments) → **redeploy**. Vite inlines the value at
   build time, so an already-built deployment won't pick it up until it is rebuilt.
4. Send yourself a test message from the live `/contact` page.

The access key is designed to be public: it can only deliver *to* the address it was
issued for, so shipping it in the bundle leaks nothing. Don't put any *secret* in a
`VITE_` variable, though — everything with that prefix is readable in the browser.

**How it behaves** (`src/pages/Contact.tsx`)

- Validation runs first; nothing is sent until name, email and message are valid.
- The visitor's email goes in as the reply-to, so pressing *Reply* in Gmail answers
  them. The subject is built from the topic chip (`I’m hiring — from Priya Sharma`).
- While sending, the button is disabled ("Sending…") so a double-click can't send twice.
- Success replaces the form with a confirmation (focus moves to it for screen readers).
  Failure — network down, rejected key, `success: false` — keeps everything the visitor
  typed and shows your email address as the fallback. A message is never silently lost.
- A hidden honeypot field (`botcheck`) catches simple bots: they're shown a normal
  success message but nothing is sent.
- **No key set?** The form still works: it opens the visitor's own mail app with the
  message pre-filled (`mailto:`) and the note under the button says so. That is the
  state before step 1–3 above are done.

Web3Forms is a third-party processor of whatever visitors type, which is worth a line
in a privacy notice if you add one. If you outgrow it, swap `site.formEndpoint` and the
payload in `Contact.tsx` for Formspree, Resend, or a Vercel serverless function — the
UI states don't change.

---

## Deploying

The build output in `dist/` is a static SPA. Because routing is client-side, the host
must rewrite unknown paths to `index.html`, or deep links like `/work/roomora` will
404 on refresh.

- **Vercel** — `vercel.json` (already in the repo) supplies the rewrite and long-lived
  caching for the hashed `/assets` and `/fonts`. Framework preset **Vite**, build
  command `npm run build`, output directory `dist` — all auto-detected. Add the
  `VITE_WEB3FORMS_KEY` environment variable before (or redeploy after) the first
  build — see "Contact form". Note the
  header rules deliberately don't touch `/work/*`: those paths are also page routes,
  and caching the HTML for them would serve stale pages after a redeploy.
- **Netlify** — `public/_redirects` (already in the repo) does the same job.
- **GitHub Pages** — copy `dist/index.html` to `dist/404.html`

Vercel builds on Linux, where file names are case-sensitive — a mismatched import
like `./toolicon` for `ToolIcon.tsx` builds on Windows and fails there. All imports
and public asset paths were checked for exact case before the first deploy.

### After the first deploy

The site currently points at `https://dhananjayaraut.com`, which is a placeholder.
Once you know the real URL, update it in **all** of these, or search engines and
link previews will point at the wrong site:

1. `src/data/site.ts` → `site.url`
2. `index.html` → `canonical`, `og:url`, `og:image`, and the JSON-LD `url`
3. `public/robots.txt` → the `Sitemap:` line
4. `public/sitemap.xml` → every `<loc>`

Also replace `public/og-image.svg` with a 1200×630 **PNG or JPG** and point `og:image`
at it — WhatsApp, LinkedIn and X won't render an SVG link preview.
