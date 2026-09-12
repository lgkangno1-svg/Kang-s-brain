# Food Finder P0 localization audit — 2026-09-13

## Scope

Active requirements were read from `docs/PRD.md` → `docs/BUILD_SPEC.md` against `main` SHA `2ffa1bcb0b8532f9df520ff3c7d437bfab800cd7` before implementation. This slice closes the Food & cafe Finder audit gap where source-checked venue descriptions and operational notes were still English-only outside the English locale.

## User flow covered

- Existing user inputs remain intact: category, planned date/time, hide-closed, saved-only.
- Existing deterministic processing remains intact: source freshness, schedule status, category filtering and saved-ID revalidation.
- Server-side presentation now localizes each of the seven current source-backed venues for `zh-CN`, `ja`, `zh-TW`, `vi`, and `th`, while English continues to use the source-authored copy.
- Localized fields cover venue summary, closure/current-listing note, dietary/policy note where present, and the `last order` phrase in hours.
- Search metadata now has locale-native descriptions for all six P0 locales.
- Existing result actions remain intact: save/remove favorite, saved-only recovery, copy address, map, walking directions, source link and checked date.
- Existing stale/invalid source handling remains fail-closed to verify-only rather than presenting unverified hours as current facts.
- Unknown future CMS venue IDs safely fall back to source-provided copy instead of disappearing or receiving invented translations.

## Privacy / cost / payment

No AI/model call, translation API, precise-location request, new runtime fetch, account, payment, Stripe, credit or entitlement dependency was added. Checkout remains fail-closed. Translation is authored static presentation only; factual source URLs and checked dates are unchanged.

## Regression gate

`check-food-localization.mjs` verifies catalog coverage, every P0 non-English locale, server-side application, locale-native metadata, safe unknown-ID fallback, and absence of browser/network dependencies in the Server Component. It is wired into `check:functionality`.

## Remaining evidence

This document is code-level evidence only. Exact-SHA CI/build, merge-SHA CI and deployed browser verification are required before calling the slice production-complete. Native-speaker editorial review remains advisable before high-traffic launch.
