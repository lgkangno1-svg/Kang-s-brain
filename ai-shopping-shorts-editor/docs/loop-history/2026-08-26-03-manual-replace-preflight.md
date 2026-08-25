# Loop 03 — Manual replacement duplicate preflight

- Starting HEAD: `8334853036a835db1dde7e2e7c714958c3cf4e88`
- Problem/evidence: `replaceClipAndRerender` accepted a segment already used by another beat, mutated/saved the EDL, and launched FFmpeg before final EDL validation. A duplicate choice could therefore spend render time and only fail in post-render QA.
- Change: added `assertManualReplacementAvailable()` and call it before mutating the EDL or invoking FFmpeg. Added regression coverage for duplicate, same-beat-current, and unused segment cases.
- Files changed: `src/core/pipeline.mjs`, `test/pipeline.test.mjs`, `docs/LOOP_ENGINEERING.md`, this record.
- Validation: isolated Node test of the duplicate-preflight predicate passed locally. Full repository `npm run check` / synthetic FFmpeg demo could not be re-run because the execution container could not resolve `github.com` to clone the branch; GitHub Actions was intentionally not required.
- Expected impact: duplicate manual choices now fail immediately with zero additional AI calls and without unnecessary FFmpeg rendering or EDL mutation.
- Rollback: revert the commits that add `assertManualReplacementAvailable`, its call site, and `test/pipeline.test.mjs`.
- Next hypothesis: review whether manual replacement should also preflight full source-boundary/EDL validity before persisting, while avoiding duplicate validation logic already owned by `validateEdl`.
