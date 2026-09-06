# Loop 26 — Project run/replace serialization

## Starting HEAD

`ebab6c33a9d327cdde3b5649bf4aa276744648a6`

## Problem / evidence

`src/server.mjs` previously checked `jobs.get(id)?.running` before `await bodyJson(req)`, but did not put a running state into `jobs` until after that asynchronous body parse completed. Two nearly simultaneous `POST /run` and/or `POST /replace` requests for the same project could therefore both observe the project as idle, both pass the guard, and then mutate/render the same project concurrently.

That race could undermine the atomic JSON and transactional rerender protections added in earlier loops: each individual transaction could be internally correct while two valid transactions compete for the same files and produce last-writer-wins or staging/backup interference.

## Files changed

- `src/core/project-job.mjs` — adds synchronous per-project job claiming and ownership-aware setup abandonment.
- `src/server.mjs` — claims the project slot before the first asynchronous request-body parse in both `/run` and `/replace`; releases the claim if request parsing/initial run setup fails.
- `test/project-job.test.mjs` — regression coverage for same-project exclusion, safe abandonment, and different-project independence.
- `docs/HANDOFF.md` — records the new reliability invariant, completed milestone, remaining concurrency boundary, and next priority.

## Validation performed

Targeted Node validation was executed in the available runtime:

- `node --check` on the project-job helper logic: PASS.
- `node --test` equivalent regression suite: 3/3 PASS.
  - second same-project claim is rejected synchronously
  - setup abandonment releases only the state that still owns the slot
  - different projects can claim independently

GitHub Actions availability was not used as a completion gate. Full repository `npm run check` / FFmpeg `npm run demo` were not required to prove this small server-side mutual-exclusion helper and were not claimed as executed in this run.

## Expected quality / cost impact

- Prevents simultaneous `/run` and `/replace` jobs from mutating/rendering the same project.
- Protects the value of the existing atomic JSON and transactional MP4/EDL/QA publish logic.
- Does not serialize unrelated projects, so independent projects can still run concurrently.
- Adds zero OpenCode Go calls and zero token cost.
- No FFmpeg work is added; rejected concurrent requests fail before rendering.

## Rollback guidance

Revert the commits that add `src/core/project-job.mjs`, its test, and the corresponding `server.mjs` integration. No workspace migration or persisted data format changed.

## Known boundary

This loop serializes the long-running `/run` and `/replace` operations. The upload route still mutates `project.json` without using the same project job slot. A future loop should inspect whether upload-during-run is reachable through the UI/API and, if it can corrupt the project snapshot or create ambiguous input state, add the smallest safe mutator policy rather than broad global locking.

## Next best hypothesis

Inspect upload/project-metadata mutation while a run or replacement is active. Prefer rejecting or safely staging only the conflicting mutation paths; do not block read-only status/preview endpoints or unrelated projects.
