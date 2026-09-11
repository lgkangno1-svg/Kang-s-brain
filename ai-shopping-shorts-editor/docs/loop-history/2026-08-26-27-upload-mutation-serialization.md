# Loop 27 — Upload / run / replace mutation serialization

## Starting HEAD

`62119d0237ee43fb38ced03dce567a4e0384c2ca`

## Problem / evidence

Loop 26 serialized `/run` and `/replace`, but `POST /upload` still streamed into `inputs/` and then rewrote `project.json` without participating in the same same-project mutation boundary.

That left two real races:

1. a long upload could be in progress while `/run` starts from the old project snapshot, then the upload could publish a new input path to `project.json` after the run has already captured its inputs;
2. `/run` or `/replace` could be active while an upload mutates `inputs/` and `project.json`, leaving disk project metadata different from the snapshot used by the active edit/render.

Using the existing `jobs` Map directly as an upload lock was rejected because `jobs` is also the user-visible run status/result store. A transient upload claim there would overwrite or erase the last QA/result state.

## Change

- Added `src/core/project-mutation.mjs` with an owner-token same-project mutation lock independent from the status `jobs` Map.
- `POST /upload` now claims the project mutation before streaming any bytes. A busy project returns HTTP 409 before writing an input file.
- `/run` and `/replace` now claim the same mutation boundary before request-body parsing and hold it until their asynchronous pipeline resolves or rejects.
- setup failures release both the job status claim and the mutation token.
- completion/failure releases only the mutation token that still owns the project, preventing stale cleanup from deleting a newer claim.
- read-only status/EDL/segments/QA/video routes remain unlocked.
- different project IDs remain independent and can upload/render concurrently.

## Files changed

- `src/core/project-mutation.mjs`
- `src/server.mjs`
- `test/project-mutation.test.mjs`
- `docs/HANDOFF.md`
- `docs/loop-history/2026-08-26-27-upload-mutation-serialization.md`

## Validation

Available runtime validation:

- isolated `node --check` of the new mutation helper: PASS
- isolated Node regression tests: 3/3 PASS
  - same-project upload/run/replace claims are mutually exclusive
  - stale token cleanup cannot release a newer owner
  - different projects can mutate independently

A fresh repository clone was attempted in the execution container in order to run `node --check src/server.mjs` and full `npm run check`, but the environment could not resolve `github.com` (`Could not resolve host: github.com`). Therefore full-repository check/demo is not claimed for this iteration. GitHub Actions availability is not a completion gate.

## Expected quality / cost impact

- prevents project input metadata from changing underneath an active edit/render
- prevents a run from starting in the middle of a same-project upload
- preserves previous run status/QA because mutation ownership is separate from the `jobs` status Map
- no additional OpenCode Go calls or tokens
- no extra FFmpeg work
- rejected conflicts fail before upload/render work

## Rollback

Revert the commits adding `project-mutation.mjs`, its test, and the `server.mjs` mutation integration. No persisted project schema or media format changed.

## Next best hypothesis

Inspect stale/crashed process recovery. The mutation lock is intentionally in-memory, so process restart clears it safely, but partially uploaded input files or interrupted `project.json`/work artifacts may remain on disk. The next high-value reliability check is whether startup/project-open paths can distinguish valid persisted state from interrupted/stale files without deleting recoverable user media.
