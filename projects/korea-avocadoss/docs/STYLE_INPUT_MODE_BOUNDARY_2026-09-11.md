# My Korea Look explicit photo / no-photo boundary — 2026-09-11

Active authority: `PRD.md` -> `BUILD_SPEC.md`.

## Gap closed

`BUILD_SPEC.md` requires `/style` to expose an explicit photo/no-photo choice and to explain the difference before any future purchase flow. It also forbids presenting preference-only results as if a photo had been analyzed.

The free My Korea Look route now presents two explicit choices in all six P0 locales:

- **Without a photo** — the visitor is told that the result uses only selected style, garment, palette and trip preferences and does not claim photo analysis.
- **With a photo** — the visitor is told that the currently available free Personal Color path is browser-local and keeps the photo on-device. It links to `/color` and does not upload a file from `/style`.

The photo option also states that secure paid photo styling remains unavailable until private account, storage, consent and fulfillment infrastructure is verified. This preserves the active fail-closed payment boundary and does not fabricate a paid photo pipeline.

## Regression contract

`check-style-full-input.mjs` now requires:

- the explicit `no-photo | photo` mode control;
- six-locale copy coverage;
- truthful no-photo wording;
- the browser-local `/color` recovery path;
- explicit prelaunch wording for secure paid photo styling;
- no `fetch`, checkout endpoint or file upload in the input-mode boundary.

No AI/model, CMS, Stripe, credit, account, remote photo-processing or merchant behavior changes in this slice.
