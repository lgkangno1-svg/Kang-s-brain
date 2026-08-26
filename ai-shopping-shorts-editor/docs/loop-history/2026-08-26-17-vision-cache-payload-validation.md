# Loop 17 — Vision cache payload validation

## Starting HEAD
`87fc616e4fdbb0dc088502486018ed626eac29f9`

## Problem / evidence
The Vision cache fingerprint now includes a semantic schema version, but a matching cache file was still accepted using only array length plus `ids.has(s.id)`. That allowed two unsafe cases:

- duplicate cached IDs could keep the same array length while hiding a missing segment ID;
- a cache file with valid IDs but malformed semantic fields could bypass the stricter live Vision response contract introduced in the previous loops.

A corrupted cache could therefore feed stale or malformed semantic evidence into the Planner without a fresh Vision call.

## Change
- Imported the existing `validateVisionBatchResponse` contract into `pipeline.mjs`.
- Added `isVisionCachePayloadValid(allSegments, cached)`.
- Cache hits now reuse exactly the same segment-ID and semantic-field integrity checks as live Vision responses.
- Invalid/missing/corrupt cache payloads are treated as cache misses and follow the existing Vision analysis path.
- Added regression tests for a valid cache, duplicate IDs hiding a missing segment, and malformed semantic fields.

## Files changed
- `src/core/pipeline.mjs`
- `test/pipeline.test.mjs`
- `docs/LOOP_ENGINEERING.md`
- `docs/loop-history/2026-08-26-17-vision-cache-payload-validation.md`

## Validation
The execution container still cannot resolve `github.com`, so a fresh repository clone and full `npm run check` / FFmpeg demo could not be executed. GitHub Actions was not treated as required evidence.

A standalone Node assertion using the exact cache-validation structure was executed successfully:
- complete valid cache => accepted;
- duplicate `s1,s1` for expected `s1,s2` => rejected;
- valid ID with malformed `actions` field => rejected.

Result: `standalone cache validator assertions: PASS`.

The committed regression tests exercise the exported helper against the repository's existing `validateVisionBatchResponse` implementation when the full suite runs in an environment with the checkout available.

## Expected quality / cost impact
- Prevents malformed cached semantic metadata from silently influencing scene-to-caption matching.
- Prevents duplicate cached IDs from hiding an unanalysed segment.
- No additional API cost for normal valid cache hits.
- Invalid cache files intentionally trigger a fresh Vision analysis instead of consuming potentially corrupt cached evidence; this can add a Vision call only when the cache is unusable.

## Rollback
Revert the commits that add `isVisionCachePayloadValid`, its tests, this durable lesson, and this loop record. The previous behavior will again accept caches using only length and ID membership.

## Next best hypothesis
Inspect whether invalid Vision cache files should be quarantined or deleted after validation failure so repeated runs do not repeatedly parse the same corrupt file before reanalysis, while ensuring a failed Vision API call never destroys the last potentially recoverable cache artifact.