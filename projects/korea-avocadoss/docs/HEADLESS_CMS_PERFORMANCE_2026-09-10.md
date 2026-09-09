# Next.js + Headless Content Architecture — 2026-09-10

## Decision

Adopt a **server-first, CMS-optional content layer** for frequently changing public content. Do not move deterministic product engines into a CMS.

### CMS-suitable domains
- restaurants / cafes
- Hanbok rental shops
- nearby attractions and walking stops
- editorial travel/culture guides
- localized public explanatory copy that changes independently of application logic

### Keep in application code
- Personal Color browser-local analysis
- Hanbok deterministic ranking logic
- Saju deterministic calendar/pillar calculation
- Naming Studio deterministic ranking
- Quick Help decision logic where zero-API behavior is required
- Nearby itinerary budgeting, date/time closure evaluation and map handoff
- payment/security/credit authorization logic

## Why this architecture

Frequently changing travel records should not be owned by Client Components. The isolated migrations now cover Gyeongbokgung food/cafe records, Hanbok rental shops and Nearby Explorer stops:

1. Server Components resolve public travel content through `src/lib/content/travel-content.ts`.
2. Interactive Client Components receive only serializable source-checked records as props.
3. Local verified records remain the default source and fail-safe fallback.
4. An optional Sanity adapter can read published records without adding a client CMS dependency.
5. Remote records are runtime-validated; malformed, partial, empty, or failed CMS responses fall back to local verified records.
6. CMS reads use Next.js server fetch caching and do not refetch per visitor.
7. A secured, allowlisted tag-revalidation endpoint supports immediate publish invalidation later.
8. Deterministic visitor logic remains application code: filtering/favorites for food/rental, and route budgeting/date-time availability/map/copy behavior for Nearby.
9. Nearby route calculation accepts the server-resolved stop catalog as input and safely skips unknown/missing IDs instead of treating CMS content as executable logic.

## Cache policy

Current policy:
- `revalidate: 21600` (6 hours)
- food content tag: `content:travel:gyeongbokgung-food`
- rental content tag: `content:travel:gyeongbokgung-hanbok-rentals`
- Nearby content tag: `content:travel:gyeongbokgung-nearby`
- CMS publish webhook can call the secured tag endpoint for an allowlisted domain
- local verified fallback is always available

This is intentionally conservative. Travel facts can change, but they do not need a live subscription for every visitor. The cache interval can be tuned from production freshness and request-volume data.

## Sanity decision

**ADAPT, not full dependency adoption yet.**

Fresh GitHub discovery on 2026-09-10 again surfaced `sanity-io/next-sanity` as the maintained official integration. The existing direct Sanity Content Lake HTTP adapter through Next.js server `fetch` remains the better current fit because the dataset is small and this avoids another runtime dependency, live-prefetch behavior and unnecessary request complexity.

Do not add `SanityLive` by default. If visual editing or draft preview becomes operationally important later, reassess the then-current `next-sanity` v13+ and Next.js Cache Components guidance before adoption.

## Other CMS candidates

### Payload CMS
- Maintained and powerful, but would add an application/database/admin runtime we do not currently need.
- Rejected for this phase because the MiniPC would own more stateful infrastructure and backups.

### Self-hosted Strapi-style CMS
- Similar operational cost: another service, database lifecycle, security patching, backups and admin surface.
- Rejected for the current performance/content slices.

### Git-only content
- Cheap and fast but does not give a true editorial CMS workflow and still couples most edits to repository operations.
- Useful as fallback/source control, not the final editor experience.

## Hugging Face review

A fresh Hugging Face model-search attempt for multilingual travel-itinerary recommendation returned a connector `tool not found` error in this slice. This is recorded as an unavailable discovery endpoint, not as evidence that no models exist. No ML model is needed for the actual engineering problem: public-record delivery, schema validation, caching, deterministic time-window filtering and map handoff are more reliable, private and cheaper as code plus curated data.

**Decision:** adopt no model, dataset or Space. Re-run discovery if a future PRD requirement genuinely needs inference rather than deterministic planning.

## Security

- CMS read token is server-only.
- Revalidation secret is server-only.
- no `NEXT_PUBLIC_*` secret fields.
- webhook can invalidate only known content tags.
- remote records must include source URL and `checkedAt` provenance and pass schema validation.
- partial-invalid remote datasets fail closed instead of silently mixing unverified records.
- CMS failure never removes all visitor content.
- deterministic routing, Hanbok ranking, payment and other security-sensitive logic remain outside the CMS.

## Deployment behavior before a CMS account exists

Production remains:

`KOREA_CONTENT_SOURCE=local`

So these migrations are safe to deploy without a Sanity account. They establish a server content boundary while the verified local dataset remains authoritative. No production speed percentage is claimed from architecture alone.

When a dedicated Korea Concierge Sanity project is available, set the server environment values and populate the validated schemas; the frontend does not need to be rewritten.

## Migration progress

Completed as isolated slices:
1. Gyeongbokgung food/cafe content → server content props.
2. Hanbok rental-shop content → server content props with validated favorite recovery.
3. Nearby Explorer stop content → server content props while preserving zero-API deterministic routing/date-time logic.

Next independent slices:
1. Public travel/culture editorial content where an editorial update cadence justifies the boundary.
2. Evaluate Cache Components / partial prefetching only with rendered performance evidence.

Do not migrate deterministic calculators or security-sensitive state into the CMS.

## Measurement

Do not claim a fixed speed percentage from these refactors. After production rollout compare:
- route client JS payload for `/en/explore/food`, `/en/hanbok` and `/en/explore/nearby`
- TTFB and LCP on cached requests
- RSC/navigation behavior
- CMS request count once enabled
- cache hit/revalidation frequency
- failure/fallback rate

The target is lower browser-owned content coupling and independent content freshness without introducing a per-request CMS dependency.
