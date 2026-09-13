# Loop 16 — Vision cache schema invalidation

## Starting HEAD
- `208f32595a8893626f87678e7f043095eb2062f0`
- PR #1 was open and mergeable at inspection time.

## Problem / evidence
The Vision response contract was recently tightened to validate semantic metadata fields, but `pipeline.mjs` still built the Vision cache fingerprint only from model/source hashes/analysis settings. Cache acceptance itself checked only array length and segment IDs. Therefore a cache produced under the older semantic contract could still be reused and bypass the newly strengthened Vision field validation.

## Change
- Added explicit `VISION_CACHE_SCHEMA = 2`.
- Added `makeVisionCacheFingerprint(...)` so the schema version participates in the SHA-256 cache fingerprint.
- `runProject()` now uses this versioned fingerprint.
- Added a regression test proving identical inputs are stable within one schema and differ across schema versions.

## Files changed
- `src/core/pipeline.mjs`
- `test/pipeline.test.mjs`
- `docs/LOOP_ENGINEERING.md`
- `docs/loop-history/2026-08-26-16-vision-cache-schema.md`

## Validation
- GitHub Actions was not required or used as a completion gate.
- Local runtime has Node `v22.16.0`.
- Repository clone/full `npm run check` and FFmpeg demo could not be run because the execution container still cannot resolve `github.com` DNS.
- A standalone Node reproduction of the exact fingerprint helper passed `node --check` and runtime assertions: schema 2 fingerprint `88b206ff61987f4d21cf` differs from schema 1 fingerprint `7c6fcf6bf5b2e79ed6ac`, while repeated schema 2 calls are deterministic.

## Expected quality / cost impact
- Prevents stale pre-contract Vision metadata from silently entering Planner input.
- Forces a one-time Vision re-analysis only when the cache contract version changes; normal same-schema cache hits remain unchanged.
- No additional API calls on ordinary repeated runs and no FFmpeg/runtime cost change outside a deliberate schema migration.

## Rollback
Revert the commits from this iteration. Doing so would restore the old cache key and allow older same-source/settings cache files to be reused again.

## Next best hypothesis
After schema invalidation, consider validating cache payload contents on every cache hit as defense against manual/corrupt cache files created under the current schema, while avoiding unnecessary API retries.