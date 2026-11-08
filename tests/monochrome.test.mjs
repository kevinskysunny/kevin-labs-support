import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('redesign retains all eight homepage languages and live product destinations',()=>{
 const html=read('index.html');
 for(const lang of ['en','zh','ja','ko','de','fr','es','pt']){
  assert.ok(html.includes(`id="apps-${lang}"`));
  assert.ok(read('guides.html').includes(`data-lang="${lang}"`));
 }
 assert.match(html,/barnest\.kevinlabs\.app/);assert.match(html,/smoothcast\.kevinlabs\.app/);
 for(const path of ['index.html','guides.html','volmix/index.html','barnest/support.html','barnest/privacy.html']){
  const content=read(path);for(const asset of ['site.css','monochrome.css']){
   const revision=createHash('sha256').update(read('assets/'+asset)).digest('hex').slice(0,12);
   assert.ok(content.includes('assets/'+asset+'?v='+revision),path+' loads the current '+asset);
  }
  assert.match(content,/id="language"/);assert.doesNotMatch(content, /class="site-version"/);
 }
});
test('documentation contents point at actual translated headings',()=>{
 for(const path of ['barnest/support.html','volmix/support.html','barnest/privacy.html','website-privacy.html']){
  const html=read(path);
  for(const [,id] of html.matchAll(/href="#([a-z]{2}-topic-\d+)"/g))assert.ok(html.includes(`id="${id}"`),path+' '+id);
 }
});
test('product artwork uses current approved assets with language-aware VolMix variants',()=>{
 const home=read('index.html'),product=read('volmix/index.html');
 assert.equal((home.match(/src="assets\/barnest-pro-icon.png"/g)||[]).length,8);
 assert.doesNotMatch(home,/class="(?:home-feature|catalog-picture)"/);
 assert.doesNotMatch(product,/src="(?:\.\.\/)?assets\/volmix-panel.png"/);
 assert.equal((product.match(/src="\.\.\/assets\/volmix-comparison-zh.png"/g)||[]).length,1);
 assert.equal((product.match(/src="\.\.\/assets\/volmix-comparison-en.png"/g)||[]).length,7);
});
test('language fallback and header DOM stay usable before scripts run',()=>{
 for(const path of ['index.html','guides.html','barnest/support.html','volmix/index.html','website-privacy.html']){
  const html=read(path),header=html.slice(html.indexOf('<header'),html.indexOf('</header>'));
  assert.ok(header.indexOf('class="brand"')<header.indexOf('class="site-nav"'),path);
  for(const tag of html.matchAll(/<[^>]+data-lang="([a-z]{2})"[^>]*>/g)){
   assert.equal(/\shidden(?:=|\s|>)/.test(tag[0]),tag[1]!=='en',path+' '+tag[1]);
  }
  assert.match(html,/noscript data-language-fallback/);
 }
});
test('homepage preserves the confirmed flagship order and five utility products plus store support',()=>{
 const html=read('index.html');
 const sections=[...html.matchAll(/<section data-lang="([a-z]{2})"[^>]*>([\s\S]*?)(?=<section class="faq-section">)/g)];
 assert.equal(sections.length,8);
 for(const [,lang,section] of sections){
  const featured=[...section.matchAll(/class="product-card" data-product="([^"]+)"/g)].map(x=>x[1]);
  const others=[...section.matchAll(/class="tool-card" data-product="([^"]+)"/g)].map(x=>x[1]);
  assert.deepEqual(featured,['nextmirror','volmix','barnest-pro'],lang);
  assert.deepEqual(others,['mindcharge','smoothcast','presenter-deck','netdoctor','ksic-studio'],lang);
  assert.equal(new Set([...featured,...others]).size,8);
  assert.match(section,/href="barnest\/support.html"/);assert.match(section,/href="barnest\/privacy.html"/);
 }
});
test('NextMirror catalog points to its licensed product domain and manual launch offer',()=>{
 const catalog=JSON.parse(read('index.json')).apps.find(app=>app.id==='nextmirror');
 assert.equal(catalog.availability,'available');assert.equal(catalog.architecture,'arm64');
 assert.equal(catalog.downloadUrl,'https://nextmirror.kevinlabs.app/download');assert.equal(catalog.appStoreUrl,undefined);
 const pricing=JSON.parse(read('nextmirror/pricing.json'));
 assert.equal(pricing.saleEnabled,true);assert.equal(pricing.promotionEndMode,'manual');
 assert.equal(pricing.currencyPrices.CN.regularMinor-pricing.currencyPrices.CN.discountMinor,2500);
 assert.equal(pricing.currencyPrices.international.regularMinor-pricing.currencyPrices.international.discountMinor,499);
 const page=read('nextmirror/index.html');
 assert.doesNotMatch(page,/href="[^"]*(?:\.dmg|\/buy|checkout)[^"]*"/);
 assert.match(page,/nextmirror\.kevinlabs\.app/);
});

test('support directory offers all eight apps with real icons in every language',()=>{
 const html=read('guides.html').replace(/<!--[\s\S]*?-->/g,'');
 const sections=[...html.matchAll(/<section data-lang="([a-z]{2})"[^>]*>([\s\S]*?)<\/section>/g)];
 assert.equal(sections.length,8);
 for(const [,lang,section] of sections){
  const rows=[...section.matchAll(/<a class="app-row"[^>]*>([\s\S]*?)<\/a>/g)].map(x=>x[1]);
  assert.equal(rows.length,8,lang);
  assert.deepEqual(rows.map(row=>row.match(/<strong>([^<]+)<\/strong>/)[1]),['VolMix','BarNest Pro','NextMirror','MindCharge','SmoothCast','PresenterDeck','NetDoctor','KSIC Studio'],lang);
  for(const app of ['BarNest Pro','VolMix','NextMirror','MindCharge','SmoothCast','KSIC Studio','NetDoctor','PresenterDeck']) {
   assert.equal(rows.filter(row=>row.includes('<strong>'+app+'</strong>')).length,1,lang+' '+app);
  }
  for(const row of rows) assert.match(row,/<img[^>]*src="assets\/[^" ]+-icon\.png"/,lang);
  assert.match(section,new RegExp('nextmirror\\.kevinlabs\\.app/\\?lang='+lang+'#support-'+lang));
 }
});

test('every product identity has an explicit catalog return above it',()=>{
 const paths=['support.html','privacy.html'];
 for(const directory of ['volmix','barnest','ksic-studio','netdoctor','presenter-deck','mindcharge']){
  for(const filename of ['index.html','support.html','privacy.html']){
   const path=directory+'/'+filename;
   if(fs.existsSync(new URL('../'+path,import.meta.url)))paths.push(path);
  }
 }
 for(const path of paths){
  const html=read(path);let previous=-1;
  for(const match of html.matchAll(/class="product-identity"/g)){
   const back=html.lastIndexOf('class="back"',match.index);
   assert.ok(back>previous,path+' is missing an explicit catalog return');
   assert.match(html.slice(back,html.indexOf('</a>',back)),/href="(?:\.\.\/)?index\.html"/);
   previous=match.index;
  }
 }
});

test('shared footers contain policy links without repeated task navigation',()=>{
 for(const path of ['index.html','guides.html','volmix/index.html','barnest/support.html','netdoctor/index.html','presenter-deck/privacy.html','ksic-studio/index.html']){
  const footer=read(path).match(/<footer[\s\S]*?<\/footer>/)?.[0];
  assert.ok(footer,path);
  const hrefs=[...footer.matchAll(/href="([^"]+)"/g)].map(x=>x[1]);
  assert.equal(new Set(hrefs).size,hrefs.length,path);
  for(const href of hrefs)assert.match(href,/privacy\.html/,path+' policy-only footer');
  assert.doesNotMatch(footer,/mailto:|Contact support|All apps|全部应用|联系支持/);
 }
});
test('MindCharge support resolves directly to its product support section',()=>{
 const app=JSON.parse(read('index.json')).apps.find(app=>app.id==='mindcharge');
 assert.equal(app.supportUrl,'https://mindcharge.kevinlabs.app/#support');
 const guide=read('guides.html');
 assert.doesNotMatch(guide,/href="mindcharge\/support\.html/);
 assert.match(guide,/href="https:\/\/mindcharge\.kevinlabs\.app\/#support"/);
 const legacy=read('mindcharge/support.html');
 assert.match(legacy,/http-equiv="refresh"/);assert.match(legacy,/location\.replace\(target\.href\)/);
 assert.doesNotMatch(legacy,/contact-card/);
});
