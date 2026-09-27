import { useEffect } from 'react'
import { site } from '@/data/site'

type Seo = {
  title: string
  description: string
  /** Path only, e.g. "/work/roomora". Combined with site.url for canonical. */
  path: string
  /** Absolute or root-relative image path for Open Graph. */
  image?: string
  type?: 'website' | 'article'
}

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/**
 * Per-route document metadata. Deliberately dependency-free — react-helmet
 * would add weight for something the DOM already does well.
 */
export function useSeo({ title, description, path, image, type = 'website' }: Seo) {
  useEffect(() => {
    const url = `${site.url}${path}`
    const ogImage = image ? (image.startsWith('http') ? image : `${site.url}${image}`) : `${site.url}/og-image.svg`

    document.title = title

    setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[property="og:url"]', 'property', 'og:url', url)
    setMeta('meta[property="og:type"]', 'property', 'og:type', type)
    setMeta('meta[property="og:image"]', 'property', 'og:image', ogImage)
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage)

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url
  }, [title, description, path, image, type])
}
