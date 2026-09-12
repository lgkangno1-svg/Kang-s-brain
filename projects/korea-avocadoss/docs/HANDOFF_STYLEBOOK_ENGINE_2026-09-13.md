# Korea Concierge handoff — paid stylebook engine v1

Date: 2026-09-13
Candidate branch: `feat/korea-style-free-boundary-20260913`
Base main SHA: `2ffa1bcb0b8532f9df520ff3c7d437bfab800cd7`

## What changed

`docs/PRD.md` still points to `docs/BUILD_SPEC.md`. The highest-value credential-free S4 gap selected for this pass was the mismatch between the active free intake (`StyleInputV1`) and the older paid deliverable generator.

`src/lib/looks/stylebook-engine-v1.ts` now provides the next paid-result domain contract without connecting payment or persistence. It consumes all active style inputs, returns three verified catalog results with source/visual/rental/route depth, generates three explicit-input-linked reasons in all six P0 locales, derives an alternate colorway from another eligible verified look, distinguishes manual preference personalization from browser-local color preview input, and fails closed when a manual `suggest` palette lacks local color evidence.

The same engine includes the BUILD_SPEC one-successful-revision rule. Supported changes create a new immutable result version; empty or second revisions fail; a failed rebuild does not consume the included revision. This is domain logic only and intentionally has no database, browser storage, checkout, Stripe, worker, or email side effects.

## Verification

`check-stylebook-engine-v1.mjs` was added to `check:functionality`. A full branch build/exact-SHA CI is still required before merge. If CI exposes a TypeScript or contract failure, fix the branch rather than weakening the payment fail-closed rules.

## Next highest-value work after this slice

1. Wire this engine behind a durable owner-bound job/result interface only after a dedicated Korea DB/Auth project is explicitly approved and created.
2. Add private result version persistence and PDF generation/re-download semantics with the original result retained after revision.
3. Keep checkout disabled until ownership, durable webhook/event storage, fulfillment, recovery and test-mode refund E2E all pass.
