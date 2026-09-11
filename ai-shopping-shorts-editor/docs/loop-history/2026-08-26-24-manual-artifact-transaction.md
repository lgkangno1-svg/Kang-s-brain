# 2026-08-26 — Manual replacement artifact transaction

## Starting HEAD
`d3e74a6f91a2c76de15a8370bdb38d6b43b9a685`

## Problem / evidence
Manual replacement already rendered the candidate video to a staging MP4, but the final publish step updated `shorts.mp4`, `edl.json`, and `qa.json` one after another. If the MP4 rename succeeded and a later JSON write failed, disk state could become inconsistent: the visible video would contain the new cut while EDL/QA still described the previous version (or vice versa).

## Change
- Added `src/core/artifact-commit.mjs` with a rollback-safe commit helper.
- Stage the new EDL and QA JSON before touching final artifacts.
- Copy the current video/EDL/QA to same-directory backup files.
- Publish staged video, EDL, and QA as one commit sequence.
- If any later rename fails, remove any newly committed files and restore all available backups.
- Clean staged/backup files in both success and failure paths.
- Wired `replaceClipAndRerender()` to use the helper after the candidate render and QA calculation.

## Files changed
- `src/core/artifact-commit.mjs`
- `src/core/pipeline.mjs`
- `test/artifact-commit.test.mjs`
- `docs/loop-history/2026-08-26-24-manual-artifact-transaction.md`
- `docs/LOOP_ENGINEERING.md`

## Validation
A targeted Node 22-style isolated regression harness reproduced the repository helper contract and passed both tests:

1. Injected failure on the second final rename (`edl.json`) after `shorts.mp4` had already been replaced.
   - prior `shorts.mp4` restored
   - prior `edl.json` restored
   - prior `qa.json` restored
   - no `.tmp` / `.bak` files left behind
2. Success path published the staged video plus matching new EDL and QA and removed temporary files.

`node --check` for the new helper passed. Full repository `npm run check` / FFmpeg demo were not run in this execution environment; GitHub Actions availability is not treated as a blocker.

## Expected impact
No OpenCode Go calls, tokens, or render work are added. The change only adds small local file copies during manual replacement finalization. In exchange, a late disk/filesystem error no longer leaves the review UI, EDL, QA, and rendered video describing different cut versions.

## Rollback
Revert the commits that add `artifact-commit.mjs` and restore the previous three-step finalization in `replaceClipAndRerender()`.

## Next hypothesis
Check whether the full automatic `runProject()` path still writes `edl.json` before final FFmpeg rendering. If a failed initial render can leave an EDL that appears complete while no valid `shorts.mp4` exists, consider applying the same staged-artifact principle to first-run output without broadening scope.
