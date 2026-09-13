# Korea Concierge handoff — Hanbok / Personal Color → My Korea Look continuity

Date: 2026-09-13
Candidate branch: `feat/korea-color-style-bridge-20260913`
Base main SHA: `c51d46f58935412985f86d5af8b9a681a666d84c`

## What changed

`docs/PRD.md` continues to designate `docs/BUILD_SPEC.md` as the active product authority. This pass closes a credential-free customer-journey gap: preferences chosen in the Hanbok matcher now continue into the full My Korea Look free intake instead of being discarded.

A small deterministic handoff module validates only allowlisted palette, mood, comfort, season, destination and color-provenance values. The Hanbok matcher marks color as `local-preview` when it came from the browser-local Personal Color route and reverts to `manual` immediately if the visitor changes the palette. The style Server Component sanitizes query data before passing it to `StyleConsultationV5`; invalid handoffs safely fall back to the ordinary free intake.

`StyleConsultationV5` now initializes from the sanitized handoff, keeps provenance through local save/restore, and shows P0-localized privacy copy explaining that only the derived color direction moved between tools and no photo was transferred. Manual palette changes remove the local-preview provenance. There is still no runtime AI call, photo upload, checkout, account dependency or remote storage in this flow.

## Regression / release state

`check-style-handoff.mjs` was added to `check:functionality`; the existing full-input contract now explicitly accepts only `manual` or `local-preview` provenance while retaining its zero-network and checkout fail-closed assertions. A local container build could not be run because outbound GitHub DNS is unavailable in this execution environment. Exact-SHA repository CI is therefore still required before merge, deployment or production-complete claims.

## Next useful work

Continue credential-free native/device/accessibility QA and source-refresh hardening. Private paid-result persistence/PDF delivery remains blocked until a dedicated Korea DB/Auth/ownership path is explicitly approved and verified; do not weaken the checkout gate to advance that work.
