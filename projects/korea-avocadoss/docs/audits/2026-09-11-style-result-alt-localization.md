# My Korea Look result accessibility localization — 2026-09-11

Source of truth: `docs/PRD.md` -> active `docs/BUILD_SPEC.md`.

## Fresh gap
The free `/style` result already localized controls, ranking explanations, display titles and palette roles for all six P0 locales. One visitor-facing accessibility leak remained: the result image `alt` text was copied directly from the English catalog asset for every locale.

This matters because the active PRD requires six-locale core journeys and accessible, meaningful result delivery. It is also a safe deterministic fix: the ranking and verified visual provenance do not need to change.

## Change
`rankStyleInputV1` now builds the result `visualAlt` from verified catalog metadata in the active locale for `zh-CN`, `ja`, `zh-TW`, `vi`, and `th`:

- localized reference-photo label;
- localized verified style family;
- localized verified garment family.

English deliberately preserves the original curated asset alt text. The localized form does not invent colors, body characteristics, identity, availability or visual facts that are not encoded in the catalog metadata.

## Architecture and cost
- deterministic/browser-local only;
- zero network calls and zero AI;
- no CMS or payment behavior changes;
- no new dependency;
- ranking, source URL, creator, license, source hex values and free/paid boundary remain unchanged.

A dependency or model would add cost/privacy/supply-chain surface without improving this finite label transformation, so none is adopted.

## Regression contract
`scripts/check-style-result-depth.mjs` now requires:

- `localizeVisualAlt` to be wired into `visualAlt`;
- locale-native accessibility terms for every non-English P0 locale;
- original English catalog alt preservation;
- all existing free/paid depth, provenance, local-storage, copy/download and zero-network guards.

Production promotion still requires the private MiniPC exact-SHA CI and deploy/live gates.
