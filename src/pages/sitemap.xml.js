import { abs } from '../data/urls.js';
import { allPages, pathOf } from '../data/pages.js';
import { getImage } from 'astro:assets';
import { img } from '../data/images.js';

// Real venue photos on each guide page are listed as image entries (image sitemap extension).
const imgUrl = async (key) => abs((await getImage({ src: img(key), width: 1200, format: 'webp' })).src.replace(import.meta.env.BASE_URL.replace(/\/$/, ''), ''));
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

const NL = String.fromCharCode(10);

export async function GET() {
  const pages = await allPages();
  const today = new Date().toISOString().slice(0, 10);
  const core = ['/', '/menu/', '/party/', '/visit/', '/food/', '/garden/', '/guides/', '/about/', '/faq/'];
  const rows = [
    ...core.map((p) => ({ loc: abs(p), lastmod: today })),
    ...(await Promise.all(pages.map(async (p) => ({
      loc: abs(pathOf(p)),
      lastmod: p.data.updated.toISOString().slice(0, 10),
      images: await Promise.all(p.data.images.filter((i) => i.src.startsWith('venue/')).map(async (i) => ({ loc: await imgUrl(i.src), title: i.alt }))),
    })))),
  ];
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ...rows.map((r) => `  <url><loc>${r.loc}</loc><lastmod>${r.lastmod}</lastmod>${(r.images || []).map((i) => `<image:image><image:loc>${i.loc}</image:loc><image:title>${esc(i.title)}</image:title></image:image>`).join('')}</url>`),
    '</urlset>',
    '',
  ].join(NL);
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
