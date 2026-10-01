import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useSeo } from '@/lib/seo'
import { site, socials } from '@/data/site'
import { Reveal } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import { TextReveal } from '@/components/ui/TextReveal'
import { LocalTime } from '@/components/ui/LocalTime'
import { CopyButton } from '@/components/ui/CopyButton'
import { cn } from '@/lib/cn'

type Errors = Partial<Record<'name' | 'email' | 'message', string>>
type Phase = 'idle' | 'sending' | 'sent' | 'error'

/** What the message is about. Picking one shapes the email's subject line. */
const topics = ['I’m hiring', 'A project', 'Collaboration', 'Just saying hi'] as const

export default function Contact() {
  useSeo({
    title: `Contact — ${site.name}`,
    description: `Get in touch with ${site.name}, UI/UX designer based in ${site.location}.`,
    path: '/contact',
  })

  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [sent, setSent] = useState<{ name: string; email: string } | null>(null)
  const confirmRef = useRef<HTMLDivElement>(null)

  /** True once a Web3Forms key is configured; until then the form degrades to mailto. */
  const canDeliver = Boolean(site.formAccessKey)

  // Move focus to the confirmation so keyboard and screen-reader users land
  // on the outcome instead of on a form that has just vanished.
  useEffect(() => {
    if (phase === 'sent') confirmRef.current?.focus()
  }, [phase])

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (phase === 'sending') return

    const form = event.currentTarget
    const data = new FormData(form)

    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const subject = String(data.get('subject') ?? '').trim()
    const topic = String(data.get('topic') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()

    const next: Errors = {}
    if (!name) next.name = 'Please add your name.'
    if (!email) next.email = 'Please add an email address so I can reply.'
    else if (!/^[^s@]+@[^s@]+.[^s@]{2,}$/.test(email)) next.email = 'That email address doesn’t look right.'
    if (!message) next.message = 'Please add a short message.'

    setErrors(next)

    if (Object.keys(next).length > 0) {
      setStatus(null)
      const firstField = Object.keys(next)[0]
      form.querySelector<HTMLElement>(`[name="${firstField}"]`)?.focus()
      return
    }

    // Honeypot: a real visitor never sees or ticks this box; form-filling bots
    // tick everything. Answer them with a convincing success and send nothing.
    if (data.get('botcheck')) {
      setSent({ name, email })
      setPhase('sent')
      return
    }

    // A typed subject wins; otherwise build one from the chosen topic.
    const fallbackSubject = topic ? `${topic} — from ${name}` : `Message from ${name}`
    const finalSubject = subject || fallbackSubject

    // No key configured yet: hand the visitor's mail app a ready-written email.
    if (!canDeliver) {
      const body = `${message}

—
${name}
${email}`
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
        finalSubject,
      )}&body=${encodeURIComponent(body)}`
      setStatus('Your email app should now be open with the message ready to send.')
      return
    }

    setPhase('sending')
    setStatus(null)
    try {
      const response = await fetch(site.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: site.formAccessKey,
          subject: finalSubject,
          from_name: name,
          // `email` is what Web3Forms uses as the Reply-To, so replying to the
          // notification goes straight to the visitor.
          email,
          name,
          topic: topic || 'Not specified',
          message,
        }),
      })
      const result = (await response.json().catch(() => null)) as { success?: boolean } | null
      if (!response.ok || !result?.success) throw new Error(`Delivery failed (${response.status})`)

      form.reset()
      setErrors({})
      setSent({ name, email })
      setPhase('sent')
    } catch {
      // Keep everything the visitor typed — losing a written message is the
      // one thing an error state must never do.
      setPhase('error')
    }
  }

  return (
    <>
      <header className="pb-16 pt-36 sm:pb-20 sm:pt-44 lg:pt-52">
        <div className="shell">
          <p className="eyebrow flex items-center gap-2">
            <span aria-hidden="true" className="text-accent">
              ●
            </span>
            Contact
          </p>

          {/* Same display face and letter behaviour as the home hero, so the
              page opens on the site's signature rather than a plain heading. */}
          <h1 className="mt-6 sm:mt-8">
            <span className="sr-only">Let&rsquo;s talk</span>
            <span aria-hidden="true">
              <TextReveal
                lines={['Let’s', 'talk.']}
                className="block font-display text-hero uppercase text-accent"
                lineClassName="[&:not(:first-child)]:-mt-[0.11em]"
                interactive
                delay={80}
              />
            </span>
          </h1>

          <Reveal className="mt-10 grid gap-8 sm:mt-14 lg:grid-cols-12" delay={200}>
            <p className="max-w-md text-balance text-lead text-muted lg:col-span-5">
              Tell me what you&rsquo;re working on, what&rsquo;s not working, or what you&rsquo;re
              hiring for. A rough idea is enough to start from.
            </p>

            {/* Two live facts a visitor actually wants: am I free, and what
                time is it where I am. */}
            <div className="flex flex-wrap items-start gap-3 lg:col-span-6 lg:col-start-7 lg:justify-end">
              <span className="inline-flex items-center gap-2.5 rounded-full border border-border-strong px-4 py-2 text-small">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full rounded-full bg-accent opacity-60 motion-safe:animate-ping" />
                  <span className="relative inline-flex size-2 rounded-full bg-accent" />
                </span>
                {site.availability}
              </span>
              <span className="inline-flex items-center gap-2.5 rounded-full border border-border px-4 py-2 text-small text-muted">
                {site.location}
                <span aria-hidden="true" className="opacity-40">
                  ·
                </span>
                <LocalTime />
              </span>
            </div>
          </Reveal>
        </div>
      </header>

      {/* The centrepiece: the fastest route is one click or one copy away. */}
      <section className="border-t border-border py-14 sm:py-20" aria-labelledby="email-heading">
        <div className="shell">
          <Reveal y={16}>
            <h2 id="email-heading" className="eyebrow">
              The quickest way
            </h2>
          </Reveal>

          <Reveal className="mt-6" delay={80} y={24}>
            <a
              href={`mailto:${site.email}`}
              data-cursor="Email"
              className="link-underline inline-block wrap-break-word text-[clamp(1.4rem,6.4vw,4.25rem)] font-medium leading-[1.05] tracking-tight transition-colors duration-300 hover:text-accent"
            >
              {site.email}
            </a>
          </Reveal>

          <Reveal className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4" delay={140} y={16}>
            <CopyButton value={site.email} />
            {site.phone && (
              <a
                href={`tel:${site.phone.replace(/\s+/g, '')}`}
                className="link-underline text-lead text-muted transition-colors duration-300 hover:text-foreground"
              >
                or call {site.phone}
              </a>
            )}
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border pb-section pt-14 sm:pt-20" aria-labelledby="contact-form-heading">
        <div className="shell grid gap-16 lg:grid-cols-12 lg:gap-12">
          {/* Form */}
          <Reveal className="lg:col-span-7" y={24}>
            <h2 id="contact-form-heading" className="eyebrow border-t border-border pt-4">
              <span className="tabular-nums">01</span>
              <span className="mx-2 opacity-40">/</span>
              Send a message
            </h2>

            {phase === 'sent' && sent ? (
              <div
                ref={confirmRef}
                tabIndex={-1}
                role="status"
                className="mt-10 rounded-card border border-border-strong p-8 outline-none sm:p-10"
              >
                <p className="eyebrow flex items-center gap-2 text-accent">
                  <span aria-hidden="true">●</span>
                  Message sent
                </p>
                <p className="mt-5 text-h3 font-medium">Thanks, {sent.name}. That&rsquo;s in my inbox.</p>
                <p className="mt-3 max-w-prose text-muted">
                  I&rsquo;ll reply to <span className="text-foreground">{sent.email}</span> as soon as I
                  can.
                </p>
                <Button
                  variant="secondary"
                  className="mt-8"
                  onClick={() => {
                    setSent(null)
                    setPhase('idle')
                  }}
                >
                  Send another
                </Button>
              </div>
            ) : (
            <form onSubmit={onSubmit} noValidate className="mt-10 space-y-8">
              {/* Honeypot — see the check in onSubmit. display:none, out of the
                  tab order and the accessibility tree. */}
              <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

              {/* Real radio inputs, restyled as chips — so it is one tab stop,
                  arrow keys move between options, and it submits like any
                  other field. `peer` lets the label react to the input. */}
              <fieldset>
                <legend className="eyebrow">What&rsquo;s this about?</legend>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {topics.map((topic) => (
                    <label key={topic} className="cursor-pointer">
                      <input type="radio" name="topic" value={topic} className="peer sr-only" />
                      <span className="inline-flex h-10 items-center rounded-full border border-border-strong px-4 text-small text-muted transition-[background-color,color,border-color,transform] duration-300 ease-spring hover:border-foreground hover:text-foreground peer-checked:scale-105 peer-checked:border-accent peer-checked:bg-accent peer-checked:text-accent-foreground peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                        {topic}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="grid gap-8 sm:grid-cols-2">
                <Field label="Your name" name="name" autoComplete="name" error={errors.name} required />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  error={errors.email}
                  required
                />
              </div>

              <Field label="Subject" name="subject" hint="Optional" />

              <Field
                label="Message"
                name="message"
                as="textarea"
                rows={6}
                error={errors.message}
                required
              />

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button type="submit" size="lg" withArrow magnetic disabled={phase === 'sending'}>
                  {phase === 'sending' ? 'Sending…' : 'Send message'}
                </Button>
                <p className="text-small text-subtle">
                  {canDeliver
                    ? 'Goes straight to my inbox — I’ll reply by email.'
                    : 'Opens your email app — nothing is stored on this site.'}
                </p>
              </div>

              {phase === 'error' && (
                <p role="alert" className="text-small text-accent">
                  That didn&rsquo;t go through, and nothing you typed was lost — try again, or email me
                  directly at{' '}
                  <a href={`mailto:${site.email}`} className="link-underline font-medium">
                    {site.email}
                  </a>
                  .
                </p>
              )}

              <p role="status" aria-live="polite" className="text-small text-accent">
                {status}
              </p>
            </form>
            )}
          </Reveal>

          {/* Direct channels */}
          <Reveal className="lg:col-span-4 lg:col-start-9" delay={100} y={24}>
            <h2 className="eyebrow border-t border-border pt-4">
              <span className="tabular-nums">02</span>
              <span className="mx-2 opacity-40">/</span>
              Elsewhere
            </h2>

            <ul className="mt-8 border-b border-border">
              <li>
                <a
                  href={site.cvUrl}
                  download
                  className="group flex items-center justify-between gap-4 border-t border-border py-4 transition-colors duration-300 hover:text-accent"
                >
                  <span className="font-medium">Download CV</span>
                  <span className="flex items-center gap-3">
                    <span className="text-small text-subtle">PDF</span>
                    <svg
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                      className="size-4 shrink-0 transition-transform duration-500 ease-out-expo group-hover:translate-y-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="square"
                    >
                      <path d="M8 2.5v8M4.5 7l3.5 3.5L11.5 7M3 13.5h10" />
                    </svg>
                  </span>
                </a>
              </li>
              {socials
                .filter((social) => social.label !== 'Email')
                .map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group flex items-center justify-between gap-4 border-t border-border py-4 transition-colors duration-300 hover:text-accent"
                    >
                      <span className="font-medium">{social.label}</span>
                      <span className="flex items-center gap-3">
                        <span className="text-small text-subtle">
                          {social.ready ? social.handle : '[Add link]'}
                        </span>
                        <svg
                          viewBox="0 0 16 16"
                          aria-hidden="true"
                          className="size-4 shrink-0 transition-transform duration-500 ease-out-expo group-hover:-translate-y-1 group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="square"
                        >
                          <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" />
                        </svg>
                      </span>
                    </a>
                  </li>
                ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  )
}

/* ------------------------------------------------------------------------- */

type FieldProps = {
  label: string
  name: string
  type?: string
  as?: 'input' | 'textarea'
  rows?: number
  hint?: string
  error?: string
  required?: boolean
  autoComplete?: string
}

function Field({
  label,
  name,
  type = 'text',
  as = 'input',
  rows,
  hint,
  error,
  required,
  autoComplete,
}: FieldProps) {
  const id = `field-${name}`
  const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null]
    .filter(Boolean)
    .join(' ')

  const shared = cn(
    'w-full rounded-none border-0 border-b bg-transparent px-0 py-3 text-body text-foreground',
    'placeholder:text-transparent transition-colors duration-300',
    'focus:outline-none focus:border-accent',
    error ? 'border-b-accent' : 'border-b-border-strong hover:border-b-foreground',
  )

  return (
    <div>
      <label htmlFor={id} className="eyebrow flex items-center gap-2">
        {label}
        {required && (
          <span className="text-accent" aria-hidden="true">
            *
          </span>
        )}
        {hint && (
          <span id={`${id}-hint`} className="font-sans normal-case tracking-normal text-subtle">
            {hint}
          </span>
        )}
      </label>

      {as === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy || undefined}
          className={cn(shared, 'mt-2 resize-y')}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy || undefined}
          className={cn(shared, 'mt-2')}
        />
      )}

      {error && (
        <p id={`${id}-error`} className="mt-2 text-small text-accent">
          {error}
        </p>
      )}
    </div>
  )
}
