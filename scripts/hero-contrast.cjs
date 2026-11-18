// Measured contrast of the Home hero text against the photo behind it, at 390 and 1440 px.
// Hides the text, screenshots each text box, takes the 95th-percentile luminance of the pixels behind it
// (a near-worst case: the brightest lamps), and compares that with the text colour.
// Usage: node scripts/hero-contrast.cjs <baseUrl> [chrome]
const { chromium, devices } = require('playwright');
const { PNG } = (() => { try { return require('pngjs'); } catch { return {}; } })();
const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const L = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
(async () => {
  const [base, exe] = process.argv.slice(2);
  const b = await chromium.launch({ executablePath: exe || undefined });
  for (const [w, opts] of [['390', { ...devices['iPhone 13'], viewport: { width: 390, height: 844 } }], ['1440', { viewport: { width: 1440, height: 900 } }]]) {
    const ctx = await b.newContext({ ...opts, reducedMotion: 'reduce' });
    const pg = await ctx.newPage();
    await pg.goto(`${base}/?c=${Date.now()}`, { waitUntil: 'load' });
    await pg.waitForTimeout(800);
    for (const [sel, need] of [['.hero-title', 3], ['.hero-sub', 4.5], ['.hero-open', 4.5]]) {
      const el = await pg.$(sel);
      if (!el || !(await el.isVisible())) { console.log(w, sel, 'not visible'); continue; }
      const color = await el.evaluate((e) => getComputedStyle(e).color);
      await el.evaluate((e) => (e.style.color = 'transparent'));
      // Measure only where the glyphs are: the union of the text's own line boxes (not the full-width block).
      const clip = await el.evaluate((e) => {
        const rs = [];
        const tw = document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
        for (let n = tw.nextNode(); n; n = tw.nextNode()) { const r = document.createRange(); r.selectNodeContents(n); rs.push(...[...r.getClientRects()].filter((x) => x.width > 2)); }
        const x = Math.min(...rs.map((q) => q.left)), y = Math.min(...rs.map((q) => q.top));
        return { x, y, width: Math.max(...rs.map((q) => q.right)) - x, height: Math.max(...rs.map((q) => q.bottom)) - y };
      });
      const buf = await pg.screenshot({ clip });
      await el.evaluate((e) => (e.style.color = ''));
      const png = PNG.sync.read(buf);
      const lums = [];
      for (let i = 0; i < png.data.length; i += 4) lums.push(L(png.data[i], png.data[i + 1], png.data[i + 2]));
      lums.sort((a, z) => a - z);
      const bg = lums[Math.floor(lums.length * 0.95)];
      const m = color.match(/[\d.]+/g).map(Number);
      const a = m[3] ?? 1;
      // text colour blended over the measured background colour (approximate as grey of that luminance)
      const bgc = 255 * Math.pow(bg, 1 / 2.2);
      const t = L(m[0] * a + bgc * (1 - a), m[1] * a + bgc * (1 - a), m[2] * a + bgc * (1 - a));
      const ratio = (Math.max(t, bg) + 0.05) / (Math.min(t, bg) + 0.05);
      console.log(`${w}px ${sel}: ${ratio.toFixed(2)}:1 (need ${need}:1) ${ratio >= need ? 'PASS' : 'FAIL'}`);
    }
    await ctx.close();
  }
  await b.close();
})();
