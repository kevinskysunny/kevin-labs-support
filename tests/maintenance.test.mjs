import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const root=new URL('../',import.meta.url);
const read=p=>fs.readFileSync(new URL(p,root),'utf8');
test('website version remains internal and all configurations agree',()=>{
 const version=JSON.parse(read('site.json')).version;
 for(const p of ['package.json','package-lock.json'])assert.equal(JSON.parse(read(p)).version,version);
 assert.equal(JSON.parse(read('index.json')).siteVersion,version);
 for(const p of ['index.html','guides.html','volmix/index.html','support.html','privacy.html','website-privacy.html']){
  const footer=read(p).match(/<footer[\s\S]*?<\/footer>/)[0];
  assert.doesNotMatch(footer,/site-version|网站版本|Website version|v\d+\.\d+/);
  assert.doesNotMatch(footer,/·\s*<\/p>/);
 }
});
test('all feedback languages compile and compatibility versions have one source',()=>{
 execFileSync(process.execPath,['scripts/build-ui.mjs','--check'],{cwd:root});
 execFileSync(process.execPath,['scripts/sync-products.mjs','--check'],{cwd:root});
 const copy=JSON.parse(read('content/ui.json'));
 assert.deepEqual(Object.keys(copy),JSON.parse(read('site.json')).languages);
 const catalog=JSON.parse(read('index.json')).apps;
 for(const item of JSON.parse(read('assets/products.json')))assert.equal(item.version,catalog.find(a=>a.id===item.id).version);
 assert.doesNotMatch(read('assets/products.json'),/no per-app output routing|不支持超过 100% 放大或按应用/);
});
test('light theme metadata and analytics privacy behavior are retained',()=>{
 assert.doesNotMatch(read('assets/site.css'),/prefers-color-scheme:dark/);
 assert.match(read('assets/site.js'),/navigator.doNotTrack==='1'\|\|navigator.globalPrivacyControl/);
 assert.match(read('assets/site.js'),/send\('store_click'\)/);
 assert.match(read('assets/site.js'),/credentials:'omit'/);
});
test('brand origin is canonical while GitHub Pages retains its legacy content host',()=>{
 const config=JSON.parse(read('site.json'));
 assert.equal(config.canonicalOrigin,'https://kevinlabs.app');
 assert.equal(config.contentOrigin,'https://support.kevinlabs.app');
 assert.equal(read('CNAME').trim(),'support.kevinlabs.app');
 for(const path of ['index.html','guides.html','volmix/index.html','website-privacy.html']){
  assert.ok(read(path).includes('href="https://kevinlabs.app/'));
  assert.doesNotMatch(read(path).match(/<link[^>]*rel="canonical"[^>]*>/)[0],/support.kevinlabs.app/);
 }
 assert.doesNotMatch(read('sitemap.xml'),/support.kevinlabs.app/);
 assert.match(read('robots.txt'),/Sitemap: https:\/\/kevinlabs.app\/sitemap.xml/);
});
