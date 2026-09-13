# Loop 05 — Pin render duration to the EDL timeline

- Starting HEAD: `86877664ab1b707fccd24d00c8bc229bc8bed8b6`
- Problem/evidence: `renderEdl()` mapped TTS audio with FFmpeg `-shortest`. If a generated/trimmed TTS file ends slightly before the beat/EDL timeline, FFmpeg can terminate the whole output at the shorter audio stream, producing a video that is shorter than the intended narration/edit timeline and then only detecting it afterward in QA.
- Change: extracted deterministic `buildRenderArgs()`, removed `-shortest`, and added `-t <last programEnd>` so the EDL program timeline is the authoritative output duration. Audio is still mapped and AAC encoded, but a short TTS stream no longer truncates the video. Added a regression test that asserts the short-TTS render command contains the EDL duration and no `-shortest`.
- Files changed: `src/core/editor.mjs`, `test/editor.test.mjs`, `docs/LOOP_ENGINEERING.md`, this record.
- Validation: GitHub showed PR #1 mergeable before the change. The execution container still cannot resolve `github.com`, so full repository clone/`npm run check`/FFmpeg demo could not be rerun. An isolated Node regression using the exact new render-argument logic passed: `-shortest` absent, `-t 2.4` present for a 2.4s EDL with a short TTS input, and invalid empty timelines fail closed. GitHub Actions was not required.
- Expected impact: prevents short TTS assets from shaving the end off the rendered Shorts video; improves TTS/cut timing determinism with zero additional AI calls, tokens, or model cost.
- Rollback: revert the render-duration and regression-test commits from this loop; no data/schema migration is involved.
- Next hypothesis: make manual replacement rendering transactional (validate candidate EDL and render to a temporary output before replacing the persisted EDL/output) so an FFmpeg failure cannot leave review state and rendered media inconsistent.
