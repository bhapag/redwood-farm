import { defineConfig } from 'astro/config';

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
  redirects: { '/parties/': (BASE === '/' ? '' : BASE) + '/party/' },
  compressHTML: true,
});
