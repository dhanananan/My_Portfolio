/**
 * Registration marks.
 * ---------------------------------------------------------------------------
 * Four small crosshairs pinned to the viewport's corners — the print
 * registration-mark motif borrowed from a reference deck the client sent:
 * every "slide" there sat inside a hairline frame with a mark at each
 * corner, which is most of what makes it read as a *designed system* rather
 * than a stack of sections. This is the site-wide, always-present half of
 * that; Hero carries the other half (its own framed corners) since it is
 * the one place worth the extra weight of a full border.
 *
 * Fixed, aria-hidden, and never above z-70 (the navbar) — pure background
 * texture. Hidden below `sm` (640px): four marks plus a 390px-wide screen
 * leaves them fighting the content for the same few pixels of margin.
 */
export function RegistrationMarks() {
  const positions = [
    'left-5 top-5',
    'right-5 top-5 rotate-90',
    'left-5 bottom-5 -rotate-90',
    'right-5 bottom-5 rotate-180',
  ] as const

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 hidden sm:block">
      {positions.map((pos) => (
        // One corner-bracket path, drawn for top-left, rotated per corner —
        // simpler and more consistent than four hand-drawn variants.
        <svg key={pos} viewBox="0 0 20 20" className={`absolute size-4 text-border-strong ${pos}`}>
          <path d="M2 8V2h6" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      ))}
    </div>
  )
}
