# Loop 31 — Transactional automatic run artifact publish

## Starting HEAD

`97df9ab41fe07b8a9fa8bf6d60cf2fa445632717`

## Problem / evidence

The automatic `runProject()` path did not have the durability guarantee already added to manual replacement. It wrote `work/beats.json`, `work/segments.json`, and `work/edl.json` before rendering, then rendered FFmpeg directly into the final `output/shorts.mp4`, and only afterward wrote `output/qa.json`.

Therefore a failed/interrupted automatic rerun could leave a mixed generation on disk: new work JSON with an old or partially overwritten MP4 and old QA. The read/review endpoints and later manual replacement could then consume artifacts that did not describe the same cut version.

## Change

- Generalized the existing replacement artifact transaction internals in `src/core/artifact-commit.mjs`.
- Added `commitRunArtifacts()` for the automatic run artifact set.
- Automatic run no longer publishes `beats.json`, `segments.json`, or `edl.json` before rendering.
- FFmpeg renders to a hidden staged MP4 path instead of directly overwriting `output/shorts.mp4`.
- After render + QA calculation succeed, the following five artifacts are staged/backed up/committed as one rollback-aware set:
  - `output/shorts.mp4`
  - `work/beats.json`
  - `work/segments.json`
  - `work/edl.json`
  - `output/qa.json`
- If any later rename fails, already committed new files are removed and all prior files with backups are restored.
- Temporary and backup files are cleaned best-effort.
- Vision cache remains independently reusable; it is not part of the user-visible cut-version transaction.

## Files changed

- `src/core/artifact-commit.mjs`
- `src/core/pipeline.mjs`
- `test/artifact-commit.test.mjs`
- `docs/LOOP_ENGINEERING.md`
- `docs/HANDOFF.md`
- `docs/loop-history/2026-08-27-31-automatic-run-artifact-transaction.md`

## Validation performed

Targeted isolated Node validation in the available execution environment: PASS.

- `node --check` on the transaction helper logic: PASS.
- 2 automatic-run transaction tests: 2/2 PASS.
  - injected failure while publishing the later EDL artifact restored old video, beats, segments, EDL, and QA and left no transaction debris;
  - success path published all five artifacts as the same new version and left no staging/backup debris.
- Repository-wide fresh-checkout `npm run check` / FFmpeg `npm run demo` were not claimed in this runtime. GitHub Actions remains optional evidence, not a patch gate.

## Expected quality / cost impact

- Prevents a failed automatic rerun from destroying or logically desynchronizing the last known-good result.
- Review UI, EDL endpoint, QA endpoint, and later manual replacement now continue to see one coherent completed generation after automatic-run failure.
- OpenCode Go calls/tokens: no increase.
- FFmpeg work: no extra encode; render target changes from final path to staged sibling.
- Local overhead: temporary JSON writes plus backup copies/renames for a small metadata set and the previous output MP4 during commit.

## Rollback

Revert `commitRunArtifacts()`, restore direct work JSON writes and direct final-path rendering in `runProject()`, and remove the added automatic-run transaction tests. No persisted schema change is involved.

## Remaining risk

- The transaction is rollback-aware within the running process, but a hard power loss during the very short multi-file commit window can still interrupt JavaScript before rollback executes. A future manifest/generation-directory + atomic pointer design could provide stronger crash consistency if evidence justifies the complexity.
- Planner/build internals may emit diagnostic/intermediate work files that are not part of the committed user-visible generation set; those should not be treated as authoritative output state.
- Cross-process writers sharing the same workspace remain outside the in-memory mutation lock boundary.

## Next best hypothesis

Evaluate whether the remaining hard-crash window during multi-file artifact commit is material enough to justify a generation-directory/manifest pointer architecture. Prefer evidence from Mini PC fault-injection or realistic power/process-kill tests before adding complexity; otherwise move to the next Phase A reliability item such as disk-full/permission failure coverage.
