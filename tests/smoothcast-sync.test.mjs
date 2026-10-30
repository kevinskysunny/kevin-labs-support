import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('SmoothCast catalog uses current app version and localized summaries',()=>{
 const app=JSON.parse(read('index.json')).apps.find(a=>a.id==='smoothcast');
 assert.equal(app.version,'1.3.1');assert.equal(Object.keys(app.summary).length,8);
 assert.equal(app.supportUrl,'https://smoothcast.kevinlabs.app/support');
 assert.equal(app.releaseNotesUrl,'https://smoothcast.kevinlabs.app/releases');
 for(const summary of Object.values(app.summary))assert.ok(summary.includes('ProRes'));
});
test('manual and automatic language preferences survive product links',()=>{
 for(const preference of ['system','en','zh','ja','ko','de','fr','es','pt']){
  const link={href:'https://smoothcast.kevinlabs.app/',getAttribute(){return this.href}};
  const select={options:[{textContent:''},...['en','zh','ja','ko','de','fr','es','pt'].map(value=>({value}))],addEventListener(){},setAttribute(){}};
  const context=vm.createContext({URL,URLSearchParams,setTimeout,clearTimeout,
   location:{href:'https://support.kevinlabs.app/',search:''},navigator:{languages:['en-US']},
   localStorage:{getItem:key=>key==='ksicSupportLanguage'?preference:null},window:{addEventListener(){}},
   document:{documentElement:{},querySelector:s=>s==='#language'?select:s.includes('h1')?{textContent:'Kevin Labs'}:{},querySelectorAll:s=>s==='a[href]'?[link]:[],addEventListener(){}}});
  vm.runInContext(read('assets/site.js'),context);
  assert.equal(new URL(link.href).searchParams.get('lang'),preference);
 }
});
test('legacy privacy route points to the live product policy',()=>{
 for(const path of ['smoothcast/privacy.html','smoothcast/support.html','smoothcast/releases.html']){
  const html=read(path);assert.match(html,/rel="canonical"/);assert.match(html,/smoothcast-redirect.js/);
 }
 const source=read('assets/smoothcast-redirect.js');assert.match(source,/location.replace/);assert.match(source,/ksicSupportLanguage/);
 assert.equal((read('index.html').match(/smoothcast.kevinlabs.app\/support/g)||[]).length,8);
});
