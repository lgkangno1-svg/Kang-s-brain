# Korea Concierge — Security & AI Token Efficiency Baseline

**Date:** 2026-08-26  
**Goal:** protect user data and maximize contribution margin without reducing user-visible quality.

## 1. Core rules

1. No AI call when deterministic/local code can do the job reliably.
2. Never send more user data than a feature requires.
3. Never put raw secrets, auth tokens, payment data, full GPS history, raw birth data or unnecessary selfie metadata into prompts.
4. Every paid AI feature has a hard input-token limit, output-token limit, provider price ceiling, retry limit and maximum supplier-cost budget.
5. Every paid action reserves credits before work, captures only on success and releases/refunds on bounded failure.
6. Prompt size is an engineering metric, not an invisible implementation detail.
7. Security checks and cost checks run before model escalation.

## 2. AI-call elimination hierarchy

Before calling OpenRouter, attempt in this order:

1. deterministic calculation;
2. curated/static answer;
3. cached public result;
4. rule-based ranking/filtering;
5. browser-local computation;
6. smallest qualified OpenRouter model;
7. stronger Chinese model only after validation/evaluation failure.

Examples:
- Quick Help: static conversation tree → 0 API calls.
- Korean/Western zodiac: deterministic → 0 API calls.
- Saju pillars/calendar: deterministic → 0 API calls.
- Hanbok candidate ranking: weighted rules/embeddings if justified → no generative AI required.
- Nearby place filtering: database/geospatial ranking → no generative AI required.
- AI explains only the final small structured candidate set.

## 3. Prompt minimization

### Do
- send IDs, normalized attributes and compact structured facts instead of entire database records;
- filter candidates before prompting (normally <= 5–8 relevant places/looks);
- use short system instructions dedicated to one feature;
- use JSON-schema/structured output to avoid repair prompts;
- send derived Saju structures, never raw birth profile;
- send compressed preference enums rather than full conversation history;
- summarize prior context server-side when a multi-turn premium feature genuinely needs continuity;
- cache reusable public descriptions/translations where privacy permits.

### Do not
- append the entire PRD/product rules to each call;
- send every saved user preference when only two fields affect the result;
- resend full itinerary/place catalogs on partial re-plan;
- ask the model to repeat supplied source facts verbatim;
- use an LLM as a calculator, timezone converter, zodiac calculator or distance engine;
- allow unbounded conversation history.

## 4. Token budgets

Initial budgets are ceilings, not targets. Production p50 should normally be far below the ceiling.

- short explanation: target <= 500 input / <= 250 output tokens;
- recommendation explanation: target <= 900 input / <= 350 output;
- Saju narrative: target <= 900 input / <= 650 output;
- itinerary composition: target <= 2,000 input / <= 900 output;
- partial itinerary re-plan: send only affected block, target <= 1,000 input / <= 500 output;
- vision: resize/crop first, remove EXIF, request compact structured output, then optionally create user-facing prose from the structured result only if necessary.

Hard ceilings remain in `src/lib/ai/model-policy.ts` and should be tightened after real p95 measurements.

## 5. Retry and fallback policy

- 0 retries for deterministic validation errors that can be fixed locally.
- At most 1 bounded retry for transient/provider/schema failures unless a feature has explicit evidence for more.
- Try another provider for the same model before upgrading model tier.
- Model escalation requires a failed validation/quality gate, not impatience.
- Do not retry unsafe or privacy-ineligible routes.
- If a selfie has no eligible ZDR endpoint, fail closed to browser-local analysis.

## 6. Caching

Safe candidates:
- public attraction/cultural explanation fragments;
- localized static UI copy;
- public place-summary templates keyed by source version;
- deterministic calculation results that contain no account identifier.

Do not broadly cache:
- personal selfies or vision outputs tied to a person;
- raw or derived birth profiles unless explicitly saved by the user;
- private itinerary/profile payloads in shared caches;
- payment/auth responses.

Cache keys must include locale, source-data version and feature-version where relevant.

## 7. Security baseline

### Web
- strict TypeScript;
- security headers;
- no secrets in `NEXT_PUBLIC_*`;
- server-side authorization for every wallet/account mutation;
- CSRF-safe payment/auth flows;
- rate limits on auth, payment, AI and abuse-prone endpoints;
- input validation at every server boundary;
- output encoding / React default escaping; avoid unsafe HTML injection;
- dependency pinning and periodic vulnerability review;
- private/account/payment/result pages noindex where appropriate.

### Payments / credits
- authoritative product and amount created server-side;
- verify payment provider response/webhook amount, currency, order and status;
- webhook signature verification;
- idempotency on order creation, webhook processing and credit mutation;
- immutable ledger; never directly trust/edit a browser balance;
- atomic reserve/capture/release;
- auditable refunds and chargeback handling;
- no raw card data handled by Korea Concierge servers.

### AI
- OpenRouter key server-only;
- per-feature allowlist of models;
- provider price ceilings;
- ZDR + data-collection denial for sensitive media;
- logging stores model/provider/tokens/cost/latency/status but not sensitive prompt content;
- prompt-injection-resistant architecture: retrieved/public content is data, not trusted instructions;
- tool access allowlisted per feature;
- external URLs/places returned by AI are not trusted until validated against structured source data.

### Personal data
- data minimization;
- explicit consent for selfies and birth inputs;
- EXIF stripping before remote media transfer;
- deletion controls;
- no inference of race, ethnicity, religion, health, nationality or attractiveness from selfies;
- locale/nationality is never inferred from face/name.

## 8. Cost telemetry

For each AI usage event record:
- feature version;
- model;
- provider;
- input/output token counts;
- OpenRouter reported `usage.cost`;
- latency;
- retries;
- fallback/escalation count;
- success/validation state;
- credits reserved/captured/refunded.

Do not store sensitive prompt bodies for cost telemetry.

Dashboards should calculate:
- p50 / p95 cost per successful feature;
- p50 / p95 tokens;
- cost per captured credit;
- retry/escalation rate;
- margin by feature and Trip Pass;
- refund/failure rate;
- cache / zero-AI resolution rate.

## 9. Optimization triggers

Review a feature if any occurs:
- p95 supplier cost rises >20% week-over-week;
- retry rate >3%;
- fallback/escalation >5% without a quality justification;
- average token count grows >20% without measurable quality gain;
- paid feature margin falls below configured target;
- a cheaper Chinese model clears the evaluation threshold;
- a deterministic/local replacement becomes viable.

## 10. Security rollout gates

Before production domain cutover:
- dependency/security audit;
- auth authorization tests;
- credit/payment idempotency tests;
- webhook replay tests;
- input validation tests;
- rate-limit tests;
- XSS/open-redirect checks;
- sensitive-data logging inspection;
- prompt-injection and source-hallucination tests;
- photo EXIF/privacy tests;
- noindex/robots verification for private flows;
- CSP design finalized after payment/analytics/hosting origins are known.

A Content-Security-Policy should not be guessed early: finalize it after the actual payment widget, analytics and asset domains are selected, then enforce the smallest practical allowlist.
