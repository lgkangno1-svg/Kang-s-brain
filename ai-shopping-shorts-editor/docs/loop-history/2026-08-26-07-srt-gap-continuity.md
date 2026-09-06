# Loop 07 — SRT gap continuity

## Starting HEAD
`05e10f509100b00c3c2b0abe8b6ab516785c014b`

## Problem / evidence
`buildBeats()` previously used parsed SRT timestamps directly. Normal subtitle files often leave short pauses between captions (and may start a little after 0). `validateEdl()` intentionally rejects program gaps, so a valid SRT such as `0.2–1.0` followed by `1.2–2.2` could produce an otherwise unnecessary `program gap/overlap` QA failure before rendering.

## Change
- Added `closeSrtGaps()` in `src/core/beats.mjs`.
- SRT-derived beats now begin at program time 0 and close positive caption gaps by extending the preceding beat to the next caption start.
- Caption text and final SRT end time remain unchanged.
- Added a regression test covering both an initial 0.2 s offset and a 0.2 s inter-caption gap.

## Files changed
- `ai-shopping-shorts-editor/src/core/beats.mjs`
- `ai-shopping-shorts-editor/test/beats.test.mjs`

## Validation
- Re-read both updated files from the feature branch after GitHub writes; expected helper, call site, and regression assertions are present.
- Ran an isolated Node check of the exact gap-closing logic: `0.2–1.0`, `1.2–2.0`, `2.0–3.0` normalized to contiguous `0–1.2`, `1.2–2.0`, `2.0–3.0` and exited successfully.
- Full repository `npm run check` / FFmpeg synthetic E2E could not be run in this execution environment because `github.com` DNS resolution failed during clone (`Could not resolve host: github.com`). GitHub Actions was not required or used as a gate.

## Expected impact
Common SRT files with natural subtitle pauses should no longer fail deterministic EDL gap QA solely because captions are not back-to-back. No OpenCode Go calls, tokens, or API cost are added.

## Rollback
Revert code commit `f887c4353d6fe96c5474c28f56a095f646803ba0` and test commit `7a609d7ca38e202c465ee5f89c8822e355994e47` if SRT pause handling causes an unintended timing regression.

## Next best hypothesis
Audit overlapping/out-of-order SRT captions separately. They can still create program overlap and should be handled only with a clearly defined policy and regression evidence rather than folded into this gap-only fix.
