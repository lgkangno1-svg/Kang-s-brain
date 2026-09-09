# Hanbok rental server-content audit — 2026-09-10

## Requirement source

`docs/PRD.md` continues to designate `docs/BUILD_SPEC.md` as the active product specification. This slice also follows `HEADLESS_CMS_PERFORMANCE_2026-09-10.md`, which explicitly schedules Hanbok rental content as the next isolated server-first migration after food/cafe content.

## Gap closed

Before this slice, `HanbokRentalFinder` imported the complete source-checked rental-shop payload directly into a Client Component. That coupled editorial travel facts to the browser module graph and prevented the existing server-only content adapter from owning rental freshness/fallback behavior.

The candidate now:
- resolves Gyeongbokgung Hanbok rental records in the `/[locale]/hanbok` Server Component;
- passes serializable shop records to the interactive finder;
- keeps date/time availability, language filtering, favorites, map handoff and address copy deterministic in the browser;
- validates remote records including `sourceUrl`, `checkedAt`, schedule confidence and language-support fields;
- rejects malformed or partially invalid remote datasets and falls back to the verified local catalog;
- uses the existing six-hour Next.js server cache and a dedicated allowlisted revalidation tag;
- revalidates browser-saved shop IDs against the currently resolved server catalog, so removed/unknown records do not survive as authoritative favorites;
- keeps `KOREA_CONTENT_SOURCE=local` as the production-safe default. No Sanity account, token, new dependency or model is required.

## Discovery decision

The existing Sanity/Next.js discovery was rechecked for this continuation. The maintained official `next-sanity` ecosystem remains useful as a reference, but adding it or live subscriptions does not beat the current server `fetch` adapter on bundle size, privacy, request volume or maintenance for this small dataset. No Hugging Face model/dataset provides value for deterministic content retrieval, schema validation or caching, so no ML dependency was adopted.

## Safety boundaries

No payment, Stripe, credit-purchase, entitlement, user-account or photo-processing behavior changes. The deterministic Hanbok ranking engine remains application code and is not moved into the CMS.

## Verification status

This document records the candidate design only. Promotion requires the exact 40-character candidate SHA to pass the private MiniPC CI gate, followed by exact merged-SHA CI, deployment and public live smoke verification. Until those gates succeed, this is not a production-completion claim.
