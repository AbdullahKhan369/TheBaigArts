// Generates public/sitemap.xml from live Supabase data (static pages + every painting slug).
// Run manually with `npm run sitemap`, or wire into your deploy step (e.g. a Vercel build command:
// "npm run sitemap && npm run build") so it regenerates on every deploy.

import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'fs'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const SITE_URL = process.env.VITE_SITE_URL || 'https://thebaigarts.com'
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)

const staticPages = ['', '/gallery', '/about', '/contact']

async function generate() {
  const { data: paintings, error } = await supabase.from('paintings').select('slug, updated_at')

  if (error) {
    console.error('Failed to fetch paintings for sitemap:', error.message)
    process.exit(1)
  }

  const urls = [
    ...staticPages.map((path) => ({ path, lastmod: new Date().toISOString() })),
    ...(paintings || []).map((p) => ({ path: `/painting/${p.slug}`, lastmod: p.updated_at })),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${SITE_URL}${u.path}</loc>
    <lastmod>${new Date(u.lastmod).toISOString().split('T')[0]}</lastmod>
  </url>`
  )
  .join('\n')}
</urlset>
`

  writeFileSync('public/sitemap.xml', xml)
  console.log(`Sitemap generated with ${urls.length} URLs -> public/sitemap.xml`)
}

generate()
