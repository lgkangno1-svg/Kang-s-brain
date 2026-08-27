# Korea Concierge — Real-Time Voice Translation

**Date:** 2026-08-27  
**Status:** approved product/provider direction; implementation deferred until auth/wallet/payment entitlements exist  
**Default provider/model:** Google Gemini API — `gemini-3.5-live-translate-preview`

## Product intent

Real-time translation is a quality-critical travel utility for visitors who need to speak with restaurants, shops, drivers, hotels, clinics, attractions or other people in Korea. It is not a generic chatbot feature and should prioritize low latency, recognition/translation quality, simple two-person conversation UX and predictable supplier cost.

## Provider decision

Use **Gemini 3.5 Live Translate** as the default production candidate for Korea Concierge real-time speech translation.

Reasons:
- Google documents it as a low-latency audio-to-audio model optimized for real-time spoken translation;
- it supports 70+ languages, covering the P0/P1 market direction;
- it can return translated audio plus transcript text;
- one direct Live API removes the latency and error compounding of a separate STT → text translation → TTS chain;
- the paid Gemini API tier is documented as not using submitted data to improve Google products;
- quality is more important than selecting the absolute cheapest voice pipeline for this feature.

Current official model ID is a **preview** ID and must remain server-configurable. Re-run provider/model evaluation before production launch or whenever Google changes availability, pricing, retention terms or model version.

OpenRouter remains the default gateway for ordinary Korea Concierge text/vision AI. At the time of this decision, the dedicated Gemini 3.5 Live Translate endpoint was not found in OpenRouter's public model catalog/search, so this feature is an explicit direct-Google exception. Do not substitute a similarly named OpenRouter Gemini model and claim equivalent real-time translation capability.

## Current supplier-cost snapshot

Google's 2026-08 pricing lists approximately:
- audio input: `$0.0053/min` effective;
- audio output: `$0.0315/min` effective;
- combined speech-to-speech translation: approximately **`$0.0368/min`**.

This is a planning snapshot, not a permanent price. Store measured production usage/cost and re-check before launch.

## Ultra / Family benefit hypothesis

Ultra remains a **one-time Trip Pass**, not an auto-renewing subscription at launch.

Initial fair-use hypothesis:
- **30 real-time translation minutes included with each Ultra Trip Pass**;
- included minutes are shared by the future Ultra family/shared-wallet entitlement;
- after included minutes, continued translation is offered at a clearly displayed fixed unit price of **8 credits per minute** unless measured costs justify a revision;
- unused included minutes do not convert to cash or normal credits;
- exact family member/device limits are deferred to the auth/wallet abuse-control gate rather than guessed now.

Why 30 minutes initially: at the current ~$0.0368/min supplier price, 30 minutes costs about **$1.104** before operational reserve. Combined with the existing Ultra protected AI supplier budget and conservative payment reserve, this keeps the current launch margin hypothesis close to the existing ~80% protection target while still giving Ultra buyers meaningful real-world use.

This is a fair-use benefit, not an uncapped unlimited promise. Re-evaluate included minutes from actual p50/p95 usage, supplier cost, conversion, abuse and satisfaction data.

## Security and privacy architecture

Never place a long-lived Gemini API key in browser/mobile code or any `NEXT_PUBLIC_*` variable.

Preferred web architecture after authentication exists:
1. user authenticates to Korea Concierge;
2. server verifies Ultra/family entitlement, remaining included minutes/credits, rate limit and abuse controls;
3. server requests a tightly constrained short-lived Gemini **ephemeral token** for the approved Live model/session;
4. client connects directly to Gemini Live API over WebSocket using the ephemeral token to minimize latency;
5. Korea Concierge records only non-sensitive metering/audit data required for entitlement and cost control;
6. session is stopped/renewed when entitlement, time or rate-limit boundaries require it.

Default privacy behavior:
- microphone permission is explicit and revocable;
- clearly disclose that live audio is transmitted directly to Google for translation;
- do not persist raw microphone audio by default;
- do not put audio/transcripts into general application logs;
- transcript display is optional and ephemeral by default;
- saving/exporting transcripts, if ever offered, requires a separate explicit action and retention disclosure;
- no speaker identity, nationality, ethnicity, religion, health, emotion or other unrelated sensitive inference;
- no advertising/profile enrichment from translated conversations;
- provider terms/data-use settings must be revalidated immediately before production.

## Metering and margin controls

Real-time translation is a metered exception to ordinary fixed-credit actions. The **unit price must still be fixed and visible before the microphone starts**.

Track per session without storing conversation contents:
- account/family entitlement ID;
- provider/model version;
- source/target language selected explicitly by the user;
- session start/end;
- billable audio seconds/minutes;
- included minutes consumed;
- credits captured after fair-use allowance;
- provider cost when available;
- reconnect/retry count;
- latency/connection failures;
- no raw audio or transcript bodies in cost telemetry.

Use server-authoritative reserve/capture/release semantics. Do not trust a client-reported remaining allowance. Add hard per-session and per-day abuse ceilings even when the UI describes usage as free within the Ultra allowance.

## Quality gate before launch

Benchmark the chosen Gemini version on realistic Korea visitor conversations, with noisy mobile conditions, for at least:
- Korean ↔ English;
- Korean ↔ Simplified Chinese / Mandarin;
- Korean ↔ Japanese;
- Korean ↔ Traditional-Chinese user scenarios where spoken Mandarin/Cantonese requirements are explicitly distinguished rather than inferred from locale;
- Korean ↔ Vietnamese;
- Korean ↔ Thai;
- P1 Indonesian and Malay before enabling those markets.

Measure:
- end-to-end speech-to-speech latency;
- word/name/menu/place-name recognition;
- meaning preservation;
- politeness/register;
- interruption/turn-taking quality;
- noisy-environment robustness;
- reconnect reliability;
- effective supplier cost per successful minute;
- user correction rate and satisfaction.

Do not infer spoken language from nationality or face. Auto language detection, if later used, must be an optional convenience and explicit language selection must always override it.

## UI direction

When implementation reaches the user-facing translation screen, use Stitch MCP first if available. The intended mobile-first interaction is:
- large `Me` / `Other person` language controls;
- obvious microphone/privacy state;
- one-tap swap languages;
- translated audio first, readable transcript second;
- large stop/pause control usable while walking;
- visible remaining Ultra included minutes or metered credit rate;
- simple fallback text input when speaking is impractical;
- no dense chatbot chrome.

## Discovery summary

### GitHub
Fresh search reviewed small Gemini real-time translation/subtitle implementations such as `gordonxc/gemini-osd-subtitles` and `andyko208/sermon-realtime-translator`. They are useful references for streaming/subtitle UX but do not provide enough provenance, security, entitlement or production-margin architecture to adopt as a dependency.

**Decision:** adapt only high-level interaction ideas; use Google's maintained Gemini API/SDK contract rather than importing an unneeded application stack.

### Hugging Face
The installed Hugging Face model-search action was attempted twice during this review and returned a tool-unavailable error. No Hugging Face model is adopted. A self-hosted STT/translation/TTS pipeline would add deployment, multilingual benchmarking, model provenance, mobile latency and operational complexity, while the user explicitly prioritizes translation quality.

**Decision:** Gemini direct Live API remains the approved quality-first candidate; re-run Hugging Face discovery when implementation begins if the connector is healthy.

## Official sources re-check before implementation

- Gemini 3.5 Live Translate model documentation
- Gemini API pricing
- Gemini Live API ephemeral-token documentation
- Gemini Live API session/capability limits
- Google data-use/privacy terms for the paid API tier
- OpenRouter model catalog, to detect whether an equivalent dedicated Live endpoint becomes available later
