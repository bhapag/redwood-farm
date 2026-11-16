import { site } from '../data/site.js';
import { abs } from '../data/urls.js';
import { menu, allItems } from '../data/menu.js';
import { allPages, pathOf, corePages } from '../data/pages.js';
import { clusters, clusterOrder } from '../data/clusters.js';

const NL = String.fromCharCode(10);

export async function GET() {
  const pages = await allPages();
  const veg = allItems.filter((i) => i.veg).length;
  const core = Object.entries(corePages).map(([p, c]) => `- [${c.title}](${abs(p)}): ${c.blurb}`).join(NL);
  const sections = clusterOrder
    .map((c) => {
      const items = pages.filter((p) => p.data.cluster === c).map((p) => `- [${p.data.title}](${abs(pathOf(p))}): ${p.data.summary}`);
      return [`## ${clusters[c].name}`, ...items].join(NL);
    })
    .join(NL + NL);
  const body = [
    '# Red Wood Farm',
    '',
    `> ${site.story}, Ludhiana, Punjab. Family restaurant first, party lawn second. North Indian, tandoor and Indo-Chinese food, ${menu.count} priced dishes, open every day.`,
    '',
    '## Key facts',
    '- Name: Red Wood Farm',
    `- Address: ${site.address.full}`,
    `- Phone and WhatsApp: ${site.phoneDisplay} (${site.wa})`,
    `- Hours: ${site.hoursDisplay}`,
    '- Service: dine-in on a garden lawn with fairy lights, takeaway, Wi-Fi',
    '- Accessibility: no wheelchair access',
    `- Menu: ${menu.count} dishes (${veg} veg), prices in Indian rupees, inclusive of GST; many mains in half and full portions`,
    '- Parties: birthday parties, kitty parties, family functions and corporate lunches on the lawn, booked on WhatsApp',
    '- Not published (ask on WhatsApp): guest capacity, per-plate and package prices',
    `- Google rating: ${site.rating.value} from ${site.rating.count} reviews (as of ${site.rating.checked})`,
    `- Google Maps: ${site.mapsUrl}`,
    '',
    '## Core pages',
    core,
    '',
    sections,
    '',
  ].join(NL);
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
