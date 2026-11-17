// THE ONE VALUE TO CHANGE when the site moves to its own domain.
// Everything public is built from it: canonical URLs, sitemap.xml (and its image entries), robots.txt,
// llms.txt / llms-full.txt, Open Graph and Twitter URLs, and every schema url/@id.
// The build's base path is taken from it too: "/redwood-farm/" now, "/" for https://redwoodfarm.in.
// Domain day: set SITE_URL = 'https://redwoodfarm.in', rebuild, deploy (see DOMAIN-SWITCH.md).
export const SITE_URL = 'https://bhapag.github.io/redwood-farm';
