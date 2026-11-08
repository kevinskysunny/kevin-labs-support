import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const root = new URL('../',import.meta.url);
const read = p=>fs.readFileSync(new URL(p,root),'utf8');
test('catalog generation is reproducible and preserves all eight products and the historical support exit',()=>{
 const before=read('index.html');
 execFileSync(process.execPath,['scripts/render-catalog.mjs','--check'],{cwd:root});
 assert.equal(read('index.html'),before);
 const data=JSON.parse(read('content/home.json'));
 assert.equal(Object.keys(data).length,8);
 for(const [lang,item] of Object.entries(data)){
  assert.equal(item.apps.length,8);assert.equal(new Set(item.apps.map(a=>a.id)).size,8);
  assert.equal(item.apps.filter(a=>a.featured).length,3);
  assert.equal(item.legacy.links.length,2);
  const section=before.match(new RegExp('<section data-lang="'+lang+'"[^>]*>([\\s\\S]*?)(?=<section class="faq-section">)'))[1];
  assert.equal((section.match(/<h1>/g)||[]).length,1);
  assert.ok(section.indexOf('class="legacy-support"')>section.indexOf('class="other-products"'));
  assert.ok(item.apps.find(a=>a.id==='presenter-deck').action!==item.apps.find(a=>a.id==='volmix').action);
 }
});
test('store destinations remain accessible over HTTPS and preserve attribution',()=>{
 for(const p of ['volmix/index.html','netdoctor/index.html','ksic-studio/index.html','barnest/index.html']){
  const html=read(p);assert.doesNotMatch(html,/href="macappstores:/);
  assert.match(html,/href="https:\/\/apps.apple.com\/[^\"]+ct=ksic_website/);
 }
});
test('VolMix keeps all seven capabilities, limits and a keyboard reachable full-size image',()=>{
 const html=read('volmix/index.html');
 assert.equal((html.match(/class="feature-groups"/g)||[]).length,8);
 assert.equal((html.match(/class="feature-options"/g)||[]).length,8);
 assert.equal((html.match(/class="image-preview"/g)||[]).length,8);
 assert.match(html,/不支持超过 100% 放大/);
 assert.match(html,/Safari 及内嵌网页音频/);
});
