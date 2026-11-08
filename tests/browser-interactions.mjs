import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createBrowserHarness } from './browser-harness.mjs';
const ui = JSON.parse(await fs.readFile(new URL('../content/ui.json',import.meta.url)));
const { browser,context,base,close } = await createBrowserHarness();
await context.addInitScript(() => {
  window.clipboardWrites=[];
  Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>{window.clipboardWrites.push(text);if(window.failCopy)throw new Error('test failure');}},configurable:true});
  document.execCommand=()=>false;
});
const page=await context.newPage();
let checks=0;
try {
  for (const [lang,copy] of Object.entries(ui)) {
    for (const width of [320,1440]) {
      await page.setViewportSize({width,height:900});
      await page.goto(`${base}/index.html?lang=${lang}`);
      assert.equal(await page.locator('h1:visible').count(),1);
      for (const target of await page.locator('#language, .site-nav, section:not([hidden]) .button, section:not([hidden]) .copy-email').all()) {
        assert.ok((await target.boundingBox()).height>=44,'primary touch target');
      }
      const overflow=await page.evaluate(()=>[...document.querySelectorAll('main *,header *')].filter(e=>e.getClientRects().length&&!e.closest('.skip')&&e.getBoundingClientRect().right>innerWidth+1).map(e=>e.tagName+'.'+e.className));
      assert.deepEqual(overflow,[],`${lang} @ ${width}`);
      if (['ko','pt'].includes(lang)) assert.equal(await page.locator('.link-language-note:visible').textContent(),copy.englishFallback);
      const email=page.locator(`section[data-lang="${lang}"] a[href^="mailto:"]`).first();
      const mailUrl=new URL(await email.getAttribute('href'));
      assert.ok(mailUrl.searchParams.get('body').includes(copy.prompt),lang+' mail template');
      assert.ok(mailUrl.searchParams.get('subject').includes(copy.feedback),lang+' subject');
      for (const host of ['nextmirror','barnest','smoothcast']) {
        const href=await page.locator(`section[data-lang="${lang}"] a[href*="${host}.kevinlabs.app"]`).first().getAttribute('href');
        assert.equal(new URL(href).searchParams.get('lang'),lang,host+' language mode');
      }
      await page.evaluate(()=>document.addEventListener('click',event=>{if(event.target.closest('a[href^="mailto:"]'))event.preventDefault();},{capture:true}));
      await email.click();
      assert.deepEqual(await page.evaluate(()=>window.clipboardWrites),[],'mail action must not write clipboard');
      const mailFeedback=page.locator('.site-toast');await mailFeedback.waitFor({state:'visible'});
      assert.ok((await mailFeedback.textContent()).includes(copy.mailFallback));
      const gmail=new URL(await mailFeedback.locator('a').getAttribute('href'));
      assert.equal(gmail.hostname,'mail.google.com');assert.equal(gmail.searchParams.get('to'),'support@kevinlabs.app');
      assert.ok(gmail.searchParams.get('body').includes(copy.prompt));
      assert.equal(await mailFeedback.locator('a').getAttribute('rel'),'noopener');
      await mailFeedback.getByRole('button',{name:copy.close,exact:true}).click();
      const copyButton=page.getByRole('button',{name:copy.copy,exact:true});
      await copyButton.click();
      const toast=page.locator('.site-toast'); await toast.waitFor({state:'visible'});
      assert.ok((await toast.textContent()).includes(copy.copied));
      assert.equal(await toast.getAttribute('role'),'status');
      assert.equal(await page.evaluate(()=>document.activeElement.classList.contains('copy-email')),true,'copy retains focus');
      await toast.getByRole('button',{name:copy.close,exact:true}).click();
      assert.equal(await toast.isVisible(),false);
      assert.equal(await page.evaluate(()=>document.activeElement.classList.contains('copy-email')),true,'dismiss restores focus');
      assert.equal(await page.locator('.site-toast button:visible').count(),0);
      await page.evaluate(()=>{window.failCopy=true;});
      await copyButton.click();await toast.waitFor({state:'visible'});
      assert.ok((await toast.textContent()).includes(copy.copyFailed));
      // A locale change clears stale feedback without leaving a hidden focus target.
      await page.selectOption('#language',lang==='en'?'fr':'en');
      assert.equal(await toast.isVisible(),false);
      checks++;
    }
  }
  await page.goto(`${base}/index.html?lang=de`);
  await page.locator('section[data-lang="de"] a[data-product="volmix"]').click();
  await page.waitForFunction(()=>document.documentElement.lang==='de');
  assert.equal(await page.locator('html').getAttribute('lang'),'de','URL language survives same-origin navigation');
  await page.selectOption('#language','fr');
  await page.goto(`${base}/guides.html`);
  assert.equal(await page.locator('html').getAttribute('lang'),'fr','manual language persists');
  await page.goto(`${base}/netdoctor/index.html?lang=de`);
  assert.equal(await page.locator('html').getAttribute('lang'),'en');
  assert.equal(await page.locator('.language-fallback').getAttribute('lang'),'de');
  assert.equal(await page.locator('#language').inputValue(),'de','fallback preserves requested mode');
  await page.goto(`${base}/index.html?lang=system`);
  assert.equal(new URL(await page.locator('section[data-lang="zh"] a[data-product="nextmirror"]').getAttribute('href')).searchParams.get('lang'),'system');
  await page.selectOption('#language','system');
  assert.equal(await page.evaluate(()=>localStorage.getItem('ksicSupportLanguage')),'system');
  await page.evaluate(()=>{Object.defineProperty(navigator,'languages',{get:()=>['fr-FR'],configurable:true});window.dispatchEvent(new Event('languagechange'));});
  assert.equal(await page.locator('html').getAttribute('lang'),'fr','system changes apply immediately');
  assert.equal(await page.locator('#language').inputValue(),'system');
  await page.goto(`${base}/index.html?lang=zh`);
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(()=>document.activeElement.className),'skip');
  const summary=page.locator('section[data-lang="zh"] details summary').first();
  await summary.focus();await page.keyboard.press('Enter');
  assert.equal(await summary.evaluate(e=>e.parentElement.open),true);
  await page.keyboard.press('Space');assert.equal(await summary.evaluate(e=>e.parentElement.open),false);
  const noJS=await browser.newContext({javaScriptEnabled:false});
  const plain=await noJS.newPage();await plain.goto(`${base}/index.html`);
  assert.equal(await plain.locator('h1:visible').textContent(),'Mac apps');
  assert.equal(await plain.locator('section[data-lang="en"] .product-card:visible').count(),3);
  assert.equal(await plain.locator('.language').isVisible(),false);
  await noJS.close();
  console.log(`PASS: ${checks} localized layout/contact scenarios; clipboard success/failure, mail separation, live/system/persisted language, fallback, keyboard FAQ, no-JS.`);
} finally { await close(); }
