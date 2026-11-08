import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createBrowserHarness} from './browser-harness.mjs';
const ui=JSON.parse(await fs.readFile(new URL('../content/ui.json',import.meta.url)));
const h=await createBrowserHarness();const page=await h.context.newPage();let checks=0;
await h.context.addInitScript(()=>{
 window.mailRequests=[];window.copyRequests=[];
 Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>{window.copyRequests.push(text);if(window.failCopy)throw new Error('denied');}},configurable:true});
 document.execCommand=()=>false;
 // Runs after the site's document handlers: prove mail navigation was not cancelled, then emulate no external handler.
 window.addEventListener('click',e=>{const a=e.target.closest('a[href^="mailto:"]');if(a){window.mailRequests.push({href:a.href,prevented:e.defaultPrevented});e.preventDefault();}});
});
try{
 for(const [lang,copy] of Object.entries(ui))for(const width of [320,1440]){
  await page.setViewportSize({width,height:900});await page.goto(`${h.base}/index.html?lang=${lang}`);
  const a=page.locator(`section[data-lang="${lang}"] .callout-actions a[href^="mailto:"]`);
  assert.equal(await a.textContent(),copy.mailApp);await a.scrollIntoViewIfNeeded();await a.focus();await page.keyboard.press('Enter');
  const status=page.locator('.site-toast');await status.waitFor({state:'visible'});
  const native=await page.evaluate(()=>window.mailRequests);assert.equal(native.length,1);assert.equal(native[0].prevented,false);
  assert.deepEqual(await page.evaluate(()=>window.copyRequests),[]);
  assert.equal(new URL(native[0].href).pathname,'support@kevinlabs.app');
  assert.ok((await status.textContent()).includes(copy.mailFallback));
  const web=new URL(await status.locator('a').getAttribute('href'));
  assert.equal(web.searchParams.get('su'),new URL(native[0].href).searchParams.get('subject'));
  assert.equal(web.searchParams.get('body'),new URL(native[0].href).searchParams.get('body'));
  assert.equal(await status.getAttribute('lang'),await page.locator('html').getAttribute('lang'));
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const box=await status.boundingBox();assert.ok(box.x>=0&&box.x+box.width<=width+1);
  await status.getByRole('button',{name:copy.copy,exact:true}).click();
  await page.waitForFunction(()=>window.copyRequests.length===1);
  assert.deepEqual(await page.evaluate(()=>window.copyRequests),['support@kevinlabs.app']);
  await status.getByRole('button',{name:copy.close,exact:true}).click();
  await a.click();await page.selectOption('#language',lang==='en'?'zh':'en');assert.equal(await status.isVisible(),false);
  checks++;
 }
 await page.goto(`${h.base}/presenter-deck/index.html?lang=zh`);
 await page.locator('section[data-lang="zh"] a[href^="mailto:"]').click();
 await page.evaluate(()=>{window.failCopy=true});
 await page.locator('.site-toast button.copy-email').click();
 await page.waitForFunction(()=>document.querySelector('.site-toast').textContent.includes('复制失败'));
 await page.screenshot({path:'/tmp/kevinlabs-store-check/mail-copy-failure.png'});
 await page.goto(`${h.base}/index.html?lang=zh`);
 await page.locator('section[data-lang="zh"] .callout-actions a[href^="mailto:"]').click();
 await page.screenshot({path:'/tmp/kevinlabs-store-check/mail-fallback.png'});
 console.log(`PASS ${checks} eight-language desktop/mobile mail fallback scenarios; keyboard, uncancelled mailto, explicit-only copy, Gmail template, locale cleanup and denied clipboard. No email sent.`);
}finally{await h.close();}
