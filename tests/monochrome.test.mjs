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
  const content=read(path);assert.match(content,/monochrome\.css\?v=2\.0\.1/);assert.match(content,/id="language"/);assert.match(content,/v2\.0\.1/);
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
 assert.equal((home.match(/src="assets\/barnest-pro-overview.png"/g)||[]).length,8);
 for(const html of [home,product]){
  assert.doesNotMatch(html,/src="(?:\.\.\/)?assets\/volmix-panel.png"/);
  assert.equal((html.match(/src="(?:\.\.\/)?assets\/volmix-comparison-zh.png"/g)||[]).length,1);
  assert.equal((html.match(/src="(?:\.\.\/)?assets\/volmix-comparison-en.png"/g)||[]).length,7);
 }
});
