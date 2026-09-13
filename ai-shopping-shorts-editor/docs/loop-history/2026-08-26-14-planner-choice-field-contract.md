# Loop 14 — Planner choice field contract

- Starting HEAD: `2ceb5d3e5d9cc83b69d243c33a2c09da59f15c58`
- Scope: CUT ONLY; no subtitle styling, effects, music, upload, or new paid AI calls.

## Problem / evidence
`validatePlannerResponse()` previously verified beat coverage but did not verify the operational field types of each choice. A malformed model response such as `sourceStart: "0"`, `score: "90"`, `score: NaN`, `alternatives: null`, or an empty `segmentId` could pass the protocol gate and reach deterministic repair. That relies on JavaScript coercion or iteration behavior, which can hide an AI protocol error or cause a later runtime failure outside the API-call boundary.

## Change
`src/core/opencode.mjs` now rejects Planner choices unless:
- `segmentId` is a non-empty string,
- `sourceStart` is a finite number,
- `score` is a finite number in `0..100`,
- `alternatives` is an array of non-empty string IDs.

This deliberately does not reject semantic/selection constraints such as an out-of-range but numeric `sourceStart`, insufficient segment duration, duplicate segment selection, or a referenced segment that needs deterministic repair. Those remain repair-layer concerns.

## Files changed
- `src/core/opencode.mjs`
- `test/opencode.test.mjs`
- `docs/LOOP_ENGINEERING.md`
- this loop record

## Validation
- Isolated Node validation of the exact new contract logic: PASS for a valid reordered response; correctly rejected empty `segmentId`, string/non-finite `sourceStart`, invalid `score`, and malformed `alternatives`.
- After GitHub writes, re-fetched the branch versions of `src/core/opencode.mjs` and `test/opencode.test.mjs` and confirmed the validator and regression cases are present.
- Full clone-based `npm run check` / FFmpeg demo could not be rerun in the execution container because `raw.githubusercontent.com` DNS resolution failed. GitHub Actions was not required or used as a gate.

## Expected impact
- Quality/reliability: malformed paid Planner responses fail at the protocol boundary instead of contaminating or crashing repair/EDL construction.
- API cost: no additional calls, retries, or tokens.
- Runtime: negligible validation overhead over the existing choices array.

## Rollback
Revert commits for this iteration, beginning with `640ec8485fdb1e317772c13f41fa13c9700fba4c`, or restore `validatePlannerResponse()` and its tests to the prior HEAD `2ceb5d3e5d9cc83b69d243c33a2c09da59f15c58`.

## Next best hypothesis
Vision analysis currently validates batch ID coverage but still trusts numeric metadata fields such as `productVisibility`, `visualQuality`, `motionLevel`, and `confidence`. A future loop should determine whether malformed/non-finite values can poison fallback ranking or compact Planner inputs, and add a narrow contract only if source evidence confirms that path is not already normalized safely.
