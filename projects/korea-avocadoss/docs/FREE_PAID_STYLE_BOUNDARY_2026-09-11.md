# My Korea Look free / paid product boundary — 2026-09-11

## Authority

`docs/PRD.md` currently designates `docs/BUILD_SPEC.md` as the active product specification. The active specification outranks older handoff and roadmap text.

## Gap found on fresh main

The active specification defines the free `/[locale]/style` result as one preference-based look with a basic color direction and a short reason. The paid My Korea Look deliverable remains three complete looks with materially deeper alternatives, Korean rental-shop support and a tailored photo route.

Before this slice, the live free component ranked and rendered three looks and also exposed accessories, an alternative colorway, Korean rental request text and a photo route. That made the free route overlap the paid deliverable boundary even though checkout itself remained fail-closed.

## Bounded correction

- The free style route now renders exactly one verified deterministic catalog result.
- The free result keeps the useful launch contract: full preference inputs, one visual, basic color direction, one short recommendation reason, source/license provenance, local save/restore, copy/download recovery and Hanbok-rental handoff.
- Paid-only depth is removed from the free component: no three-look bundle, accessory bundle, alternative look/colorway, Korean rental request card or tailored photo route.
- The three public `/style/sample/[slug]` demonstrations remain unchanged and continue to show the complete three-look paid-quality depth, shop-card example and photo route.
- The internal paid deliverable generator remains unchanged at three ranked looks and continues to carry the paid fields behind the disabled payment boundary.
- `/style` metadata and all six P0 locale descriptions now promise one free look instead of three.
- Regression contracts now explicitly fail if the free component returns three looks or leaks paid-only fields, while separately proving that public paid samples and the paid deliverable retain three-look depth.

## Architecture / cost / privacy

No AI, external model, CMS, payment, account or new network dependency is introduced. Ranking remains deterministic and local. `colorSource='manual'` remains fail-closed for an ungrounded `Suggest for me` choice, and Personal Color remains the browser-local recovery path. Checkout remains disabled until the active specification's durable owner-bound order, fulfillment and provider prerequisites are verified.

## Release evidence required

This document records the candidate intent only. The change is not production-complete until the exact candidate SHA passes the private MiniPC CI, the safely reconciled merged SHA passes exact-SHA CI, the merged SHA is deployed through the root-owned MiniPC cutover, public Cloudflare probes pass, and the affected `/style` routes are live-smoked.
