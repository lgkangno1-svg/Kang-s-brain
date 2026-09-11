# Loop 28 — Upload staging durability

## Starting HEAD

`7dffc379b05f0cf3c05ea09fe323c8f762bdb4eb`

## Problem / evidence

`POST /upload` streamed request bytes directly into the final `inputs/<name>` path with `createWriteStream(..., { flags: 'wx' })`. The normal exception path removed that file, but process termination or power loss does not execute catch/finally cleanup.

That meant an interrupted upload could leave a partial file with a final-looking filename. Because the next upload derived the same deterministic prefix/name from unchanged `project.json`, the orphan could also cause `EEXIST` and block retry. The project metadata itself stayed authoritative, but the filesystem artifact looked too much like a published input.

## Change

- Added `src/core/upload-staging.mjs`.
- Uploads now stream only into hidden unique `.upload-<token>.part` paths.
- Each upload gets a unique final filename as well, so a prior unreferenced orphan cannot block retry by filename collision.
- After the request stream finishes, the staged file is renamed to its final path.
- Only after that rename does the server persist the path into `project.json`.
- If metadata persistence throws, the just-published final file is removed as rollback.
- Stream failures best-effort remove the staged file.
- No project schema, AI routing, EDL format, or media format changed.

A hard crash in the very small interval after final rename but before `project.json` commit can still leave a complete unreferenced orphan. It is not referenced as valid input and unique naming prevents it from blocking the next upload. Automatic stale-orphan deletion is deliberately deferred until provenance/age rules are defined; user media should not be deleted by guesswork.

## Files changed

- `src/core/upload-staging.mjs`
- `src/server.mjs`
- `test/upload-staging.test.mjs`
- `docs/HANDOFF.md`
- `docs/loop-history/2026-08-27-28-upload-staging-durability.md`

## Validation

Targeted Node validation in the available runtime:

- `upload-staging.mjs` syntax check: PASS
- hidden unique staging path generation: PASS
- distinct final path generation for repeated logical filenames: PASS
- simulated `project.json` persistence failure removes both staged/final artifacts: PASS
- successful persistence keeps the final artifact and removes staging: PASS

Full repository `npm run check` / FFmpeg `npm run demo` are not claimed for this iteration because the active automation runtime does not have a reliable fresh repository checkout. GitHub Actions availability is not a completion gate.

## Expected quality / cost impact

- interrupted byte streams no longer appear under published input filenames
- retry is not blocked by a previous orphan using the same logical filename
- metadata write failure rolls back the newly published input
- OpenCode Go calls/tokens: no increase
- FFmpeg work: no increase
- overhead: one same-filesystem rename plus small filename bookkeeping per upload

## Rollback

Revert the upload-staging helper/test and restore the previous direct-to-final upload block in `src/server.mjs`. No persisted schema migration is needed.

## Next best hypothesis

`server.mjs` currently reads `project.json` in the common project route before `/upload`, `/run`, or `/replace` claims the mutation token. Verify whether an extreme interleaving can therefore allow a request to claim the lock later but operate on a stale project snapshot. If reproducible, the minimal fix is to acquire mutation ownership before reading the mutable project snapshot (or re-read after claim) without serializing read-only endpoints.
