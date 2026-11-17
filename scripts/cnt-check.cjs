const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: process.argv[2] });
  const pg = await (await b.newContext({ ...devices['Pixel 7'] })).newPage();
  await pg.goto('http://127.0.0.1:4405/', { waitUntil: 'load' }); await pg.waitForTimeout(1000);
  const el = await pg.$('.stats');
  console.log('before', await pg.evaluate(() => document.querySelector('.stats').className));
  await pg.evaluate(() => document.querySelector('.stats').scrollIntoView({ block: 'center' })); await pg.waitForTimeout(2200);
  console.log('after', await pg.evaluate(() => document.querySelector('.stats').className));
  await el.screenshot({ path: process.argv[3] });
  await b.close();
})();
