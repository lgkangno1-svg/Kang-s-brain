# Repository agent policy

## Mandatory fresh-state preflight before development

Before **every** coding, refactor, UI, architecture, debugging, test-repair, documentation-linked implementation, or deployment change, assume that Codex, ChatGPT, another AI agent, or a human developer may have changed the repository since the last conversation or run.

Do not trust remembered repository state as current.

At minimum, inspect the fresh GitHub state before editing:

1. latest default-branch head SHA;
2. recent commits relevant to the project;
3. open pull requests;
4. relevant active/diverged branches, especially branches owned by other concurrent agents;
5. the full project subtree for the target project;
6. project north-star / roadmap / handoff documents;
7. related workflow/CI state and production evidence when the change can affect release behavior.

For `projects/korea-avocadoss`, always inspect `docs/PRODUCT_MASTER_SPEC.md`, `docs/IMPLEMENTATION_ROADMAP.md`, `docs/PROJECT_HANDOFF.md`, the full `projects/korea-avocadoss` tree, relevant `korea-concierge/*` branches, and private `lgkangno1-svg/korea-concierge-ci` evidence before a material patch. A known Stitch/UI branch must be compared against current `main` before touching overlapping UI files. Never casually overwrite or duplicate another agent's unmerged work.

If fresh inspection shows concurrent/diverged work, reconcile deliberately: compare changed files/commits, decide whether to merge, port, supersede, or isolate, and document that decision. Do not continue from stale assumptions.

## Development execution policy

Repository development is performed directly by the active chat/Codex development session. Do not use OpenCode Go for coding, implementation, planning, debugging, refactoring, code review, test repair, repository exploration for development, architecture work, or unattended development loops.

The checked-in `.opencode/opencode.json` intentionally contains no `opencode-go/*` development model routing. Do not reintroduce Go models into build/general/plan/reviewer/code-reviewer/investigator/auto-build/deep agents or equivalent sub-agents.

OpenCode Go may still be used by application/runtime automation when the product itself intentionally calls the Go API for non-development business tasks. Runtime use does not authorize delegating repository development to OpenCode Go.

When development is requested, perform the work directly in the chat/Codex environment and validate it with the repository's normal tests and checks.
