# Loop 30 — Safe stale upload staging cleanup

## Starting HEAD

`531e3cf4e208e261a7a5b84acf7a063923241d2e`

## Problem / evidence

Loop 28 moved uploads to hidden unique `.upload-<token>.part` staging files, so interrupted streams are no longer published into `project.json`. However, a hard process/power failure can bypass JavaScript cleanup and leave these staging files on disk indefinitely. Repeated crashes can therefore accumulate unreferenced partial upload bytes.

Blind startup deletion was rejected because the same workspace could theoretically be used by another server process. Deleting every `.part` at startup could destroy an active upload or a user-created file.

The program does have strong provenance for its own staging names: `createUploadPaths()` creates only `.upload-<safe-token>.part`, and a successful upload renames that file away before metadata publication.

## Change

- Added `cleanupStaleUploadParts()` in `src/core/upload-staging.mjs`.
- Cleanup accepts only exact tool-owned `.upload-[a-zA-Z0-9_-]+.part` regular files.
- Default minimum age is 24 hours.
- Fresh staging files, arbitrary user `.part` files, and final media filenames are excluded.
- `publishStagedUpload()` runs the cleanup opportunistically after the current request stream has completed and before publishing the current staged upload.
- Cleanup errors are best-effort and never make an otherwise valid upload fail.
- Complete unreferenced final media is intentionally not deleted; its provenance/age policy remains a separate problem.

## Files changed

- `src/core/upload-staging.mjs`
- `test/upload-staging.test.mjs`
- `docs/HANDOFF.md`
- `docs/loop-history/2026-08-27-30-stale-upload-part-cleanup.md`

## Validation performed

Isolated Node validation in the available execution environment: PASS.

- `node --check` on the updated upload-staging helper logic: PASS.
- 2 targeted tests: 2/2 PASS.
  - a 25-hour-old tool-owned staging file is removed while a fresh tool staging file and an old user-named `.part` remain;
  - `publishStagedUpload()` removes old staging debris and still publishes/preserves the current upload.
- Repository-wide fresh-checkout `npm run check` / FFmpeg `npm run demo` were not claimed because this runtime still lacks reliable GitHub DNS for cloning. GitHub Actions availability is optional evidence and was not used as a completion gate.

## Expected quality / cost impact

- prevents crash-created partial upload staging files from accumulating forever once later successful uploads occur;
- avoids deleting user media by requiring exact program provenance plus a conservative age threshold;
- OpenCode Go calls/tokens: no increase;
- FFmpeg work: no increase;
- local overhead: one small directory scan/stat pass per successful upload publish.

## Rollback

Revert `cleanupStaleUploadParts()`, its `publishStagedUpload()` call, and the added tests. No persisted schema or existing user media format changes are involved.

## Remaining risk

- cleanup is opportunistic, not startup-global; if no later upload occurs, stale `.part` debris remains;
- a second independent server process could theoretically share the workspace. The 24-hour threshold lowers but does not mathematically eliminate cross-process ownership risk;
- complete unreferenced final media after a crash between rename and `project.json` commit is not automatically deleted.

## Next best hypothesis

Inspect the automatic `/run` render/output path for the same durability property already added to manual replacement. Determine whether an interrupted or failed automatic run can overwrite or partially corrupt the last known-good `output/shorts.mp4` or QA artifacts. If so, stage and publish the automatic run artifacts transactionally without adding AI calls.
