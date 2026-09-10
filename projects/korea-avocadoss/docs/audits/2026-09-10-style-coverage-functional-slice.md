# My Korea Look coverage functional slice — 2026-09-10

## Source of truth

- Fresh `main` inspected at `947e094a2a52111f8b82c4a1d9ac1744d19e8ad1`.
- `docs/PRD.md` still points to `docs/BUILD_SPEC.md` as the active requirements source.
- BUILD_SPEC defines `coverage: standard | more-coverage` as an explicit user input and requires user choices to materially change recommendations.
- `LAUNCH_FUNCTIONAL_AUDIT.md` still marks My Korea Look as HARDENING, with deeper result/input completeness remaining before payment-grade launch.

## Gap closed

The free `/style` planner previously accepted style, garment, color direction, trip priority and season, but not the PRD coverage preference. Visitors wanting more coverage could not express that constraint and the generated three-look result could not respond to it.

This slice adds coverage as a real deterministic preference end to end:

1. six-locale `standard` / `more-coverage` input;
2. coverage is passed into the shared deterministic ranker and receives a strong positive score when catalog coverage matches;
3. matching is a preference rather than a hard filter in the free preview so the existing three-result promise is not accidentally reduced by sparse catalog coverage;
4. each result discloses its catalog coverage so a visitor can see when an alternative does not fully match the preference;
5. coverage is saved/restored in the existing browser-local bounded plan state, while legacy saved plans without the field recover to `standard`;
6. coverage is included in local copy/download exports;
7. no API, AI/model, CMS, payment, Stripe, credits, merchant or remote-photo behavior is added.

The paid Stylebook hard-filter contract in BUILD_SPEC is unchanged; this free-preview scoring choice is explicitly a pre-payment preview behavior, not a relaxation of future paid validation.

## Discovery gate

A fresh 2026-09-10 search was performed before revising the recommendation subfeature. GitHub search did not surface a maintained Hanbok-specific rule-ranking library that materially fits this small typed catalog problem. Hugging Face surfaced broad fashion-recommendation datasets such as FashionRec and a small Hanbok image dataset, plus image-generation LoRAs. Those assets would add model/runtime/privacy/license complexity and do not improve a deterministic coverage preference over the maintained local catalog. No new dependency or model was adopted.

## Regression contract

`scripts/check-style-plan-recovery.mjs` now verifies the P0-localized coverage control, bounded persistence validation, legacy restore default, deterministic ranking handoff, actual coverage disclosure, export preservation, and the prior local-storage/clipboard/provenance recovery invariants.

## Remaining launch gaps

This slice does not claim My Korea Look is complete. The active spec still calls for additional input dimensions/result depth and eventual owner-bound private paid-result persistence after dedicated external auth/database prerequisites are approved. Payment remains fail-closed.
