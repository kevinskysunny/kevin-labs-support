# Kevin Labs apex portal / 2.6.0

User approved brand integration while preserving the existing main portal Bento design and MacPulse's dark/light and orange product identity. The apex is now the brand portal; GitHub Pages at support.kevinlabs.app remains the content origin and legacy address.

## Routing

`edge/worker.mjs` streams public GET/HEAD requests from `kevinlabs.app/*` to a fixed support origin. Relative navigation stays on the apex; origin normalization redirects are rewritten to the apex. www redirects to apex while preserving path and query. Binary responses, Range/HEAD, status and validators are preserved. No browser Cookie/Authorization is sent upstream; no origin cookies are sent to browsers. No new paid service, DNS/email migration or product commerce route is introduced.

The prior Cloudflare single redirect `apex and www -> support.kevinlabs.app` matched both hosts, redirected 301 to `concat("https://support.kevinlabs.app", http.request.uri.path)`, preserving query strings. It is retained **disabled**, not deleted. The apex/www Worker routes were deployed before disabling that rule. To roll back: enable this same rule first, then remove only the `kevinlabs-brand-portal` apex/www routes. Existing support NextMirror commerce routes must remain untouched.

OAuth had Workers permissions but could not read redirect rules or DNS (403); the authenticated Cloudflare dashboard was used to inspect and disable the one relevant redirect. No permissions or credentials were changed. Hostnames remain proxied as before.

## Source and discovery

`site.json` defines `canonicalOrigin` and `contentOrigin`; `scripts/sync-site.mjs` generates canonical, OpenGraph and sitemap/robots URLs for the apex while leaving functional legacy links intact. GitHub Pages CNAME remains support.kevinlabs.app. One source feeds both hosts; no duplicate product page or iframed site.

MacPulse keeps its product domain, download and checkout/activation service. Its eight-language header becomes `Kevin Labs / MacPulse`, with a brand logo, a localized All apps link and footer return link. Manual language and Auto are passed to the portal. The app binary stays 0.9.0/build148; the website release is separate.

## Verification

Unit checks cover credentials, redirect handling, safe upstream origin, methods, streaming, Range/HEAD and upstream errors alongside existing product/catalog tests. Production/browser results are added after final deployment. Browser mobile viewports are simulated; no claim of physical-phone testing or real payment.

## Production acceptance

- Portal source `7dfb18d`, Worker deployment `22ec1327-0546-4390-a638-fc7a88b59598`. GitHub Pages built the same source; apex serves 200 without changing the browser host, www preserves path/query while returning to apex, and support remains accessible.
- Canonical metadata, robots and sitemap now use the apex; the portal reports website2.6.0. Product destination records (including IDs, prices/versions and store/support/privacy URLs) are byte-for-byte equivalent as data to the previous catalog, apart from the separate siteVersion field.
- Sixteen production browser combinations (eight languages ×390/1440px) passed; `browser.json` records viewport, image/link and canonical results. The Chinese portal → MacPulse → brand-header round trip landed on `https://kevinlabs.app/?lang=zh` and preserved language. Existing layouts and colors remain.
- Thirty-five public catalog product/support/privacy URLs and selected apex routes returned200 after transient transport retries; see `legacy-links.json`. This verifies public destinations, not Apple/Google backend settings, country-wide store availability or completed payment.
- MacPulse site source1b8f6f0 / Worker3bcc198e-adee-434b-8b40-f51dfb37e044. 36 tests, workerd/localD1 smoke and24 production brand-navigation browser combinations passed (320/390/1440px ×8 languages). Application binary remains notarized0.9.0/build148.
- Domain migration initially caused the existing analytics collector to reject apex-origin events403. A bounded compatibility fix in ksic-task-board **1.1.1**, commit `2be0344`. It adds only exact `https://kevinlabs.app` alongside the legacy origin and preserves per-path product attribution. Full local verification passed (118tests/27suites, type check, learning/PDF check and production build); established CI/deploy [run42475153841](https://github.com/kevinskysunny/ksic-task-board/actions/runs/42475153841) succeeded. A real browser page event from apex/volmix returned204 with exact-origin CORS. No customer data, product licenses or provider transactions were changed.
- Source repositories were pushed with task-only changes; existing .hallmark and unrelated task-board work were excluded. No email, DNS, App Store Connect, Google Web Store or Paddle configuration was modified by this integration.
