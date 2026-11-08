// Homepage product copy has one eight-language source; generated HTML works without JS.
import fs from 'node:fs';
const root = new URL('../', import.meta.url);
const data = JSON.parse(fs.readFileSync(new URL('content/home.json', root)));
const esc = text => String(text).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const card = app => `<a class="${app.featured?'product-card':'tool-card'}" data-product="${esc(app.id)}" href="${esc(app.href)}"><img alt="" height="${app.featured?64:36}" src="${esc(app.icon)}" width="${app.featured?64:36}"/><${app.featured?'h2':'h3'}>${esc(app.name)}</${app.featured?'h2':'h3'}><p class="product-purpose">${esc(app.purpose)}</p><p class="product-description">${esc(app.description)}</p>${app.id==='nextmirror'?'<p class="product-platform">Apple Silicon · macOS 12+</p>':''}<span class="product-action">${esc(app.action)}</span></a>`;
const file = new URL('index.html', root);
let html = fs.readFileSync(file,'utf8');
html = html.replace(/(<section data-lang="([a-z]{2})"[^>]*>)[\s\S]*?(?=<section class="faq-section">)/g, (match, tag, lang) => {
  const item=data[lang];
  if (!item) throw new Error(`Missing homepage locale ${lang}`);
  return `${tag}<div class="home-intro"><h1>${esc(item.title)}</h1></div>\n<div class="featured-products" id="apps-${lang}">${item.apps.filter(a=>a.featured).map(card).join('')}</div>\n<h2 class="other-heading">${esc(item.more)}</h2><div class="other-products">${item.apps.filter(a=>!a.featured).map(card).join('')}</div>\n`;
});
if (process.argv.includes('--check')) {
  if (fs.readFileSync(file,'utf8') !== html) throw new Error('Homepage is out of date; run npm run build.');
} else fs.writeFileSync(file,html);
console.log('Rendered all eight homepage catalogs.');
