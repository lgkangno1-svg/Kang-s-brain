# Korea Concierge — Stitch UI/UX Design System Specification

**Version:** 1.1  
**Date:** 2026-08-30  
**Stitch Project ID:** `5491471407117217005` (`projects/5491471407117217005`)  
**Design System Asset ID:** `assets/6183445483705617630`  
**Target Product:** `https://korea.avocadoss.co.kr`  
**Design Theme:** Contemporary Korean Companion (Warm, Elegant, Visual-First, Mobile-First)

## Sync status

The original Stitch UI slice was merged through PR #11 on 2026-08-27. The dedicated branch `korea-concierge/stitch-ui-system` still points to that 2026-08-27 snapshot, while later Hanbok/product work landed directly on `main`. This document is therefore the current design contract for code-first work until the external Stitch project is regenerated again.

Current synchronization rule:
- `main` is the runtime source of truth.
- Stitch remains the visual design system/reference, not a frozen alternate product branch.
- After any material customer-facing UI change, update this spec in the same run.
- If Stitch tooling is available, regenerate or refresh the affected Stitch screen from current `main` requirements.
- If Stitch tooling is unavailable, continue with the established tokens/components, explicitly record `Stitch sync pending`, and never let the stale Stitch branch overwrite newer product behavior.
- New UI must not reintroduce static/decorative confidence percentages. Visible numbers require deterministic measurement or a documented rubric.

---

## 1. Executive Summary & Design Vision

Korea Concierge is a personalized Korean travel and cultural companion engineered specifically for international visitors exploring Seoul. Rather than functioning as a generic directory or an ungrounded AI chatbot, the product provides structured, visually compelling, and explainable recommendations across personal color analysis, Hanbok styling, palace walking routes, food, and traditional cultural experiences.

### Core Design Principles
- **Contemporary Korean Warmth:** Anchored by natural Hanji paper tones (`#FAF8F5`), silk surfaces (`#FFFFFF`), charcoal ink (`#1C1917`), refined Dancheong crimson (`#9E2A2B`), and celadon jade (`#2D5A4C`).
- **Explainable Recommendations:** Every AI/deterministic suggestion provides concrete evidence, comparison/alternatives, uncertainty, and practical next steps without fabricating or exposing raw chain-of-thought.
- **Outdoor Mobile Usability:** Engineered for one-hand thumb navigation while walking outside in Seoul, featuring sticky bottom navigation, large touch targets (≥ 44px), and glare-resistant high-contrast typography.
- **Privacy & Ethical Integrity:** Browser-local processing for the free Personal Color preview. Future premium photo processing requires explicit consent, bounded observable features, minimal retention and clear method/privacy disclosure.
- **Multilingual Text Expansion Resilience:** Full typography and layout safety across all 6 P0 launch locales (`en`, `zh-CN`, `ja`, `zh-TW`, `vi`, `th`).
- **Visual Product Truth:** Real reference photos must have reviewable reuse rights and visible provenance. AI-generated Hanbok concepts must be labeled as concepts, never as actual rental inventory.

---

## 2. Design Tokens & Visual Hierarchy

### 2.1 Color Palette & Functional Roles
| Token Name | Hex Value | Role & Usage |
|---|---|---|
| **Parchment Canvas** | `#FAF8F5` | Primary background canvas; reduces glare in bright outdoor sunlight |
| **Pure Silk Surface** | `#FFFFFF` | Elevated interactive cards, bottom sheets, and input containers |
| **Charcoal Ink** | `#1C1917` | Primary headlines, titles, and active toggle buttons |
| **Muted Stone** | `#78716C` | Body copy, secondary metadata, and guidance notes |
| **Dancheong Crimson** | `#9E2A2B` | Primary CTAs, active badges, and key focus callouts |
| **Royal Indigo** | `#1E293B` | Dark section containers, formal tags, and high-contrast anchors |
| **Celadon Jade** | `#2D5A4C` | High-confidence/verified states where confidence is actually measured or a result is verified |
| **Persimmon Amber** | `#D97706` | Cautionary tips, alternative exploration, and spotlight notes |
| **Whisper Border** | `#E7E5E4` | 1px subtle structural dividing lines |

### 2.2 Typography System
- **Headlines & Display:** `Plus Jakarta Sans` — weight 600–800, tracking `-0.02em`, sharp and contemporary.
- **Body Text & Explanations:** `Manrope` — weight 400–600, line-height 1.6, optimized for CJK, Vietnamese tone marks, and Thai glyphs.
- **Metrics & Coordinates:** `Monospace` — tabular figures for measured/calculated values and documented rubric scores.

### 2.3 Elevation & Geometry
- **Corner Roundness:** 12px on cards/buttons, 16px on hero containers, 999px on chips.
- **Shadows:** Diffused whisper shadows (`0 1px 3px rgba(28, 25, 23, 0.05)`, `0 4px 20px rgba(28, 25, 23, 0.06)`).

---

## 3. Stitch Screen Specifications & Generated Artifacts

### 3.1 Screen 1: Personal Color Analysis & Explainable Dashboard
- **Original Stitch Screen ID:** `01739f0380424dc2acd1d1ec574aecd3`
- **Original dimensions:** Mobile (780px × 5292px)
- **Key Features:**
  1. Selfie shooting guide with daylight/filter guidance.
  2. Browser-local free capture/analysis stage with clear privacy disclosure.
  3. Progressive analysis state.
  4. Measured/derived undertone tendency, visible depth and contrast output.
  5. Explainable evidence/observation cards.
  6. Recommended-vs-alternative palette comparison.
  7. Warm/neutral/cool comparison and manual correction.
  8. Harmonious palette swatches.
  9. **Persistent Hanbok Bridge:** after analysis, the explicit Personal Color undertone travels to `/hanbok?undertone=...#hanbok-matcher` and pre-fills the broad Hanbok color direction. This state must survive subsequent Hanbok style-card selection.

### 3.2 Screen 2: Hanbok Studio — Current 2026-08-30 Contract
- **Original Stitch Screen ID:** `e2d2834775804957a7c0a4ba27861922`
- **Original dimensions:** Mobile (780px × 3586px)

The old Stitch mock contained generic mood-driven Top 3 looks and static example percentages. The current product direction supersedes that mock.

#### A. Entry experience: three intuitive palace styles
Customer-facing core categories are exactly:
1. **Princess / Prince** — soft, graceful, youthful, pastel, photo-friendly palace experience.
2. **Queen / King** — elegant, traditional, dignified, richer formal court-inspired styling.
3. **Royal** — the most ornate, ceremonial and highly decorated experience label; a product style label, not a historical rank claim.

Each category supports feminine/masculine reference switching, consistent 4:5 frames, visible source/license provenance and a direct `Find my Hanbok match` action.

Do not use runway/fashion-show imagery as the primary visual definition of these customer categories. Prefer high-resolution, rights-reviewed real palace wear, royal-ceremony reenactment, or clearly licensed traditional Hanbok references. If no suitable real reference is available, use an honest illustration rather than a misleading unrelated photo.

#### B. Personal Color continuity
- Free Personal Color analysis can pre-fill the broad Hanbok color direction.
- Explicit user style selection controls mood/comfort intent.
- Personal Color only influences palette; it must not silently overwrite the user's explicit style or practical preferences.
- All selections remain user-editable.

#### C. Deterministic free matcher
Keep the free matcher useful without AI cost:
- color direction;
- mood;
- walking/photos priority;
- destination;
- season;
- Top 3 ranked complete looks;
- jeogori/chima or baji color direction;
- accessories/fabric/location notes;
- explainable reasons.

Any visible score must be produced by the documented deterministic rubric. It is not AI confidence, beauty, attractiveness or calibrated probability.

#### D. Premium AI Hanbok concept — next product layer, payment deferred
The next premium experience should visually answer: **“What kind of Hanbok would actually suit me?”**

Inputs:
- Personal Color result;
- Princess/Prince, Queen/King or Royal style;
- mood;
- destination;
- season;
- comfort/photo priority;
- optional explicitly consented photo later;
- solo/couple/family context later.

Output target:
- 1–3 large AI-generated Hanbok concept previews;
- recommended colorway and alternate colorway;
- silhouette/detail/accessory brief;
- why the combination fits the explicit Personal Color/style choices;
- a simple card the traveler can show a rental shop;
- clear label: **AI styling concept — actual rental inventory may differ**.

Architecture rule:
- deterministic/user-selected fields form a typed styling brief first;
- image generation visualizes that brief second;
- generated image does not become evidence for the underlying Personal Color result;
- do not send raw photos to narrative LLMs;
- no live credit charge or Stripe dependency is required to build the UX/provider seam;
- provider/model cost is measured before assigning credit consumption.

#### E. Reference-library strategy
Do not optimize for uncontrolled scraping volume. Build a rights-reviewed library gradually, with useful metadata such as:
- style category;
- feminine/masculine/unisex presentation;
- dominant/secondary colors;
- warm/neutral/cool palette fit;
- ornament level;
- silhouette;
- season/fabric;
- palace/location context;
- source/license/provenance;
- whether it represents real bookable inventory.

A smaller well-labeled library plus generated concepts is preferred to thousands of unlicensed or badly labeled images.

### 3.3 Screen 3: K-Culture Lab & Daily Harmony Companion
- **Original Stitch Screen ID:** `d32eb460dec644db97000a6f2770b673`
- **Original dimensions:** Mobile (780px × 5306px)
- **Key Features:**
  1. Respectful educational introduction to Korean seasonal harmony and deterministic calendar concepts.
  2. Daily travel/culture cards only when grounded by actual deterministic/factual inputs.
  3. Traditional Zodiac & Four Pillars explorer connected to the shipped deterministic Saju core.
  4. Curated palace moment and cross-links to Personal Color/Hanbok.
  5. No decorative luck/confidence precision.

---

## 4. Mobile Navigation & Accessibility Architecture

- **Mobile Sticky Bottom Navigation Bar (`.mobileBottomNav`):** Fixed at the bottom of the viewport (`height: 64px`), providing instant one-thumb access to Color, Hanbok, Gyeongbokgung, K-Culture, and Credits.
- **Quick Help Floating Trigger:** Positioned safely above the mobile bottom navigation bar.
- **High-Contrast Touch Targets:** Interactive controls maintain at least 44px touch height with `:focus-visible` outlines.
- **Text Overflow Safety:** Preserve locale-aware wrapping behavior for CJK, Vietnamese and Thai.
- **Image Consistency:** Hanbok primary cards use consistent 4:5 visual frames and crop metadata so one low-resolution or unusually shaped source does not dominate the page.

---

## 5. Current UI Files & Boundaries

### Current UI layer
- `src/features/color/color-scanner.tsx`: browser-local explainable Personal Color experience and Hanbok deep-link.
- `src/features/color/color-scanner.module.css`: Personal Color presentation.
- `src/features/hanbok/hanbok-visual-library.ts`: three palace experience categories and reference metadata.
- `src/features/hanbok/hanbok-visual-inspiration.tsx`: three-category visual entry with feminine/masculine switching.
- `src/features/hanbok/personal-color-bridge.ts`: bounded deterministic Personal Color → Hanbok palette bridge.
- `src/features/hanbok/hanbok-matcher.tsx`: deterministic matcher, URL style preset and Personal Color prefill.
- `src/app/[locale]/culture/page.tsx`: K-Culture presentation layer.
- `src/app/globals.css`: Stitch-derived design tokens, typography, mobile navigation and shared components.
- `src/app/[locale]/layout.tsx`: mobile navigation and brand header.
- locale messages: all six P0 locales must remain in parity.

### Protected boundaries
- `.github/**` and private CI/deployment configurations.
- deterministic `src/lib/**` calculation/security systems unless a task explicitly requires integration.
- server wallet/payment routing.
- photo/AI processing must remain behind explicit privacy/provider/cost gates.

---

## 6. Why Stitch looked stale

The design itself was not absent: PR #11 merged the original Stitch-generated UI into `main`. The stale appearance came from synchronization drift:
1. the dedicated Stitch branch stopped at the 2026-08-27 UI snapshot;
2. later Hanbok gallery work intentionally used isolated CSS modules instead of rewriting global Stitch CSS;
3. the 3-style Hanbok + payment slice landed on `main` without regenerating the external Stitch screen/project;
4. this spec remained version 1.0 and still described the old generic Hanbok Top 3 mock.

The remedy is **not** to merge the old Stitch branch again. That could regress newer product work. The remedy is to sync current product requirements forward into Stitch/design artifacts and keep current `main` as the integration base.

---

## 7. Immediate UI priority

1. Personal Color → Hanbok state continuity.
2. Replace weak/runway-heavy primary Hanbok references with rights-reviewed palace/ceremonial references.
3. Build the typed Premium Hanbok AI styling brief and image-generation provider seam without activating payment.
4. Add explicit photo consent/transient-processing UX before any remote photo pipeline.
5. Refresh the external Stitch Hanbok screen from this v1.1 contract when Stitch tooling is available.

Stripe account activation, Price IDs and live checkout are intentionally deferred while the customer-facing premium result is still being built.
