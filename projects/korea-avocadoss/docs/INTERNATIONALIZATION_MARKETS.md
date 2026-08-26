# Korea Concierge — International Markets & Localization Strategy

**Status:** implementation baseline  
**Date:** 2026-08-26  
**Target:** `korea.avocadoss.co.kr`

## 1. Product rule

Korea Concierge must localize the *experience*, not merely translate strings.

Market-level defaults may be informed by official tourism research and first-party product analytics, but nationality must never be treated as an individual personality trait. A visitor's explicit preferences and behavior always override market defaults.

Do not infer nationality, ethnicity, religion, dietary practice, spending power, family status or language from a selfie or name.

## 2. Evidence for market priority

Current official Korean tourism reporting shows that China, Japan and Taiwan remain core inbound markets. MCST reported approximately 1.45M visitors from China, 0.94M from Japan and 0.54M from Taiwan in 2026 Q1. US arrivals were also approximately 0.81M in Jan–Jun 2026. Official top-market reporting has repeatedly included Vietnam, Hong Kong, Thailand, Singapore, the Philippines and Malaysia among major inbound markets.

Sources to re-check quarterly:
- Korea Tourism Statistics / Korea Tourism Organization
- MCST inbound-tourism releases
- Korea Tourism Data Lab country-market analysis
- Foreign Tourist Survey

## 3. Locale rollout

### P0 launch locales

| Locale | Primary markets | Rationale |
|---|---|---|
| `en` | US, Canada, UK, Australia, Singapore, Philippines and international default | Large long-haul market and global fallback |
| `zh-CN` | Mainland China | Largest 2026 Q1 inbound market |
| `ja` | Japan | Second-largest 2026 Q1 inbound market |
| `zh-TW` | Taiwan, Hong Kong | Taiwan is a top-3 market; Traditional Chinese is needed for Taiwan/HK written UX |
| `vi` | Vietnam | Repeated top inbound / strategic Southeast Asia market |
| `th` | Thailand | Major Southeast Asia inbound and strong Korea-travel social interest |

### P1 locales

| Locale | Primary markets | Notes |
|---|---|---|
| `id` | Indonesia | Important Southeast Asia growth / K-culture market |
| `ms` | Malaysia | Repeated top inbound market; also important for practical dietary/travel UX |

### P2 based on measured traffic

`fr`, `de`, `es`, `ru`, `fil` and additional locales. English remains the fallback until first-party traffic justifies dedicated localization.

## 4. Language architecture

- Locale-prefixed public URLs: `/en/...`, `/ja/...`, `/zh-CN/...`, etc.
- `hreflang` for all equivalent public pages plus `x-default`.
- No automatic hard redirect based on IP/nationality.
- Browser language can suggest a locale, but the user can always choose.
- Remember explicit locale choice in a low-risk cookie/local storage setting.
- URLs and SEO metadata must be localized, not only body text.
- Translation keys must be separated from factual place data.
- Time-sensitive place facts must not be permanently baked into static translated copy.

## 5. Market-aware UX, without stereotyping

These are *hypotheses to test*, not individual assumptions.

### Mainland Chinese (`zh-CN`)
- Make price, opening-time freshness, photo examples, route convenience and payment information highly visible.
- Surface K-culture, beauty, food, shopping and photo-experience filters as optional shortcuts.
- Do not assume a visitor uses a specific Chinese app/payment method until supported and selected.
- Research Chinese search/social acquisition separately from Google-centric SEO.

### Japan (`ja`)
- Favor concise, high-density practical information: exact walking times, reservation notes, menu examples, queues, opening hours and clear comparison tables.
- Strong food/beauty/shopping shortcuts can be tested based on tourism-market evidence, while preserving full category access.
- Japanese copy should be native-quality and restrained rather than literal English translation.

### Taiwan / Hong Kong (`zh-TW`)
- Traditional Chinese copy.
- Strong visual itinerary, cafés/food, photo spots and experience discovery can be tested.
- Keep Taiwan and Hong Kong analytics separated even though both can share written Traditional Chinese because behavior, payments and acquisition channels can differ.

### Vietnam (`vi`)
- Mobile-first, visual-first flows with simple price/credit explanations.
- Strong K-culture, photo, beauty, food and group/couple itinerary entry points can be tested.
- Visa/entry facts, where shown, must come from current authoritative sources and must not be inferred from language alone.

### Thailand (`th`)
- Strong visual discovery and K-culture/photo experience shortcuts can be tested.
- Heat/weather comfort should be easy to filter in Hanbok and walking-route features.
- Thai copy must avoid dense English-style paragraphs.

### Indonesia / Malaysia (`id`, `ms`)
- Dietary and ingredient filters should be first-class product controls for everyone, with halal-related information shown only when a place has a reliable source/verification signal.
- Do not infer religion from locale or nationality.
- Clear prayer-friendly / dietary information may be offered as opt-in filters when reliable data is available.

### English (`en`)
- Treat as a global fallback, not a US-only locale.
- Currency, measurement, date/time and tipping/etiquette explanations should avoid US-only assumptions.
- For long-haul visitors, emphasize orientation, transit, cultural context, booking confidence and what needs advance planning.

## 6. Saju / birth-time UX for international visitors

Birth time must be optional.

### Input flow

1. Birth date — required for Saju experience.
2. Birth time options:
   - **I know the exact time** → time picker.
   - **I only know roughly** → Morning / Afternoon / Evening / Late night, with an explicit lower-confidence explanation.
   - **I don't know my birth time** → continue without time.
3. Birth place:
   - country + city search only when time-zone/calendar conversion actually requires it;
   - explain why it is requested;
   - never require current location access.
4. Calendar selector when relevant: Gregorian by default; clearly label any lunar-calendar conversion.

### Unknown-time behavior

Never fabricate a birth hour.

If time is unknown:
- calculate only deterministic components that do not require the hour pillar;
- omit or mark hour-dependent content as unavailable;
- show a clear scope label such as `3-pillar overview` / `birth time not provided` rather than presenting it as a full Four Pillars reading;
- reduce the credit price when materially less computation/content is delivered;
- offer an optional explanation of what birth time would add;
- never ask the AI to guess the missing time from personality questions.

If approximate time is supplied:
- show that multiple hour pillars may be possible near boundaries;
- avoid false precision;
- allow the user to compare possible time bands later as an optional feature.

### Data minimization

- Saju calendar calculations are deterministic server-side.
- Raw birth date/time/city should not be sent to the LLM.
- LLM receives only derived non-identifying pillar/element data required for optional narrative explanation.
- Saved birth profiles require explicit opt-in and deletion controls.

## 7. Localized Quick Help

The free Quick Help must remain API-free.

Implementation sequence:
1. English conversation tree.
2. Translation dictionaries for P0 locales.
3. Locale-specific topic ordering using aggregate analytics only after enough traffic exists.
4. Add typo/fuzzy local search only when the knowledge base becomes large enough to justify it.

No LLM is needed for this feature.

## 8. Personalization hierarchy

Always rank inputs in this order:

1. explicit user choices;
2. saved user preferences;
3. current trip context (time, area, party, weather where authorized);
4. aggregate locale/market defaults;
5. global defaults.

Locale/national market defaults must never override an explicit user preference.

## 9. Analytics needed

Track by locale and market acquisition source where legally and technically appropriate:
- landing-page conversion;
- language-switch rate;
- Quick Help topic selections;
- Hanbok/color feature starts and completion;
- itinerary/food filters selected;
- credit purchase conversion;
- payment failure rate;
- feature completion / refund rate;
- support / confusion events;
- organic and AI referral source.

Do not build sensitive demographic profiles.

## 10. Rollout gates

A locale is production-ready only when:
- navigation and core onboarding are fully translated;
- payment/credit explanations are native-quality;
- privacy/consent text is reviewed;
- SEO metadata and hreflang are present;
- key Quick Help answers exist;
- date/time/currency formatting works;
- screenshots fit mobile layouts without clipping;
- no English-only dead end exists in a paid flow.

## 11. Immediate implementation order

1. locale registry + routing architecture;
2. functional language selector;
3. English source dictionaries split from components;
4. P0 translation dictionaries;
5. localized Quick Help;
6. Saju unknown/approximate birth-time form and deterministic result states;
7. locale-aware travel/food filters;
8. localized payment/credit checkout copy;
9. market-level analytics and A/B testing;
10. expand P1/P2 locales only after QA and/or demand evidence.
