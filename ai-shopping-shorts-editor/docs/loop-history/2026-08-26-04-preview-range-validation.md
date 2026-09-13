# Loop 04 — Preview byte-range validation

- Starting HEAD: `b82c8cfb7f45d811bb304f7075487156c6b16a9c`
- Problem/evidence: `sendFile()` trusted the HTTP `Range` start/end values and directly derived `Content-Length` plus the file stream bounds. Malformed, reversed, out-of-file, or multi-range requests could therefore produce invalid response metadata or unstable preview behavior instead of a standards-compatible rejection.
- Change: added `parseByteRange()` with normal, open-ended, suffix, clamped-end, malformed, and unsatisfiable handling. `sendFile()` now returns HTTP 416 with `Content-Range: bytes */<size>` for invalid ranges and streams only validated ranges.
- Files changed: `src/core/utils.mjs`, `src/server.mjs`, `test/utils.test.mjs`, this record.
- Validation: locally ran `node --check` for the revised server and utility module and `node --test` for the new byte-range regression tests; 2/2 tests passed. GitHub Actions was not required.
- Expected impact: video seek/preview requests fail safely instead of generating invalid range responses; no AI calls, tokens, rendering cost, or output-editing behavior changed.
- Rollback: revert the commits adding `parseByteRange`, the `sendFile()` range guard, and `test/utils.test.mjs`.
- Next hypothesis: inspect preview/static serving path confinement and request lifecycle behavior for another concrete robustness issue before touching semantic editing logic.
