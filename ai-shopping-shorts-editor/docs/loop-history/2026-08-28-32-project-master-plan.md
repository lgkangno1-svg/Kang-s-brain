# Loop 32 — Canonical Project Master Plan

## Starting HEAD

`0772492912ec3b5bcb5c56ba2565474093b9f76d`

## Problem / evidence

The repository already had `PRD.md`, `ARCHITECTURE.md`, `LOOP_ENGINEERING.md`, and a detailed living `HANDOFF.md`, but there was no single stable document whose job was to preserve the user's long-term product intent, development philosophy, priority order, quality/cost criteria, and rules for deciding whether an improvement should be adopted.

`HANDOFF.md` necessarily changes often because it contains implementation state, milestones, current risks, SHA snapshots, and next actions. Mixing stable product intent with frequently changing implementation status makes it easier for a future AI/developer to drift from the intended product direction.

The user explicitly requested a GitHub document that future development and improvements must keep consulting as the standard for development purpose, planning, and improvement decisions.

The user also clarified that the Mini PC setup commands have **not yet been run**. This is an operational pending action, not a reason to delay the documentation/governance change.

## Change

Created:

- `docs/PROJECT_MASTER_PLAN.md`

The Master Plan now defines:

- what product the user actually wants
- final user flow and completion goal
- CUT ONLY scope and non-goals
- AI-vs-FFmpeg architectural philosophy
- semantic quality priority order
- TTS/SRT/cut timing principles
- OpenCode Go cost policy
- reliability/data-safety invariants
- UX principles
- P0-P4 improvement priority order
- evidence-based criteria for accepting an improvement
- quality/cost/reliability metrics
- development-loop workflow
- documentation authority hierarchy
- minimal-user-action operating principle
- concise reporting convention
- long-term product completion criteria

Updated:

- `docs/LOOP_ENGINEERING.md`

Every future loop must now read `PROJECT_MASTER_PLAN.md` before HANDOFF/history/source inspection and must use the Master Plan when choosing improvements. Product-purpose/scope/priority changes require an explicit product decision and a Master Plan update; ordinary implementation progress stays in HANDOFF.

## Validation

Documentation/source-level validation only; no product code changed.

Verified from GitHub after creation that `PROJECT_MASTER_PLAN.md` exists on `feat/ai-shopping-shorts-editor-bootstrap` and begins by declaring itself the long-term project standard, separating stable product direction from `HANDOFF.md` current-state tracking.

No API keys, media, personal data, workspace outputs, or secrets were added.

## Expected impact

- Future AI/developers can reconstruct the intended product without relying on chat memory.
- Improvement selection becomes less likely to drift into flashy but low-value features outside CUT ONLY.
- Reliability, semantic quality, TTS/cut timing, cost, and review UX have a stable shared priority model.
- `HANDOFF.md` can remain a practical living status document without becoming the only place product philosophy is stored.
- User manual work remains intentionally minimized.

## Rollback

If this governance split proves unhelpful, revert the commits that introduced `PROJECT_MASTER_PLAN.md` and the corresponding `LOOP_ENGINEERING.md` master-plan contract. No runtime behavior or user media is affected.

## Next best hypothesis

Continue product work from the latest GitHub state using this order:

1. verify current source/PR and HANDOFF
2. read Master Plan before selecting work
3. choose the highest-value evidence-backed P0/P1/P2 issue
4. validate with targeted tests and FFmpeg E2E when available
5. keep HANDOFF current

Operationally, Mini PC self-hosted runner installation remains pending until the user runs the prepared commands; development/documentation work should not be blocked on that.