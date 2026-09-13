# Loop 23 — Stage manual rerender before committing state

## Starting HEAD
- `9ee318d88ae1aa7045b7501335369dd28e9854ad`

## Problem / evidence
`replaceClipAndRerender()` previously wrote the replacement `work/edl.json` before invoking FFmpeg, and rendered directly to `output/shorts.mp4`. If FFmpeg failed, the persisted EDL could describe the replacement clip while the usable video still represented the previous edit; direct rendering could also damage the last known-good MP4.

## Change
- Added a same-format staged output path such as `.shorts.<nonce>.tmp.mp4`.
- Manual replacement now validates the candidate EDL before rendering.
- FFmpeg renders the replacement to the staged MP4 rather than overwriting `shorts.mp4` directly.
- A failed render removes the staged file and leaves the previous final MP4 untouched.
- `edl.json` and `qa.json` are not updated until replacement rendering has succeeded.

## Files changed
- `src/core/pipeline.mjs`
- `test/pipeline.test.mjs`
- `docs/LOOP_ENGINEERING.md`
- `docs/loop-history/2026-08-26-23-manual-rerender-staging.md`

## Validation
- Added regression coverage for staged-path format and render failure behavior.
- Isolated Node regression executed in the available runtime: a fake renderer wrote a partial staged MP4 and threw a synthetic FFmpeg error; the previous `shorts.mp4` remained byte-for-byte unchanged and the staged file was removed. Result: PASS.
- GitHub Actions was not required for this change.
- Full repository `npm run check` / synthetic FFmpeg demo were not executed from the connector-backed source tree in this runtime, so they remain additional evidence for the Mini PC self-hosted runner when available.

## Expected impact
- Prevents a common review-state corruption mode after a failed manual rerender.
- Preserves the last known-good preview video when FFmpeg fails.
- No additional OpenCode Go calls or token cost.
- One temporary MP4 exists only during a manual rerender and is cleaned on failure.

## Rollback
Revert the commits from this loop; the previous behavior wrote `edl.json` first and rendered directly to `output/shorts.mp4`.

## Next hypothesis
The remaining multi-file commit window after a successful staged render can still theoretically leave `shorts.mp4`, `edl.json`, and `qa.json` partially updated if a filesystem write/rename fails during the final commit. Evaluate whether a small backup/rollback transaction is justified without adding excessive complexity.