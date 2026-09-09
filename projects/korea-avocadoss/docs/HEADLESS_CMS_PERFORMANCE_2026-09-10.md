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

The first migration moves Gyeongbokgung food/cafe records behind a Server Component content adapter:

1. `FoodPage` resolves content on the server.
2. `FoodFinder` receives only serializable records as props and keeps filtering/favorites/map handoff in the browser.
3. Local verified records remain the default source and fail-safe fallback.
4. An optional Sanity adapter can read published records without adding a client CMS dependency.
5. Remote records are runtime-validated; malformed, partial, empty, or failed CMS responses fall back to local verified records.
6. CMS reads use Next.js server fetch caching and do not refetch per visitor.
7. A secured, allowlisted tag-revalidation endpoint supports immediate publish invalidation later.

## Cache policy

Current first-slice policy:
- `revalidate: 21600` (6 hours)
- content tag: `content:travel:gyeongbokgung-food`
- CMS publish webhook can call the secured tag endpoint
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
- Rejected for the first performance slice.

### Git-only content
- Cheap and fast but does not give a true editorial CMS workflow and still couples most edits to repository operations.
- Useful as fallback/source control, not the final editor experience.

## Hugging Face review

A runtime ML model is not useful for CMS retrieval/caching. The connected Hugging Face model-search endpoint was unavailable during this slice; no model was adopted. Adding embeddings, translation models or generated summaries to the request path would increase latency/cost without improving the core content-delivery problem.

## Security

- CMS read token is server-only.
- Revalidation secret is server-only.
- no `NEXT_PUBLIC_*` secret fields.
- webhook can invalidate only known content tags.
- remote records must include source URL and `checkedAt` provenance and pass schema validation.
- CMS failure never removes all visitor content.

## Deployment behavior before a CMS account exists

Production remains:

`KOREA_CONTENT_SOURCE=local`

So this migration is safe to deploy now and does **not** require a Sanity account. It already improves architecture by keeping Food content out of the client module and resolving it in the Server Component.

When a dedicated Korea Concierge Sanity project is available, set the server environment values and populate the validated schema; the frontend does not need to be rewritten.

## Next migration slices

Do these independently with exact-SHA CI after each slice:
1. Hanbok rental shop content → server content props.
2. Nearby Explorer place content → server content props while preserving zero-API route calculation.
3. Public travel/culture editorial content.
4. Evaluate Cache Components / partial prefetching only with rendered performance evidence.

Do not migrate deterministic calculators or security-sensitive state into the CMS.

## Measurement

Do not claim a fixed speed percentage from this refactor. After production rollout compare:
- route client JS payload for `/en/explore/food`
- TTFB and LCP on cached requests
- RSC/navigation behavior
- CMS request count once enabled
- cache hit/revalidation frequency
- failure/fallback rate

The target is lower browser work and independent content freshness without introducing a per-request CMS dependency.
