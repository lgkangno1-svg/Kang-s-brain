# Loop 22 — Manual replacement alternatives refresh

## Starting HEAD
`0a933ebc121ca237f5f1dd9838bc143c4f56cb58`

## Problem / evidence
The Quality Judge replacement path already refreshed `clip.alternatives` after changing the current segment, but `replaceClipAndRerender()` did not. After a user manually selected an alternative, the newly selected segment could remain in the alternatives list while the previous current segment was lost. That made subsequent review actions confusing: the UI could offer the current clip as a no-op replacement and provide no immediate rollback choice.

## Files changed
- `src/core/pipeline.mjs`
  - import the existing `alternativesAfterReplacement()` invariant helper
  - add `refreshManualReplacementAlternatives()`
  - capture the previous segment before manual mutation and refresh alternatives before persisting the EDL
- `test/pipeline.test.mjs`
  - add regression coverage for current-segment exclusion, previous-segment rollback preservation, and duplicate removal
- `docs/LOOP_ENGINEERING.md`
  - record the durable review-state invariant

## Validation performed
- Source-level inspection confirmed the Judge path already applies this invariant while the manual path did not.
- Isolated Node assertion reproduced the intended transition:
  - old alternatives: `s2, s3, s2, s4`
  - previous current: `s1`
  - new current: `s2`
  - resulting alternatives: `s1, s3, s4`
- Isolated regression assertion passed.
- Full repository `npm run check` and synthetic FFmpeg E2E could not be executed from the current container because `github.com` DNS resolution remains unavailable. GitHub Actions status was not treated as a blocker.

## Expected quality / cost impact
- Review UX: removes a no-op current-segment option after manual replacement and restores the immediately previous clip as the first rollback candidate.
- Consistency: Judge-driven and human-driven replacements now maintain the same review-state invariant.
- API cost: no additional Vision, Planner, or Judge calls.
- Render cost: unchanged for successful manual replacements.

## Rollback
Revert the commits that add `refreshManualReplacementAlternatives()` and its regression test. No data migration or cache invalidation is required.

## Next best hypothesis
Inspect whether manual replacement failure after EDL persistence (for example an FFmpeg/probe failure) can leave `edl.json` pointing at a replacement that never produced a valid output video. If so, stage the edited EDL in memory and only persist it after successful render/validation, or preserve the last-known-good EDL for rollback.