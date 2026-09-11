# Loop 06 — Leading micro-beat forward merge

## Starting HEAD
`f9ea068d96456a5e0f5111939f1f0060494279fb`

## Problem / evidence
`buildBeats()` only merged a beat shorter than `minBeat` into the previous beat. A leading SRT/TTS beat has no previous beat, so a 0.x-second opening beat could survive normalization and force an unnecessarily abrupt opening cut even when the following beat could absorb it without exceeding `maxBeat`.

## Change
- `src/core/beats.mjs`: when a short beat cannot be merged backward, merge it forward into the next beat if the combined span stays within `maxBeat + 0.05`.
- Preserve the original start, next beat end, text order, and continuous timeline.
- `test/beats.test.mjs`: add regression coverage for a 0.3s leading beat followed by a 1.5s beat.
- `docs/LOOP_ENGINEERING.md`: record the durable micro-beat rule.

## Validation
- PR/source inspection confirmed the previous backward-only merge behavior.
- Added a targeted Node regression test in the repository.
- Independently executed the exact forward-merge branch in Node with `0.0–0.3`, `0.3–1.8`, `1.8–3.2` beats; result was two continuous beats with the first span `0.0–1.8` and text order preserved.
- Full `npm run check` / FFmpeg demo could not be rerun in this execution container because `github.com` DNS resolution failed during clone. GitHub Actions was intentionally not required.

## Expected impact
Reduces accidental 0.x-second opening cuts caused by subtitle/TTS segmentation, improving opening pacing without adding AI calls, tokens, API cost, or render complexity.

## Rollback
Revert the forward-merge branch in `buildBeats()` and remove the corresponding regression test. No data migration or persisted project format changed.

## Next hypothesis
Audit AI Vision batch response integrity: missing/duplicated/mismatched segment IDs currently deserve verification because silently accepting incomplete semantic metadata can degrade planner quality after paid Vision calls.
