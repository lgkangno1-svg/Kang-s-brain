# My Korea Look destination/provenance audit — 2026-09-13

## Scope

Active requirements remain `docs/BUILD_SPEC.md` via `docs/PRD.md`. BUILD_SPEC requires the paid stylebook to include a real location with source/checked date and a 2–3 hour, 3–4 stop route, while avoiding claims of live opening, booking or inventory availability.

The paid domain engine already accepted `destination`, but the generated result still copied each catalog look's editorial `recommendedLocation` and one-stop `photoRoute`. That meant a customer who selected Bukchon or Seochon could receive a look whose actionable location/route pointed somewhere else, and the travel portion did not carry first-class provenance.

## Implemented

- Added `src/lib/looks/stylebook-destination-v1.ts` with deterministic destination plans for Gyeongbokgung, Bukchon and Seochon.
- Each plan contains a 120–180 minute, four-stop route, a map query, conservative visitor guidance, official source URL, source label and explicit `checkedAt` date.
- `stylebook-engine-v1.ts` now resolves the selected `StyleInputV1.destination` into a first-class `destinationPlan` in the paid result.
- Each generated look's `recommendedLocation` and `photoRoute` are now aligned to the selected destination instead of silently reusing a catalog location from another area.
- Look image/source/license provenance remains separate and unchanged; destination provenance is not used to imply rental stock, booking availability, current admission or real-time opening state.
- No fetch, checkout, Stripe, account, database, storage, worker or AI dependency was added. Payment remains fail-closed.

## Source verification

Checked 2026-09-13:

- Gyeongbokgung Palace — Visit Seoul: `https://english.visitseoul.net/attractions/Gyeongbokgung/ENP000072`. The page documents Tuesday closure and the public-holiday substitution rule as of 2026.
- Bukchon Hanok Village — Visit Seoul: `https://english.visitseoul.net/attractions/Bukchon-Hanok-Village/ENP000261`. The page was edited 2026-09-10 and lists restricted-area visiting hours 10:00–17:00 plus silent-tourism/resident-privacy guidance.
- Seochon walking route — Visit Seoul: `https://english.visitseoul.net/PalaceArea/Seochon-Hanok-Village/ENN000624`. The official walking-tour reference lists a three-hour route through Seochon.

The static plan intentionally tells the visitor to re-check date/site-specific access before travel; it does not promote these source checks into a live-availability claim.

## Regression contract

`check-stylebook-destination-v1.mjs` is included in `npm run check:functionality`. It guards all three destination plans, source URLs, checked dates, 2–3 hour duration markers, selected-destination binding, route binding, and zero network/payment/storage coupling.

## Remaining gates

This slice improves the future paid result payload but does not make the SKU sellable. Dedicated Korea Auth/DB, server-owned order creation, private version persistence, durable job/worker state, PDF delivery/re-download, idempotent verified webhook persistence, refund recovery, test-mode E2E, device/accessibility QA and exact-SHA deployment evidence remain required before checkout can open.
