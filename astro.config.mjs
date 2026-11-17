import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// client:interact hydrates an island on the first scroll, touch, click or key press (src/directives/interact.js).
const interact = { name: 'interact-directive', hooks: { 'astro:config:setup': ({ addClientDirective }) => addClientDirective({ name: 'interact', entrypoint: './src/directives/interact.js' }) } };

// Two builds from one source:
//   Cloudflare Pages:  BASE_PATH unset  -> served at "/"
//   GitHub Pages copy: BASE_PATH=/redwood-farm -> served at bhapag.github.io/redwood-farm/ (printed QR codes)
// Canonical URLs come from PUBLIC_CANONICAL_ORIGIN (default in src/data/urls.js). Switch it to the custom domain later.
const BASE = process.env.BASE_PATH || '/';
const SITE = process.env.PUBLIC_CANONICAL_ORIGIN || 'https://redwood-farm.pages.dev';

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