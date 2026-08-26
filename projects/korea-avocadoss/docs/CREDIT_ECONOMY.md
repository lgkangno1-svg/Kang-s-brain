# Korea Concierge — Credit Economy

**Version:** 0.1  
**Date:** 2026-08-26  
**Status:** launch hypothesis; server-configurable

## Objective

Credits should make premium features feel simple to foreign visitors while protecting gross margin from model-price changes, retries, refunds, payment fees and future third-party API costs.

The system is **prepaid**. Free public travel discovery remains useful; credits monetize personalized computation and premium convenience.

## Plans

| Plan | Price | Credits | Effective price / credit | Positioning |
|---|---:|---:|---:|---|
| Basic | $6.99 | 300 | $0.0233 | One-trip light use |
| Advanced | $14.99 | 850 | $0.0176 | Default / best-value anchor |
| Ultra | $29.99 | 2,200 | $0.0136 | Power users, couples, groups |

These are one-time prepaid packs, not subscriptions. Subscription packaging can be tested only after repeat-use behavior exists.

The larger pack gives visibly better value without collapsing the revenue floor. All feature-margin tests therefore use **Ultra's effective price per credit**, the cheapest customer revenue per credit.

## Launch feature prices

| Feature | Credits | Planning variable cost ceiling | Revenue at Ultra rate | Approx. variable margin* |
|---|---:|---:|---:|---:|
| First personal-color scan | 0 | $0.0002 | acquisition | subsidized |
| Detailed personal-color report | 4 | $0.0010 | ~$0.0545 | ~98% |
| Premium photo color review | 12 | $0.0080 | ~$0.1636 | ~95% |
| Hanbok match | 5 | $0.0015 | ~$0.0682 | ~98% |
| Premium Hanbok photo review | 15 | $0.0100 | ~$0.2045 | ~95% |
| AI itinerary | 8 | $0.0070 | ~$0.1091 | ~94% |
| Itinerary re-plan | 3 | $0.0045 | ~$0.0409 | ~89% |
| Saju cultural reading | 8 | $0.0025 | ~$0.1091 | ~98% |
| Premium concierge answer | 10 | $0.0080 | ~$0.1363 | ~94% |

*Before payment fees, taxes, support, content/data vendors and fixed infrastructure. These margins are therefore **AI/feature variable-margin indicators**, not accounting gross margin.

## Pricing rule

Feature price is the greater of:

1. **cost-protection floor**, calculated from conservative p95 variable cost and cheapest revenue per credit; and
2. **value price**, based on user utility and willingness to pay.

Do not price expensive-looking experiences only at their raw token cost. A personalized itinerary or Saju interpretation may cost fractions of a cent in model inference but carries much higher user value.

### Cost-protection formula

For target variable margin `M`:

`required revenue = estimated p95 variable cost / (1 - M)`

`minimum credits = ceil(required revenue / cheapest effective USD per credit)`

The code implementation lives in `src/lib/credits/economics.ts`.

## Cost accounting

Each `usage_event` should capture, without sensitive prompt contents:

- feature key;
- quoted credit price/version;
- model slug;
- OpenRouter provider when available;
- input/output/cached tokens;
- OpenRouter-reported or calculated AI cost;
- non-AI API cost estimate;
- retries/escalations;
- latency;
- success/failure/refund state.

Daily/weekly reporting should compute p50, p95 and p99 cost per successful result. Feature prices change only from measured distributions or deliberate merchandising tests.

## Margin guardrails

- Use the **cheapest pack rate** when checking feature economics.
- Target at least 80% feature-level variable margin at p95 cost unless a feature is intentionally subsidized for acquisition.
- Maintain a 15% retry/refund reserve in planning.
- Maintain configurable payment-fee reserves until actual Toss/PayPal merchant rates are contracted and measured; current engineering placeholders are 6% + $0.35/order and are **not claims about provider pricing**.
- Never let `openrouter/auto` select arbitrary expensive models for credit-priced production features.
- A model escalation must remain inside the feature's maximum cost ceiling or trigger a controlled failure/refund.
- Promotional credits are separate ledger grants and may expire; purchased credits should not silently expire at launch.
- Never expose internal model costs or profit margins in customer UI.

## Merchandising principles

### Basic
Entry purchase with enough credits to experience several premium features. Its job is conversion, not maximum ARPU.

### Advanced
Default visual emphasis. It should feel clearly better than Basic and cover a typical Seoul trip's premium personalization needs.

### Ultra
Lowest cost per credit, but still margin-protected. Position for couples/groups and repeated use rather than pretending it is an unlimited plan.

Avoid unlimited AI plans during MVP. They make abuse and model-cost spikes difficult to control.

## Repricing triggers

Revisit credit quantities or feature prices when any of these occurs:

- p95 feature variable margin falls below target;
- OpenRouter price changes materially;
- a model route is replaced;
- paid data/map/booking APIs are introduced;
- refund or retry rate changes materially;
- payment fee data becomes contractual/observed;
- conversion data shows obvious under/over-pricing;
- group usage creates materially different economics.

## Product UX

Before every paid action, show:

- exact credits required;
- user's current balance;
- resulting balance;
- what the user receives;
- failure/refund assurance.

Do not show token counts, model names or complicated cost mechanics to normal users.
