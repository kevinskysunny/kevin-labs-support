// Browser-level invariants for the three shared page templates.
// Run npm install, then npm run test:browser. Uses installed Chrome by default.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createBrowserHarness } from './browser-harness.mjs';
const { browser, context, base, close } = await createBrowserHarness();
const page = await context.newPage();
const records = [];
const paths = ['index.html','guides.html','volmix/index.html','presenter-deck/index.html','netdoctor/index.html','ksic-studio/index.html','volmix/support.html','barnest/support.html','support.html','website-privacy.html','privacy.html'];
try {
  for (const width of [320,390,430,600,601,700,701,768,850,851,1000,1001,1024,1440]) {
    await page.setViewportSize({ width, height:900 });
    for (const file of paths) {
      await page.goto(`${base}/${file}?lang=zh`, { waitUntil:'load' });
      const result = await page.evaluate(() => {
        const visible = e => !!e.getClientRects().length;
        const grid = selector => {
          const e = [...document.querySelectorAll(selector)].find(visible);
          return e ? { columns:getComputedStyle(e).gridTemplateColumns.split(' ').length, width:e.clientWidth } : null;
        };
        const cards = [...document.querySelectorAll('section:not([hidden]) .product-card')].map(e => {
          const r=e.getBoundingClientRect(); return { x:r.x,y:r.y,w:r.width };
        });
        return {
          overflow:[...document.querySelectorAll('main *, header *')].filter(e => visible(e) && !e.closest('.skip') && e.getBoundingClientRect().width > 0 && (e.getBoundingClientRect().right > innerWidth + 1 || e.getBoundingClientRect().left < -1)).map(e=>e.tagName+'.'+e.className),
          featured:grid('.featured-products'), other:grid('.other-products'), hero:grid('.product-hero'), guide:grid('.guides-page main > section'), catalog:grid('.guides-page .catalog-list'),
          mainWidth:document.querySelector('main').clientWidth, reading:grid('.reading-body'), textHero:grid('.text-product-hero'), cards,
          broken:[...document.images].filter(e=>visible(e)&&e.complete&&!e.naturalWidth).map(e=>e.src),
          version:[...document.querySelectorAll('.site-version')].filter(visible).map(e=>e.textContent)
        };
      });
      const label = `${file} @ ${width}`;
      assert.deepEqual(result.overflow,[],label+' content clipping');
      assert.deepEqual(result.broken,[],label+' broken images');
      if (result.featured) {
        const columns = width<=600 ? 1 : width<=1000 ? 2 : 3;
        assert.equal(result.featured.columns,columns,label+' featured columns');
        assert.equal(result.other.columns,columns,label+' utility columns');
        assert.ok(result.cards[0].y<=result.cards[1].y && result.cards[1].y<=result.cards[2].y,label+' DOM/visual order');
        assert.ok(Math.max(...result.cards.map(c=>c.w))-Math.min(...result.cards.map(c=>c.w))<2,label+' equal cards');
      }
      if (width<=700 && result.hero) assert.equal(result.hero.columns,1,label+' mobile hero');
      if (width>700 && result.hero && !result.textHero) assert.equal(result.hero.columns,2,label+' desktop hero');
      if (result.guide) { assert.equal(result.guide.columns,width<=1000?1:2,label+' directory layout'); assert.equal(result.catalog.columns,width<=600?1:2,label+' directory columns'); }
      if (result.textHero) assert.equal(result.textHero.columns,1,label+' text template');
      if (result.reading && width<=700) assert.ok(result.reading.width>=result.mainWidth-2,label+' reading width');
      assert.equal(result.version.length,0,label+' no website version in footer');
      records.push({ file,width,...result });
    }
  }
  await fs.mkdir(new URL('../output/playwright/',import.meta.url),{recursive:true});
  await fs.writeFile(new URL('../output/playwright/layout-results.json',import.meta.url),JSON.stringify(records,null,2));
  console.log(`PASS: ${records.length} browser layout combinations; clipping, reading width, columns, order, images, version.`);
} finally { await close(); }
