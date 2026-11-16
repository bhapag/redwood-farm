import { defineConfig } from 'astro/config';

// Moving to a custom domain later: set SITE to the domain and BASE to '/'.
const SITE = 'https://bhapag.github.io';
const BASE = '/redwood-farm';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  image: { responsiveStyles: false },
  redirects: { '/parties/': BASE + '/party/' },
  compressHTML: true,
});
