// Brand portal at the apex. GitHub Pages remains the single content origin.
export const PORTAL_ORIGIN = 'https://kevinlabs.app';
export const CONTENT_ORIGIN = 'https://support.kevinlabs.app';

export async function handlePortal(request, fetchOrigin = fetch) {
  const incoming = new URL(request.url);
  if (!['kevinlabs.app', 'www.kevinlabs.app'].includes(incoming.hostname)) return new Response('Not found', { status: 404 });
  if (incoming.hostname === 'www.kevinlabs.app') {
    incoming.hostname = 'kevinlabs.app'; incoming.protocol = 'https:';
    return new Response(null, { status: 308, headers: { location: incoming.href } });
  }
  // Forms and commerce APIs stay on their existing hosts; this is a read-only portal.
  if (!['GET', 'HEAD'].includes(request.method)) return new Response('Method not allowed', { status: 405, headers: { allow: 'GET, HEAD' } });
  if (['/barnest', '/barnest/', '/barnest/index.html'].includes(incoming.pathname)) return new Response(null, { status: 301, headers: { location: 'https://barnest.kevinlabs.app/' } });
  const upstream = new URL(incoming.pathname + incoming.search, CONTENT_ORIGIN);
  const headers = new Headers();
  // Support conditional/range requests without forwarding browser credentials or unrelated headers.
  for (const name of ['accept', 'accept-language', 'if-none-match', 'if-modified-since', 'range', 'if-range', 'user-agent']) {
    const value = request.headers.get(name); if (value) headers.set(name, value);
  }
  let response;
  try { response = await fetchOrigin(new Request(upstream, { method: request.method, headers, redirect: 'manual' })); }
  catch { return new Response('Temporarily unavailable', { status: 502, headers: { 'retry-after': '30', 'cache-control': 'no-store' } }); }
  const output = new Headers(response.headers);
  // The content host may normalize trailing slashes; keep that navigation on the apex.
  const location = output.get('location');
  if (location) {
    const destination = new URL(location, upstream);
    if (destination.origin === CONTENT_ORIGIN) {
      destination.hostname = 'kevinlabs.app'; output.set('location', destination.href);
    }
  }
  output.delete('set-cookie');
  output.set('x-content-type-options', 'nosniff');
  output.set('referrer-policy', 'strict-origin-when-cross-origin');
  // Brand HTML and catalogs must reflect the current source, while static binaries can stream/cache.
  if (/text\/html|application\/json|text\/xml/.test(output.get('content-type') || '') || incoming.pathname === '/robots.txt') {
    output.set('cache-control', 'public, max-age=0, must-revalidate, no-transform');
  }
  return new Response(request.method === 'HEAD' ? null : response.body, { status: response.status, statusText: response.statusText, headers: output });
}
export default { fetch: request => handlePortal(request) };
