// End-to-end QR test: open each printed QR address and report where the browser lands and the page's H1.
// Usage: node scripts/qr-test.cjs [chrome]
const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: process.argv[2] || undefined });
  const pg = await (await b.newContext({ ...devices['Pixel 7'] })).newPage();
  for (const p of ['', 'party/', 'menu/']) {
    const from = `https://bhapag.github.io/redwood-farm/${p}?src=qr&cb=${Date.now()}`;
    const r = await pg.goto(from, { waitUntil: 'load' }); await pg.waitForTimeout(1500);
    const h1 = await pg.evaluate(() => document.querySelector('h1')?.textContent.trim().slice(0, 60));
    console.log(`${r.status()} /redwood-farm/${p} -> ${pg.url().split('?')[0]} | h1: ${h1}`);
  }
  await b.close();
})();
