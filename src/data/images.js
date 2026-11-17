// Image registry: content frontmatter refers to images by key, e.g. "venue/tunnel.jpg".
const files = import.meta.glob('../assets/venue/*.{jpg,png}', { eager: true });
export const images = Object.fromEntries(
  Object.entries(files).map(([path, mod]) => [path.replace('../assets/', ''), mod.default])
);
export const img = (key) => {
  const i = images[key];
  if (!i) throw new Error(`Unknown image key: ${key}`);
  return i;
};
export const isFood = (key) => key.startsWith('food/');
