# Korea Concierge — Living Project Handoff

**Last updated:** 2026-08-28  
**Repository:** `lgkangno1-svg/Kang-s-brain`  
**Project root:** `projects/korea-avocadoss`  
**Phase:** Step 3 — deterministic/explainable K-Culture core  
**Current verified production application SHA:** `0a602765d26d3f238b8ac9c32e64aa138506d652`  
**CI/deploy control:** private `lgkangno1-svg/korea-concierge-ci`, isolated MiniPC runner

> Before every material patch inspect fresh main/recent commits/open PRs/full project tree, `IMPLEMENTATION_ROADMAP.md`, this handoff, private CI state and a fresh live-site preflight. Never infer state from chat history alone.

## 1. Product contract
Korea Concierge is a mobile-first multilingual companion for international visitors to Korea. Personalized results follow **result → evidence/data → alternative → uncertainty → action → method/privacy**. Visible numbers must come from deterministic calculation, measurement, verified facts or a documented rubric; never decorative precision.

P0 locales: `en`, `zh-CN`, `ja`, `zh-TW`, `vi`, `th`; P1 Indonesian/Malay. Explicit user choice wins. Never infer sensitive identity from photo/name/locale/voice.

## 2. Production reliability
The 2026-08-27 intermittent Cloudflare 1033/530/502 incident is **closed and monitored**. Production is `korea-concierge.service` on `127.0.0.1:3100`. Legacy `korea-server.service` was removed from active user-systemd configuration; its app was archived rather than destructively deleted. The Docker connector `n8n-server-cloudflared-1` is unrelated and must not be stopped as a Korea repair step.

Closure evidence includes stable local `/` 308 + `/en` 200, clean-reset 12/12 probes, two later independent 12/12 no-retry runs, and repeated full preflights. Pre-patch preflight at `2026-08-27T21:54:00Z` passed **8/8 no-retry stability, sitemap 36, 36/36 P0 routes, failures=0**. Post-deploy preflight at `2026-08-27T22:03:31Z` repeated **8/8 no-retry stability, sitemap 36, 36/36 P0 routes, failures=0**. Any sampled 1033/530/502 immediately reopens reliability priority.

Keep the 10-minute private `Korea Concierge Tunnel Stability Watch`, consecutive deploy probes and no-retry live preflight. Runner remains without general sudo/Docker access.

## 3. Existing explainable previews
Personal Color free preview may expose locally calculated undertone/depth/contrast/analyzer confidence/CIELAB values with limitations. Hanbok free matcher uses a transparent preference-fit rubric, not AI confidence or beauty scoring. Premium Personal Color/Hanbok remains future consented photo-based explainable AI after privacy/provider/cost gates.

## 4. Step 3A shipped foundations
Production includes exact/approximate/unknown birth-time contracts; unknown time is valid reduced scope and never gets a guessed hour; exact/approximate clock input requires IANA timezone; true-solar mode additionally requires longitude; raw DOB/time/city/timezone/longitude/name/account identifiers are stripped from narrative payloads. Policies are explicit `midnight` / `jasi` / `splitJasi` and `civil` / `true-solar`.

`npm run check:saju` gates deterministic fixtures. No runtime Saju calculator dependency has been added.

### Trusted 2024 Ipchun Year Pillar boundary
KASI official: **2024-02-04 17:27 KST**, minute precision. Independent implementation checks support the transition **癸卯 → 甲辰**. Trusted samples remain outside KASI's unresolved minute: 17:26 → 癸卯; 17:27 minute unresolved; 17:28 → 甲辰.

### Trusted 2024 Jingzhe Month Pillar boundary
KASI official: **2024-03-05 11:23 KST**, minute precision. Independent implementation checks support **丙寅 → 丁卯**. Trusted samples: 11:22 → 丙寅; 11:23 minute unresolved; 11:24 → 丁卯.

### Shipped 23:00 / 00:00 / 01:00 policy semantics
Production includes:
- `src/lib/saju/day-boundary-policy.ts`;
- `fixtures/saju/day-boundary-policy-fixtures.json`;
- `scripts/check-saju-day-boundary-policy.mjs` wired into `npm run check:saju`;
- `docs/SAJU_DAY_BOUNDARY_RESEARCH_2026-08-28.md`.

The three policies are intentionally different only where tradition differs:
- `midnight`: 23:00–23:59 keeps the civil-date Day Pillar and same-date hour-stem basis;
- `jasi`: 23:00–23:59 advances both displayed Day Pillar and hour-stem basis;
- `splitJasi`: 23:00–23:59 keeps displayed Day Pillar but advances the Hour-Pillar day-stem basis.

Reference fixture uses independently corroborated adjacent dates 2005-06-15 **庚午** and 2005-06-16 **辛未**. At 23:00: `midnight` → 庚午/丙子; `jasi` → 辛未/戊子; `splitJasi` → 庚午/戊子. At 00:00 all converge to 辛未/戊子; at 01:00 all converge to 辛未/己丑. Hour pillars are executable-checked using the Five-Rat rule, not generated prose.

Evidence posture: 6tail's explicit late-Zi sect semantics are **ADAPT**, Pillarwise adjacent-date/hour atlas and BaziInsight split behavior are independent corroboration, not universal cultural authority. Hugging Face model search was unavailable in this environment; no HF evidence is claimed. No attributable Threads evidence was adopted.

Release evidence:
1. fresh pre-patch production preflight passed 8/8 + 36/36;
2. exact branch head `224cacb59f5a492e02189a5f5bffbaeb7ed6c5c5` passed private MiniPC CI;
3. PR #18 squash-merged to production code SHA `0a602765d26d3f238b8ac9c32e64aa138506d652`;
4. exact merged SHA deploy completed with `status=success`;
5. post-deploy preflight passed 8/8 no-retry stability + sitemap 36 + 36/36 P0 routes + `failures=0`.

## 5. Remaining Step 3A order
1. True-solar longitude/equation-of-time branch-hour crossing.
2. Historical IANA timezone/DST fixture for foreign visitors.
3. Semantic lunar leap-month validity against trusted calendar data.
4. Evaluate exact pinned `manseryeok` only against trusted fixtures.
5. Beginner foreign-user exact/rough/unknown-time UX with minimal location input.
6. Deterministic full/reduced-scope chart output; unknown time returns reduced scope rather than a guessed hour.

## 6. Later K-Culture roadmap
After deterministic Saju foundations: Korean Zodiac → Western Zodiac/Astrology → Tarot → Daily Fortune. Deterministic mechanics first. Tarot randomization is independent of LLM interpretation. Astrology may not fabricate placements/ascendant from missing data. Daily fortune is reflective/cultural entertainment, not deterministic prediction or medical/legal/financial/high-impact advice.

## 7. Premium Naming Studio
Separate premium Korean/Asian naming consultation target remains about USD `$149–150`, with curated Top 3–5, Hangul/pronunciation/romanization, validated optional Hanja, meanings, rationale, Korean naturalness, generation feel, international pronunciation, pitfalls and clearly separated traditional Saju/onomastics. Scores require explicit rubrics/data.

## 8. Global-first payments
International visitor is the launch payer. PayPal Checkout remains leading candidate subject to fresh Korean merchant/policy verification. No production payment exists yet. Before money: auth, server-owned catalog/amounts, immutable/idempotent wallet/service-entitlement ledger, server-side create/capture, verified signed webhook, replay protection, refunds/reversals, rate limits and audit telemetry. Browser success never grants credits.

## 9. Architecture / release flow
Next.js `16.3.3`, `next-intl@4.13.4`, 36 canonical P0 URLs, reciprocal hreflang/x-default, deterministic 308 legacy redirects, frozen dependency installs. Public repo never attaches directly to production runner.

Mandatory release flow: fresh repo/live/private-CI preflight → isolated branch → private `target-ref.txt` exact 40-char branch head → MiniPC CI green → merge → private `deploy-ref.txt` exact merged SHA → local + consecutive public checks → full sitemap/P0 crawl.

## 10. Regression watch
Never weaken reliability gates, fabricate Saju hours/astrology placements, turn a convention choice into a confidence percentage, overstate source precision, send raw birth/photo/name PII to narrative AI, let a candidate library validate itself, infer lunar leap-month validity from shape alone, invent Hanja for foreign names, or ship checkout before signed-webhook/idempotent-ledger/refund foundations.

## 11. User action currently required
**None.** Continue autonomously. Ask only for merchant/provider credentials, DNS, or a narrowly scoped privileged MiniPC action when it is genuinely the final blocker.
