import { base, u, abs, sitePath, CANONICAL_ORIGIN } from '../data/urls.js';
import { getCollection } from 'astro:content';

export async function GET({ site }) {
    const notes = await getCollection('notes');
  const today = new Date().toISOString().slice(0, 10);
  const paths = ['/', '/menu/', '/party/', '/visit/', '/notes/', ...notes.map((n) => `/notes/${n.id}/`)];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${abs(p)}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
