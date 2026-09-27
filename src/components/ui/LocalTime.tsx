import { useEffect, useState } from 'react'

/**
 * Live wall-clock time in another timezone — a real detail rather than a
 * decorative one, and a genuinely useful one for someone deciding when to
 * expect a reply. Renders `--:--` until mounted so the markup is identical
 * on first paint, then ticks (every 20s is plenty for an HH:MM display).
 */
export function LocalTime({
  timeZone = 'Asia/Kathmandu',
  label = 'NPT',
  className,
}: {
  timeZone?: string
  label?: string
  className?: string
}) {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    const format = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone })
    const tick = () => setTime(format.format(new Date()))
    tick()
    const id = window.setInterval(tick, 20_000)
    return () => window.clearInterval(id)
  }, [timeZone])

  return (
    <span className={className}>
      <span className="tabular-nums">{time ?? '--:--'}</span>
      <span className="ml-1.5 opacity-60">{label}</span>
    </span>
  )
}
