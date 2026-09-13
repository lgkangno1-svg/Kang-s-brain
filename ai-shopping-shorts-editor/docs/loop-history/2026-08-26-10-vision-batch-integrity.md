# Loop 10 — Vision batch response integrity

- Starting HEAD: `4b453ccfe4f85d18df3dd40a1ab60707f8bf9d13`
- Focus: semantic edit quality / paid Vision reliability

## Problem / evidence
`analyzeSegmentsVision()` previously accepted any JSON array from the Vision model, converted it to a map by `id`, and silently merged only matching rows back onto requested segments. If a paid batch response omitted an ID, duplicated an ID, returned an unknown ID, or emitted an object without an ID, the missing requested segment quietly retained its low-confidence local `Unanalyzed scene` metadata and still flowed into the Planner as if the Vision analysis had succeeded. That can degrade caption-to-visual matching after API cost has already been incurred and can also cache the mixed-quality result.

## Change
- Added `validateVisionBatchResponse(batch, parsed)` in `src/core/opencode.mjs`.
- A Vision batch is accepted only when every requested segment ID appears exactly once.
- Response row order may differ because matching is ID-based.
- Missing, duplicate, unexpected, or missing-ID rows fail fast with an explicit integrity diagnostic.
- `analyzeSegmentsVision()` now merges only a validated ID map; it no longer silently falls back per missing row.
- Added regression tests for valid reordered responses plus missing, duplicate, and unexpected IDs.

## Files changed
- `src/core/opencode.mjs`
- `test/opencode.test.mjs`
- `docs/LOOP_ENGINEERING.md`
- `docs/loop-history/2026-08-26-10-vision-batch-integrity.md`

## Validation performed
- Source-level review against PR #1 HEAD before patch confirmed the prior `Map(parsed.map(...))` plus `|| {}` behavior that silently tolerated missing analysis rows.
- Ran the exact new integrity predicate in local Node: reordered complete results were accepted; missing, duplicate, and unexpected-ID cases were all rejected. Result: PASS.
- Added repository Node regression tests covering the same cases.
- GitHub Actions was not required or used as a gate. Full repository checkout / FFmpeg E2E was not necessary for this change because no media, EDL, renderer, or FFmpeg path changed.

## Expected impact
- Prevents partial/ambiguous paid Vision output from being cached or passed to the Planner as successful semantic metadata.
- Improves semantic selection reliability and observability without adding retries, model calls, tokens, FFmpeg passes, or memory-significant work.
- Default `failOnAiError: true` now fails clearly; installations that explicitly opt into AI fallback still fall back at the existing pipeline boundary rather than silently mixing analyzed and unanalyzed rows inside one batch.

## Rollback
Revert the commits adding `validateVisionBatchResponse`, its regression tests, durable lesson, and this history record. No persisted project schema or media format changed.

## Next best hypothesis
Audit the Planner response with the same invariant mindset: require exactly one valid choice per beat before repair, and distinguish malformed/missing beat IDs from legitimate candidate repair so model protocol failures are observable without adding API retries.