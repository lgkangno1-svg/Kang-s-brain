# Korea Concierge — Living Project Handoff

**Last updated:** 2026-08-28  
**Repository:** `lgkangno1-svg/Kang-s-brain`  
**Project root:** `projects/korea-avocadoss`  
**Current phase:** Step 3 — deterministic/explainable K-Culture core  
**Current production code SHA:** `6f70d14b93f7e191753acee4d28b3ba8847d3543`  
**Stitch UI:** LIVE in production  
**Primary CI/deploy control:** private `lgkangno1-svg/korea-concierge-ci` on the isolated MiniPC runner

> This is the cross-session/cross-AI source of truth. Before every material patch, inspect fresh `main`, recent commits, open PRs, the project tree, `IMPLEMENTATION_ROADMAP.md`, this handoff and the live public site. Never assume remembered state is current. Update this file whenever architecture, tests, production, security/privacy, cost, blockers or next priorities change.

## 1. Product intent
Korea Concierge is a mobile-first multilingual companion for international visitors to Korea. It should personalize recommendations while making them understandable: **result → evidence/data → alternative → uncertainty → action → method/privacy**.

A result must not merely say “you are Cool” or “this Hanbok suits you.” When we measure or deterministically calculate something, show useful numbers. Numbers are encouraged because users like data, but each visible value must come from an actual measurement, deterministic calculation, verified external fact or documented rubric. Never fabricate decorative precision or hidden chain-of-thought.

P0 locales are `en`, `zh-CN`, `ja`, `zh-TW`, `vi`, `th`; P1 Indonesian/Malay. Explicit user choice wins. Never infer nationality, ethnicity, religion, health or another sensitive identity from a photo, name, locale or voice.

## 2. Explainable Personal Color + Hanbok direction
The premium target is **user photo → explicit consent → AI/vision-assisted styling analysis → explainable recommendation**. Existing browser-local Personal Color and deterministic Hanbok tools are the free/private preview layer, not the final premium ceiling.

### Personal Color free preview
Current local analysis can expose actual calculated:
- undertone;
- depth;
- contrast;
- analyzer confidence;
- CIELAB `L*` lightness;
- warnings/limitations.

PR #11 originally contained unsupported numeric presentation. Before merge it was corrected so confidence is no longer artificially floored and a photo upload does not automatically claim “natural daylight detected.” Comparison palettes now come from the actual deterministic result.

### Hanbok free matcher
Current `0–100` score is a transparent **preference-fit rubric**, not AI confidence or an objective beauty score:
- palette 40;
- mood 25;
- walking/photo priority 15;
- backdrop 10;
- season 10.

Backdrop/comfort displays are derived from explicit selections. Future premium photo-aware Hanbok recommendations may add real photo evidence only after consent/privacy/provider gates are implemented.

### Premium photo safety
Before remote photo processing:
- explicit consent;
- strip EXIF;
- strict file/type/pixel limits;
- transient-by-default retention;
- no raw-photo logging;
- provider retention/ZDR review;
- server-only secrets;
- abuse/rate limits;
- fixed supplier-cost ceiling;
- no race/ethnicity/nationality/religion/health/emotion/attractiveness/identity inference.

## 3. Stitch UI production status
Codex used Stitch MCP for the frontend-expression layer.

- Stitch project: `5491471407117217005`
- design-system asset: `6183445483705617630`
- UI spec: `docs/UI_STITCH_SPEC.md`
- PR #11: `feat(ui): implement Stitch-designed explainable UI/UX system`
- corrected PR head: `1e2dcb8daaf6daac610e7b57785da81e64d61446`
- exact-head MiniPC CI: run `33085085859` — SUCCESS
- squash merge: `95a86da4554a9a027b39a5480c971aaa48939672`
- final main verification: run `33086070763` — SUCCESS
- production deployment: run `33086300976` — SUCCESS
- deployed SHA: `6f70d14b93f7e191753acee4d28b3ba8847d3543`
- production deploy health on first public retry: `/` = 308, `/en` = 200, `lang=en`, legacy marker absent
- post-deploy full live crawl: run `33086470253` — SUCCESS
- post-deploy crawl result: 36 sitemap URLs checked, all P0 routes 200, correct document languages/canonicals, root 308, `failures=0`

The Stitch production cutover is therefore **verified live**, not merely merged.

Design changes include contemporary parchment/silk/charcoal surfaces, Dancheong crimson and celadon accents, richer Personal Color/Hanbok result cards, K-Culture presentation, accessibility focus treatment and mobile bottom navigation.

## 4. Cloudflare Tunnel incident
The user observed Cloudflare Error `1033`, and earlier automated preflights observed intermittent `530/502` while the local Next.js origin remained healthy.

Sanitized diagnostics showed:
- `korea-concierge.service` active;
- local `/` 308 and `/en` 200;
- two `cloudflared` processes existed but no systemd cloudflared unit was registered;
- at one diagnostic moment public `/` returned 502 and `/en` 530.

The subsequent Stitch deployment public check succeeded immediately and the full 36-route post-deploy crawl also passed with zero failures. Treat this as an intermittent tunnel/connectivity risk rather than a proven app-route bug. Continue monitoring; do not expose tunnel tokens or process command lines in diagnostics. If it recurs persistently, inspect process ownership/cgroup/connection health and use only a narrowly scoped user/root action if genuinely necessary.

## 5. Saju / Four Pillars — current next implementation slice
Step 3A remains the next core work after this UI deployment.

Branch: `korea-concierge/step-3a-input-contracts`  
Last known validated head before fresh reinspection: `32c81989094b2a3b6e85dfa2e0346896857c9333`  
Earlier exact-SHA MiniPC CI: SUCCESS.

Existing contracts cover:
- Gregorian/lunar birth date;
- exact / approximate / unknown birth time;
- timezone/longitude requirements;
- `midnight` / `jasi` / `splitJasi` day-boundary policy;
- civil vs true-solar-time policy;
- unknown time reduced scope;
- whitelist narrative payload that removes raw DOB/time/location/name/account identifiers.

Rules:
- never guess a missing birth hour;
- exact/approximate/unknown are all valid user states;
- name is not required for Four Pillars;
- never invent Hanja for a foreign name to make Saju work;
- deterministic chart facts before narrative AI;
- separate calculation from traditional interpretation;
- beginner-friendly localized “What is Saju?” before sensitive input;
- show what missing/rough time changes.

Promising references found so far:
- `yhj1024/manseryeok` — MIT TypeScript, claims KASI lunar/solar-term data, true-solar/historical-time options and Four Pillars utilities; promising but requires trusted fixture/provenance checks before adoption.
- `6tail/lunar-javascript` — MIT, useful active cross-check/reference candidate.

## 6. Other K-Culture services
Planned under one coherent K-Culture Lab:
- Korean Zodiac;
- Western Zodiac/Astrology;
- Daily Fortune/Horoscope;
- Tarot.

Use deterministic mechanics first where applicable. Tarot card selection/randomization must be independent of the LLM. Astrology must not fabricate ascendants/placements from missing birth data. Daily fortune should present reflective themes/actions, not certain predictions. All are cultural/entertainment/reflection products, never medical/legal/financial/high-impact advice.

## 7. Premium Naming Studio
A separate premium Korean/Asian naming consultation is planned around **USD $149–150**, not as a cheap random-name generator.

Before naming, use a short localized questionnaire for desired style, modern/traditional balance, gender expression or neutral preference where relevant, mood, desired meanings, sounds/meanings to avoid, pronunciation/length and whether to echo the original name.

Return a curated Top 3–5 with, where valid:
- Hangul;
- romanization/pronunciation;
- validated optional Hanja alternatives;
- component and whole-name meaning;
- why it matches the questionnaire;
- Korean naturalness;
- modernness/generational feel;
- international pronunciation ease;
- nicknames;
- cultural/pronunciation pitfalls;
- optional traditional Saju/onomastics view clearly separated from modern naming quality.

Use current naming-frequency/trend evidence where legally/technically usable to avoid obviously dated names. Scores may be shown only from an explicit rubric/data source. Include 1–2 refinement rounds and aim for a report-style deliverable.

## 8. Payments — global foreign-customer first
Korean domestic checkout is not a launch priority. The target payer is an international visitor, so payment is USD/global-first.

Current leading initial candidate: **PayPal Checkout**, subject to final Korean merchant/account/policy verification. Do not blindly adopt a Merchant-of-Record provider if its acceptable-use rules conflict with human-in-the-loop naming/consulting services.

Ordinary launch economics remain:
- Basic: $7.99 / 120 credits
- Advanced: $14.99 / 400 credits
- Ultra: $24.99 / 1000 credits
- one-time Trip Passes + optional top-ups; no subscription at launch.

Premium Naming Studio should likely be a separate fixed-price service product (~$149), not disguised as credits.

**No production payment system exists yet.** Before money is accepted, implement:
- auth;
- server-owned product catalog/amounts;
- immutable/idempotent wallet/service entitlement ledger;
- server-side order creation/capture;
- verified signed webhook;
- replay/idempotency protection;
- refunds/reversals;
- rate limits/audit telemetry.

A browser “success” screen never grants credits or service by itself. Ask the user for merchant credentials only after the credential-free/test foundation is ready.

## 9. Real-time translation
Quality-first planned provider: direct Google `gemini-3.5-live-translate-preview`, after auth/wallet/payment.

Planning policy:
- rough cost `$0.0368/min` combined speech-to-speech;
- Ultra fair-use hypothesis: 30 included minutes then 8 credits/min;
- long-lived key server-only;
- short-lived constrained client credential;
- no raw audio persistence by default;
- explicit source/target language selection wins.

See `docs/LIVE_TRANSLATION.md`.

## 10. Architecture / CI / deployment
- Next.js 16.3.3 + exact `next-intl@4.13.4`.
- 36 canonical P0 public URLs.
- reciprocal hreflang + x-default.
- deterministic legacy redirects via HTTP 308.
- static reviewed locale dictionaries; no runtime ML for static copy.
- private primary CI repo: `lgkangno1-svg/korea-concierge-ci`.
- runner: `minipc-korea-concierge-ci-c49acd`.
- runner labels: `self-hosted, linux, x64, minipc`.
- runner has no general sudo/Docker privilege.
- public repo must never attach directly to the production MiniPC runner.
- public GitHub-hosted Korea Concierge workflow remains manual fallback only.
- production app: `korea-concierge.service`, MiniPC port 3100, Cloudflare Tunnel in front.
- deployment uses exact SHA, root-owned limited helper, local health checks and rollback protections.

Mandatory code merge flow:
1. inspect fresh main/PRs/tree/docs/live site;
2. implement isolated branch;
3. set private `target-ref.txt` to exact public head SHA;
4. require MiniPC CI green;
5. merge;
6. deploy exact desired public SHA via private `deploy-ref.txt`;
7. verify local + Cloudflare public route;
8. run full live P0 crawl before calling it shipped.

## 11. Security / cost / trust posture
- deterministic/static/cache/rules/browser-local before AI;
- bounded prompts, candidates, history, retries and provider spend;
- no sensitive raw prompt/photo/birth payloads in general logs;
- dependency/lockfile reproducibility and pinned actions;
- prompt instructions and untrusted source data kept separate;
- payment and wallet server-authoritative;
- source freshness/verification shown for place/food facts;
- dietary filters remain explicit: Vegan, Vegetarian, Halal-certified, Muslim-friendly, pork-free, alcohol-free, gluten-free, seafood-free and allergies; never infer religion/diet; Halal-certified != Muslim-friendly.

## 12. Completed foundations
- Step 0 ✅ product/architecture/cost/SEO/security baselines
- Step 1 ✅ zero-AI Quick Help
- Step 2A/B/C ✅ full P0 i18n/routing/SEO/document-lang/legacy cleanup/reproducible CI
- free Personal Color preview ✅
- deterministic Hanbok matcher ✅
- Credits preview/economics ✅
- private MiniPC CI ✅
- secure exact-SHA production deployer ✅
- explainable-personalization contract ✅
- Stitch UI system ✅ merged and production-verified
- Gemini Live policy ✅ documented
- Premium Naming Studio direction ✅ defined
- global-first payment direction ✅ defined; implementation not yet built

## 13. Current priorities
1. Continue Step 3A Saju deterministic calculation/input contracts after a fresh repo/live preflight.
2. Verify candidate Saju libraries against trusted boundary fixtures and Korean conventions.
3. Complete foreign-user birth-time/name UX: exact/rough/unknown time, no forced Hanja, minimal location input.
4. Continue Step 3B–E: explainable Saju → zodiac/astrology → tarot → daily fortune.
5. Step 4 auth + authoritative wallet.
6. Step 5 global USD payment foundation, PayPal candidate first after fresh provider-policy verification.
7. Then Gemini Live and premium consented photo analysis.
8. Continue Premium Naming Studio data/rubric/questionnaire research in parallel when it does not break roadmap dependencies.

## 14. Known risks / regression watch
- Cloudflare Tunnel has shown intermittent 1033/530/502 despite healthy local origin; latest post-deploy full crawl is clean.
- Do not turn Hanbok preference scores into fake AI confidence.
- Do not expose fake Personal Color certainty; keep real measured data and photo limitations.
- Do not send raw birth/photo/name PII to narrative AI.
- Do not fabricate missing Saju birth hour or astrology placements.
- Do not invent Hanja for foreign names.
- Do not ship checkout before webhook/idempotent ledger/refund foundations.
- Do not claim production deployment without exact-SHA + public verification.

## 15. Recent change history
- 2026-08-27: private MiniPC CI and secure exact-SHA production deployer established.
- 2026-08-27: old Japanese landing origin replaced by Next.js Korea Concierge.
- 2026-08-27: explainable photo-based Personal Color/Hanbok direction and K-Culture expansion defined.
- 2026-08-27: Premium Naming Studio (~$149–150) and global-first payment direction defined.
- 2026-08-27: Codex/Stitch PR #11 created; core review replaced unsupported numbers with measured data/deterministic rubrics.
- 2026-08-27: PR #11 merged; final main MiniPC CI run `33086070763` passed.
- 2026-08-27: production deploy run `33086300976` passed for `6f70d14b93f7e191753acee4d28b3ba8847d3543`.
- 2026-08-27: post-deploy live crawl run `33086470253` passed all 36 public P0 URLs with `failures=0`; Stitch UI is production-verified.

## 16. User action currently required
**None.** Continue autonomous development. Only request merchant/provider credentials, DNS changes or a narrowly scoped MiniPC root action when that becomes the genuine remaining blocker.
