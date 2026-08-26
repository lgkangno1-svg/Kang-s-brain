# Korea Concierge — OpenRouter AI Routing Policy

**Version:** 0.1  
**Date:** 2026-08-26  
**Gateway:** OpenRouter only

## Why this exists

Korea Concierge must not treat every feature as an LLM problem. The routing policy has four goals:

1. use deterministic/local computation before paid AI;
2. keep selfie and birth-related workflows privacy-first;
3. select the least-expensive model that reliably meets the UX quality bar;
4. make model changes configuration-driven rather than scattered through feature code.

Model availability and pricing change frequently. The IDs below are a launch baseline, not permanent product truth. Re-benchmark before production and periodically afterward.

## Baseline model pool

### `google/gemini-2.5-flash-lite`
Use for inexpensive multilingual text work: short explanations, rewrite/translation assistance, structured summaries, lightweight Hanbok reasoning from already-derived inputs, and low-complexity cultural explanations.

OpenRouter price snapshot on 2026-08-26: approximately $0.10/M input and $0.40/M output.

### `openai/gpt-5.6-luna`
Use for higher-quality non-sensitive text synthesis where the extra quality materially improves the visitor experience: itinerary composition, multi-constraint recommendation explanation, premium result narratives, and cross-feature concierge responses.

OpenRouter price snapshot on 2026-08-26: approximately $0.20/M input and $1.20/M output.

Do not send raw selfies, raw birth profiles, precise location history, payment data, or other sensitive payloads to a route that does not meet the feature privacy policy.

### `google/gemini-2.5-flash`
Use for opt-in multimodal analysis when an actual image must leave the browser. Require an OpenRouter provider policy that denies data collection and enforces Zero Data Retention.

OpenRouter price snapshot on 2026-08-26: approximately $0.30/M text/image input and $2.50/M output.

## Feature routing

| Feature | Default execution | AI model if needed | Raw sensitive input allowed? |
|---|---|---|---|
| Basic personal color | Browser/local deterministic image statistics | None | No upload |
| Detailed color explanation | Derived color features only | `google/gemini-2.5-flash-lite` | No |
| Premium visual color review | Opt-in vision | `google/gemini-2.5-flash` | Selfie only with explicit consent + ZDR |
| Hanbok ranker | Deterministic weighted scoring | None | No |
| Hanbok explanation | Structured recommendation facts | `google/gemini-2.5-flash-lite` | No |
| Hanbok photo-based premium review | Opt-in vision | `google/gemini-2.5-flash` | Photo only with explicit consent + ZDR |
| Basic attraction/restaurant ranking | Structured place data + deterministic ranking | None | No |
| Itinerary composition | Ranked place candidates + constraints | `openai/gpt-5.6-luna` | No precise history; use current task location only when necessary |
| Short translation/helper copy | Text only | `google/gemini-2.5-flash-lite` | Avoid sensitive data |
| Korean zodiac | Deterministic calculation | None | No |
| Western zodiac | Deterministic calculation | None | No |
| Saju pillars/elements | Deterministic calculation on server | None | Raw birth inputs stay server-side |
| Saju narrative | Derived pillars/elements, no raw date/time/name | `google/gemini-2.5-flash-lite` initially | No raw birth data |
| Premium cross-feature concierge | Sanitized profile + ranked candidates | `openai/gpt-5.6-luna` | No raw media/payment/birth profile |

## Privacy routing rules

### Selfies and user photos

Default personal-color analysis is local/browser-side. If a premium workflow genuinely requires remote vision:

- obtain explicit purpose-specific consent before upload;
- resize/crop to the minimum image needed;
- strip EXIF metadata client-side;
- do not infer race, ethnicity, nationality, religion, health, attractiveness or identity;
- call OpenRouter with `provider.zdr = true` and `provider.data_collection = "deny"`;
- do not enable OpenRouter prompt/content logging for production keys;
- do not persist source photos unless the user explicitly requests a saved visual feature and retention is disclosed.

If no eligible ZDR provider is available, fail closed and offer the local analysis instead. Never silently relax the privacy constraint to make a request succeed.

### Birth data / Saju

The LLM should never need the user's raw birth date, birth time, name, email or exact birth location. A deterministic server module should calculate the traditional calendar-derived representation first. Only the minimum derived, non-identifying structure needed for an entertainment explanation is sent to AI.

### Location

Prefer a one-shot current-area input over stored location history. The itinerary prompt should operate on candidate place IDs, walking times and area labels whenever possible instead of raw GPS traces.

## OpenRouter request policy

For sensitive multimodal requests:

```json
{
  "provider": {
    "zdr": true,
    "data_collection": "deny",
    "require_parameters": true
  }
}
```

For non-sensitive requests, use OpenRouter's normal provider routing unless a benchmark or reliability requirement justifies a stricter route. Provider failover for the same model is preferred over an automatic jump to a much more expensive model.

Do not use `openrouter/auto` for credit-priced production features until cost variance and model-quality variance are measured. A fixed feature-to-model policy makes credit economics auditable.

## Cost-control rules

- Never send full place catalogs to the LLM. Rank/filter with code first, then send a small candidate set.
- Never ask an LLM to calculate deterministic zodiac/Saju calendar values.
- Cache reusable public explanations and translations.
- Cap output tokens per feature.
- Prefer structured JSON outputs for recommendation explanations so UI copy can be rendered without retries.
- Record model ID, provider, latency, input/output tokens, estimated API cost and feature execution ID for cost analytics; never log sensitive prompt contents.
- Credit price must be based on a conservative percentile of measured API cost, not a single happy-path request.
- Expensive fallback models require an explicit feature-level policy and maximum-cost guard.

## Quality-control rules

Each AI feature needs a small evaluation set before production. Evaluate:

- correctness against deterministic inputs;
- multilingual clarity and naturalness;
- hallucinated place/shop claims;
- cultural stereotyping;
- privacy leakage;
- JSON/schema adherence;
- latency;
- token cost;
- user usefulness.

Model promotion is based on measured quality/cost, not leaderboard reputation alone.

## OpenRouter operational settings

Production account/key policy should:

- keep OpenRouter input/output content logging disabled;
- disable training/data-collection routes where required;
- apply key budget limits;
- restrict model allowlists to the models actually used by the application;
- use separate development and production API keys;
- rotate compromised keys immediately;
- keep the API key server-only.

## Sources to re-check before launch

- OpenRouter provider routing documentation
- OpenRouter Zero Data Retention documentation
- OpenRouter provider/data-policy pages
- Current model pages and pricing

Never assume the August 2026 model list or prices remain valid at launch.
