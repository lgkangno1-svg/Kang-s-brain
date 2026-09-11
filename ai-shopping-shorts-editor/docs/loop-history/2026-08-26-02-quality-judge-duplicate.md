# Loop 02 — Quality Judge duplicate replacement guard

## Starting HEAD
`150e3e05a2490830c04cfaf8f1e9b1788f9b6bf9`

## Problem / evidence
Quality mode runs a second Vision Judge after the initial EDL has already been repaired to avoid duplicate segments. The replacement path previously chose the first duration-valid alternative from a different source without checking whether another beat already occupied that segment. A low-score replacement could therefore reintroduce a duplicate segment and make the later `validateEdl()` fail after Judge API work had already been paid for.

## Files changed
- `src/core/editor.mjs`
  - Added `chooseJudgeReplacement()`.
  - Maintains a live set of occupied segment IDs while processing Judge replacements.
  - Rejects occupied, too-short, missing, and same-source alternatives before replacing a clip.
- `test/editor.test.mjs`
  - Added regression coverage proving an occupied alternative is skipped and the next eligible free alternative is selected.
- `docs/LOOP_ENGINEERING.md`
  - Recorded the EDL-invariant lesson for future loops.

## Validation performed
- GitHub source re-read after patch confirmed the occupied-segment guard is present on the feature branch.
- Focused local Node execution of the replacement-selection logic passed: an occupied `s2` and too-short `s3` were rejected and free eligible `s4` was selected.
- Full repository `npm run check` / FFmpeg synthetic demo could not be rerun in this execution environment because outbound DNS resolution for `github.com` failed while cloning the branch. GitHub Actions was intentionally not treated as a requirement.

## Expected impact
- Prevents invalid EDL failures caused specifically by Quality Judge replacement collisions.
- Avoids wasting completed Judge API work on an edit that would be rejected immediately afterward.
- No additional API calls or tokens are introduced.

## Rollback
Revert the commits that add `chooseJudgeReplacement`, its regression test, and this documentation entry. The previous behavior remains isolated to the Quality Judge replacement path.

## Next best hypothesis
Manual zero-AI clip replacement currently renders first and only then validates duplicate-segment conflicts. Consider moving duplicate/EDL validation before FFmpeg rerender so an invalid manual choice fails immediately without wasting render time.
