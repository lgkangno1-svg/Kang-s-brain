# Loop 11 — Planner beat integrity

## Starting HEAD
`581dde2e9602e38ae3060d7258241d1433a9a541`

## Problem / evidence
`planTimelineAI()` asks the model to return exactly one choice per narration beat, but the returned JSON was previously passed directly to `repairChoices()`. `repairChoices()` builds a `Map` keyed by `beatId`, so duplicate beat IDs silently overwrite an earlier choice, missing beat IDs are silently filled by deterministic repair, and unexpected beat IDs are ignored. This makes an AI protocol failure look like a normal repairable edit decision after a paid Planner call.

## Change
- Added `validatePlannerResponse(beats, parsed)` in `src/core/opencode.mjs`.
- The validator requires a `choices` array containing every requested `beatId` exactly once and rejects missing, duplicate, unexpected, or missing-ID choices.
- `planTimelineAI()` now validates the parsed model response before returning it.
- Deliberately kept segment-duration, duplicate-segment, sourceStart, and source-diversity correction in the existing deterministic `repairChoices()` path. This separates response-protocol integrity from normal edit auto-repair.
- Added regression coverage in `test/opencode.test.mjs` for reordered valid choices plus missing, duplicate, unexpected, and malformed responses.

## Validation
- Repository clone / full `npm run check` / FFmpeg demo could not be run in this execution environment because direct `github.com` DNS resolution fails.
- Performed isolated Node validation of the exact planner-integrity algorithm: reordered valid choices PASS; missing beat rejected; duplicate beat rejected; unexpected beat rejected.
- Re-fetched the updated branch file through the GitHub connector and confirmed `planTimelineAI()` calls `validatePlannerResponse()`.
- No GitHub Actions result was required.

## Expected impact
More trustworthy semantic-edit planning: paid Planner responses that violate the requested beat cardinality can no longer be silently normalized into apparently valid plans. No additional OpenCode calls, tokens, or FFmpeg work are introduced.

## Rollback
Revert the commits associated with this loop, or remove `validatePlannerResponse()` and restore `return extractJson(raw)` in `planTimelineAI()` together with its regression tests and durable lesson.

## Next best hypothesis
The Quality Vision Judge currently accepts arbitrary/missing/duplicate `beatId` rows across batches and then maps them by ID. Apply the same batch-response integrity principle there only if inspection confirms malformed Judge responses can silently skip or overwrite paid judgments.
