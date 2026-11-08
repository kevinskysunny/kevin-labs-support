// Compile the shared eight-language feedback dictionary into the classic deferred script.
import fs from 'node:fs';
const root = new URL('../',import.meta.url);
const config = JSON.parse(fs.readFileSync(new URL('site.json',root)));
const copy = JSON.parse(fs.readFileSync(new URL('content/ui.json',root)));
const keys = Object.keys(copy.en).sort();
for (const lang of config.languages) {
  if (!copy[lang] || JSON.stringify(Object.keys(copy[lang]).sort()) !== JSON.stringify(keys) || Object.values(copy[lang]).some(v=>typeof v!=='string'||!v.trim())) throw new Error(`Incomplete UI copy: ${lang}`);
}
const file = new URL('assets/site.js',root);
const source = fs.readFileSync(file,'utf8');
const marker = /\/\* ui-copy:start \*\/[\s\S]*?\/\* ui-copy:end \*\//;
if (!marker.test(source)) throw new Error('Missing UI copy marker');
const next = source.replace(marker,()=>`/* ui-copy:start */${JSON.stringify(copy,null,2)}/* ui-copy:end */`);
if (process.argv.includes('--check')) { if (next!==source) throw new Error('UI copy is out of date'); }
else fs.writeFileSync(file,next);
console.log('Shared UI dictionary verified for eight languages.');
