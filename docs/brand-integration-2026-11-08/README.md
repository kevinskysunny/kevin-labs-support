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
