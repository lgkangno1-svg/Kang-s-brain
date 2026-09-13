# Loop 21 — Judge alternatives refresh

## Starting HEAD
`8b02ff093479e7289c1df5fd7e2bdd4abde3cfff`

## Problem / evidence
`repairChoices()` correctly removes the initial selected segment from `alternatives`, but Quality Judge can later replace `clip.segmentId` with an entry from that same alternatives list. The clip then retained the stale list: the newly selected current segment remained visible as an alternative while the previous valid selection was absent. This made the review UI offer a no-op replacement and removed the most useful immediate rollback option.

## Change
- Added `alternativesAfterReplacement()` in `src/core/editor.mjs`.
- After a successful Judge replacement, rebuild alternatives so the new current segment is excluded.
- Preserve the previous selected segment as the first rollback candidate.
- Deduplicate IDs and retain the existing four-alternative cap.
- Added a regression case in `test/editor.test.mjs`.

## Validation
Targeted Node assertion executed in the available runtime:

`['s2','s3','s2','s4']`, previous=`s1`, replacement=`s2` -> `['s1','s3','s4']`.

The assertion verified that the replacement (`s2`) is absent, the prior selection (`s1`) is first, and duplicates are removed. GitHub Actions availability was not used as a completion requirement. Full repository/FFmpeg E2E was not rerun in this environment for this small review-metadata-only change.

## Expected quality / cost impact
- Cleaner manual review UX: no current clip presented as its own replacement.
- One-click rollback candidate remains available after automatic Judge replacement.
- No added Vision, Planner, Judge, FFmpeg, or token cost.
- No renderer behavior or CUT ONLY scope change.

## Rollback
Revert the commits that add `alternativesAfterReplacement()` and its Judge call/test; no data migration is required.

## Next best hypothesis
Inspect the manual replacement path to ensure that after a user-initiated replacement, `alternatives` is refreshed by the same invariant (exclude the new current segment and preserve the previous selection) rather than leaving stale review metadata.