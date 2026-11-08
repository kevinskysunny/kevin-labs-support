import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createBrowserHarness } from './browser-harness.mjs';
const {context,base,close}=await createBrowserHarness();
const catalog=JSON.parse(await fs.readFile(new URL('../index.json',import.meta.url)));
const ui=JSON.parse(await fs.readFile(new URL('../content/ui.json',import.meta.url)));
const regions=JSON.parse(await fs.readFile(new URL('../content/store-regions.json',import.meta.url))).regions;
const page=await context.newPage();let checks=0;
try{
 for(const app of catalog.apps.filter(a=>a.appStoreUrl?.startsWith('https://apps.apple.com/'))){
  const id=app.appStoreUrl.match(/id([0-9]+)/)[1];
  for(const lang of Object.keys(ui))for(const width of [320,1440]){
   await page.setViewportSize({width,height:900});await page.goto(`${base}/${app.id}/index.html?lang=${lang}`);
   const native=page.locator('.store-native:visible');assert.equal(await native.count(),1);
   assert.equal(await native.getAttribute('href'),app.appStoreUrl.replace('https:','macappstores:'));
   assert.equal(await native.textContent(),ui[lang].storeOpen);
   const details=page.locator('.store-web:visible');await details.locator('summary').click();
   const picker=details.locator('select');assert.equal(await picker.locator('option').count(),176);
   for(const region of (lang==='en' && width===320 ? regions : ['cn','us','gb','jp','de','hk','tw','za'])){
    await picker.selectOption(region);
    const destination=new URL(await details.locator('.store-web-link').getAttribute('href'));
    assert.equal(destination.pathname,`/${region}/app/id${id}`);assert.equal(destination.searchParams.get('ct'),'ksic_website');
   }
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
   assert.equal(overflow,false,`${app.id}/${lang}/${width}`);
   checks++;
  }
 }
 // UI language must not choose the store region; only a user's store selection persists.
 await page.goto(`${base}/presenter-deck/index.html?lang=zh`);
 await page.evaluate(()=>localStorage.removeItem('kevinLabsStoreRegion'));await page.reload();
 const details=page.locator('.store-web:visible');await details.locator('summary').click();
 assert.equal(await details.locator('select').inputValue(),'');assert.equal(await details.locator('.store-web-link').isVisible(),false);
 await details.locator('select').selectOption('de');await page.selectOption('#language','ja');
 assert.equal(await page.locator('.store-web:visible select').inputValue(),'de');
 await page.goto(`${base}/volmix/index.html?lang=fr`);assert.equal(await page.locator('.store-web:visible select').inputValue(),'de');
 await context.addInitScript(()=>{Storage.prototype.getItem=()=>{throw new Error('disabled')};Storage.prototype.setItem=()=>{throw new Error('disabled')};});
 await page.goto(`${base}/presenter-deck/support.html?lang=ko`);
 await page.locator('.store-web:visible summary').click();await page.locator('.store-web:visible select').selectOption('cn');
 assert.ok((await page.locator('.store-web:visible .store-web-link').getAttribute('href')).includes('/cn/app/id6805086319'));
 console.log(`${checks} product/language/viewport scenarios; all 175 regional URLs per app plus eight representative regions per scenario, persistence, language independence and disabled storage passed. External Apple traffic is not mocked as evidence of real landing.`);
}finally{await close();}
