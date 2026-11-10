import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {createHash} from 'node:crypto';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('App Store privacy policy body remains unchanged except for edition notices',()=>{
 const html=read('barnest/privacy.html');const body=html.match(/<main id="main">([\s\S]*?)<\/main>/)[1].replace(/<aside class="callout-box app-edition-note">[\s\S]*?<\/aside>/g,'');
 assert.equal(createHash('sha256').update(body).digest('hex'),'8a44c314ea8f24ec7fda7b8723896eb5f7c67228e0971c6c1efa0ba24bf5baa3');
});
test('App Store edition identity, trial mechanism and registered links stay separate from Pro',()=>{
 for(const name of ['index','support','privacy']){
  const html=read('barnest/'+name+'.html');assert.equal((html.match(/class="callout-box app-edition-note"/g)||[]).length,8);
  for(const route of ['/','/support','/privacy'])assert.ok(html.includes('href="https://barnest.kevinlabs.app'+route+'"'));
 }
 for(const name of ['index','support']){
  const html=read('barnest/'+name+'.html');assert.doesNotMatch(html,/7-day|7 天|7日|7일|7-Tage|7 Tagen|7 jours|7 días|7 dias/);
  assert.ok(html.includes('$0'));assert.ok(html.includes('$2.99'));assert.ok(html.includes('$5.99'));assert.ok(html.includes('2026-12-01'));
 }
 assert.equal(JSON.parse(read('index.json')).apps.find(a=>a.id==='barnest').version,'1.0.2');
 assert.match(read('barnest/index.html'),/href="https:\/\/kevinlabs.app\/barnest\/" rel="canonical"/);
 for(const route of ['support.html','privacy.html',''])assert.ok(read('sitemap.xml').includes('https://kevinlabs.app/barnest/'+route));
 assert.ok(read('sitemap.xml').startsWith('<?xml version="1.0" encoding="UTF-8"?>'));
});
