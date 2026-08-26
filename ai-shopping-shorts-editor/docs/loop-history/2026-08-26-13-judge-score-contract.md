# Loop 13 — Quality Judge score contract

## Starting HEAD
`ac37f3003b6c5207b3d55f4e1f8fe058acaf670a`

## Problem / evidence
`validateJudgeResponse()` previously verified only beat coverage. `buildEdl()` later coerced `j.score` with `Number(j.score)` and compared it with the replacement threshold. A malformed score such as `"bad"` becomes `NaN`, and `NaN < threshold` is false, which can silently let an untrustworthy judgment pass. Numeric strings, null, and scores outside the promised 0..100 schema were also accepted.

## Change
- `src/core/opencode.mjs`: Judge responses now require every `score` to be a finite JavaScript `number` in the inclusive 0..100 range. Invalid values are reported in the response-integrity error before any partial judgment is applied.
- `test/judge-integrity.test.mjs`: added regression coverage for numeric strings, null, negative scores, and scores above 100.
- `docs/LOOP_ENGINEERING.md`: recorded the durable response-contract rule.

## Validation
- PR #1 was inspected first and was open/mergeable at starting HEAD.
- Isolated Node 22 validation reproduced the exact validator rule and passed: valid reordered judgments accepted; string/null/-1/101 scores rejected.
- Full repository `npm run check` and FFmpeg demo were not rerun because this execution environment cannot resolve `github.com` for cloning the branch. GitHub Actions availability was not treated as a blocker.
- Source-level verification confirmed the patch is limited to the Judge response contract, its regression test, and documentation.

## Expected impact
Prevents malformed paid Judge output from bypassing the quality threshold or contaminating EDL metadata. No extra OpenCode Go calls, tokens, FFmpeg work, or runtime passes are introduced.

## Rollback
Revert commits that add Judge score validation/test/docs if a provider is intentionally allowed to return non-number scores. Prefer adapting the provider response explicitly rather than weakening the core contract.

## Next best hypothesis
Validate the Planner numeric contract (`sourceStart` and `score`) separately from deterministic repair: preserve repairable out-of-range `sourceStart` behavior, but prevent non-finite values from entering EDL metadata or telemetry silently.
