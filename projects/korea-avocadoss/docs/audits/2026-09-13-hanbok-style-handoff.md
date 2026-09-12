# Functional audit — Hanbok → My Korea Look continuity

Date: 2026-09-13
Branch: `feat/korea-color-style-bridge-20260913`
Base main SHA: `c51d46f58935412985f86d5af8b9a681a666d84c`

## Why this slice

`docs/PRD.md` still points to `docs/BUILD_SPEC.md`. The paid stylebook domain engine is now present, while private ownership/persistence remains intentionally blocked on dedicated Korea DB/Auth. The highest-value credential-free gap was continuity between the already-live browser-local Personal Color → Hanbok flow and the full free My Korea Look intake: the Hanbok matcher could consume Personal Color, but its chosen palette/mood/comfort/season/destination were discarded when moving into My Korea Look.

## Implemented contract

- Added a deterministic, typed handoff contract in `src/lib/looks/style-handoff.ts`.
- Hanbok now carries the current palette, mood, comfort, season and compatible destination into `/style`.
- A Personal Color-derived palette is marked `local-preview`; manually overriding the Hanbok color immediately changes provenance back to `manual`.
- `/style` sanitizes the handoff in its Server Component. Unknown origins, palettes or provenance fail closed and fall back to the normal defaults.
- `StyleConsultationV5` initializes from the sanitized handoff, preserves provenance in browser-local save/restore/export input state, and changes provenance back to `manual` when the visitor manually changes the palette.
- All six P0 locales explain when a browser-local color direction was carried over and explicitly state that no photo was transferred.
- The handoff contains no photo, file, image bytes, confidence, account identifier, checkout token or remote API call.

## Recovery / accessibility / mobile

The existing responsive select grid, keyboard-native controls, `role="status"`, localStorage recovery and copy/download fallbacks remain in place. The handoff adds no fixed-width surface. An invalid URL handoff does not strand the visitor; the regular deterministic free preview remains usable.

## Regression coverage

`check-style-handoff.mjs` verifies sanitization, Hanbok provenance reset, preference continuity, six-locale privacy copy, server-side handoff parsing, zero-network behavior and absence of photo/file/image payloads. `check-style-full-input.mjs` was updated without weakening the zero-network or checkout fail-closed guarantees and now requires explicit manual/local-preview provenance handling.

## Verification limits

This environment could not clone GitHub from the container because outbound DNS is unavailable, so no local npm/build claim is made. The branch must pass repository exact-SHA CI before merge/deploy. Payment, Stripe, credits, auth, ownership, webhook and fulfillment behavior are unchanged and remain fail-closed.
