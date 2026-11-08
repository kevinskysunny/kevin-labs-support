// Read-only public-route audit: repository boundaries must not hide product-site footers.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium } from 'playwright-core';
const common=['en','zh','ja','ko','de','fr','es','pt'];
const sites=[
 {host:'support.kevinlabs.app',langs:common,paths:['/','/guides.html','/volmix/index.html','/volmix/support.html','/barnest/support.html','/presenter-deck/index.html','/netdoctor/index.html','/ksic-studio/index.html','/support.html','/privacy.html','/website-privacy.html']},
 {host:'nextmirror.kevinlabs.app',langs:[...common,'zh-Hant'],paths:['/','/index.html','/legal.html','/buy']},
 {host:'mindcharge.kevinlabs.app',langs:['en','zh-Hans','zh-Hant','ja','de','fr','es'],paths:['/','/legal.html','/restore.html','/buy','/buy.html','/i18n/ja/legal.html']},
 {host:'barnest.kevinlabs.app',langs:[...common,'zh-Hant'],paths:['/','/support','/privacy','/releases','/buy']},
 {host:'smoothcast.kevinlabs.app',langs:common,paths:['/','/support','/releases','/privacy','/terms','/refund']}
];
const allowed=new Set(sites.map(s=>s.host));
const browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const context=await browser.newContext({locale:'zh-CN'});
// No checkout POST, email, downloads, analytics or third-party payment calls.
await context.route('**/*',route=>{
 const request=route.request(),url=new URL(request.url());
 if(!['GET','HEAD'].includes(request.method())||!allowed.has(url.hostname)||/\.(dmg|zip|mp4)$/.test(url.pathname))return route.abort();
 return route.continue();
});
const results=[];
try {
 const settled=await Promise.allSettled(sites.map(async site=>{
  const page=await context.newPage();await page.setViewportSize({width:1440,height:900});
  try {
   for(const path of site.paths)for(const lang of site.langs){
    const url=`https://${site.host}${path}?lang=${lang}`;
    const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
    assert.ok(response.ok(),`${url}: HTTP ${response.status()}`);
    await page.waitForLoadState('load');
    const footer=page.locator('footer');await footer.waitFor({state:'visible'});
    const raw=await footer.textContent();
    assert.ok(raw.includes('© 2026 Kevin Labs'),url+' copyright');
    assert.doesNotMatch(raw,/网站版本|網站版本|(?:Website|Site|Sitio(?: web)?|サイト|웹사이트)\s+\d+\.\d+/i,url);
    assert.equal(await footer.locator('[data-copy="site_version"],[data-copy="version"],[data-i18n="site_version"],#i18n-site-version,.site-version').count(),0,url+' version marker');
    const links=await footer.locator('a[href]').count();assert.ok(links>=1,url+' policy exit');
    results.push({url,lang,status:response.status(),copyright:'© 2026 Kevin Labs',versionMarkers:0,policyLinks:links});
   }
   await page.setViewportSize({width:390,height:844});await page.goto(`https://${site.host}/?lang=zh`,{waitUntil:'load'});
   await page.locator('footer').scrollIntoViewIfNeeded();
   await fs.mkdir(new URL('../output/playwright/footers/',import.meta.url),{recursive:true});
   await page.screenshot({path:new URL(`../output/playwright/footers/${site.host}.png`,import.meta.url).pathname});
   console.log(`${site.host}: ${site.paths.length} routes × ${site.langs.length} languages passed`);
  } finally {await page.close();}
 }));
 for(const item of settled)if(item.status==='rejected')throw item.reason;
 await fs.writeFile(new URL('../output/playwright/footers/results.json',import.meta.url),JSON.stringify(results,null,2));
 console.log(`PASS: all ${sites.length} named domains / ${results.length} route-language combinations have no footer website version.`);
} finally {await browser.close();}
