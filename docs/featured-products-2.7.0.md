# Featured products — website 2.7.0

2026-11-08: VolMix occupies the large flagship card with a panel view of the existing approved Chinese/English comparison artwork. MacPulse is the second recommendation, BarNest Pro remains third, and NextMirror leads the six other tools. The eight locale catalogs retain their existing destinations and copy. No app releases, store listings, prices, or payment settings change.

Validation: build and 26 tests pass. A real Chrome run covers all eight languages at 320, 390, 768, 1024, and 1440 pixels (40 cases): ordered destinations, loaded images, no horizontal overflow or artwork overlap with description/action. Chinese desktop/mobile screenshots were visually inspected. The public root and legacy support host share this generated homepage.

The panel is presented by CSS from the existing comparison art; future replacement artwork must preserve its crop geometry or update the flagship rules. Chinese uses the Chinese variant and other locales retain the existing English artwork fallback.

Product pages also share the compact Kevin Labs / product breadcrumb, matching MacPulse. The brand link returns to the apex with language preserved; duplicate standalone catalog return buttons are removed. The shared generator keeps headers consistent on rebuild. Full existing browser regression: 154 layout combinations pass.
