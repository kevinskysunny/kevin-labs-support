import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('redesign retains all eight homepage languages and live product destinations',()=>{
 const html=read('index.html');
 for(const lang of ['en','zh','ja','ko','de','fr','es','pt']){
  assert.ok(html.includes(`id="apps-${lang}"`));
  assert.ok(read('guides.html').includes(`data-lang="${lang}"`));
 }
 assert.match(html,/barnest\.kevinlabs\.app/);assert.match(html,/smoothcast\.kevinlabs\.app/);
 for(const path of ['index.html','guides.html','volmix/index.html','barnest/support.html','barnest/privacy.html']){
  const content=read(path);assert.match(content,/monochrome\.css\?v=2\.1\.0/);assert.match(content,/id="language"/);assert.match(content,/v2\.1\.0/);
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
test('homepage presents three featured peers and three unique utility entries per language',()=>{
 const html=read('index.html');
 const sections=[...html.matchAll(/<section data-lang="([a-z]{2})"[^>]*>([\s\S]*?)(?=<section class="faq-section">)/g)];
 assert.equal(sections.length,8);
 for(const [,lang,section] of sections){
  const featured=[...section.matchAll(/class="product-card" data-product="([^"]+)"/g)].map(x=>x[1]);
  const others=[...section.matchAll(/class="tool-card" data-product="([^"]+)"/g)].map(x=>x[1]);
  assert.deepEqual(featured,['volmix','barnest-pro','smoothcast'],lang);
  assert.deepEqual(others,['presenter-deck','netdoctor','ksic-studio'],lang);
  assert.equal(new Set([...featured,...others]).size,6);
  assert.match(section,/href="barnest\/support.html"/);assert.match(section,/href="barnest\/privacy.html"/);
 }
});
