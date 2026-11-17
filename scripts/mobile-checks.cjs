// Measured mobile checks for the brief's phone rules, on three devices.
// Usage: node scripts/mobile-checks.cjs <baseUrl> [chromePath]
const { chromium, devices } = require('playwright');
const base = process.argv[2] || 'http://127.0.0.1:4402';
const profiles = [
  ['Galaxy S20 / Redmi 360x800', { viewport: { width: 360, height: 800 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: devices['Galaxy S9+'].userAgent }],
  ['Pixel 7', devices['Pixel 7']],
  ['iPhone 13', devices['iPhone 13']],
];
const pages = ['/', '/menu/', '/party/', '/visit/', '/party/birthday-party-venues-ludhiana/'];
(async () => {
  const b = await chromium.launch({ executablePath: process.argv[3] || undefined });
  const rows = [];
  for (const [dev, opts] of profiles) {
    const ctx = await b.newContext(opts);
    for (const p of pages) {
      const pg = await ctx.newPage();
      await pg.goto(base + p, { waitUntil: 'load' });
      await pg.waitForTimeout(800);
      const r = await pg.evaluate(async (path) => {
        const out = { page: path };
        const bar = document.querySelector('.actionbar').getBoundingClientRect().height;
        const vh = innerHeight;
        if (path === '/') {
          const ctas = [...document.querySelectorAll('.hero-ctas .btn')].map((e) => e.getBoundingClientRect());
          out.heroCtasVisible = ctas.every((c) => c.bottom <= vh - bar && c.top >= 0);
          const h1 = document.querySelector('.hero h1');
          out.heroH1Lines = Math.round(h1.getBoundingClientRect().height / parseFloat(getComputedStyle(h1).lineHeight));
          const n = document.querySelector('.hero-name');
          out.neonOneLine = n.getBoundingClientRect().height < parseFloat(getComputedStyle(n).fontSize) * 1.6 && n.scrollWidth <= n.clientWidth;
          // Dishes on phones: native swipe carousel with a CSS scroll-driven tilt.
          const row = document.querySelector('.dish-phone');
          out.dishCarousel = !!row && getComputedStyle(row).display !== 'none' && row.scrollWidth > row.clientWidth;
          out.dishCards = document.querySelectorAll('.dish-phone .dtilt').length;
          out.tunnelBand = !!document.querySelector('[data-tunnel]');
          out.heroPhotoRatio = +(() => { const r = document.querySelector('.hero-photo').getBoundingClientRect(); return (r.width / r.height).toFixed(2); })();
          out.swipeHint = !!document.querySelector('.swipe-hint') && getComputedStyle(document.querySelector('.swipe-hint')).display !== 'none';
          out.reviewRowsShown = [...document.querySelectorAll('.rv-row')].filter((e) => getComputedStyle(e).display !== 'none').length;
          out.reviewsInRow = document.querySelectorAll('.rv-phone .rv-card:not([aria-hidden])').length;
        }
        if (path === '/menu/') {
          const mb = document.querySelector('.m-bar');
          out.menuBarSticky = getComputedStyle(mb).position === 'sticky';
          out.searchInBar = !!mb.querySelector('input[type=search]');
          out.chipsInBar = mb.querySelectorAll('.m-cats a').length;
          out.chipMinHeight = Math.min(...[...mb.querySelectorAll('.m-cats a, .m-diet button')].map((e) => e.getBoundingClientRect().height));
          out.priceFont = getComputedStyle(document.querySelector('.m-p')).fontSize;
          out.backToTop = !!document.querySelector('[data-top]');
        }
        // Pinned or sticky content sections on phones (header, action bar, menu bar and back-to-top are allowed).
        const allowed = ['site-head', 'actionbar', 'm-bar', 'to-top', 'sheet', 'scroll-stack__slot'];
        out.pinnedSections = [...document.querySelectorAll('body *')].filter((e) => {
          const s = getComputedStyle(e).position;
          return (s === 'sticky' || s === 'fixed') && !allowed.some((c) => e.closest('.' + c)) && e.getBoundingClientRect().height > 0;
        }).map((e) => e.className.toString().slice(0, 30));
        // Text on photos: headings or paragraphs whose box overlaps an image box.
        const imgs = [...document.querySelectorAll('main img')].map((i) => i.getBoundingClientRect()).filter((r) => r.width > 80);
        const texts = [...document.querySelectorAll('main h1, main h2, main h3, main p')].filter((t) => t.textContent.trim() && !t.closest('figcaption'));
        out.textOverPhoto = texts.filter((t) => { const a = t.getBoundingClientRect(); return imgs.some((r) => a.left < r.right - 4 && a.right > r.left + 4 && a.top < r.bottom - 4 && a.bottom > r.top + 4); }).map((t) => t.textContent.trim().slice(0, 30));
        // Ghosting: anything mid cross-fade (two stacked images both partly transparent).
        out.translucentImages = [...document.querySelectorAll('main img, main video')].filter((i) => { let e = i, o = 1; while (e && e !== document.body) { o *= +getComputedStyle(e).opacity; e = e.parentElement; } return o > 0.05 && o < 0.95; }).length; // half-visible only; fully hidden deck cards (opacity 0) are not ghosts
        // Page end clears the action bar.
        window.scrollTo(0, document.documentElement.scrollHeight);
        await new Promise((r) => setTimeout(r, 300));
        const last = document.querySelector('.signoff').getBoundingClientRect();
        out.endClearOfBar = last.bottom <= vh - bar + 1;
        out.overflow = document.documentElement.scrollWidth > innerWidth + 1;
        return out;
      }, p);
      rows.push({ device: dev, ...r });
      await pg.close();
    }
    await ctx.close();
  }
  await b.close();
  console.log(JSON.stringify(rows, null, 1));
})();
