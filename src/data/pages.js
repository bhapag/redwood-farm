import { getCollection } from 'astro:content';
import { clusters } from './clusters.js';

export const corePages = {
  '/': { title: 'Home', blurb: 'Garden family restaurant and party lawn on outer Pakhowal Road.' },
  '/menu/': { title: 'Menu and prices', blurb: 'All 187 dishes with half and full prices, veg and non-veg marked.' },
  '/party/': { title: 'Parties & events', blurb: clusters.party.blurb },
  '/visit/': { title: 'Getting here', blurb: clusters.visit.blurb },
  '/food/': { title: 'Food & menu guides', blurb: clusters.food.blurb },
  '/garden/': { title: 'The garden', blurb: clusters.garden.blurb },
  '/guides/': { title: 'Guides', blurb: clusters.guides.blurb },
  '/about/': { title: 'About Red Wood Farm', blurb: 'Who we are, what we serve and how the place works.' },
  '/faq/': { title: 'Questions and answers', blurb: 'Hours, bookings, food, parties and getting here.' },
};

export const slugOf = (entry) => entry.id.split('/').pop();
export const pathOf = (entry) => `/${entry.data.cluster}/${slugOf(entry)}/`;

export async function allPages() {
  const list = await getCollection('pages');
  return list.sort((a, b) => a.data.title.localeCompare(b.data.title));
}

export async function pagesIn(cluster) {
  return (await allPages()).filter((p) => p.data.cluster === cluster);
}

/** Title and blurb for any site path (core page or content page). */
export async function lookup() {
  const map = { ...corePages };
  for (const p of await allPages()) map[pathOf(p)] = { title: p.data.title, blurb: p.data.description };
  return map;
}

export const wordCount = (body = '') => body.replace(/^---[\s\S]*?---/, '').split(/\s+/).filter(Boolean).length;
