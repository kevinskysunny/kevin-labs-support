import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
export async function createBrowserHarness() {
const root = fileURLToPath(new URL('../', import.meta.url));
const external = process.env.SITE_BASE_URL;
const mime = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.json':'application/json', '.png':'image/png', '.svg':'image/svg+xml', '.ico':'image/x-icon' };
const server = http.createServer(async (req, res) => {
  try {
    const requested = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.resolve(root, '.' + (requested.endsWith('/') ? requested + 'index.html' : requested));
    if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
    const data = await fs.readFile(file);
    res.writeHead(200, { 'Content-Type':mime[path.extname(file)] || 'application/octet-stream' }).end(data);
  } catch { res.writeHead(404).end(); }
});
if (!external) await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = external || `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ executablePath: process.env.BROWSER_EXECUTABLE || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const context = await browser.newContext({ locale:'zh-CN' });
// Acceptance traffic must not reach production analytics or trigger downloads.
await context.route('**/*', route => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort());

return { browser,context,base,close:async()=>{await browser.close(); if (!external) await new Promise(resolve=>server.close(resolve));} };
}
