# Loop 29 — Fresh project snapshot after mutation claim

## Starting HEAD

`cf890f8b83f31e8554925734c9749b221e06c0ee`

## Problem / evidence

`src/server.mjs` loaded `project.json` in the common project route before `/upload`, `/run`, or `/replace` acquired the same-project mutation token.

That left a real stale-state overwrite window. Example: request B could read revision 1 and wait; request A could then acquire the mutation token, upload a new video, persist revision 2, and release. B could subsequently acquire the token but continue using its already-read revision 1 object. `/run` would then persist script/settings through that stale object and could silently erase A's newly added video path from `project.json`.

The existing mutation lock prevented simultaneous writes, but did not guarantee that the object being written was read while the caller owned the mutation boundary.

## Change

- Added `beginProjectMutationWithFreshSnapshot()` in `src/core/project-mutation.mjs`.
- The helper acquires the mutation token first, then executes the supplied project read.
- If the read throws, it releases only the token it owns before rethrowing.
- `/upload`, `/run`, and `/replace` now acquire mutation ownership and re-read `project.json` before deriving upload prefixes, persisting script/settings, invoking the pipeline, or performing a replacement.
- The earlier common route read remains as a cheap existence/read-only gate, but mutating paths no longer use that pre-lock object for mutation or execution.
- If the post-claim snapshot is missing, the token is released and the request returns 404.

## Files changed

- `src/core/project-mutation.mjs`
- `src/server.mjs`
- `test/project-mutation.test.mjs`
- `docs/LOOP_ENGINEERING.md`
- `docs/HANDOFF.md`
- `docs/loop-history/2026-08-27-29-fresh-project-snapshot.md`

## Validation performed

Targeted isolated Node validation in the available runtime: PASS.

Assertions covered:

- a stale pre-lock snapshot can remain revision 1 while the fresh post-claim snapshot observes revision 2;
- the project mutation token is already owned while the fresh read callback executes;
- the fresh snapshot contains a concurrently completed upload that the stale snapshot did not contain;
- a snapshot read failure releases the mutation token so the project is not left permanently busy.

The repository-wide `npm run check` and FFmpeg `npm run demo` are not claimed in this run because a reliable fresh local checkout was not available. GitHub Actions availability is optional evidence and was not used as a completion gate.

## Expected quality / cost impact

- prevents serialized-but-stale `/upload` / `/run` / `/replace` operations from overwriting newer `project.json` metadata;
- ensures the media paths passed into `runProject()` and `replaceClipAndRerender()` match the latest committed project state at mutation start;
- OpenCode Go calls/tokens: no increase;
- FFmpeg work: no increase;
- local overhead: one small `project.json` re-read for each mutating request.

## Rollback

Revert `beginProjectMutationWithFreshSnapshot()`, its tests, and the three server call sites to direct `beginProjectMutation()` usage. No persisted schema migration is involved.

## Next best hypothesis

With stale snapshot overwrite closed, the next reliability target is startup/crash recovery. Define evidence-based cleanup for old hidden `.upload-*.part` files first. Do not automatically delete complete unreferenced media until age/provenance rules can distinguish true orphans from user files safely.
