// Shared product-site breadcrumb; Kevin Labs is the single catalog return.
import fs from 'node:fs';
const root = new URL('../', import.meta.url);
const products = {volmix:'VolMix',barnest:'BarNest','ksic-studio':'KSIC Studio',netdoctor:'NetDoctor','presenter-deck':'PresenterDeck',mindcharge:'MindCharge',nextmirror:'NextMirror',smoothcast:'SmoothCast',photoslim:'PhotoSlim'};
for (const [directory,name] of Object.entries(products)) {
 for(const entry of fs.readdirSync(new URL(directory+'/',root),{withFileTypes:true}).filter(e=>e.isFile()&&e.name.endsWith('.html'))) {
  const path=new URL(directory+'/'+entry.name,root);let html=fs.readFileSync(path,'utf8');
  // Redirect-only compatibility pages have no header to update.
  html=html.replace(/<a class="brand" href="[^"]+">[\s\S]*?<\/a>(?:<span class="brand-divider"[^>]*>.*?<\/span><strong class="brand-product">.*?<\/strong>)?/,`<a class="brand" href="https://kevinlabs.app/"><img alt="" class="brand-logo" height="24" src="../assets/logo.png" width="24"/><span class="brand-name">Kevin Labs</span></a><span class="brand-divider" aria-hidden="true">/</span><strong class="brand-product">${name}</strong>`);
  html=html.replace(/<a class="back" href="(?:\.\.\/)?index\.html">[\s\S]*?<\/a>\s*/g,'');
  fs.writeFileSync(path,html);
 }
}
console.log('Product headers share the Kevin Labs / product breadcrumb.');
