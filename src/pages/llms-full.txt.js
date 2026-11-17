// llms-full.txt: the whole site as plain text for AI answer engines: key facts, the full priced menu,
// and every guide page in full (title, URL, summary, FAQs, body). llms.txt stays the short index.
import { site } from '../data/site.js';
import { abs } from '../data/urls.js';
import { menu, priceLabel } from '../data/menu.js';
import { allPages, pathOf, corePages } from '../data/pages.js';

const NL = String.fromCharCode(10);

export async function GET() {
  const pages = await allPages();
  const menuText = menu.categories.map((c) => [
    `### ${c.name}`,
    ...c.groups.flatMap((g) => g.items.map((i) => `- ${i.name} (${i.veg ? 'veg' : 'non-veg'}): ${priceLabel(i)}`)),
  ].join(NL)).join(NL + NL);
  const pageText = pages.map((p) => [
    `## ${p.data.title}`,
    `URL: ${abs(pathOf(p))}`,
    '',
    p.data.summary,
    '',
    ...(p.data.faq || []).flatMap((f) => [`Q: ${f.q}`, `A: ${f.a}`, '']),
    (p.body || '').replace(/^---[\s\S]*?---/, '').replace(/\]\((\.\.\/)+/g, `](${abs('/')}`).trim(),
  ].join(NL)).join(NL + NL + '---' + NL + NL);
  const body = [
    '# Red Wood Farm (full text)',
    '',
    `> ${site.story}, Ludhiana, Punjab. Garden family restaurant and party lawn. Tandoor, North Indian and Indo-Chinese food, ${menu.count} priced dishes, open every day. Short index: ${abs('/llms.txt')}`,
    '',
    '## Key facts',
    `- Address: ${site.address.full}`,
    `- Phone and bookings: ${site.phoneDisplay}`,
    `- Hours: ${site.hoursDisplay}`,
    '- Service: dine-in on a garden lawn with fairy lights, takeaway, Wi-Fi. No wheelchair access.',
    `- Google rating: ${site.rating.value} from ${site.rating.count} reviews (as of ${site.rating.checked})`,
    '- Not published (ask us): guest capacity, per-plate and package prices',
    '',
    '## Core pages',
    ...Object.entries(corePages).map(([p, c]) => `- ${c.title}: ${abs(p)}. ${c.blurb}`),
    '',
    `## Full menu (${menu.count} dishes, prices in Indian rupees, inclusive of GST)`,
    menuText,
    '',
    '# Guides',
    '',
    pageText,
    '',
  ].join(NL);
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
