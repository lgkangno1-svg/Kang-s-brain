# Saju practical domain outlook — 2026-09-10

## Active requirement

`docs/PRD.md` continues to designate `docs/BUILD_SPEC.md` as the product authority. The user has additionally prioritized functional completeness over visual/design work. Saju remains a free deterministic cultural feature; payment activation is not part of this slice.

## Gap closed

The production Saju flow already calculated Four Pillars, Day Master/Five Elements, visible-stem Ten Gods and five annual symbolic outlooks, but the future section remained too abstract for a visitor asking what the reading means in daily life.

This slice keeps the calendar/Ten Gods math unchanged and adds a fixed interpretation layer for every annual Five Elements relation. Each of the five future years now exposes:

- work / direction;
- resources / money;
- relationships;
- energy / pace;
- a useful focus;
- a caution.

The rules are localized for all six P0 locales and are included in the local copy/download artifact. Financial language explicitly rejects treating symbolic readings as investment advice. Unknown birth time remains unguessed; optional name remains display-only; no birth input is persisted by this feature.

## Discovery decision

Fresh GitHub discovery found Saju/BaZi implementations and planning references that separate deterministic chart calculation from interpretation (including examples discussing Ten Gods). None justified replacing the existing tested engine or adding a runtime dependency for this bounded interpretation slice. Hugging Face model/dataset search was unavailable/disabled in the connected endpoint during this run. No model is needed because the requested output can be produced with deterministic local rules, which is cheaper, auditable and privacy-preserving.

## Architecture / boundaries

- No AI or OpenRouter call.
- No CMS dependency.
- No network request from the Saju experience.
- No changes to Stripe, credits, entitlements, accounts or merchant behavior; payment remains fail-closed.
- Existing deterministic pillar, Five Elements and Ten Gods code remains the source of calculated facts.
- Future prose is framed as symbolic cultural interpretation rather than probability or certainty.

## Release gate

This runtime-affecting change is not production-complete until the final public candidate SHA passes the private Korea Concierge MiniPC exact-SHA CI, the merged exact main SHA is reverified, deploy-ref is pinned to the green main SHA, MiniPC deployment/root-owned cutover/public probes pass, and the live Saju route is smoked against that deployed SHA.
