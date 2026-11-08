// Retain the historical products.json array API without maintaining duplicate versions.
import fs from 'node:fs';
const root=new URL('../',import.meta.url);
const catalog=JSON.parse(fs.readFileSync(new URL('index.json',root)));
const details=JSON.parse(fs.readFileSync(new URL('content/product-details.json',root)));
const apps=new Map(catalog.apps.map(app=>[app.id,app]));
const output=Object.entries(details).map(([id,detail])=>{
 const app=apps.get(id);
 if (!app) throw new Error(`Unknown compatibility product ${id}`);
 const store=app.appStoreUrl || app.productUrl;
 return { id,name:app.name,...detail,summary:['en','zh'].map(lang=>app.summary[lang]||app.summary.en),support:app.supportUrl,privacy:app.privacyUrl,demo:app.videos[0]?.playerUrl||null,store,version:app.version,nativeStore:store?.startsWith('https://apps.apple.com/')?store.replace('https:','macappstores:'):store };
});
const file=new URL('assets/products.json',root),next=JSON.stringify(output,null,2)+'\n';
if(process.argv.includes('--check')) { if(fs.readFileSync(file,'utf8')!==next)throw new Error('Compatibility product data is stale'); }
else fs.writeFileSync(file,next);
console.log('Compatibility product versions, links and summaries synchronized from index.json.');
