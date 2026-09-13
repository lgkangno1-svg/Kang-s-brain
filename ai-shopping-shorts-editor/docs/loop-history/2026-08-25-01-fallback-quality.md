# Loop 01 — Deterministic fallback quality ordering

- Starting HEAD: `182c791357160c48cc626b8830f903ba3394cb9d`
- Problem/evidence: `fallbackPlan()` sorted eligible scenes by visual quality, product visibility, and diversity, but then selected `candidates[i % candidates.length]`. On later beats this could intentionally choose a lower-ranked scene despite a better unused eligible scene being available.
- Change: select `candidates[0]` after the existing eligibility, unused-scene, quality, product-visibility, and diversity ordering. Added a regression test proving two beats choose the best two remaining eligible scenes (`s1`, then `s2`) rather than rotating to a low-quality `s3`.
- Files changed: `src/core/editor.mjs`, `test/editor.test.mjs`, `docs/LOOP_ENGINEERING.md`, this record.
- Validation: GitHub source-level review completed. Full repository checkout was attempted but network access from the execution container could not resolve github.com, so full `npm run check` / FFmpeg demo could not be rerun in this environment. The isolated deterministic selection logic was executed locally with Node and returned `["s1","s2"]` as expected. No test was weakened.
- Expected impact: improves zero-AI/fallback scene quality with no additional OpenCode calls, tokens, render work, or memory cost.
- Rollback: revert commits beginning with `5415567` (selection change), `b35a548` (regression test), `0e79931` (durable lesson), and this history commit if necessary.
- Next best hypothesis: inspect whether fallback diversity penalties are strong enough to prevent visually repetitive same-source runs without sacrificing product visibility; change only if a concrete regression case can be demonstrated.
