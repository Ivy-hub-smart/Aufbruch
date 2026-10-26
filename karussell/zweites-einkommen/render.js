// Rendert das Karussell als 1080×1080 PNGs nach out/
// Aufruf: node karussell/zweites-einkommen/render.js
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const dir = __dirname;
  const out = path.join(dir, 'out');
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1080 } });

  // Slide 1: das fertige Titelbild, auf 1080×1080 skaliert
  await page.setContent(`<body style="margin:0"><img src="data:image/png;base64,${fs.readFileSync(path.join(dir, 'assets/cover.png')).toString('base64')}" style="width:1080px;height:1080px;display:block"></body>`);
  await page.screenshot({ path: path.join(out, 'slide-1.png') });

  for (const n of [2, 3, 4, 5]) {
    await page.goto(`file://${path.join(dir, 'slides.html')}?s=${n}`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(out, `slide-${n}.png`) });
  }
  await browser.close();
  console.log('Fertig:', out);
})();
