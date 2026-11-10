import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createBrowserHarness} from './browser-harness.mjs';
const {browser,context,base,close}=await createBrowserHarness();
const ui=JSON.parse(await fs.readFile(new URL('../content/ui.json',import.meta.url),'utf8'));
try {
 const page=await context.newPage();
 for(const width of [390,1440]) {
  await page.setViewportSize({width,height:1000});await page.goto(base+'/');
  for(const lang of ['en','zh','ja','ko','de','fr','es','pt','system']) {
   await page.selectOption('#language',lang);
   const metadata=await page.evaluate(()=>({lang:document.documentElement.lang,title:document.title,fields:Object.fromEntries(['description','og:title','og:description','twitter:title','twitter:description'].map(field=>[field,document.querySelector(`meta[name="${field}"],meta[property="${field}"]`)?.content]))}));
   const locale=metadata.lang.startsWith('zh')?'zh':metadata.lang.split('-')[0];
   assert.equal(metadata.title,ui[locale].homeMetaTitle);
   for(const field of ['og:title','twitter:title'])assert.equal(metadata.fields[field],ui[locale].homeMetaTitle);
   for(const field of ['description','og:description','twitter:description'])assert.equal(metadata.fields[field],ui[locale].homeMetaDescription);

   assert.equal(await page.locator('section:not([hidden]) .other-products .tool-card').count(),6);
   const urls=await page.locator('main a').evaluateAll(nodes=>nodes.filter(n=>n.getClientRects().length).map(n=>n.href));
   assert.ok(urls.every(url=>!new URL(url).searchParams.has('lang')));
   const order=await page.locator('section:not([hidden]) .product-card').evaluateAll(nodes=>nodes.map(n=>n.dataset.product));
   assert.deepEqual(order,['volmix','macpulse','barnest-pro']);
   assert.deepEqual(await page.locator('section:not([hidden]) .other-products .tool-card').evaluateAll(nodes=>nodes.map(n=>n.dataset.product)),['nextmirror','smoothcast','presenter-deck','mindcharge','netdoctor','ksic-studio']);
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
 console.log('PASS: three featured/six secondary products, order and clean URLs in eight languages plus system mode, at mobile/desktop widths.');
} finally {await close();}
