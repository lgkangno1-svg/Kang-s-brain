# Korea Concierge — OpenRouter AI Routing Policy

**Version:** 0.2  
**Date:** 2026-08-26  
**Gateway:** OpenRouter only

## Business objective

The AI stack is optimized for margin, not model prestige. The default rule is:

> deterministic/local code first → ultra-low-cost Chinese model → higher-quality Chinese model → premium fallback only when measured quality requires it.

Every feature must earn the right to use a more expensive model through evaluation data. Model choice is configuration-driven and can be changed without rewriting feature code.

Model availability and pricing change frequently. The prices below are a 2026-08-26 snapshot from OpenRouter and must be re-checked automatically before production changes.

## Tiered model pool

### Tier 0 — no model
Use deterministic/local computation whenever the task can be calculated or ranked reliably without generative AI.

Examples: basic personal-color measurements, zodiac dates, Saju calendar calculation, Hanbok weighted ranking, nearby-place filtering, distance/time scoring, credit/payment logic.

Cost target: $0.

### Tier 1 — `qwen/qwen3-30b-a3b-instruct-2507`
Default production text model.

Why:
- very low current OpenRouter price;
- multilingual instruction following;
- tool calling;
- structured JSON-schema outputs;
- sufficient quality for short explanations, translations and most personalization copy.

2026-08-26 observed OpenRouter listed floor: about **$0.04815/M input + $0.1931/M output** at the cheapest provider, with other providers around $0.09–0.13/M input and $0.30–0.52/M output.

Use for:
- personal-color explanation from derived values;
- Hanbok recommendation explanation;
- short UI/support translations;
- cultural explanations;
- Saju narrative from derived pillars/elements only;
- restaurant/attraction reason strings from verified structured facts;
- low-complexity concierge chat.

### Tier 2 — `deepseek/deepseek-v3.2`
Quality/cost escalation model for complex text reasoning.

Why:
- materially stronger reasoning and agent/tool performance than the Tier-1 default;
- still inexpensive relative to frontier premium models;
- useful for constrained itinerary composition and difficult cross-feature reasoning.

2026-08-26 observed OpenRouter low provider pricing: roughly **$0.21/M input + $0.31–0.32/M output** on discounted routes, with some providers higher.

Use for:
- multi-constraint itinerary composition;
- complex itinerary repair/re-plan;
- premium cross-feature concierge when Tier 1 fails evaluation thresholds;
- difficult structured recommendation synthesis.

Reasoning should be disabled or kept low unless the feature genuinely needs it.

### Tier 2V — `qwen/qwen3.5-35b-a3b`
Primary candidate for remote vision because it is a Chinese multimodal model with favorable input pricing.

2026-08-26 OpenRouter headline pricing: about **$0.14/M input + $1.00/M output**.

Use only for opt-in premium photo analysis when:
- local/browser analysis is insufficient;
- the selected OpenRouter endpoint satisfies the required privacy policy;
- output is tightly capped and structured.

Use for:
- premium selfie-assisted personal-color review;
- premium Hanbok photo/style review.

### Tier 3 — `moonshotai/kimi-k2.5`
Reserve for multimodal or complex reasoning cases where Qwen/DeepSeek do not meet the quality bar.

2026-08-26 OpenRouter pricing is materially higher than the default tiers, around **$0.375–0.45/M input + $2.0–2.25/M output** at lower-priced providers.

Do not use by default. Promotion to this tier requires an evaluation result showing a user-visible improvement worth the extra cost.

### Frontier non-Chinese fallback

No OpenAI/Google/Anthropic model is a normal production default. A non-Chinese frontier model may be added only when an evaluation demonstrates a feature cannot meet its quality, safety, privacy or reliability target with the Chinese model pool. Such fallbacks require a feature-level cost ceiling and explicit documentation.

## Feature routing

| Feature | Default execution | Default AI | Escalation |
|---|---|---|---|
| Basic personal color | browser/local deterministic image statistics | none | none |
| Detailed color explanation | derived color features | Qwen3 30B A3B Instruct | DeepSeek V3.2 only if eval fails |
| Premium visual color review | opt-in remote vision | Qwen3.5 35B A3B | Kimi K2.5 if visual eval proves necessary |
| Hanbok ranker | deterministic weighted scoring | none | none |
| Hanbok explanation | structured recommendation facts | Qwen3 30B A3B Instruct | DeepSeek V3.2 |
| Hanbok photo review | opt-in remote vision | Qwen3.5 35B A3B | Kimi K2.5 |
| Basic attraction/restaurant ranking | structured data + deterministic ranking | none | none |
| Place recommendation explanation | verified candidate facts | Qwen3 30B A3B Instruct | DeepSeek V3.2 |
| Itinerary composition | filtered/ranked candidates + constraints | DeepSeek V3.2 | premium fallback only after eval |
| Partial itinerary re-plan | deterministic validation + AI composition | DeepSeek V3.2 | premium fallback only after eval |
| Short translation/helper copy | text only | Qwen3 30B A3B Instruct | none normally |
| Korean zodiac | deterministic calculation | none | none |
| Western zodiac | deterministic calculation | none | none |
| Saju pillars/elements | deterministic server calculation | none | none |
| Saju narrative | derived non-identifying structure only | Qwen3 30B A3B Instruct | DeepSeek V3.2 |
| Premium cross-feature concierge | sanitized profile + ranked candidates | DeepSeek V3.2 | premium fallback only after eval |

## Privacy routing rules

### Selfies and user photos

Default personal-color analysis remains local/browser-side. Remote vision is a premium, explicit-consent path only.

Before remote vision:
- resize/crop to the minimum image needed;
- strip EXIF metadata client-side;
- do not infer identity, race, ethnicity, nationality, religion, health, attractiveness or other unrelated sensitive traits;
- require OpenRouter `provider.zdr = true`;
- require `provider.data_collection = "deny"`;
- require parameter support;
- do not enable prompt/content logging for production keys;
- do not persist the source photo unless a separately disclosed saved-photo feature requires it.

If the requested Chinese vision model has no eligible ZDR endpoint at request time, **fail closed** and offer browser-local analysis instead. Do not silently route the selfie to a weaker privacy endpoint just to save cost.

### Birth data / Saju

Raw birth date, birth time, name, account identifiers and exact location must not be sent to the LLM. A deterministic server module computes the traditional calendar representation first. The LLM receives only the minimum derived, non-identifying pillars/elements/zodiac structure needed for entertainment-oriented explanation.

### Location

Prefer area labels, place IDs and derived walking times over raw GPS history. Do not send stored movement history to models.

## OpenRouter routing policy

### Ordinary non-sensitive text

Use price-aware provider routing with a hard price ceiling and fallbacks among providers for the **same model**.

Conceptual request settings:

```json
{
  "provider": {
    "sort": "price",
    "allow_fallbacks": true,
    "data_collection": "deny",
    "require_parameters": true,
    "max_price": {
      "prompt": 0.30,
      "completion": 1.00
    }
  }
}
```

The exact max-price limits are feature configuration and must track current OpenRouter units/schema.

### Sensitive photo requests

```json
{
  "provider": {
    "sort": "price",
    "allow_fallbacks": true,
    "zdr": true,
    "data_collection": "deny",
    "require_parameters": true
  }
}
```

Privacy constraints outrank cost savings.

Do not use `openrouter/auto` for credit-priced production features. Fixed feature tiers make gross margin measurable and prevent surprise model upgrades.

## Escalation logic

A paid feature begins with its configured default tier. Escalation is allowed only when one of these occurs:

1. validation/schema failure after a bounded retry;
2. deterministic verifier rejects the output;
3. a feature-specific confidence/evaluation gate fails;
4. the user explicitly purchases a higher-quality tier in a future product experiment.

Never escalate merely because a provider is temporarily unavailable; first use another provider for the same model.

## Margin controls

Every feature has:
- `default_model`;
- `fallback_model`;
- `max_input_tokens`;
- `max_output_tokens`;
- `max_provider_price`;
- `max_ai_cost_usd`;
- credit price;
- expected p50 and p95 cost;
- minimum gross-margin target.

Rules:
- filter/rank place data in code before prompting;
- cache reusable public copy and translations;
- use structured outputs to avoid repair calls;
- keep prompts feature-specific and short;
- never ask an LLM to perform deterministic zodiac/Saju calendar calculations;
- record model, provider, latency, token counts and estimated cost by `usage_event` without logging sensitive prompt contents;
- reprice credits only from measured cost distributions, not anecdotal requests;
- free model endpoints may be used for development/evaluation but must not be the sole production dependency because of rate limits and availability.

## Evaluation policy

Maintain feature-specific multilingual evaluation sets covering at least English first, then launch-priority languages.

Compare candidate models on:
- factual adherence to supplied structured data;
- recommendation usefulness;
- natural multilingual writing;
- JSON/schema validity;
- hallucinated place/shop claims;
- cultural stereotyping;
- privacy leakage;
- latency;
- cost per successful result;
- retry/escalation rate.

The winning production model is the **cheapest model that clears the quality threshold**, not the highest-scoring model overall.

## Current decision summary

- **Default cheap text:** Qwen3 30B A3B Instruct 2507.
- **Complex reasoning / itinerary:** DeepSeek V3.2.
- **Cheap remote vision candidate:** Qwen3.5 35B A3B, ZDR only.
- **Premium Chinese fallback:** Kimi K2.5, only when benchmarks justify it.
- **Deterministic/local first:** personal-color measurements, Hanbok scoring, route filtering, zodiac/Saju calculations, payments and credits.

## Sources to re-check continuously

- OpenRouter model pages/pricing
- OpenRouter provider routing documentation
- OpenRouter Zero Data Retention documentation
- OpenRouter provider/data-policy pages
- GitHub/Hugging Face model cards and evaluation notes

Never assume the August 2026 model list, discounts, providers or prices remain valid later.
