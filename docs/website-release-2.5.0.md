# Kevin Labs 2.5.0 — MacPulse catalog launch

2026-11-08. Adds MacPulse 0.9.0/build148 to the six secondary product cards and support directory in all eight languages; the approved three featured products and visual system stay intact. Machine catalog includes ARM64/macOS13 minimum, versioned release metadata, public download, support and privacy URLs.

Cross-site language links use MacPulse's persistent `/lang/<code|auto>?to=<page>` endpoint, including support routes. Re-rendering language choice preserves the destination page. Website version remains internal.

Validation: reproducible site generation, 21 unit checks, 16 local Chrome scenarios (eight languages × 390px/1280px), correct MacPulse destinations, no broken images or document overflow. Chinese mobile layout visually inspected. Production checks and deployment are recorded after publishing. Browser mobile emulation does not represent a physical phone test.

MacPulse's public DMG has Developer ID signing, Apple notarization and Gatekeeper acceptance, with verified SHA-256. Download/trial is available. Production Paddle checkout returned vendor-level 403. MacPulse domain has been submitted in Paddle and is In review; buying remains visibly disabled pending approval and revalidation. No payment was performed.

Sources: MacPulse repository `docs/releases/0.9.0-build148.md`; current catalog tests and browser observations. Existing untracked `.hallmark` directories are excluded from this release.
