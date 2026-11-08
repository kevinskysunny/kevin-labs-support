// Refresh shared asset fingerprints and the website version, never app versions.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
const root = new URL('../', import.meta.url);
const { version } = JSON.parse(fs.readFileSync(new URL('site.json', root)));
const revisions = Object.fromEntries(['site.css', 'monochrome.css', 'site.js'].map(name => [name,
  createHash('sha256').update(fs.readFileSync(new URL(`assets/${name}`, root))).digest('hex').slice(0, 12)]));
function walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    if (item.name.startsWith('.') || ['docs', 'node_modules', 'output'].includes(item.name)) continue;
    const file = path.join(dir, item.name);
    if (item.isDirectory()) walk(file);
    else if (item.name.endsWith('.html')) {
      const before = fs.readFileSync(file, 'utf8');
      let after = before;
      for (const [name, revision] of Object.entries(revisions))
        after = after.replaceAll(new RegExp(`assets/${name.replace('.', '\\.')}\\?v=[a-f0-9]+`, 'g'), `assets/${name}?v=${revision}`);
      if (after !== before) fs.writeFileSync(file, after);
    }
  }
}
walk(root.pathname);
const catalogPath = new URL('index.json', root);
const catalog = JSON.parse(fs.readFileSync(catalogPath));
catalog.siteVersion = version;
fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + '\n');
console.log(`Website ${version}; shared asset fingerprints synchronized.`);
