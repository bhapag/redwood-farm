import { abs } from '../data/urls.js';
import { allPages, pathOf } from '../data/pages.js';

const NL = String.fromCharCode(10);

export async function GET() {
  const pages = await allPages();
  const today = new Date().toISOString().slice(0, 10);
  const core = ['/', '/menu/', '/party/', '/visit/', '/food/', '/garden/', '/guides/', '/about/', '/faq/'];
  const rows = [
    ...core.map((p) => ({ loc: abs(p), lastmod: today })),
    ...pages.map((p) => ({ loc: abs(pathOf(p)), lastmod: p.data.updated.toISOString().slice(0, 10) })),
  ];
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...rows.map((r) => `  <url><loc>${r.loc}</loc><lastmod>${r.lastmod}</lastmod></url>`),
    '</urlset>',
    '',
  ].join(NL);
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
