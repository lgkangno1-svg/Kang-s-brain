# Loop 18 — Atomic JSON persistence

## Starting HEAD
`a3f085c47f595fd9f80162800b316b0a26859526`

## Problem / evidence
Vision cache validation now rejects malformed payloads, but all JSON state was still persisted by writing directly to the destination path. If the process exits or serialization/storage fails during replacement, a previously valid Vision cache (or EDL/QA state) can be truncated or replaced by partial data. On the next run `readJson()` safely falls back, but the valid cache is already lost and Vision may need to be paid for again.

A proposed invalid-cache quarantine was not implemented because invalid caches are already overwritten after a successful fresh Vision analysis, so quarantine would add complexity without materially reducing calls. Protecting the last valid cache at write time is the higher-value failure prevention.

## Files changed
- `src/core/utils.mjs`
  - `writeJson()` now writes to a unique temporary file in the same directory and replaces the destination with `fs.rename()` only after the temporary JSON is complete.
  - cleanup in `finally` removes a leftover temp file without masking the original error.
- `test/utils.test.mjs`
  - regression test verifies that a failed replacement serialization preserves the previous JSON file and leaves no temp file behind.
- `docs/LOOP_ENGINEERING.md`
  - durable lesson added for atomic persistence of reusable JSON state.

## Validation performed
- Isolated Node runtime validation: PASS.
  - wrote `{ version: 1, stable: true }` successfully;
  - attempted replacement containing `1n`, which intentionally makes `JSON.stringify` fail;
  - confirmed the previous `state.json` remained unchanged;
  - confirmed the temporary directory contained only `state.json` after cleanup.
- GitHub Actions was not required or used as a release gate.
- Full repository `npm run check` / FFmpeg demo was not rerun in this execution environment; the change is deliberately limited to the JSON persistence primitive and has a focused regression test.

## Expected quality / cost impact
- No additional OpenCode Go calls or tokens on successful runs.
- Reduces the chance that an interrupted cache/state write destroys the last valid Vision cache and forces a paid re-analysis on the next run.
- Also protects `beats.json`, `segments.json`, `edl.json`, and `qa.json` from direct in-place truncation because they use the same helper.

## Trade-off
Each JSON save performs one additional same-directory rename and may briefly create one temporary file. This is negligible compared with media analysis/rendering and preserves same-filesystem rename semantics.

## Rollback
Revert the `writeJson()` implementation to direct `fs.writeFile(filePath, JSON.stringify(...))`, remove the atomic-write regression test, and remove the corresponding durable lesson.

## Next best hypothesis
Inspect concurrent or duplicate project runs that may target the same project directory. Atomic single-file replacement prevents torn JSON but does not by itself prevent two simultaneous runs from racing to overwrite valid state; only add locking if the server/UI can actually launch overlapping writes to one project.