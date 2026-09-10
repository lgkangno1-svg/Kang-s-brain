# My Korea Look — full free-input functional slice (2026-09-10)

Source of truth: `docs/PRD.md` -> active `docs/BUILD_SPEC.md`.

## Gap closed
The free `/style` preview previously exposed style, garment, tone, trip priority, season and coverage, but the active `StyleInputV1` contract additionally requires explicit palette, mood, comfort, destination and optional visit date. This slice wires those customer choices through one deterministic input object into catalog ranking, local save/restore and copy/download export.

## Behavior
- Inputs: style, garment, palette, mood, comfort, coverage, season, destination and optional `YYYY-MM-DD` visit date.
- A valid visit date deterministically supplies seasonal fit; unknown/no date leaves the explicit season choice in control.
- Garment and coverage are hard filters. Ranking then uses style, palette, comfort, season, destination editorial fit and mood with stable tie-breaking.
- If fewer than three verified catalog looks satisfy hard filters, the preview fails closed and asks the visitor to change garment/coverage rather than duplicating or inventing looks.
- Destination fit is explicitly editorial. Existing catalog photo routes remain verified Gyeongbokgung references; Bukchon/Seochon selections do not fabricate opening, inventory, price, booking or realtime route facts.
- State persists only in browser `localStorage`; invalid/stale payloads are removed. Copy/download remain local recovery paths.
- Six P0 locale shells cover all new input/recovery labels.
- Free preview remains zero-checkout, zero-AI and zero-remote-photo processing.

## Discovery
Fresh GitHub discovery reviewed TypeScript itinerary implementations and found support for serializable travel-date inputs and deterministic calculators, but no dependency that materially improves this bounded catalog-ranking problem. A fresh Hugging Face model search was attempted; the connected endpoint returned `Tool model_search not found`. No model, dataset, Space or new dependency was adopted. Deterministic local rules are smaller, cheaper and avoid fabricated travel claims.

## Boundaries
This does not activate paid persistence, auth, Supabase, Stripe, credits, remote image processing or CMS-backed deterministic logic. Existing payment gates remain fail-closed. Locale-native catalog prose remains a separate content-quality gap.

## Verification contract
`scripts/check-style-full-input.mjs` is included in `check:functionality` and guards the PRD input enums, deterministic scoring dimensions, hard coverage filtering, date-season mapping, six-locale UI, local persistence/export, zero-network boundary and live `/style` route wiring. Exact-SHA MiniPC CI and production deployment/live smoke remain mandatory before this slice is production-complete.
