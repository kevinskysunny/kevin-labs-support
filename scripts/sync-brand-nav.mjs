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
  html=html.replace(/<div class="product-identity">[\s\S]*?<\/div>(?:<\/div>)?/g, identity => {
    const platform=identity.match(/<span[^>]*>([\s\S]*?)<\/span>/)?.[1];
    return platform ? `<p class="product-compatibility">${platform}</p>` : '';
  });
  html=html.replace(/(<p class="product-compatibility">[^<]*<\/p>)(<h1>[\s\S]*?<\/h1>\s*<p class="lead">[\s\S]*?<\/p>)/g, '$2$1');
  html=html.replace(/(<p class="product-compatibility">[^<]*<\/p>)(<h1>[\s\S]*?<\/h1>)/g, '$2$1');
  fs.writeFileSync(path,html);
 }
}
console.log('Product headers share the Kevin Labs / product breadcrumb.');

// Historical KSIC Studio policy/help URLs remain public entry points.
for (const filename of ['support.html','privacy.html']) {
 const path=new URL(filename,root);let html=fs.readFileSync(path,'utf8');
 html=html.replace(/<a class="brand" href="[^"]+">[\s\S]*?<\/a>(?:<span class="brand-divider"[^>]*>.*?<\/span><strong class="brand-product">.*?<\/strong>)?/, '<a class="brand" href="https://kevinlabs.app/"><img alt="" class="brand-logo" height="24" src="assets/logo.png" width="24"/><span class="brand-name">Kevin Labs</span></a><span class="brand-divider" aria-hidden="true">/</span><strong class="brand-product">KSIC Studio</strong>');
 html=html.replace(/<div class="product-identity">[\s\S]*?<\/div><\/div>/g,'');
 fs.writeFileSync(path,html);
}
