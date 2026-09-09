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
- payment/security/credit authorization logic

## Why this architecture

The existing travel records were imported from TypeScript modules directly by client components. That couples public content updates to application deploys and can put static content into the client JavaScript graph.

The first migration moved Gyeongbokgung food/cafe records behind a Server Component content adapter. The second isolated migration applies the same boundary to source-checked Hanbok rental-shop records:

1. `FoodPage` and the Hanbok page resolve their public travel content on the server.
2. `FoodFinder` and `HanbokRentalFinder` receive only serializable records as props and keep filtering/favorites/map handoff in the browser.
3. Local verified records remain the default source and fail-safe fallback.
4. An optional Sanity adapter can read published records without adding a client CMS dependency.
5. Remote records are runtime-validated; malformed, partial, empty, or failed CMS responses fall back to local verified records.
6. CMS reads use Next.js server fetch caching and do not refetch per visitor.
7. A secured, allowlisted tag-revalidation endpoint supports immediate publish invalidation later.
8. Browser-saved rental IDs are validated against the current server-resolved catalog so removed or malformed records do not remain authoritative favorites.

## Cache policy

Current policy:
- `revalidate: 21600` (6 hours)
- food content tag: `content:travel:gyeongbokgung-food`
- rental content tag: `content:travel:gyeongbokgung-hanbok-rentals`
- CMS publish webhook can call the secured tag endpoint for either allowlisted domain
- local verified fallback is always available

This is intentionally conservative. Travel facts can change, but they do not need a live subscription for every visitor. The cache interval can be tuned from production freshness and request-volume data.

## Sanity decision

**ADAPT, not full dependency adoption yet.**

Reviewed:
- `sanity-io/next-sanity` — official maintained integration
- official Sanity Next.js caching/revalidation guidance
- official Sanity warning about Next.js 16 + older `next-sanity` Live setups increasing request/ISR volume

Current implementation uses the Sanity Content Lake HTTP endpoint through Next.js server `fetch` instead of adding `next-sanity` or `SanityLive`. This minimizes dependencies and avoids live-prefetch request amplification while the content volume is small.

If visual editing or draft preview becomes operationally important later, reassess current `next-sanity` v13+ and Cache Components support before adoption.

## Other CMS candidates

### Payload CMS
- Maintained and powerful, but would add an application/database/admin runtime we do not currently need.
- Rejected for this phase because the MiniPC would own more stateful infrastructure and backups.

### Self-hosted Strapi-style CMS
- Similar operational cost: another service, database lifecycle, security patching, backups and admin surface.
- Rejected for the first performance slices.

### Git-only content
- Cheap and fast but does not give a true editorial CMS workflow and still couples most edits to repository operations.
- Useful as fallback/source control, not the final editor experience.

## Hugging Face review

A runtime ML model is not useful for CMS retrieval/caching. The connected Hugging Face model-search endpoint was unavailable during the first slice; a fresh search for this rental continuation also did not surface a model, dataset or Space that improves deterministic retrieval/schema validation. No model was adopted. Adding embeddings, translation models or generated summaries to the request path would increase latency/cost without improving the core content-delivery problem.

## Security

- CMS read token is server-only.
- Revalidation secret is server-only.
- no `NEXT_PUBLIC_*` secret fields.
- webhook can invalidate only known content tags.
- remote records must include source URL and `checkedAt` provenance and pass schema validation.
- partial-invalid remote datasets fail closed instead of silently mixing unverified records.
- CMS failure never removes all visitor content.
- deterministic Hanbok ranking, payment and other security-sensitive logic remain outside the CMS.

## Deployment behavior before a CMS account exists

Production remains:

`KOREA_CONTENT_SOURCE=local`

So these migrations are safe to deploy without a Sanity account. They create the server content boundary while the verified local dataset remains authoritative. No production speed percentage is claimed from architecture alone.

When a dedicated Korea Concierge Sanity project is available, set the server environment values and populate the validated schemas; the frontend does not need to be rewritten.

## Migration progress

Completed as isolated slices:
1. Gyeongbokgung food/cafe content → server content props.
2. Hanbok rental-shop content → server content props with validated favorite recovery.

Next independent slices:
1. Nearby Explorer place content → server content props while preserving zero-API route calculation.
2. Public travel/culture editorial content.
3. Evaluate Cache Components / partial prefetching only with rendered performance evidence.

Do not migrate deterministic calculators or security-sensitive state into the CMS.

## Measurement

Do not claim a fixed speed percentage from this refactor. After production rollout compare:
- route client JS payload for `/en/explore/food` and `/en/hanbok`
- TTFB and LCP on cached requests
- RSC/navigation behavior
- CMS request count once enabled
- cache hit/revalidation frequency
- failure/fallback rate

The target is lower browser work and independent content freshness without introducing a per-request CMS dependency.
