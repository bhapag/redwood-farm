import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import { SITE_URL } from './site.config.mjs';

// client:interact hydrates an island on the first scroll, touch, click or key press (src/directives/interact.js).
// client:after hydrates 2.5 s after load or on first interaction (src/directives/after.js).
const interact = { name: 'rwf-directives', hooks: { 'astro:config:setup': ({ addClientDirective }) => {
  addClientDirective({ name: 'interact', entrypoint: './src/directives/interact.js' });
  addClientDirective({ name: 'after', entrypoint: './src/directives/after.js' });
} } };

// The public address is SITE_URL in site.config.mjs (one value). The base path follows it:
//   SITE_URL https://bhapag.github.io/redwood-farm -> base /redwood-farm/  (GitHub Pages, printed QR codes)
//   SITE_URL https://redwoodfarm.in                 -> base /
// BASE_PATH (env) overrides the base only for the Cloudflare preview mirror, which is served at "/"
// with noindex and canonical URLs pointing at SITE_URL.
const siteUrl = new URL(SITE_URL);
const BASE = process.env.BASE_PATH || siteUrl.pathname.replace(/\/$/, '') || '/';
const SITE = siteUrl.origin;

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  image: { responsiveStyles: false },

  redirects: Object.fromEntries(Object.entries({
    '/parties/': '/party/',
    '/notes/': '/guides/',
    '/notes/kitty-party-venue-ludhiana/': '/party/kitty-party-venues-ludhiana/',
    '/notes/birthday-party-venue-checklist-ludhiana/': '/party/birthday-party-venues-ludhiana/',
    '/notes/tandoor-what-to-order-first/': '/food/tandoor-guide/',
    '/notes/an-evening-on-the-lawn/': '/garden/an-evening-on-the-lawn/',
  }).map(([from, to]) => [from, (BASE === '/' ? '' : BASE) + to])),

  compressHTML: true,
  integrations: [react(), interact],
});