# Korea Concierge — Living Project Handoff

**Last updated:** 2026-08-27  
**Repository:** `lgkangno1-svg/Kang-s-brain`  
**Project root:** `projects/korea-avocadoss`  
**Current phase:** Step 3 — Saju deterministic cultural core  
**Last completed implementation slice:** Step 2C-7 — supply-chain reproducibility / Step 2 closure  
**Step 2 merge on main:** `bf12dc22a986a1ad14eea24055575c2f129780d8` (PR #9)  
**Step 2 main CI:** run `33070371958` — SUCCESS  
**Latest product-policy merge on main:** `ef49f718f8c3fd04bd6ad7c2d0261b071e1844ce` (PR #8 — Gemini Live translation / Ultra Family policy)  
**Primary CI:** private `lgkangno1-svg/korea-concierge-ci` repository-scoped MiniPC runner  
**Production status:** **deployed** to `korea.avocadoss.co.kr` from exact public source SHA `774fe959e135f2db70d60ade37aa69ca173cf67c`; MiniPC `korea-concierge.service` serves Next.js 16.3.3 on port `3100` behind the existing Cloudflare Tunnel.  
**Production deployment verification:** private deploy workflow run `33076411784` attempt 2 — SUCCESS; diagnostic run `33077658031` — SUCCESS; local and public `/` return 308, `/en` returns 200 with `<html lang="en">`, and the legacy Japanese landing marker is absent.  
**Exact next implementation slice:** Step 3A — deterministic Saju calculation/input contracts before narrative AI or major UI work.

> This file is the cross-session/cross-AI source of current implementation context. Every material run must inspect latest `main`, recent commits, open PRs, the current project tree, this file and `IMPLEMENTATION_ROADMAP.md` before editing. Update this file in the same run whenever status, tests, decisions, blockers, security/privacy posture, AI cost, credit economics, production deployment or the next step changes.

## 1. Product intent
Korea Concierge is a mobile-first multilingual Korea companion for international visitors. It should be useful before payment, genuinely localized, deterministic/browser-local before AI, privacy-first for photos/birth/audio data, source-validated for changing travel facts, server-authoritative for future wallet/payment operations, cost-controlled for AI and crawlable/answer-first on public pages.

International visitors may not understand Korea-specific concepts. Major services such as Saju, Korean zodiac, personal color, Hanbok conventions and other cultural tools must provide a friendly localized “What is this?” explanation, what information is needed, what the user gets, limitations/privacy and a simple example before sensitive or paid input.

Food/restaurant discovery must support explicit dietary filters including Vegan, Vegetarian, Halal-certified, Muslim-friendly, pork-free, alcohol-free, gluten-free, seafood-free and relevant allergy needs. Never infer religion/diet from locale/name. Halal-certified, Muslim-friendly, pork-free and alcohol-free are distinct claims and must not be collapsed. Sensitive dietary claims require source/evidence plus verification date and uncertainty/cross-contamination disclosures where relevant.

## 2. Non-negotiable requirements
- **P0 locales:** `en`, `zh-CN`, `ja`, `zh-TW`, `vi`, `th`. P1: Indonesian/Malay. Explicit user choice always wins. Never infer nationality, ethnicity, religion or sensitive identity from name, face, voice or locale. Taiwan/Hong Kong analytics remain separable. English is a global fallback.
- **Saju:** exact / rough / unknown birth time are valid. Never fabricate or AI-guess a missing hour. Unknown time returns deterministic non-hour components only and must be reduced-scope/lower-priced when monetized. Raw birth date/time/city/name/account identifiers never go to an LLM.
- **Quick Help:** 0 credits, 0 AI, no external question transfer, P0 localized button/topic tree. No RAG/embeddings/LLM without measured need.
- **Security:** strict auth/validation, immutable/idempotent wallet later, verified payment callbacks, rate limits, dependency pinning, data minimization, EXIF stripping before future remote sensitive-media use, ZDR restrictions where applicable, safe logs, prompt instruction/data separation, source validation for AI-returned place facts, server-only long-lived secrets and no guessed CSP origins.
- **AI cost:** deterministic → static → cache → rules → browser-local → cheapest qualified Chinese OpenRouter model for ordinary text/vision. Compact payloads, bounded candidates/history, hard token/provider-cost ceilings, one retry by default, same-model provider fallback before escalation, p50/p95 telemetry without sensitive prompt bodies.
- **Credits:** `CREDIT_ECONOMICS.md` is authoritative. Basic/Advanced/Ultra one-time passes + optional top-ups; no subscriptions/ML personalized pricing without evidence. Fixed credits are shown before ordinary paid actions. Metered live translation uses a fixed visible unit rate. Wallet mutations later use immutable reserve/capture/release/refund semantics.

## 3. Approved real-time translation direction
The user explicitly prioritizes translation quality and selected **Google Gemini 3.5 Live Translate** as the default real-time spoken-translation provider candidate.

Authoritative policy file: `docs/LIVE_TRANSLATION.md`.

Current decision:
- direct Google Gemini API model `gemini-3.5-live-translate-preview`;
- this is a narrow exception to the ordinary OpenRouter-first text/vision routing policy;
- OpenRouter public search did not confirm this dedicated Live Translate endpoint at decision time;
- current official Google pricing snapshot is about `$0.0368/min` combined effective speech-to-speech audio cost;
- initial Ultra/Family fair-use hypothesis: **30 included minutes per Ultra Trip Pass**, then **8 credits/min**;
- Ultra remains a one-time Trip Pass at launch, not a recurring subscription;
- included minutes are intended to be shared by the future Ultra family/shared-wallet entitlement; exact member/device limits wait for Step 4 abuse-control design;
- do not advertise uncapped unlimited translation until measured economics support it;
- do not silently downgrade quality merely to save margin; adjust allowance/unit economics transparently instead.

Security architecture after auth exists:
1. server verifies account, Ultra/family entitlement, remaining allowance/credits and rate limits;
2. server requests a constrained short-lived Gemini ephemeral token;
3. client connects directly to Gemini Live API over WebSocket for lower latency;
4. long-lived Gemini key stays server-only;
5. raw microphone audio is not persisted by default and audio/transcript bodies are excluded from general/cost logs;
6. explicit source/target language selection always overrides future optional detection.

Implementation is intentionally scheduled **after Step 4 auth/wallet and Step 5 payment**, as Step 5B. Do not add a public microphone/API-key path before those server-authoritative entitlement controls exist.

## 4. Design workflow requirement
For future user-facing screen creation or substantial UI redesign, **Stitch MCP is the design-first tool**. Use Stitch to explore/define the mobile-first UI, then implement the chosen result in the existing Next.js architecture and run accessibility/i18n/performance regression checks.

The currently connected tool/plugin catalog in recent execution environments exposed no Stitch MCP endpoint. Re-check availability before each UI-design slice and never claim Stitch was used if it was not actually available.

For the future live translator screen, preferred UX is a simple mobile conversation tool rather than chatbot chrome: clear `Me` / `Other person` language controls, microphone/privacy state, swap languages, translated audio first, readable transcript second, stop/pause, remaining Ultra minutes or fixed metered rate, and text fallback.

## 5. Current architecture
- Next.js **16.3.3** + exact `next-intl@4.13.4`.
- Production P0 URL trees: `/en`, `/zh-CN`, `/ja`, `/zh-TW`, `/vi`, `/th`.
- Static reviewed dictionaries only; no runtime translation ML for site localization. Modular messages use recursive deep merge.
- `P0Locale` is the production compile-time boundary; broader research locales must not leak into routing.
- Complete localized public surfaces: Home, Personal Color, Hanbok, Gyeongbokgung, K-Culture, Credits.
- Complete P0 public URLs have self-canonical, reciprocal hreflang and `x-default` → English. Sitemap contains 36 canonical P0 URLs.
- `[locale]/layout.tsx` owns P0 root documents and emits `en`, `zh-Hans`, `ja`, `zh-Hant`, `vi`, `th`.
- `config/legacy-redirects.json` is the authoritative backwards-compatible unprefixed URL map. It maps six known former English URLs directly to English canonical equivalents via HTTP 308.
- No browser-language, IP, nationality or market inference participates in redirects.
- Ordinary AI gateway: OpenRouter. Approved future exception: direct Google Gemini Live API for real-time spoken translation only.

## 6. Primary CI architecture — private MiniPC runner
The public `Kang-s-brain` repository must **not** be attached directly to the production MiniPC self-hosted runner. Public pull requests can contain untrusted code, so the runner is instead repository-scoped to the separate private control repository `lgkangno1-svg/korea-concierge-ci`.

Current private CI setup:
- runner: `minipc-korea-concierge-ci-c49acd`;
- labels: `self-hosted`, `linux`, `x64`, `minipc`;
- dedicated runner directory: `/opt/github-runners/lgkangno1-svg__korea-concierge-ci`;
- dedicated service user; no sudo or Docker-group grant;
- service hardening hides `/home` and limits writable paths to the runner sandbox/private temp;
- private workflow clones public `Kang-s-brain` read-only over HTTPS without persisting source-repository credentials;
- accepted source targets are only `main` or an exact 40-character commit SHA;
- `target-ref.txt` update triggers an immediate exact-SHA run; scheduled runs test `main` hourly; manual dispatch remains available;
- the public `.github/workflows/korea-concierge-ci.yml` is GitHub-hosted **manual fallback only**, so normal development does not spend hosted Actions minutes.

Verification evidence:
- private run `33072758268` proved MiniPC checkout, Node 22/npm, lockfile policy, frozen install, P0 i18n, production build and document-language checks; its redirect step exposed a host port collision because port 3100 was already serving a different process;
- the private workflow was hardened to allocate a free loopback port dynamically and pass `REDIRECT_CHECK_ORIGIN` explicitly;
- private runs `33072901430` and `33073152447` passed the full gate including deterministic 308 redirects/query preservation on the MiniPC;
- exact latest-main pre-cutover MiniPC CI run `33076199204` passed lockfile, frozen install, P0 localization, production build, document-language and redirect checks before production cutover.

**Required CI procedure for future code changes:** before merging a Korea Concierge code PR/branch, write the exact public head SHA into private `korea-concierge-ci/target-ref.txt`, wait for the MiniPC run to pass, then merge. Scheduled `main` verification is additional drift detection, not a substitute for exact-head pre-merge verification. Never weaken the private-repository boundary merely to auto-run public PR code on the MiniPC.

## 6A. Production deployment — live
The legacy Japanese treasure-hunt origin was replaced on 2026-08-27 after exact-SHA validation and a one-time root bootstrap on the MiniPC.

Current production facts:
- `korea.avocadoss.co.kr` remains behind the existing Cloudflare Tunnel and MiniPC origin;
- production origin remains port **3100**, so no DNS or Cloudflare route change was required;
- `korea-concierge.service` is enabled and active and runs Next.js **16.3.3** as the dedicated unprivileged `korea-concierge` system user;
- active release points to `/opt/korea-concierge/releases/774fe959e135f2db70d60ade37aa69ca173cf67c/repo/projects/korea-avocadoss`;
- the one-time root bootstrap installed `korea-concierge.service`, `korea-concierge-deploy-request.path`, the request handler and exact-SHA deployment helper while leaving the private CI runner without sudo/Docker access;
- the first successful manual exact-SHA cutover stopped only the known legacy port-3100 process and passed local `/en` 200 + `/` 308 checks;
- diagnostic run `33077658031` independently confirmed `korea-concierge.service` active, current release SHA, local `/` 308, local `/en` 200, public `/` 308, public `/en` 200, English document language and no legacy Japanese marker;
- private production deploy workflow run `33076411784` was then re-run after helper hardening and **attempt 2 completed SUCCESS**, including exact-SHA preflight, root-owned deployment request and public Cloudflare verification;
- future deployments can be driven from the private CI repository without another user sudo step, provided the root-owned deployer remains installed and healthy.

Deployment security remains least-privilege:
- CI retains **no sudo/Docker privilege**;
- root deployer accepts only exact 40-character SHAs from the private runner request directory;
- each release is fetched from public GitHub at the exact SHA, lockfile-checked, installed with lifecycle scripts disabled and built as the dedicated app user;
- unknown processes on production port cause fail-closed aborts;
- local health-check failure triggers rollback;
- public Cloudflare route is checked after cutover before production success is claimed.

## 7. Completed roadmap
- Step 0 ✅ product/architecture/cost/SEO/international/security baselines.
- Step 1 ✅ deterministic P0 Quick Help, 0-AI/0-credit/no sensitive input.
- Step 2A ✅ pinned/validated i18n foundation.
- Step 2B ✅ native P0 Home/Culture/Gyeongbokgung, locale navigation, metadata and overflow safeguards.
- Step 2C-1A ✅ native P0 Personal Color, browser-local deterministic scan.
- Step 2C-1B ✅ native P0 Hanbok, free deterministic matcher.
- Step 2C-1C ✅ native P0 Credits, deterministic authoritative pricing display, no fake checkout.
- Step 2C-2 ✅ executable i18n + production-build gate.
- Step 2C-3 ✅ P0 canonical/hreflang/x-default + localized sitemap/robots cutover.
- Step 2C-4 ✅ correct P0 document language with generated-build verification.
- Step 2C-5 ✅ deterministic retirement of old unprefixed duplicates with executable HTTP redirect verification.
- Step 2C-6 ✅ shadowed legacy UI removed safely.
- Step 2C-7 ✅ real npm lockfile committed; frozen `npm ci`; full Step 2 executable gate green on PR and merged main.
- Private MiniPC CI ✅ isolated private control repo + full self-hosted gate green.
- Production deployment ✅ exact SHA `774fe959e135f2db70d60ade37aa69ca173cf67c` live behind Cloudflare; local/public health checks and automated deployment attempt 2 green.
- Product-policy PR #8 ✅ Gemini Live / Ultra Family translation direction documented and merged.

## 8. Step 2C-7 completion evidence
Step 2C-7 was rebased from the latest main in PR #9 after the Gemini Live planning merge so newer policy work was preserved.

The previously blocked GitHub Actions path recovered. A trusted Node 22 Actions run generated a real npm lockfile with lifecycle scripts disabled. The lockfile policy passed before commit. The reviewed graph has 106 package entries; all resolved tarballs use HTTPS `registry.npmjs.org`, all resolved packages have sha512 integrity, root manifest specifiers match `package.json`, and no package entry is missing license metadata. Runtime dependencies remain exactly pinned; dev dependency ranges are retained because the committed lockfile freezes their concrete versions and future updates should be deliberate lockfile reviews.

Temporary same-repository PR write jobs were used only to materialize the generated lockfile and synchronize closure documentation because the connector could not directly upload the generated artifact as a repository file. They were branch/actor constrained and removed before merge. The merged workflow used `contents: read`, SHA-pinned official actions, no persisted checkout credentials and no repository secrets. After MiniPC CI became primary, this public GitHub-hosted workflow was converted to manual fallback only.

Final read-only PR #9 workflow run `33070277051` succeeded with: lockfile policy → frozen `npm ci --ignore-scripts --no-audit --no-fund` → P0 localization contracts → Next.js production build/TypeScript → generated document languages → deterministic 308 legacy redirects and query preservation. After squash merge `bf12dc22a986a1ad14eea24055575c2f129780d8`, main workflow run `33070371958` passed the same complete gate. These are executable build/CI evidence; production deployment evidence is now separately recorded in §6A.

## 9. Real-time translation discovery evidence
### Google / OpenRouter
Official Google docs were reviewed for Gemini 3.5 Live Translate, pricing, Live API and ephemeral tokens. Fresh OpenRouter public search did not return the dedicated Live Translate model.

### GitHub
Fresh repository search reviewed `gordonxc/gemini-osd-subtitles` and `andyko208/sermon-realtime-translator`. They are useful references but are not adopted as dependencies because Korea Concierge needs its own entitlement, privacy, abuse-control and metering architecture.

### Hugging Face
Installed Hugging Face model search was attempted twice and returned tool-unavailable errors. No HF model was adopted. Re-run the gate at Step 5B implementation rather than pretending the search succeeded.

Decision details were recorded both in `OPEN_SOURCE_DISCOVERY.md` and `LIVE_TRANSLATION.md`.

## 10. Security / privacy / token / margin posture
Current infrastructure changes add **no application AI call, customer-data transfer, payment behavior, microphone capture or runtime dependency**. The private CI repository stores no production API credentials and does not grant its runner sudo/Docker access.

Production deployment follows least privilege:
- private runner may write only into its own sandbox;
- root deployer is a fixed root-owned script installed once by the user;
- only exact SHA deployment requests are accepted;
- build executes as dedicated unprivileged `korea-concierge` user;
- initial port replacement is limited to the known legacy process command;
- health-check failure triggers rollback;
- deployment does not require exposing Cloudflare credentials to GitHub Actions.

Future Gemini Live path requirements:
- long-lived key server-only;
- short-lived constrained token for client WebSocket;
- microphone consent and direct-Google transfer disclosure;
- server-authoritative entitlement/metering/rate limits;
- no raw audio persistence by default;
- no transcript/audio in cost logs;
- quality benchmark for Korean↔P0 before launch.

Current pricing hypothesis: 30 included Ultra minutes cost about `$1.104` raw at today's Google rate. Actual p50/p95 cost/usage must decide production allowance.

## 11. Exact next action
1. Re-inspect latest public `main`, recent commits, open PRs, roadmap and this handoff before editing.
2. Continue Step 3A: GitHub + Hugging Face discovery; exact/rough/unknown birth input types; deterministic conversion boundaries; privacy-safe fixtures/tests.
3. Before any merge, verify the exact head SHA through private MiniPC CI.
4. After a verified merge, deploy the exact desired production SHA through the private deploy workflow and require local/public post-cutover checks before claiming success.
5. Before substantial user-facing Step 3 UI work, re-check Stitch MCP and use it first when actually available.

## 12. Future order after Step 2
- Step 3: deterministic Saju cultural core + beginner explanations.
- Step 4: auth, immutable wallet, entitlements/family sharing/rate limits.
- Step 5: international payment foundation.
- **Step 5B: Gemini Live Translate Ultra/Family benefit.**
- Step 6: Personal Color hardening/premium boundary.
- Step 7: Hanbok recommendation v1.
- Step 8: verified discovery including Vegan/Halal/allergy-aware food filters.
- Step 9: itinerary/premium concierge.
- Step 10: analytics/market adaptation including live-translation minute/cost/latency metrics without conversation contents.

## 13. Deferred / do not accidentally start
- bulk Hanbok visual asset generation/collection;
- recurring subscription or ML-personalized pricing without evidence;
- runtime translation model for static site localization;
- RAG/embeddings/LLM for current Quick Help;
- Saju narrative AI before deterministic calculation/privacy boundary;
- checkout before authoritative wallet/payment callback foundations;
- public Gemini microphone/session path before auth/entitlement/rate limiting;
- browser-language/IP/nationality inference;
- attaching the public repository directly to the MiniPC self-hosted runner;
- granting the private CI runner general sudo or Docker access;
- guessed CSP origins;
- production-deployment claims without successful public post-cutover evidence.

## 14. Operations / recent change history
- 2026-08-27: private `korea-concierge-ci` repository and isolated MiniPC runner established.
- 2026-08-27: MiniPC CI full production-build gate passed after dynamic redirect-test port fix.
- 2026-08-27: public hosted CI converted to manual fallback to reduce GitHub-hosted minutes.
- 2026-08-27: production discovery identified Cloudflare → MiniPC port 3100 → legacy Japanese `korea-treasure-hunt-lp/server.js` path.
- 2026-08-27: secure exact-SHA deployer bootstrap installed on MiniPC without granting runner sudo/Docker rights.
- 2026-08-27: source SHA `774fe959e135f2db70d60ade37aa69ca173cf67c` built and cut over to production; `korea-concierge.service` active on port 3100.
- 2026-08-27: diagnostic run `33077658031` confirmed local/public 308 + 200, English document language and legacy marker removal.
- 2026-08-27: production deploy workflow run `33076411784` attempt 2 completed SUCCESS, proving future private-CI-driven exact-SHA deployment works end to end.

## 15. User action currently required
**None.** The one-time MiniPC root bootstrap and first production cutover are complete. Future normal CI and production deployments can run through the private MiniPC control repository without additional user sudo work. Merchant credentials, payment onboarding, production Google Gemini credentials and any future DNS/provider-specific setup remain deferred to their roadmap gates.
