# Korea Concierge — Credit Economics & Packaging

**Version:** 0.4  
**Date:** 2026-08-27  
**Status:** launch pricing hypothesis; server-configurable; must be recalibrated from real usage and conversion data.

## 1. Commercial objective

Credits are not a direct resale of AI tokens. The customer buys a useful Korea experience, while supplier cost is only one input into the price.

The product should maximize contribution margin without making pricing feel punitive or unpredictable.

Rules:

1. Keep public travel browsing, merchant discovery, basic zodiac results, and useful editorial content free.
2. Charge credits for computation-heavy personalization, premium reports, complex planning, and premium concierge work.
3. Show the exact credit price before every paid action.
4. A successful ordinary paid action costs a fixed number of customer credits even if the underlying model/provider/token count varies.
5. Failed or rejected jobs release/refund reserved credits automatically.
6. Record actual supplier cost per successful job and reprice from measured p50/p95 distributions.
7. Never let the browser decide credit price, balance, allowance, or minting.
8. Metered real-time services may use a fixed visible per-minute unit price, but entitlement and usage remain server-authoritative.

## 2. Why Trip Passes instead of subscriptions at launch

The first audience is international visitors with a short usage window. A recurring monthly subscription creates cancellation anxiety and reduces checkout conversion.

Launch with one-time, Higgsfield-style tiered packages, but call them **Trip Passes**:

| Plan | Price | Credits | Effective price / credit | Intended user |
|---|---:|---:|---:|---|
| Basic | $7.99 | 120 | ~$0.0666 | short solo trip / light personalization |
| Advanced | $14.99 | 400 | ~$0.0375 | recommended default for a several-day trip |
| Ultra | $24.99 | 1,000 | ~$0.0250 | couples, families, power users |

The higher tier gives visibly better value per credit without giving away enough credits to destroy margin.

At launch these are one-time purchases, not auto-renewing subscriptions. A recurring plan can be tested later for expats, repeat Korea visitors, creators, or merchant users after repeat-use evidence exists.

### Ultra / Family positioning

Ultra is the family/power-user Trip Pass. The current approved premium-benefit hypothesis adds quality-first real-time spoken translation:

- **30 Gemini Live Translate minutes included per Ultra Trip Pass**;
- included minutes are intended to be shared by the future Ultra family/shared-wallet entitlement;
- exact household member/device limits are deferred until Step 4 auth/wallet abuse controls exist;
- after the included allowance, continued live translation is initially priced at **8 credits per minute**;
- the unit price and remaining allowance must be visible before microphone activation and while the session is running;
- included minutes are a fair-use benefit, not an uncapped unlimited promise;
- unused included minutes do not convert to cash or normal credits.

At the current Google price snapshot of about `$0.0368/min`, 30 included minutes imply about **$1.104** direct translation supplier cost before operational reserve. With the existing Ultra protected AI supplier budget and conservative payment reserve, this keeps the planning contribution-margin envelope near the existing ~80% target. Recalculate from measured usage before launch.

Implementation details, privacy and provider policy live in `docs/LIVE_TRANSLATION.md`.

### Optional refill packs

After a user has already bought a pass and understands credit value:

- 60 credits — $4.99
- 160 credits — $9.99
- 400 credits — $19.99

Refills are deliberately less generous than Advanced/Ultra so the initial pass remains the best purchase path.

## 3. Free acquisition allowance

Recommended launch acquisition policy:

- public travel/restaurant/attraction browsing: free;
- first basic personal-color scan: free;
- zodiac / Korean zodiac result: free;
- optional new-account promo: small promotional balance only after anti-abuse controls are working;
- promotional credits are a separate ledger bucket and may have a disclosed expiry;
- purchased credits should not expire at launch unless legal/payment-policy review explicitly approves an expiry policy.

Do not grant enough free credit to perform every premium flow. The free layer should demonstrate value, then lead naturally to the first paid action.

## 4. Current feature pricing hypothesis

| Feature | Credits | Default cost strategy |
|---|---:|---|
| First personal-color scan | 0 | local/deterministic first |
| Repeat personal-color scan | 3 | local/deterministic |
| Detailed color report | 8 | cheap Qwen text explanation |
| Premium remote photo color review | 20 | Qwen vision, privacy-gated |
| Hanbok match | 8 | deterministic rank + cheap text explanation |
| AI itinerary | 12 | DeepSeek complex composition after deterministic filtering |
| Partial itinerary re-plan | 4 | bounded DeepSeek/Qwen composition |
| Korean / Western zodiac | 0 | deterministic |
| Saju quick summary | 3 | deterministic chart + short Qwen explanation |
| Full Saju cultural reading | 15 | deterministic chart + bounded Qwen/DeepSeek narrative |
| Extended Saju reading | 25 | longer bounded narrative |
| Standard Korea concierge answer | 2 | short Qwen response |
| Premium multi-step concierge answer | 8 | DeepSeek only when complexity warrants it |
| Ultra real-time translation included allowance | 0 credits for first 30 min | Gemini Live Translate, server-metered fair use |
| Real-time translation after Ultra allowance | 8 credits / min | fixed visible metered unit price |

These prices intentionally include a large value margin above inference cost. The cheapest AI call should not force the product to charge fractions of a cent for a feature that has meaningful user value.

## 5. Supplier cost accounting

### OpenRouter usage

OpenRouter includes usage accounting in each API response, including token counts and `usage.cost`. Store the following on each `usage_event`:

- feature id / feature-price version;
- request id and OpenRouter generation id;
- model and provider;
- prompt/completion/reasoning/cached tokens where available;
- OpenRouter `usage.cost`;
- upstream inference cost when supplied;
- retries/fallback count;
- latency;
- success/failure/refund status;
- customer credits charged;
- no sensitive prompt/image contents in the accounting record.

Source: https://openrouter.ai/docs/cookbook/administration/usage-accounting

OpenRouter's FAQ currently states a **5.5% funding fee** when purchasing platform credits (with a minimum fee). Treat that as an additional AI funding cost, not as part of the model's headline inference rate.

Source: https://openrouter.ai/docs/faq

### Gemini Live translation usage

For real-time translation, record the smallest non-sensitive metering record needed for entitlement and economics:

- feature-price/fair-use version;
- account/family entitlement ID;
- provider/model version;
- billable audio seconds/minutes;
- included Ultra minutes consumed;
- credits captured after included allowance;
- provider cost when available;
- session/reconnect count and latency metrics;
- success/failure status;
- **no raw microphone audio or transcript body** in cost/accounting logs.

Google pricing observed on 2026-08-27 for `gemini-3.5-live-translate-preview` is approximately `$0.0368/min` combined effective speech-to-speech audio cost. Re-check before launch.

### Guarded supplier cost

For ordinary OpenRouter features until production distributions are stable:

`guarded_cost = raw_supplier_cost × 1.055 × 1.25`

- 1.055: current OpenRouter funding fee allowance;
- 1.25: provider fallback/retry/cost-drift reserve.

For direct Gemini Live translation, do not apply the OpenRouter 1.055 funding factor. Use:

`guarded_live_cost = raw_google_cost × live_operational_reserve`

Start with a conservative reserve of at least `1.25` until actual reconnect, failed-session and price-drift distributions are known.

## 6. Internal credit cost ceiling

Set an initial protected supplier-cost budget for ordinary redeemed credits of:

> **$0.001 guarded supplier cost per redeemed customer credit**

This is an internal risk limit, not the retail value of a credit.

At full redemption the ordinary AI reserve is therefore at most roughly:

- Basic: $0.12 supplier budget;
- Advanced: $0.40 supplier budget;
- Ultra: $1.00 supplier budget.

Ultra's included live-translation allowance is a separately budgeted acquisition/retention benefit and must not be hidden inside the `$0.001/credit` assumption.

Using a conservative payment reserve of 10% of revenue + $0.35 fixed per transaction, the original ordinary-feature worst-case contribution margin remains above roughly 80% for all three launch passes before tax and fixed company overhead. At today's ~$0.0368/min Google price, 30 Ultra included minutes add ~$1.104 raw supplier cost; the combined Ultra planning margin remains close to the ~80% launch protection target before a live-specific operational reserve. If measured p95 usage/cost erodes the target, reduce included minutes, raise post-allowance unit credits or revise Ultra pricing transparently rather than silently degrading model quality.

## 7. Feature repricing algorithm

The user-facing charge should not fluctuate per token. Repricing is an offline/admin decision.

For every feature and model tier, track rolling 7/30-day:

- successful executions;
- p50/p90/p95 supplier cost;
- cost per successful result including retries;
- average credits charged;
- refund/failure rate;
- conversion into the feature;
- repeat usage;
- feature satisfaction where measurable.

For live translation additionally track:
- p50/p95 minutes consumed per Ultra buyer/family;
- percentage exhausting included minutes;
- reconnect/drop rate;
- p50/p95 end-to-end latency;
- post-allowance continuation rate;
- supplier cost per successful translated minute;
- user correction/satisfaction rate.

Trigger a review when any of these occur:

1. p95 guarded supplier cost exceeds the internal supplier budget implied by the feature's credits;
2. estimated variable gross margin drops below 85% for ordinary credit actions or materially below the explicitly approved Ultra live-benefit envelope;
3. retry/escalation/reconnect rate rises materially;
4. a cheaper model clears the feature evaluation bar;
5. a feature is high-value but underpriced relative to demand;
6. a feature consumes credits but causes user confusion or poor retention;
7. Ultra live-translation usage makes the fair-use allowance economically unsafe or too restrictive for real visitors.

Do not automatically raise prices from one anomalous request.

## 8. Model-cost snapshot used for launch design

Observed around 2026-08-26/27; re-check before production because prices/providers change:

- `qwen/qwen3-30b-a3b-instruct-2507`: about $0.04815/M input + $0.1931/M output at the lowest observed OpenRouter route;
- `deepseek/deepseek-v3.2`: about $0.21/M input + $0.31–0.32/M output on low-priced OpenRouter routes;
- `qwen/qwen3.5-35b-a3b`: about $0.14/M input + $1.00/M output;
- OpenRouter web search tool, if ever used: currently about $0.005/search request on several engines;
- Google `gemini-3.5-live-translate-preview`: about **$0.0368/min** combined effective audio input/output cost.

OpenRouter provider routing supports price sorting and `max_price` filters. Ordinary production features should use explicit model tiers and cost ceilings instead of `openrouter/auto`. Gemini Live translation is a documented direct-provider exception because quality/latency is the primary requirement.

Sources:
- https://openrouter.ai/qwen/qwen3-30b-a3b-instruct-2507
- https://openrouter.ai/deepseek/deepseek-v3.2
- https://openrouter.ai/qwen/qwen3.5-35b-a3b
- https://openrouter.ai/docs/guides/routing/provider-selection
- https://openrouter.ai/docs/guides/features/server-tools/web-search
- https://ai.google.dev/gemini-api/docs/pricing
- https://ai.google.dev/gemini-api/docs/models/gemini-3.5-live-translate-preview

## 9. Margin-protection rules

- deterministic/local calculation before LLM;
- cheapest Chinese model that passes evaluation for ordinary AI work;
- quality-first Gemini Live route for real-time translation unless benchmarks justify a cheaper equivalent;
- hard input/output token ceilings per ordinary AI feature;
- hard session/day/minute ceilings for live translation;
- structured output to reduce repair calls;
- public/non-sensitive reusable answers may use caching where privacy policy allows;
- never enable response caching for sensitive selfie/Saju personal data paths;
- never persist live microphone audio by default;
- filter local travel candidates before prompting instead of paying the model to read large inventories;
- avoid OpenRouter web search for facts already present in our curated/official data layer;
- no invisible model upgrade that changes unit economics;
- premium fallback only after verifier/evaluation failure;
- actual provider usage/cost, not static estimates, is the accounting source of truth.

## 10. Ledger architecture

The authoritative wallet is an immutable ledger, not a mutable `credits_remaining` field.

Minimum production entities:

- `credit_ledger` — immutable grant/reserve/capture/release/refund/expire adjustments;
- `credit_wallets` — derived/cache balance for fast reads;
- `feature_prices` — versioned fixed customer prices;
- `usage_events` — feature execution + actual supplier cost;
- `payment_orders` — payment-provider lifecycle;
- `credit_products` — pass/top-up catalog and server-owned prices;
- `entitlements` or equivalent server-owned benefit record — Ultra/family live-translation allowance and future shared-plan benefits.

Every payment webhook and every feature charge must be idempotent. Credit reserve + usage creation should be atomic; capture on success, release on failure.

For metered live translation, the server owns the allowance and credit meter. The client may display remaining time but never decides it. Short-lived Gemini session tokens must only be issued after server-side entitlement/rate-limit validation.

A full Kafka/CQRS microservice is unnecessary for launch traffic. Start with Postgres transactions + immutable ledger + idempotency keys; add an outbox/event pipeline only when operational scale requires it.

## 11. Product UX

Before a paid action, button copy should communicate cost clearly, e.g.:

- `Generate my full report · 8 credits`
- `Build my itinerary · 12 credits`
- `Get full Saju reading · 15 credits`

For Ultra real-time translation:
- before microphone activation show `30 minutes included with Ultra` and remaining allowance;
- after allowance show the fixed `8 credits/min` rate before continuing;
- show a live remaining-minute/credit meter without exposing model/token jargon;
- stop safely at entitlement/credit boundaries instead of allowing unbounded supplier spend.

The confirmation should show remaining balance after ordinary fixed actions. Do not show token counts or model names unless the user opens technical details.

When balance is insufficient, show the recommended pass/refill based on the exact action they attempted rather than sending every user to a generic pricing wall.

## 12. Experiments after launch

Test in this order:

1. $7.99 vs $8.99 Basic price;
2. Advanced label/position as default recommendation;
3. first-purchase bonus credits instead of a cash discount;
4. bundles such as `Style Day`, `Palace Day`, or `Culture Pack` that consume the same ledger credits;
5. Ultra family/shared wallet behavior and real-time translation usage;
6. 30-minute included live allowance vs measured visitor need, without lowering translation quality merely to save cost;
7. recurring membership only after repeat-use cohort proves it is wanted.

Do not introduce personalized/dynamic customer pricing from an ML model at launch. Public fixed pricing is easier to trust, explain, test, and audit.
