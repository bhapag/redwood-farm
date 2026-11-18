// Party panel buttons: one line, inside their panel, at every width. Usage: node scripts/party-btn-check.cjs <base> [chrome]
const { chromium } = require('playwright');
(async () => {
  const [base, exe] = process.argv.slice(2);
  const b = await chromium.launch({ executablePath: exe || undefined });
  let bad = 0, n = 0;
  for (const w of [320, 360, 390, 412, 768, 900, 1024, 1280, 1440, 1920]) {
    const pg = await b.newPage({ viewport: { width: w, height: 900 } });
    for (const p of ['/', '/party/']) {
      await pg.goto(base + p, { waitUntil: 'load' });
      const r = await pg.$$eval('.party-btn', (bs) => bs.map((x) => { const br = x.getBoundingClientRect(), pr = x.closest('.party').getBoundingClientRect(); return { lines: Math.round(br.height / parseFloat(getComputedStyle(x).lineHeight || 16)), h: br.height, inside: br.left >= pr.left - 0.5 && br.right <= pr.right + 0.5, label: x.textContent.trim(), aria: x.getAttribute('aria-label') }; }));
      r.forEach((x) => { n++; if (x.h > 56 || !x.inside) { bad++; console.log('BAD', w, p, JSON.stringify(x)); } });
      if (w === 390 && p === '/party/') console.log('sample', JSON.stringify(r.map((x) => [x.label, x.aria])));
    }
    await pg.close();
  }
  console.log(`${n} buttons checked, ${bad} wrap or overflow`);
  await b.close();
})();
