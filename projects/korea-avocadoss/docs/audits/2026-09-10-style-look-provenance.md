# My Korea Look free-result visual provenance — 2026-09-10

## Source of truth

- Fresh `main` was inspected at `3f6d5fc7ccc56d7e57e89acd0fd803dfe4e008d4`.
- `docs/PRD.md` still designates `docs/BUILD_SPEC.md` as the active requirements source.
- BUILD_SPEC requires every result visual to show its source/creator/license and whether it is a `Style illustration` or `Reference photo` directly with the visual.

## Gap closed

The curated catalog already stored `sourceUrl`, `creator`, `license`, `licenseUrl`, `kind`, rights evidence and `checkedAt`, but the free `/style` result cards did not expose that provenance. The browser-local copy/download artifact also omitted it. A visitor therefore could not independently inspect the origin and usage basis of the reference visual from the actual recommendation flow.

This bounded slice:

1. displays a localized visual-source label immediately beneath each recommended look image;
2. displays the catalog creator and license beside a direct source link;
3. identifies the visual as a style illustration or reference photo from the catalog `kind` field;
4. preserves creator/license/source URL in the locally generated three-look text export;
5. keeps deterministic ranking, local save/recovery and zero-API export behavior unchanged;
6. adds no model, dependency, CMS read, payment, Stripe, credits, merchant activation or secret.

## Regression contract

`scripts/check-style-plan-recovery.mjs` now guards visible source-link/creator/license/type provenance, inclusion in the exported plan and P0-localized provenance labels while preserving existing local-storage, clipboard/download recovery and zero-fetch invariants.

## Remaining gaps

This does not claim the broader My Korea Look launch is complete. Locale-native catalog/result prose and paid owner-bound persistence remain separate requirements. Payment remains fail-closed behind the existing external account/identity/durable-persistence gates.

## Release evidence

Candidate exact-SHA CI, merged exact-SHA CI, deployment and live route evidence must be recorded only after those gates actually succeed.
