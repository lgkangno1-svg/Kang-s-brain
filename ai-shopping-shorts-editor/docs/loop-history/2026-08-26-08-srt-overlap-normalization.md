# Loop 08 — SRT overlap normalization

## Starting HEAD
`a97ff8aafddd198f240e80dfdc32809be59ddd15`

## Problem / evidence
The previous SRT continuity fix only closed positive gaps. Overlapping cues were left untouched. A sequence such as `0.2–2.0`, `1.5–3.0`, `3.2–4.0` could therefore produce overlapping beat program ranges and fail downstream EDL continuity validation. A cue fully contained inside the previous cue could also collapse into a zero/negative usable interval if naively clamped.

## Change
- Updated `src/core/beats.mjs` `closeSrtGaps()` to preserve SRT caption order while normalizing overlaps before beat splitting/merging.
- Partial overlap: move the current cue start to the previous cue end.
- Fully contained overlap: fold its caption text into the previous cue instead of creating an invalid-duration beat.
- Existing positive-gap behavior remains: extend the previous cue to the next cue start so the program timeline remains contiguous.
- Added regression coverage for both partial and fully-contained overlaps.

## Files changed
- `ai-shopping-shorts-editor/src/core/beats.mjs`
- `ai-shopping-shorts-editor/test/beats.test.mjs`
- `ai-shopping-shorts-editor/docs/LOOP_ENGINEERING.md`
- `ai-shopping-shorts-editor/docs/loop-history/2026-08-26-08-srt-overlap-normalization.md`

## Validation
Targeted isolated Node validation reproduced both normalization cases before committing:
- partial overlap normalized from `[0.2–2.0, 1.5–3.0, 3.2–4.0]` to contiguous `[0–2.0, 2.0–3.2, 3.2–4.0]` while preserving caption order;
- fully-contained cue `1.0–1.5` inside `0–2.0` was folded into the previous caption and no invalid interval was emitted.

GitHub Actions was not required. Full repository `npm run check` / FFmpeg demo was not claimed for this iteration because the available execution environment did not have a checked-out copy of this GitHub branch; only the directly affected deterministic logic was executed locally.

## Expected impact
- Prevents malformed or exporter-generated overlapping SRT cues from creating program overlaps in the EDL.
- Preserves caption text instead of silently dropping fully-contained cues.
- No additional OpenCode Go calls, tokens, cache entries, or FFmpeg work.

## Rollback
Revert commits for this iteration, primarily the `closeSrtGaps()` change and its two regression tests. The prior behavior only closed positive SRT gaps.

## Next best hypothesis
Audit SRT ordering and timestamp sanity beyond overlap handling: a later caption block whose entire timestamp range precedes the prior block may represent truly out-of-order SRT input. Determine whether preserving file order, stable timestamp sorting, or fail-fast diagnostics gives the safest user experience without silently reordering narration semantics.
