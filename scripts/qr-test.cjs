// End-to-end QR test: open each printed QR address and report where the browser lands.
// Usage: node scripts/qr-test.cjs [chrome] [cloudflareIp]
const { chromium, devices } = require('playwright');
(async () => {
  const [exe, ip] = process.argv.slice(2);
  const args = ip ? [`--host-resolver-rules=MAP redwoodfarm.in ${ip}, MAP www.redwoodfarm.in ${ip}`] : [];
  const b = await chromium.launch({ executablePath: exe || undefined, args });
  const pg = await (await b.newContext({ ...devices['Pixel 7'] })).newPage();
  for (const p of ['', 'party/', 'menu/']) {
    const from = `https://bhapag.github.io/redwood-farm/${p}?src=qr`;
    await pg.goto(from, { waitUntil: 'load' }); await pg.waitForTimeout(2500);
    const h1 = await pg.evaluate(() => document.querySelector('h1')?.textContent.trim().slice(0, 60));
    console.log(`${from}\n  -> ${pg.url()}  | h1: ${h1}`);
  }
  await b.close();
})();
