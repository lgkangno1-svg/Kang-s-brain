# Hanbok rental source-freshness hardening — 2026-09-12

## Scope

This slice follows `docs/PRD.md` → `docs/BUILD_SPEC.md` and keeps checkout fail-closed. It hardens the existing source-checked Gyeongbokgung Hanbok rental finder without adding accounts, payment, AI, booking APIs, geolocation, or runtime network dependencies.

## Problem

The finder already used `checkedAt`, `scheduleConfidence`, weekly closures, arrival time, source links and local favorites, but a record could remain labelled `Open at this time` indefinitely after its source-check date. A future trip could therefore receive a definite open/closed label from source data that would be too old by the visit date. The published-closing countdown could also continue to appear even when the underlying schedule should no longer be treated as current.

## Change

- Added deterministic `hanbokRentalSourceFreshness()` with a 30-day freshness window.
- Freshness is evaluated against the **selected visit date**, not only the browser's current day. This means a trip more than 30 days after the source check degrades to `recheck` before the stale schedule can be presented as open or closed.
- Invalid `checkedAt` values and dates before the recorded source check also fail closed to `recheck`.
- The published-closing countdown now receives the selected visit date and is suppressed when the source is stale or invalid.
- Existing six-locale `Recheck before visiting` copy, source links, checked date, map/directions, filters and browser-local saved-shop recovery remain intact.
- No live inventory, booking availability, return deadline or price is inferred.

## Regression contract

`check-hanbok-rental-recovery.mjs` now asserts the freshness type/helper, 30-day stale threshold, invalid/future-date handling, `recheck` downgrade, visit-date-bound closing-window suppression, existing source-ID allowlisting, focused 5–10 shop curation, and the zero-network/zero-geolocation core contract.

## Verification status

Repository-side static regression coverage was updated on branch `feat/korea-rental-freshness-20260912`. A local clone/build could not be executed from the automation container because outbound DNS to GitHub is unavailable there; this is **not** treated as a test pass. Exact-SHA CI and deployment evidence remain required before calling the slice production-complete.
