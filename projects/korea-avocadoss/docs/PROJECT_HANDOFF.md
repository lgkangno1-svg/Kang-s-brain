# Korea Concierge — Living Project Handoff

**Last updated:** 2026-08-27  
**Repository:** `lgkangno1-svg/Kang-s-brain`  
**Project root:** `projects/korea-avocadoss`  
**Current phase:** Step 2 — final supply-chain gate  
**Last completed slice on main:** Step 2C-6 — shadowed legacy implementation cleanup  
**Main baseline inspected:** `e725bb15285890c54d5a2eb0e8e19d76b87f39d9`  
**Active work:** Step 2C-7 on PR #7 / branch `korea-concierge/step-2c7-lockfile`  
**Status:** partially prepared, executable lockfile generation currently blocked.

> This file is the cross-session/cross-AI source of current implementation context. Every material run must inspect latest `main`, recent commits, the project tree, this file and `IMPLEMENTATION_ROADMAP.md` before editing. Update this file whenever status, tests, decisions, blockers, security/privacy posture, AI cost, credit economics or the next step changes.

## 1. Product intent
Korea Concierge is a mobile-first multilingual Korea companion for international visitors. It should be useful before payment, genuinely localized, deterministic/browser-local before AI, privacy-first for photos/birth data, source-validated for changing travel facts, server-authoritative for future wallet/payment operations, cost-controlled for AI and crawlable/answer-first on public pages.

## 2. Non-negotiable requirements
- **P0 locales:** `en`, `zh-CN`, `ja`, `zh-TW`, `vi`, `th`. P1: Indonesian/Malay. Explicit user choice always wins. Never infer nationality, ethnicity, religion or sensitive identity from name, face or locale. Taiwan/Hong Kong analytics remain separable. English is a global fallback.
- **Saju:** exact / rough / unknown birth time are valid. Never fabricate or AI-guess a missing hour. Unknown time returns deterministic non-hour components only and must be reduced-scope/lower-priced when monetized. Raw birth date/time/city/name/account identifiers never go to an LLM.
- **Quick Help:** 0 credits, 0 AI, no external question transfer, P0 localized button/topic tree. No RAG/embeddings/LLM without measured need.
- **Security:** strict auth/validation, immutable/idempotent wallet later, verified payment callbacks, rate limits, dependency pinning, data minimization, EXIF stripping before future remote sensitive-media use, ZDR restrictions, safe logs, prompt instruction/data separation, source validation for AI-returned place facts, server-only secrets and no guessed CSP origins.
- **AI cost:** deterministic → static → cache → rules → browser-local → cheapest qualified Chinese OpenRouter model. Compact payloads, bounded candidates/history, hard token/provider-cost ceilings, one retry by default, same-model provider fallback before escalation, p50/p95 telemetry without sensitive prompt bodies.
- **Credits:** `CREDIT_ECONOMICS.md` is authoritative. Basic/Advanced/Ultra one-time passes + optional top-ups; no subscriptions/ML personalized pricing without evidence. Fixed credits are shown before paid actions. Wallet mutations later use immutable reserve/capture/release/refund semantics.

## 3. Design workflow requirement
For future user-facing screen creation or substantial UI redesign, **Stitch MCP is the design-first tool**. Use Stitch to explore/define the mobile-first UI, then implement the chosen result in the existing Next.js architecture and run accessibility/i18n/performance regression checks.

The currently connected tool/plugin catalog exposes no Stitch MCP endpoint. Step 2C-7 is supply-chain work and makes no UI changes. Re-check Stitch availability before Step 3 user-facing UI work and never claim it was used when unavailable.

## 4. Current architecture
- Next.js **16.3.3**, exact `next-intl@4.13.4`, React/React DOM **19.2.0**.
- Production P0 URL trees: `/en`, `/zh-CN`, `/ja`, `/zh-TW`, `/vi`, `/th`.
- Static reviewed dictionaries only; no runtime translation ML. Modular messages use recursive deep merge.
- `P0Locale` is the production compile-time boundary; broader research locales must not leak into routing.
- Complete localized public surfaces: Home, Personal Color, Hanbok, Gyeongbokgung, K-Culture, Credits.
- Complete P0 public URLs have self-canonical, reciprocal hreflang and `x-default` → English. Sitemap contains 36 canonical P0 URLs.
- `[locale]/layout.tsx` owns P0 root documents and emits `en`, `zh-Hans`, `ja`, `zh-Hant`, `vi`, `th`.
- `config/legacy-redirects.json` is the authoritative backwards-compatible unprefixed URL map; six known former English URLs redirect directly to English canonicals via HTTP 308.
- No browser-language, IP, nationality or market inference participates in redirects.

## 5. Completed roadmap
- Step 0 ✅ product/architecture/cost/SEO/international/security baselines.
- Step 1 ✅ deterministic P0 Quick Help, 0-AI/0-credit/no sensitive input.
- Step 2A ✅ pinned/validated i18n foundation.
- Step 2B ✅ native P0 Home/Culture/Gyeongbokgung, locale navigation, metadata and overflow safeguards.
- Step 2C-1A ✅ native P0 Personal Color, browser-local deterministic scan.
- Step 2C-1B ✅ native P0 Hanbok, free deterministic matcher.
- Step 2C-1C ✅ native P0 Credits, deterministic authoritative pricing display, no fake checkout.
- Step 2C-2 ✅ executable GitHub Actions i18n + production-build gate.
- Step 2C-3 ✅ P0 canonical/hreflang/x-default + localized sitemap/robots cutover.
- Step 2C-4 ✅ correct P0 document language with generated-build verification.
- Step 2C-5 ✅ deterministic retirement of old unprefixed duplicates with executable HTTP redirect verification.
- Step 2C-6 ✅ merged to main, shadowed legacy UI removed safely.
- Step 2C-7 ⏳ in progress; do **not** mark Step 2 complete until frozen install/build evidence exists.

## 6. Step 2C-6 final evidence
PR #6 workflow run `33016109548` succeeded before squash merge. It verified dependency installation, all P0 localization contracts, Next.js 16.3.3 production build/TypeScript, generated document-language checks, deterministic 308 legacy redirects, destination 200 responses and query preservation.

Existing workflow controls: full-SHA official checkout/setup-node, `contents: read`, no repository secrets, no persisted checkout credentials, Node 22, Next telemetry disabled, 15-minute timeout, path scoping and concurrency cancellation.

## 7. Step 2C-7 work prepared in PR #7
Fresh main was inspected before editing; no concurrent Korea Concierge change newer than `e725bb15285890c54d5a2eb0e8e19d76b87f39d9` was present.

Prepared on branch `korea-concierge/step-2c7-lockfile`:
- temporary CI step generates `package-lock.json` with `npm install --package-lock-only --ignore-scripts --no-audit --no-fund` inside the trusted GitHub Actions Node 22 environment;
- generated lockfile is configured to upload only on pull requests as a one-day artifact;
- `actions/upload-artifact@v4.6.2` was resolved from the official GitHub tag and pinned to full commit `ea165f8d65b6e75b540449e92b4886f43607fa02`;
- added `scripts/check-lockfile-policy.mjs`, which requires lockfileVersion 3, exact root manifest/lockfile specifier parity, HTTPS `registry.npmjs.org` tarball origins and sha512 integrity for resolved packages;
- no package-lock has been fabricated or committed yet;
- no switch to `npm ci` has been made yet.

## 8. Step 2C-7 discovery decision
### GitHub / npm
Reviewed npm's current `package-lock.json` and `npm ci` contract plus `lirantal/lockfile-lint`. npm documents that committed lockfiles represent an exact dependency tree and that `npm ci` requires a matching lockfile, fails on manifest drift and does not rewrite the lockfile.

`lockfile-lint` is relevant, but adding another npm dependency solely to verify a small lockfile policy would itself expand the dependency/supply-chain surface. The in-repo Node validator covers the currently required origin/integrity/root-parity checks without another package.

### Hugging Face
Fresh public Hub review found supply-chain-security models/Spaces including CycloneDX `cdx1` variants and a Space credential/dependency risk scanner. These may be useful in a future dedicated security/SBOM audit but do not generate or prove npm's concrete dependency resolution for this project.

A Hugging Face CPU Job was also attempted as an independent trusted executable environment using a Node 22 container, but the Hub returned **HTTP 402 Payment Required** because compute credit is unavailable.

**Decision:** no model/Space adoption. Generate the npm lockfile using a real npm executable environment; validate deterministically; then use frozen `npm ci`.

## 9. Current executable blocker
Three independent paths were checked:
1. local/container shell: public GitHub clone fails with `Could not resolve host: github.com`;
2. GitHub Actions: PR #7 commits create third-party check suites, but no new Korea Concierge Actions workflow run is being created at this time; the previous successful run remains `33016109548`;
3. Hugging Face Jobs: Node 22 CPU probe returns HTTP 402 Payment Required.

Because a real lockfile must be generated by npm, it is unsafe to synthesize one from registry metadata or hand-edit it. **Step 2C-7 and Step 2 therefore remain open.**

## 10. Exact continuation when an executable runner is available
1. Run the PR #7 workflow or an equivalent trusted Node 22/npm environment.
2. Generate `package-lock.json` with lifecycle scripts disabled.
3. Retrieve and inspect the generated artifact; run `node scripts/check-lockfile-policy.mjs`.
4. Commit the reviewed lockfile.
5. Change CI install to `npm ci --ignore-scripts --no-audit --no-fund` and remove the temporary lockfile-generation/artifact steps.
6. Wire `check-lockfile-policy.mjs` into CI before install/build.
7. Review resolved dev dependency versions before deciding whether direct dev ranges should be exact-pinned; do not change known-good runtime pins.
8. Rerun P0 i18n contracts, frozen install, production build, generated document languages and deterministic legacy redirect checks.
9. If all green, update `IMPLEMENTATION_ROADMAP.md`, this file and `OPEN_SOURCE_DISCOVERY.md`, merge PR #7, and close Step 2.
10. Only then begin Step 3 Saju deterministic core. Re-check Stitch MCP before designing Step 3 user-facing UI.

## 11. Security / privacy / token / margin impact of current partial work
- application AI/model calls added: **0**;
- CI AI/model calls added: **0**;
- runtime dependencies added: **0**;
- customer-data transfer added: **0**;
- browser-language/IP/nationality inference added: **0**;
- secrets/payment/wallet behavior changed: **0**;
- ML/dynamic pricing: **0**;
- incremental production supplier inference cost: **0**.

The only attempted external compute was a non-customer-data Hugging Face CPU probe, which did not execute because the account lacked compute credit.

## 12. Deferred / do not accidentally start
- Step 3 before Step 2C-7 frozen-install gate closes;
- bulk Hanbok visual asset generation/collection;
- subscription or ML-personalized pricing;
- runtime translation model;
- RAG/embeddings/LLM for current Quick Help;
- Saju narrative AI before deterministic calculation/privacy boundary;
- checkout before authoritative wallet/payment callback foundations;
- browser-language/IP/nationality inference;
- guessed CSP origins;
- production-deployment claims without evidence.

## 13. Smallest user/environment action if immediate continuation is required
Provide **one** executable Node/npm path with outbound package/GitHub access. The preferred option is restoring GitHub Actions availability for PR #7; an authorized self-hosted runner is equally sufficient. No merchant/DNS/OpenRouter credentials are needed for this step.
