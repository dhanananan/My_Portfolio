import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@/components/ui/Button'

/**
 * Catches render errors — most plausibly a failed lazy chunk after a redeploy —
 * and offers a way out instead of a blank page.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) console.error('Render error:', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <section className="shell flex min-h-[70vh] flex-col justify-center py-section">
        <p className="eyebrow">Something broke</p>
        <h1 className="mt-6 max-w-2xl text-h2 font-medium">
          This page didn&rsquo;t load properly.
        </h1>
        <p className="mt-5 max-w-prose text-lead text-muted">
          Reloading usually fixes it. If it keeps happening, I&rsquo;d genuinely like to know.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button onClick={() => window.location.reload()} size="lg" withArrow>
            Reload the page
          </Button>
          <Button to="/" variant="secondary" size="lg">
            Back to home
          </Button>
        </div>
      </section>
    )
  }
}
