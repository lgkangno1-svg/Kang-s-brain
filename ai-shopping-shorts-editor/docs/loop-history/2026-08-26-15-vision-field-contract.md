# Loop 15 — Vision semantic field contract

## Starting HEAD
`f6313a3cc5e8f4b21e3151f661e92f7ce3f6378b`

## Problem / evidence
`validateVisionBatchResponse()` previously checked only batch coverage by segment ID. A paid Vision response could therefore return malformed semantic metadata (for example `actions` as a string, an unsupported `shotType`, or string/out-of-range 0..1 scores) and still be merged into the analyzed segment object. Those values are later compacted into the Planner prompt, so malformed analysis could silently degrade semantic matching or cause coercion-dependent behavior.

## Change
- Validate non-empty `description`.
- Require `subjects`, `actions`, and `usabilityTags` to be arrays of non-empty strings.
- Restrict `shotType` to the prompt contract: `close_up|medium|wide|macro|unknown`.
- Require `productVisibility`, `visualQuality`, `motionLevel`, and `confidence` to be finite number values in `[0, 1]`.
- Reject the whole Vision batch before Planner use if any field violates the contract.
- Add regression coverage for empty/mistyped semantic fields, unsupported shot type, string numeric values, NaN, and out-of-range scores.

## Files changed
- `src/core/opencode.mjs`
- `test/opencode.test.mjs`
- `docs/LOOP_ENGINEERING.md`
- this loop record

## Validation
- Re-fetched the branch version of `src/core/opencode.mjs` through the GitHub connector and confirmed the new validator is present on the feature branch.
- Attempted isolated local verification with `git clone`, `node --check src/core/opencode.mjs`, and `node --test test/opencode.test.mjs`.
- Local execution could not start because the execution container could not resolve `github.com`; this is an environment/network limitation, not a GitHub Actions dependency.
- No test was weakened and no GitHub Actions result was required.

## Expected impact
Prevents malformed paid Vision metadata from being treated as valid semantic evidence or entering the Planner prompt. This should improve failure transparency and protect semantic edit quality without adding API calls, tokens, or render work.

## Rollback
Revert the Vision field-contract commit(s) from this iteration if real provider responses demonstrate a documented contract variant that should be supported. Prefer explicitly extending the accepted schema over reintroducing coercion.

## Next best hypothesis
Validate semantic response text fields that are currently informational (`reason`) only if they are proven to affect UX or downstream logic; otherwise prioritize a higher-impact boundary such as cache validation/versioning so old malformed Vision cache entries cannot bypass newer contracts.
