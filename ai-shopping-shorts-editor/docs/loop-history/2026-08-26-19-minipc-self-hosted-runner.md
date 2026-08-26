# Loop 19 — Mini PC self-hosted CI

## Starting HEAD
`e474c0f56db86bcf761b26d4c75ed0b9bdad7248`

## Problem / evidence
The project workflow still used `runs-on: ubuntu-latest`, so automated QA depended on GitHub-hosted runners and did not exercise the user's actual Ubuntu Mini PC/FFmpeg environment. The user also reported hosted Actions minutes exhaustion in other repositories. Missing Actions/CI must not block Loop Engineering commits.

## Change
- Switched `.github/workflows/ai-shopping-shorts-editor.yml` to `[self-hosted, linux, x64, minipc]`.
- Added workflow concurrency cancellation so repeated Loop Engineering commits prioritize the newest ref.
- Added Node/npm/FFmpeg/FFprobe preflight plus `npm run demo` synthetic FFmpeg E2E after `npm run check`.
- Reduced workflow token permissions to `contents: read`.
- Prevented external fork pull requests from executing arbitrary code on the personal self-hosted Mini PC.
- Added `tools/minipc-runner/bootstrap.sh` for one-time package/toolchain/runner/systemd setup.
- Added `status.sh`, `remove.sh`, and `docs/MINIPC_SELF_HOSTED_RUNNER.md`.

## Validation performed
- The three shell helpers were created locally first and passed `bash -n` syntax validation before being committed.
- Existing workflow source was inspected before replacement and confirmed to use `ubuntu-latest` with only `npm run check`.
- GitHub write operations succeeded on the existing PR branch.
- Full self-hosted workflow execution cannot be validated until the physical Mini PC is registered and online; no GitHub Actions success is claimed yet.

## Expected quality / cost impact
- GitHub-hosted runner minutes are no longer required for this project's automated QA.
- CI now validates the actual FFmpeg-dependent E2E render path, not only unit/protocol tests.
- Fast repeated Loop Engineering commits should waste less runner time because older same-ref runs are cancelled.
- No OpenCode Go API calls or token costs are added.

## Security
The repository is public, so self-hosted execution of untrusted fork PR code would be unsafe. The job therefore runs for repository-owned PR heads only, with read-only `GITHUB_TOKEN` permissions.

## Rollback
Revert the self-hosted workflow commits and restore `runs-on: ubuntu-latest`. The Mini PC runner can be removed separately with `tools/minipc-runner/remove.sh` using a fresh GitHub removal token.

## Next best hypothesis
After the Mini PC is registered, run the workflow once and inspect the real job. The most valuable next improvement should be based on actual Mini PC evidence: missing runtime libraries, permission/workspace cleanup, FFmpeg runtime, disk pressure, or test failures. Do not add speculative runner complexity before that evidence exists.
