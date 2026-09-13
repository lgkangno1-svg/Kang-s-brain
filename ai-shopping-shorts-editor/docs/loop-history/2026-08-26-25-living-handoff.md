# Loop 25 — Living project handoff

## Starting HEAD

`db3cbfce98ec07f78f0d61ee1232e0cf0d1ee3e7`

## Problem / evidence

The repository already had separate PRD, architecture, loop-engineering, Mini PC runner, and per-iteration history documents, but there was no single living document that answered all of the following for a new AI/developer without relying on chat history:

- why the product exists
- what the final goal is
- what is deliberately out of scope
- what has already been implemented
- which reliability/cost/security lessons are durable
- which phase the project is currently in
- what should be worked on next
- what the user still has to do manually

The user explicitly requested that a detailed handoff file live in GitHub and be updated whenever the project is updated.

## Files changed

- `docs/HANDOFF.md` — new living project handoff/source-of-truth document
- `docs/LOOP_ENGINEERING.md` — makes HANDOFF review/update part of the mandatory loop protocol
- `docs/loop-history/2026-08-26-25-living-handoff.md` — this record

## What changed

`HANDOFF.md` now centralizes:

- development intent and product definition
- CUT ONLY scope
- repository/PR/branch snapshot
- architecture and model integration
- quality/cost modes
- current implementation inventory
- major completed loop milestones
- validation and Mini PC self-hosted CI strategy
- security and API-cost principles
- known limitations
- phased roadmap
- current next-best hypothesis
- mandatory start-of-work checklist
- mandatory handoff-maintenance contract
- important file map
- current user-only manual action

`LOOP_ENGINEERING.md` now requires every meaningful project change to update the handoff in the same iteration when it affects current state, architecture, validation, cost, security, scope, roadmap, or next priority.

## Validation performed

- Read current PR #1 metadata before writing.
- Read current `README.md`, `PRD.md`, `ARCHITECTURE.md`, `LOOP_ENGINEERING.md`, `package.json`, and loop-history directory before composing the handoff.
- Confirmed the new handoff and protocol were written directly to the active feature branch.
- No product code changed in this iteration, so FFmpeg/runtime regression testing was not necessary for this documentation-governance change.

## Expected quality / cost impact

Product output quality and API cost are unchanged directly.

Operational quality should improve because future AI/developer sessions can recover the latest intent, completed state, constraints, and next priorities from GitHub instead of assistant memory or old chat context. This reduces duplicated work, conflicting changes, accidental scope drift, and regression risk.

## Rollback guidance

If the living-handoff process proves too heavy, revert this iteration's documentation commits. Product runtime behavior is unaffected.

Do not remove per-loop history; HANDOFF is a current-state summary while `docs/loop-history/` remains the detailed chronological evidence trail.

## Next best hypothesis

Inspect whether concurrent edit/rerender requests can mutate the same project simultaneously. If the current server permits that race, add the smallest project-level serialization/lock mechanism and regression coverage without increasing AI calls.
