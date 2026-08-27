# Korea Concierge — Explainable Personalization & K-Culture Experience Contract

**Date:** 2026-08-27  
**Status:** product/architecture contract for future implementation  
**Applies to:** Personal Color, Hanbok, Saju/Four Pillars, Korean Zodiac, Western Astrology, Daily Fortune, Tarot, discovery, food and itinerary recommendations.

## 1. Core product rule
Korea Concierge must not behave like a thin result generator that gives a label with no useful reasoning. Every personalized feature should help an international visitor understand **what was observed or calculated, why the recommendation follows, what could change the answer, and what to do next**.

The product must not reveal or fabricate hidden chain-of-thought. Instead, it exposes a compact, auditable explanation assembled from user-visible evidence, deterministic calculations, source-backed facts, bounded model outputs and explicit uncertainty.

The default result contract is:
1. **Result** — concise answer/ranking.
2. **Why this fits** — 3–6 concrete evidence cards.
3. **Compare** — strongest alternative or counterfactual and why it ranked lower/differently.
4. **Confidence / uncertainty** — confidence band and material conditions that can change the result.
5. **Try this next** — actionable colors, styles, places, questions or experiments.
6. **Method / privacy** — what data was used, where it was processed, and what was not inferred.

Avoid false precision. Percentages may be shown only when they correspond to a defined calibrated score; otherwise use labels such as Strong / Moderate / Mixed / Low confidence.

## 2. Personal Color — photo-first premium intent
The core premium intent is **photo-based AI/vision analysis**, not a questionnaire-only color picker. The existing browser-local scanner remains a free/private preview and fallback, not the final product ceiling.

### 2.1 Inputs
- selfie or camera photo;
- optional second photo for disagreement/lighting check;
- explicit consent before any remote vision transfer;
- optional user correction/feedback;
- no race, ethnicity, nationality, religion, health, emotion, attractiveness or identity inference.

### 2.2 Analysis dimensions
Use only appearance/color observations needed for styling, such as:
- visible skin color tendency under current lighting;
- relative warmth/coolness tendency;
- lightness/depth;
- visible face contrast;
- saturation/clarity tendency where robust;
- lighting/exposure/color-cast quality;
- optional hair/eye **visible color** only when it materially improves palette comparison and is framed as appearance, not identity.

A premium vision model may contribute observations, but a deterministic post-processor should normalize them into a strict schema. The model must not directly invent a season label without evidence fields.

### 2.3 Explainable result
A useful result should resemble:
- primary tendency: e.g. Neutral–Cool / Medium depth / Medium-high contrast;
- evidence: “blue-vs-yellow balance around sampled facial regions leaned cooler,” “your face retained definition beside deeper navy,” “very yellow muted colors reduced visible contrast in this photo”;
- competing interpretation: “warm-neutral remains plausible because indoor lighting adds yellow cast”;
- comparison palette: show 2–3 near-face color pairs so the user can visually compare;
- recommended neutrals, accents, metal/accessory direction, makeup-adjacent color family only as styling guidance;
- colors to **test carefully**, never absolute universal bans;
- photo-condition warning and re-scan advice when needed.

The wording should make the visitor say “I can see why,” rather than pretending scientific certainty.

## 3. Hanbok — photo-aware styling, not only color matching
Hanbok recommendations should combine the Personal Color result with the visitor's photo when consented, plus explicit preference/context inputs.

### 3.1 Inputs
- optional personal-color profile;
- optional photo/visible styling observations;
- requested mood: elegant, royal, romantic, minimalist, K-drama, playful, traditional etc.;
- destination/background;
- season/weather;
- comfort/coverage/walking needs;
- party/couple/family context;
- optional height/silhouette preference; never infer body measurements from a photo as authoritative.

### 3.2 Outputs
Return ranked **complete looks**, not just three hex codes:
- jeogori + chima/baji color relationship;
- saturation/depth balance;
- silhouette/design family;
- collar/sleeve/skirt or baji treatment where relevant;
- accessory/hair ornament direction;
- photo backdrop fit;
- rental-shop match when verified inventory exists.

### 3.3 Explanation
Every look includes:
- **Why it suits you:** color/contrast/mood/context reasons;
- **Why this works at the destination:** background contrast and photographic readability;
- **Trade-off:** e.g. richer royal palette photographs strongly but may feel heavier in hot weather;
- **Alternative:** a softer or warmer version for users who dislike the top recommendation;
- **Try-on prompt:** 2–3 visual details to check in the mirror before renting.

Premium AI composite/virtual styling is a later visualization layer, not the sole source of recommendation logic.

## 4. Saju / Four Pillars
Saju must be deterministic at the calculation layer and interpretive only after the chart is fixed.

### 4.1 Input contract
- exact birth time;
- rough/approximate birth time;
- unknown birth time.

Never fabricate a missing hour pillar. Unknown time produces a reduced-scope three-pillar analysis and should have visibly reduced certainty/scope and lower price when monetized.

### 4.2 Result architecture
1. Explain “What is Saju?” for a first-time foreign visitor.
2. Show the calculated pillars/elements in a visual, localized form.
3. Explain the strongest observed structural themes in plain language.
4. Separate **calculation** from **traditional interpretation**.
5. Give alternate interpretations where schools/conventions can differ.
6. Explain what missing/rough time changes.
7. Connect optional color/culture suggestions as storytelling, not objective prescriptions.

Narrative AI receives only a minimized derived chart schema when possible — not raw name/account identifiers, and raw birth fields should not be sent when the deterministic derived representation suffices.

## 5. Korean Zodiac + Western Astrology
These should be accessible comparison experiences for international visitors.

### Korean Zodiac
- deterministic animal/sign from date/calendar rules;
- cultural history/context;
- common traditional associations labeled as tradition, not facts about personality;
- optional compatibility/years comparison framed as entertainment.

### Western Astrology
Start with deterministic sun-sign calculation. Birth-chart/ascendant/moon features require exact astronomical/timezone handling and should not be faked from incomplete input.

Result explanation should distinguish:
- what is calculated;
- what is a conventional astrological interpretation;
- what input uncertainty can change.

## 6. Daily Fortune
Daily fortune should not be generic random prose disguised as personalized calculation.

Preferred architecture:
- optional deterministic profile seed (Saju/zodiac/astrology choice);
- current date and locale/timezone;
- rule-based theme selection;
- bounded generative wording for freshness only after the underlying theme is fixed;
- visible “Today’s lens” explaining which inputs/themes were used.

Suggested sections: overall mood, relationships/social, travel/activity, reflection prompt, color/theme of the day. Never give high-stakes medical/legal/financial predictions or certainty claims.

## 7. Tarot
Tarot should feel deliberate and reflective rather than like an opaque random chatbot.

### Flow
1. Explain tarot as a reflective/entertainment tool.
2. User chooses a question category or writes a bounded question.
3. User chooses spread: 1-card, 3-card (situation/action/outlook), or another explicitly defined spread.
4. Cards are selected using a documented random mechanism; the model must not secretly choose cards to fit a desired answer.
5. Show card identity, orientation policy if reversals are used, traditional keywords and image symbolism.
6. AI composes a concise interpretation grounded in the selected cards + user question.
7. Show a second plausible reading or “another way to read this card” for ambiguity.
8. End with a reflective action/question, not a deterministic prophecy.

High-stakes questions must be redirected away from definitive predictions.

## 8. Travel / place / food recommendations
All recommendation cards must expose enough evidence to distinguish facts from personalization.

A place card can show:
- **Why for you:** route fit, interest fit, budget, walking tolerance, language accessibility;
- **Verified facts:** distance/hours/price/source verification date;
- **Uncertainty:** stale hours, inventory or dietary uncertainty;
- **Alternative:** one nearby option with a different trade-off.

For dietary needs, preserve explicit independent filters: Vegan, Vegetarian, Halal-certified, Muslim-friendly, pork-free, alcohol-free, gluten-free, seafood-free and allergies. Never infer religion/diet. Halal-certified and Muslim-friendly are not synonyms. Show evidence source/date and cross-contamination/sauce/cooking-alcohol uncertainty when relevant.

## 9. Itinerary / concierge
Generated plans should explain each stop in terms of constraints rather than hide the ranking.

For every stop, expose at least one reason such as:
- on the route with low detour;
- matches requested photography/history/food interest;
- fits remaining Hanbok return time;
- gives a rest break after a long walking block;
- satisfies a verified dietary/accessibility constraint.

Allow **replace this stop** with a reason-specific control (“closer”, “quieter”, “cheaper”, “more photogenic”, “better for kids”) so users can steer the system without regenerating the whole itinerary.

## 10. AI architecture and cost controls
Use AI where it creates genuine personalization value; do not use it to imitate intelligence when deterministic evidence already exists.

Preferred stack:
1. validate input;
2. deterministic/local extraction/calculation first;
3. remote vision only for approved premium photo analysis;
4. normalize into typed evidence schema;
5. deterministic ranking;
6. bounded LLM wording/synthesis only when it improves explanation;
7. validate output contract;
8. cache non-sensitive derived results where appropriate.

Provider prompts should request **observable evidence fields**, not hidden reasoning. Store/telemetry should record model/version, latency, token/image cost, confidence/quality flags and structured error codes without sensitive prompt/photo bodies.

## 11. Photo privacy/security boundary
Before premium remote photo analysis ships:
- explicit consent naming remote processing;
- EXIF stripping before transfer;
- size/type/pixel limits and image bomb protection;
- face/image processing used only for requested styling purpose;
- no identity recognition or sensitive-trait inference;
- shortest practical retention, preferably transient processing by default;
- user-visible deletion semantics;
- provider data-retention/ZDR review;
- server-side credentials only;
- rate limits, upload abuse controls and fixed maximum provider cost per analysis.

## 12. Shared result schema
Future features should converge on a reusable result shape conceptually equivalent to:

```ts
type ExplainedResult<T> = {
  result: T;
  evidence: Array<{title: string; detail: string; source?: string}>;
  alternatives: Array<{label: string; whyDifferent: string}>;
  uncertainty: Array<{condition: string; impact: string}>;
  actions: Array<{label: string; action: string}>;
  method: {kind: 'deterministic' | 'local-vision' | 'remote-vision' | 'hybrid' | 'generative'; version: string};
};
```

Do not expose model chain-of-thought. Expose **evidence and decision factors that can be independently inspected**.

## 13. Implementation order
Respect existing dependency gates:
1. Step 3A deterministic Saju input/calculation contracts.
2. Expand K-Culture Lab deterministic foundations for zodiac/astrology/tarot selection mechanics.
3. Step 4 auth/wallet/entitlements.
4. Step 5 payments.
5. Step 5B Gemini Live Translate.
6. Step 6 premium photo-based Personal Color evidence pipeline.
7. Step 7 photo-aware Hanbok ranking and explainable looks.
8. Discovery/food/itinerary explainability upgrades.

Planning these features now does **not** authorize skipping auth/payment/privacy/provider gates for paid remote AI.

## 14. Design status
Stitch MCP was rechecked on 2026-08-27 and was not available in the connected tool/plugin catalog. No substantial new UI is claimed as Stitch-designed in this slice. Recheck immediately before each user-facing redesign.
