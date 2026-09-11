# Hanbok catalog audit — 2026-09-11

Source of truth: `docs/PRD.md` → `BUILD_SPEC.md`.

## Current state

- The **My Korea Look** catalog now contains **12 distinct, source-checked reference looks**: the original six plus six additional Korea.net / Korean Culture and Information Service cultural-showcase photographs published on Wikimedia Commons under CC BY-SA 2.0.
- The six additions complete the PRD matrix with a second `chima` and second `baji` direction for each experience family: `princess-prince`, `queen-king`, and `royal`.
- The active `/style` deterministic free-preview ranker consumes all 12 looks. Garment and coverage constraints remain filters; palette, comfort, season, destination, mood and explicit style continue to influence deterministic ranking.
- The existing `/hanbok` catalog comparison remains on the original six-look subset in this slice because those six have authored locale-native title/description coverage across all P0 locales. Expanding that separate comparison surface without native presentation would reintroduce English fallback text.
- The six new entries use conservative visual metadata only: visible garment family, color relationship, walking/photo trade-off and bounded styling direction. They do not claim historical rank, customer identity, body type, live inventory, booking availability or exact rental-shop stock.
- Rental request cards for new entries explicitly tell visitors to confirm the actual design and any additional fee with the shop.

## Added references

| Look | Style | Garment | Source |
|---|---|---|---|
| `look-modern-gold-chima-07` | princess-prince | chima | Korea Hanbok Fashion Show 03 / Korea.net-KOCIS |
| `look-layered-ivory-baji-08` | princess-prince | baji | Korea Hanbok Fashion Show 20 / Korea.net-KOCIS |
| `look-teal-gold-chima-09` | queen-king | chima | KOCIS Korea Hanbok-AoDai FashionShow 71 |
| `look-indigo-modern-baji-10` | queen-king | baji | Korea Hanbok Fashion Show 04 / Korea.net-KOCIS |
| `look-jeonmo-gold-chima-11` | royal | chima | KOCIS Korea Hanbok-AoDai FashionShow 57 |
| `look-scarlet-brocade-baji-12` | royal | baji | Korea Hanbok Fashion Show 18 / Korea.net-KOCIS |

Each catalog record contains the individual Wikimedia Commons source page, creator attribution, CC BY-SA 2.0 license URL, commercial-use evidence note, source dimensions and a `checkedAt` date of 2026-09-11.

## Discovery gate

Fresh discovery was repeated before implementation.

- GitHub search did not identify a maintained dependency or catalog-ranking library that materially improves the existing deterministic local implementation.
- The connected Hugging Face dataset-search action was unavailable in this run because that endpoint was disabled by server configuration. This is recorded as an unavailable discovery endpoint, not evidence that no Hanbok datasets exist.
- No model or runtime image-generation dependency was adopted. Curated, provenance-carrying static references remain cheaper, more predictable and easier to audit for the current requirement.

## Regression contract

`npm run check:hanbok` now includes both catalog-localization and 12-look completeness contracts.

`check-look-catalog-completeness.mjs` fails if:

- the source-checked total is not exactly 12 for this release,
- the six new IDs are not distinct,
- any experience family fails to gain both a `chima` and `baji` direction,
- an added record loses its Commons source, reviewed CC BY-SA 2.0 license or source-check date,
- the active My Korea Look rank path stops consuming the expanded catalog, or
- fabricated availability language is introduced into the expansion dataset.

The existing `check-hanbok-catalog-localization.mjs` continues to protect the authored six-look `/hanbok` presentation and its P0 localization boundary.

## Release status

This document records repository implementation state only. The 12-look gap is not considered production-closed until the candidate exact-SHA MiniPC CI, merged exact-SHA CI, production deployment and affected-route live verification all pass.
