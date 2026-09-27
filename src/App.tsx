import { Suspense, lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SmoothScrollProvider } from '@/lib/SmoothScroll'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { PageTransition } from '@/components/layout/PageTransition'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import { RouteFallback } from '@/components/ui/RouteFallback'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'
import Home from '@/pages/Home'

/* Home ships in the initial bundle; everything else is fetched on demand. */
const Work = lazy(() => import('@/pages/Work'))
const CaseStudy = lazy(() => import('@/pages/CaseStudy'))
const About = lazy(() => import('@/pages/About'))
const Contact = lazy(() => import('@/pages/Contact'))
const NotFound = lazy(() => import('@/pages/NotFound'))

export default function App() {
  return (
    <BrowserRouter>
      <SmoothScrollProvider>
        <CustomCursor />
        <ScrollProgress />
        <Navbar />

        <PageTransition>
          {(location) => (
            <main id="main">
              <ErrorBoundary>
                <Suspense fallback={<RouteFallback />}>
                  <Routes location={location}>
                    <Route path="/" element={<Home />} />
                    <Route path="/work" element={<Work />} />
                    <Route path="/work/:slug" element={<CaseStudy />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </main>
          )}
        </PageTransition>

        <Footer />
      </SmoothScrollProvider>
    </BrowserRouter>
  )
}
