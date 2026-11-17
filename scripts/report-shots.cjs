// Report screenshots: each listed section of a page, at the given widths, with reveals settled.
// Usage: node scripts/report-shots.cjs <url> <outDir> <widths comma list> <selector>[,<selector>...] [chromePath]
// Selectors are separated by "|" when they contain commas.
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');
(async () => {
  const [url, out, widths, sels, exe] = process.argv.slice(2);
  const list = sels.split('|');
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ executablePath: exe || undefined });
  for (const w of widths.split(',').map(Number)) {
    const mobile = w < 900;
    const ctx = await b.newContext(mobile ? { ...devices['iPhone 13'], viewport: { width: w, height: 844 } } : { viewport: { width: w, height: 900 } });
    const pg = await ctx.newPage();
    for (let k = 0; k < 3; k++) { try { await pg.goto(url, { waitUntil: 'load', timeout: 60000 }); break; } catch (e) { if (k === 2) throw e; await pg.waitForTimeout(3000); } }
    await pg.waitForTimeout(1500);
    // Load every lazy image first, so no section is captured with empty frames.
    const H = await pg.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 600) { await pg.evaluate((yy) => window.scrollTo(0, yy), y); await pg.waitForTimeout(120); }
    await pg.evaluate(() => { window.scrollTo(0, 0); document.querySelectorAll('[data-reveal]').forEach((e) => e.classList.add('in')); document.querySelectorAll('img[loading=lazy]').forEach((i) => (i.loading = 'eager'));
      // Fixed chrome (header, bottom bar, back-to-top) would otherwise be stamped over each section capture.
      const st = document.createElement('style'); st.textContent = '.site-head, .actionbar, .to-top { visibility: hidden !important; }'; document.head.append(st); });
    await pg.waitForTimeout(1500);
    for (let i = 0; i < list.length; i++) {
      const el = await pg.$(list[i]);
      if (!el) { console.log('missing', list[i]); continue; }
      await el.scrollIntoViewIfNeeded();
      await pg.waitForTimeout(700);
      const name = `${String(i + 1).padStart(2, '0')}-${list[i].replace(/[^a-z0-9-]+/gi, '').slice(0, 24)}_${w}.jpg`;
      await el.screenshot({ path: path.join(out, name), type: 'jpeg', quality: 78 });
    }
    await ctx.close();
  }
  await b.close();
  console.log('done', out);
})();
