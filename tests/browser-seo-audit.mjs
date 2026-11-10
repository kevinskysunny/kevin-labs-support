import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createBrowserHarness} from './browser-harness.mjs';
const {browser,context,base,close}=await createBrowserHarness();
try {
 const page=await context.newPage();
 for(const width of [390,1440]) {
  await page.setViewportSize({width,height:1000});await page.goto(base+'/');
  for(const lang of ['en','zh','ja','ko','de','fr','es','pt','system']) {
   await page.selectOption('#language',lang);
   assert.equal(await page.locator('section:not([hidden]) .product-ctas a').count(),10);
   const urls=await page.locator('main a').evaluateAll(nodes=>nodes.filter(n=>n.getClientRects().length).map(n=>n.href));
   assert.ok(urls.every(url=>!new URL(url).searchParams.has('lang')));
   const order=await page.locator('section:not([hidden]) .product-card').evaluateAll(nodes=>nodes.map(n=>n.dataset.product));
   assert.deepEqual(order,['nextmirror','smoothcast','barnest-pro','mindcharge','macpulse']);
  }
  await fs.mkdir('output/playwright',{recursive:true});await page.screenshot({path:`output/playwright/seo-home-${width}.png`,fullPage:true});
 }
 if(process.env.AUDIT_LIVE==='1') {
  const live=await browser.newContext();await live.route('**/*',r=>r.request().method()==='GET' && new URL(r.request().url()).hostname==='mindcharge.kevinlabs.app'?r.continue():r.abort());
  const p=await live.newPage();await p.goto('https://mindcharge.kevinlabs.app/');
  await p.waitForFunction(()=>document.querySelector('.download')?.getAttribute('aria-disabled')==='false',{},{timeout:20000});
  console.log('LIVE MindCharge loaded button:',await p.locator('.download').evaluate(n=>({text:n.textContent,href:n.href,disabled:n.getAttribute('aria-disabled')})));
  await live.close();
 }
 console.log('PASS: product CTA, order and clean URLs in eight languages plus system mode, at mobile/desktop widths.');
} finally {await close();}
