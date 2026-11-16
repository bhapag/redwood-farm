import { site } from '../data/site.js';
import { abs } from '../data/urls.js';
import { menu, allItems } from '../data/menu.js';
import { getCollection } from 'astro:content';

export async function GET({ site: origin }) {
  const base = abs('/');
  const notes = (await getCollection('notes')).sort((a, b) => a.data.order - b.data.order);
  const veg = allItems.filter((i) => i.veg).length;
  const body = `# Red Wood Farm

> ${site.story}, Ludhiana, Punjab. Family restaurant first, party lawn second. North Indian, tandoor and Indo-Chinese food, ${menu.count} priced dishes, open every day.

## Key facts
- Name: Red Wood Farm
- Address: ${site.address.full}
- Phone and WhatsApp: ${site.phoneDisplay} (${site.wa})
- Hours: ${site.hoursDisplay}
- Service: dine-in on a garden lawn with fairy lights, takeaway, Wi-Fi
- Accessibility: no wheelchair access
- Menu: ${menu.count} dishes (${veg} veg), prices in Indian rupees, inclusive of GST; many mains in half and full portions
- Parties: birthday parties, kitty parties, family functions and corporate lunches on the lawn, booked on WhatsApp
- Not published (ask on WhatsApp): guest capacity, per-plate and package prices
- Google rating: ${site.rating.value} from ${site.rating.count} reviews (as of ${site.rating.checked})
- Google Maps: ${site.mapsUrl}

## Pages
- [Home](${base}): overview
- [Menu with prices](${base}menu/): all ${menu.count} dishes, veg and non-veg marked
- [Parties and events](${base}party/): party types, how booking works, FAQ
- [Visit](${base}visit/): address, hours, directions, facilities

## Notes
${notes.map((n) => `- [${n.data.title}](${base}notes/${n.id}/): ${n.data.description}`).join('\n')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
