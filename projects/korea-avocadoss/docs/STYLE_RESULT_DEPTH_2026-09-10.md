# My Korea Look — result-depth functional slice (2026-09-10)

Source of truth: `docs/PRD.md` -> active `docs/BUILD_SPEC.md`.

## Gap closed
The full free intake already accepted style, garment, palette, mood, comfort, coverage, season/date and destination, but the live result card still omitted several active result-contract fields. This slice makes the result visibly explain its ranking instead of only showing a catalog description.

## User-visible behavior
Each of the three deterministic ranked looks now includes:
- exactly three visible evidence lines tied to the visitor's explicit style, palette, comfort, season and destination choices;
- the top / bottom / accent color relationship from the rights-reviewed catalog;
- the catalog accessory set;
- a deterministic alternate look/colorway chosen from the same hard-filtered ranked set, preferring a different palette undertone;
- the existing practical trade-off, source/license, Korean rental request card and verified catalog photo route.

The same result-depth fields are included in copy/download export. Save/restore remains browser-local. No network request, AI/model, checkout, payment, photo upload, CMS call or new dependency is added.

## Discovery decision
Fresh GitHub discovery did not identify a dependency that materially improves this small deterministic ranked-catalog explanation problem. A fresh Hugging Face model-search attempt for multilingual fashion recommendation returned `Tool model_search not found`; this is recorded as an unavailable connected endpoint, not as evidence that no models exist. No inference dependency is justified because the required result explanation is directly derived from explicit inputs plus curated catalog fields.

## Verification
`scripts/check-style-result-depth.mjs` is part of `check:functionality` and guards the evidence linkage, colors, accessories, alternate colorway, practical/location/source/shop-card/route fields, six-locale shell, local recovery/export behavior and zero-network/payment boundary.

Exact-SHA MiniPC CI, merge-SHA CI, production deployment and live `/en/style` verification remain required before this slice may be called production-complete.
