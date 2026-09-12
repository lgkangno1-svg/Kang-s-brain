# Korea Concierge handoff — Food Finder P0 localization

**Date:** 2026-09-13  
**Candidate branch:** `feat/korea-food-locale-content-20260913`  
**Base main SHA:** `2ffa1bcb0b8532f9df520ff3c7d437bfab800cd7`

- `docs/PRD.md` still designates `docs/BUILD_SPEC.md` as the active requirements source.
- The Food & cafe Finder already had category/date/time inputs, freshness-aware schedule processing, favorites persistence/recovery, source links, map/walking handoff and six-locale interface labels; the remaining user-facing content gap was English-only venue descriptions and venue-specific operational notes.
- This slice adds authored P0 presentation for all seven current source-backed venues in `zh-CN`, `ja`, `zh-TW`, `vi`, and `th`, plus localized `last order` wording and locale-native `/explore/food` search descriptions.
- Localization is applied in the Server Component after source-checked content resolution. The Client Component behavior, source URLs, checked dates, availability logic and saved-ID contract are unchanged.
- Future/unknown CMS venue IDs fail safely to their source-provided copy; the code does not invent translations or hide the place.
- A dedicated `check-food-localization.mjs` contract is part of `check:functionality` and guards catalog/P0 coverage, server application, safe fallback and zero added runtime network/location dependencies.
- No AI/model, precise-location, payment, Stripe, account, credits or entitlement behavior changed. Checkout remains fail-closed.
- Before merge, require branch CI/build evidence. After merge, require merge-SHA CI and deployed browser verification before marking production-complete.
