# Loop 20 — EDL source/program duration invariant

- Starting HEAD: `b2d5c29d10ce994e0b95fa0347445e8994e0b7a4`
- Focus: cut/TTS timeline robustness and avoiding wasted FFmpeg work.

## Problem / evidence

`validateEdl()` checked program continuity, source ranges, source bounds, negative starts, and duplicate segments, but did not verify that each clip's program duration matched the actual source trim duration. A damaged or manually altered EDL could therefore request (for example) a 1.5 s program slot from only 1.0 s of source trim and reach FFmpeg before the mismatch surfaced later as output-duration QA noise.

## Change

- `src/core/editor.mjs`
  - reject non-positive program ranges;
  - compare `programEnd - programStart` with `sourceEnd - sourceStart`;
  - reject mismatches greater than 40 ms before rendering.
- `test/editor.test.mjs`
  - add regression coverage proving a 1.0 s source trim cannot fill a 1.5 s program slot.

## Validation

Actions was not required. An isolated Node assertion executed in the available runtime verified:

- 1.0 s source vs 1.5 s program => rejected with `source/program duration mismatch`;
- 1.5 s source vs 1.5 s program => accepted.

Full repository `npm run check` / `npm run demo` remains optional additional evidence when the Mini PC self-hosted runner is online.

## Expected impact

- Prevent malformed timing from reaching FFmpeg.
- Reduce wasted render time and make failures earlier and more actionable.
- No OpenCode Go calls, token usage, or paid API cost added.
- Preserves CUT ONLY scope.

## Rollback

Revert commits touching `src/core/editor.mjs` and `test/editor.test.mjs` from this loop if valid production EDLs are unexpectedly rejected. The tolerance is intentionally 40 ms to cover normal millisecond rounding while still detecting material mismatch.

## Next best hypothesis

Check whether manual replacement or Quality Judge replacement can leave stale `alternatives` entries that point to the newly selected current segment, causing confusing no-op options in review UI.