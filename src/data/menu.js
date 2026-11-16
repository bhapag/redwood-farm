import data from './menu.json';

export const menu = data;
export const allItems = data.categories.flatMap((c) => c.groups.flatMap((g) => g.items.map((i) => ({ ...i, cat: c.name, catId: c.id }))));
export const find = (name) => {
  const it = allItems.find((i) => i.name === name);
  if (!it) throw new Error(`Menu item not found: ${name}`);
  return it;
};
export const price = (it) => (it.half ? `₹${it.half} / ₹${it.full}` : `₹${it.full}`);
export const priceLabel = (it) => (it.half ? `Half ₹${it.half}, full ₹${it.full}` : `₹${it.full}`);
