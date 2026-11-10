import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const root = new URL('../',import.meta.url);
const read = p=>fs.readFileSync(new URL(p,root),'utf8');
test('catalog generation is reproducible and preserves all nine products without promoting the store edition',()=>{
 const before=read('index.html');
 execFileSync(process.execPath,['scripts/render-catalog.mjs','--check'],{cwd:root});
 assert.equal(read('index.html'),before);
 const data=JSON.parse(read('content/home.json'));
 assert.equal(Object.keys(data).length,8);
 for(const [lang,item] of Object.entries(data)){
  assert.equal(item.apps.length,9);assert.equal(new Set(item.apps.map(a=>a.id)).size,9);
  assert.equal(item.apps.filter(a=>a.featured).length,3);
  assert.equal(item.legacy,undefined);
  const section=before.match(new RegExp('<section data-lang="'+lang+'"[^>]*>([\\s\\S]*?)(?=<section class="faq-section">)'))[1];
  assert.equal((section.match(/<h1>/g)||[]).length,1);
  assert.doesNotMatch(section,/legacy-support|assets\/barnest-icon|href="barnest\//);
  assert.equal(item.apps.find(a=>a.id==='presenter-deck').action,item.apps.find(a=>a.id==='volmix').action);
 }
});
test('native store destinations retain IDs and explicit HTTPS fallbacks preserve attribution',()=>{
 for(const p of ['volmix/index.html','netdoctor/index.html','ksic-studio/index.html','barnest/index.html','presenter-deck/index.html','presenter-deck/support.html']){
  const html=read(p);assert.match(html,/href="macappstores:\/\/apps.apple.com\/app\/id[0-9]+\?mt=12&amp;ct=ksic_website/);
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

test('store links and all storefronts are generated from their single sources',()=>{
 execFileSync(process.execPath,['scripts/sync-store-links.mjs','--check'],{cwd:root});
 const regions=JSON.parse(read('content/store-regions.json')).regions;
 assert.equal(regions.length,175);assert.equal(new Set(regions).size,175);
 for(const r of ['cn','us','gb','jp','de','hk','tw','kr','br','za','xk'])assert.ok(regions.includes(r));
 for(const app of JSON.parse(read('index.json')).apps.filter(a=>a.appStoreUrl?.startsWith('https://apps.apple.com/'))){
  const id=app.appStoreUrl.match(/id([0-9]+)/)[1];
  assert.ok(read(app.id+'/index.html').includes('data-store-id="'+id+'"'));
 }
});
