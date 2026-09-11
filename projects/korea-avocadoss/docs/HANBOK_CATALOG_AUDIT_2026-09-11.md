# Hanbok catalog audit — 2026-09-11

Source of truth: `docs/PRD.md` → `BUILD_SPEC.md`.

## This slice

- The current source-checked catalog contains **6 distinct look IDs**, not 12.
- This slice does **not** invent six extra style/color records merely to satisfy the number. Additional catalog records require source-checked imagery plus visually verified garment/style/palette metadata before they participate in deterministic ranking.
- Existing six source-checked looks now have locale-native title and concise catalog description coverage for all P0 locales: `en`, `zh-CN`, `ja`, `zh-TW`, `vi`, `th`.
- Hanbok comparison output now uses locale-native walking/season labels and Korean place names for non-English locales instead of leaking raw English catalog enums/names.
- Non-English palette presentation exposes the verified hex values rather than hard-coded English color-name prose.
- Catalog image alt text now follows the localized look presentation instead of falling back to raw English catalog alt text.

## Discovery gate

Fresh discovery was run before considering a 6→12 expansion.

- GitHub search did not identify a maintained dependency that materially improves deterministic Hanbok catalog ranking over the existing local rules.
- Hugging Face surfaced a Hanbok image dataset, but this is not adopted: its surfaced result does not establish the provenance/license and curated commercial-use guarantees required for production catalog assets.
- Wikimedia Commons/Korea.net Hanbok Fashion Show files provide additional source candidates under CC BY-SA 2.0, but source licensing alone is insufficient to assign palette, garment and style metadata safely. Those records remain a separate future exact-SHA slice after visual metadata verification.

## Regression contract

`npm run check:hanbok` now includes `scripts/check-hanbok-catalog-localization.mjs`, which fails if:

- the six current source-checked IDs are missing from any P0 locale block,
- raw English catalog title/alt/walking/season/location presentation is reintroduced into `HanbokCatalogResults`, or
- the localization adapter stops being used by the result/compare paths.

## Remaining PRD gap

The PRD calls for a **12-look** curated catalog. Current verified count remains 6. This is an explicit fixable gap and must not be reported complete until six additional source-checked looks are added with reliable visual metadata, tests, exact-SHA CI, deployment and live verification.
