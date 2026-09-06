# Loop 09 — SRT timeline ordering

- Starting HEAD: `a07d1a0aa2729d1a36283dbb195e24798d33c389`
- Focus: cut timing / continuity

## Problem / evidence
`closeSrtGaps()` previously processed parsed SRT cues in file/block order. SRT files can be re-exported or manually edited with cue blocks out of timestamp order. In that case a later timestamp appearing first can cause a valid earlier cue to be treated as an overlap and folded into the wrong beat, changing caption semantics and producing the wrong edit order.

## Change
- Sort a cloned cue list by `start` ascending before gap/overlap normalization.
- For equal starts, process the longer cue first (`end` descending) so shorter overlay cues are deterministically folded into the containing cue instead of creating an artificial split.
- Add a regression test with cues stored in `3, 1, 2` block order and assert the resulting beat text and timing are `1, 2, 3` in timeline order.

## Files changed
- `src/core/beats.mjs`
- `test/beats.test.mjs`
- `docs/LOOP_ENGINEERING.md`
- `docs/loop-history/2026-08-26-09-srt-timeline-order.md`

## Validation
- Source-level review of the modified normalization path.
- Isolated Node validation using the exact sorting/gap-normalization logic: PASS for out-of-order cues, producing `[0–1, 1–2, 2–3]` with text order `첫 장면 → 두 번째 장면 → 세 번째 장면`.
- GitHub Actions was not required or used as a gate.
- Full repository `npm run check` / FFmpeg synthetic demo was not rerun in this execution environment; the change is deliberately limited to deterministic cue ordering and its regression test.

## Expected impact
- Prevents valid captions from being merged into the wrong beat when SRT block order is malformed.
- Preserves semantic narration order and EDL continuity without additional OpenCode calls, tokens, FFmpeg passes, or runtime-significant cost (sorting is `O(n log n)` over the small caption list).

## Rollback
Revert the commits that modify `closeSrtGaps()` ordering and the associated regression/doc changes. No data migration or persisted workspace format change is involved.

## Next best hypothesis
Audit malformed SRT parsing boundaries (for example unusual timestamp metadata after the end time) only if a concrete parser failure can be reproduced; otherwise prioritize semantic scene-selection quality rather than adding more defensive parsing complexity.
