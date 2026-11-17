// One place for every URL.
// CANONICAL_ORIGIN: where search engines index the site: https://redwoodfarm.in (Cloudflare Pages).
// BASE_URL comes from the build: "/" on Cloudflare Pages, "/redwood-farm/" for the GitHub Pages copy.
export const CANONICAL_ORIGIN = (import.meta.env.PUBLIC_CANONICAL_ORIGIN || 'https://redwoodfarm.in').replace(/\/$/, '');
export const base = import.meta.env.BASE_URL.replace(/\/$/, '');
/** Link inside the current build (respects the base path). */
export const u = (p) => `${base}${p}`;
/** Absolute canonical URL for a site path like "/menu/". */
export const abs = (p) => `${CANONICAL_ORIGIN}${p}`;
/** Strip the build base from a pathname, giving the site path. */
export const sitePath = (pathname) => (base && pathname.startsWith(base) ? pathname.slice(base.length) : pathname) || '/';
