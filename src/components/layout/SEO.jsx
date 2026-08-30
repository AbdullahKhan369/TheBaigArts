import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'THE BAIGARTS'
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://thebaigarts.com'
const DEFAULT_OG_IMAGE = `${SITE_URL}/brand/og-image.jpg`

/**
 * Drop this into any page to set its title/description/canonical/OG tags.
 * Pass `jsonLd` (a plain object) to inject structured data for that page.
 */
export default function SEO({
  title,
  description,
  path = '',
  image = DEFAULT_OG_IMAGE,
  jsonLd,
  noIndex = false,
}) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Original Handmade Paintings`
  const canonicalUrl = `${SITE_URL}${path}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  )
}
