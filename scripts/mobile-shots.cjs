// Mobile audit captures: scrolls each page one screen at a time on three phone sizes,
// saves viewport screenshots and simple metrics (overflow, small tap targets, small text, console errors).
// Usage: node scripts/mobile-shots.cjs <baseUrl> <outDir> [chromePath]
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');

const [base = 'http://127.0.0.1:4400', out = 'shots', exe] = process.argv.slice(2);
const pages = [['home', '/'], ['menu', '/menu/'], ['party', '/party/'], ['visit', '/visit/'], ['guide', '/party/birthday-party-venues-ludhiana/']];
const profiles = [
  ['s360', { viewport: { width: 360, height: 800 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: devices['Galaxy S9+'].userAgent }],
  ['iphone13', devices['iPhone 13']],
  ['pixel7', devices['Pixel 7']],
];

(async () => {
  const browser = await chromium.launch({ executablePath: exe || undefined });
  const report = {};
  for (const [dev, opts] of profiles) {
    const ctx = await browser.newContext({ ...opts, deviceScaleFactor: 2 });
    for (const [name, p] of pages) {
      const pg = await ctx.newPage();
      const errors = [];
      pg.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
      pg.on('pageerror', (e) => errors.push(String(e)));
      await pg.goto(base + p, { waitUntil: 'load' });
      await pg.waitForTimeout(1200);
      const dir = path.join(out, dev, name);
      fs.mkdirSync(dir, { recursive: true });
      const vh = opts.viewport.height;
      let y = 0, i = 0;
      const total = await pg.evaluate(() => document.documentElement.scrollHeight);
      while (y < total && i < 40) {
        await pg.evaluate((yy) => window.scrollTo(0, yy), y);
        await pg.waitForTimeout(700);
        await pg.screenshot({ path: path.join(dir, String(i).padStart(2, '0') + '.jpg'), type: 'jpeg', quality: 70 });
        y += Math.round(vh * 0.85); i++;
        const t = await pg.evaluate(() => document.documentElement.scrollHeight);
        if (t > total) break;
      }
      const m = await pg.evaluate(() => {
        const vis = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
        const small = [];
        document.querySelectorAll('a, button, summary, input, select').forEach((el) => {
          if (!vis(el)) return;
          const inProse = el.closest('p, li, address, td') && el.tagName === 'A' && getComputedStyle(el).display === 'inline';
          if (inProse) return;
          const r = el.getBoundingClientRect();
          if (r.height < 44 || r.width < 44) small.push(`${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30)}" ${Math.round(r.width)}x${Math.round(r.height)}`);
        });
        const tiny = new Set();
        document.querySelectorAll('p, li, span, a, small, td, label').forEach((el) => {
          if (!vis(el) || !el.childNodes.length || ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return;
          const fs = parseFloat(getComputedStyle(el).fontSize);
          if (fs < 14) tiny.add(`${fs}px "${el.textContent.trim().slice(0, 30)}"`);
        });
        return { overflow: document.documentElement.scrollWidth > innerWidth + 1, smallTargets: small, tinyText: [...tiny].slice(0, 20), height: document.documentElement.scrollHeight };
      });
      report[`${dev}/${name}`] = { ...m, errors, frames: i };
      await pg.close();
    }
    await ctx.close();
  }
  fs.writeFileSync(path.join(out, 'metrics.json'), JSON.stringify(report, null, 2));
  await browser.close();
  console.log('done', Object.keys(report).length);
})();
