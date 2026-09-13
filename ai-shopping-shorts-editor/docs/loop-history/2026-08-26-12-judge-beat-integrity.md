# Loop 12 — Quality Judge beat integrity

## Starting HEAD
`48289634c21a59515afc5cae7e9448249fa48efe`

## Problem / evidence
`judgeSelectionsVision()` previously accepted any parsed JSON array and appended it to the result set. A model response could therefore omit a requested beat, duplicate a beat, or return an unexpected beat ID. Downstream code converts judgments into a `Map`, so duplicates are silently overwritten and missing beats simply receive no judge score. That makes a paid Quality-mode protocol failure look like a valid partial review.

## Change
- Added `validateJudgeResponse(items, parsed)` in `src/core/opencode.mjs`.
- Require every requested `beatId` exactly once per Judge batch.
- Reject malformed, missing, duplicate, or unexpected beat coverage before partial judgments enter the EDL review path.
- Added `test/judge-integrity.test.mjs` regression coverage.
- Added the invariant to `docs/LOOP_ENGINEERING.md`.

## Validation
- Targeted standalone Node check of the exact validator logic: PASS for reordered complete responses; PASS-by-rejection for missing, duplicate, unexpected, and malformed responses.
- Source-level verification confirms `judgeSelectionsVision()` now calls the validator before appending batch results.
- Full repository `npm run check` / FFmpeg demo could not be run because the available execution container cannot resolve `github.com`, so the branch cannot be cloned into that environment. GitHub Actions status was intentionally not treated as a blocker.

## Expected impact
Improves Quality-mode semantic review reliability without adding any OpenCode Go calls or tokens. Invalid paid Judge responses are no longer silently mixed into otherwise valid EDL state.

## Rollback
Revert commits from this loop starting with `5e17143017787dbc22d19a042b11152938aad77e` if the stricter protocol check proves incompatible with the provider response contract.

## Next best hypothesis
Validate numerical Judge fields (`score`) before using them for replacement decisions, so NaN/out-of-range values cannot silently bypass the threshold or corrupt review telemetry.
