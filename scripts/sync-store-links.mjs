// Store IDs come only from index.json. Native links leave storefront choice to Apple Account.
import fs from 'node:fs';
const root=new URL('../',import.meta.url);
const catalog=JSON.parse(fs.readFileSync(new URL('index.json',root)));
const copy=JSON.parse(fs.readFileSync(new URL('content/ui.json',root)));
const esc=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;');
for(const app of catalog.apps.filter(a=>a.appStoreUrl?.startsWith('https://apps.apple.com/'))){
 const id=new URL(app.appStoreUrl).pathname.match(/\/id(\d+)$/)?.[1];
 if(!id)throw new Error(`Missing store ID: ${app.id}`);
 for(const name of ['index.html','support.html']){
  const file=new URL(`${app.id}/${name}`,root);
  if(!fs.existsSync(file))continue;
  let html=fs.readFileSync(file,'utf8');
  // Remove previous generated controls, allowing the build to be run repeatedly.
  html=html.replace(/<!-- store:start -->[\s\S]*?<!-- store:end -->/g,`<a class="button button-accent" href="${esc(app.appStoreUrl)}">App Store</a>`);
  html=html.replace(/<section data-lang="([a-z]{2})"[\s\S]*?<\/section>/g,(section,lang)=>section.replace(/<a class="button button-accent" href="https:\/\/apps.apple.com\/[^\"]+">[^<]*<\/a>/g,()=>{
   const text=copy[lang];
   return `<!-- store:start --><a class="button button-accent store-native" href="${esc(app.appStoreUrl.replace('https:','macappstores:'))}">${text.storeOpen}</a><details class="store-web" data-store-id="${id}"><summary>${text.storeWeb}</summary><div class="store-region-controls" hidden></div><a class="store-web-link" href="${esc(app.appStoreUrl)}">${text.storeView}</a></details><!-- store:end -->`;
  }));
  if(process.argv.includes('--check')){if(fs.readFileSync(file,'utf8')!==html)throw new Error(`Stale store links: ${app.id}/${name}`);}
  else fs.writeFileSync(file,html);
 }
}
const file=new URL('assets/site.js',root),before=fs.readFileSync(file,'utf8');
const regions=JSON.parse(fs.readFileSync(new URL('content/store-regions.json',root))).regions;
const after=before.replace(/\/\* store-regions:start \*\/[\s\S]*?\/\* store-regions:end \*\//,`/* store-regions:start */${JSON.stringify(regions)}/* store-regions:end */`);
if(process.argv.includes('--check')){if(before!==after)throw new Error('Stale store region list');}else fs.writeFileSync(file,after);
console.log(`Store links synchronized for five Mac apps and ${regions.length} web storefronts.`);
