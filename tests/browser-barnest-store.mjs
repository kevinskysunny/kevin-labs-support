import assert from 'node:assert/strict';import fs from 'node:fs/promises';import {createBrowserHarness} from './browser-harness.mjs';
const {context,base,close}=await createBrowserHarness();let checks=0;
try{
 const page=await context.newPage();
 for(const width of [390,1440])for(const name of ['index','support','privacy']){
  await page.setViewportSize({width,height:1000});const r=await page.goto(`${base}/barnest/${name}.html`);assert.equal(r.status(),200);
  for(const lang of ['en','zh','ja','ko','de','fr','es','pt']){
   await page.selectOption('#language',lang);const visible=page.locator(`main section[data-lang="${lang}"]`);
   assert.equal(await visible.locator('.app-edition-note').count(),1);
   assert.equal(await visible.locator('.app-edition-note a[href="https://barnest.kevinlabs.app/support"]').count(),1);
   assert.equal(await visible.locator('.app-edition-note a[href="https://barnest.kevinlabs.app/privacy"]').count(),1);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
   if(name!=='privacy'){
    const text=await visible.textContent();assert.ok(text.includes('14'));assert.ok(text.includes('$0'));assert.ok(text.includes('$2.99'));assert.ok(text.includes('$5.99'));assert.ok(text.includes('2026-12-01'));
   }
   if(lang==='zh'){await fs.mkdir('output/playwright',{recursive:true});await page.screenshot({path:`output/playwright/barnest-store-${name}-${width}.png`,fullPage:true});}
   checks++;
  }
 }
 console.log('PASS:',checks,'App Store page/locale/viewport combinations; edition identity, Pro links, trial and price copy.');
}finally{await close();}
