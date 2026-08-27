# Korea Concierge — Stitch UI/UX Design System Specification

**Version:** 1.0  
**Date:** 2026-08-27  
**Stitch Project ID:** `5491471407117217005` (`projects/5491471407117217005`)  
**Design System Asset ID:** `assets/6183445483705617630`  
**Target Product:** `https://korea.avocadoss.co.kr`  
**Design Theme:** Contemporary Korean Companion (Warm, Elegant, Visual-First, Mobile-First)

---

## 1. Executive Summary & Design Vision

Korea Concierge is a personalized Korean travel and cultural companion engineered specifically for international visitors exploring Seoul. Rather than functioning as a generic directory or an ungrounded AI chatbot, the product provides structured, visually compelling, and explainable recommendations across personal color analysis, Hanbok styling, palace walking routes, food, and traditional cultural experiences.

### Core Design Principles
- **Contemporary Korean Warmth:** Anchored by natural Hanji paper tones (`#FAF8F5`), silk surfaces (`#FFFFFF`), charcoal ink (`#1C1917`), refined Dancheong crimson (`#9E2A2B`), and celadon jade (`#2D5A4C`).
- **Explainable Recommendations:** Every AI/deterministic suggestion provides 3–6 observable evidence cards, comparison contrasts, confidence bounds, and practical next steps without fabricating or exposing raw chain-of-thought.
- **Outdoor Mobile Usability:** Engineered for one-hand thumb navigation while walking outside in Seoul, featuring sticky bottom navigation, large touch targets (≥ 44px), and glare-resistant high-contrast typography.
- **Privacy & Ethical Integrity:** 100% on-device processing guarantees for photos, zero demographic/racial/religious/attractiveness inference, and transparent calendar mathematics.
- **Multilingual Text Expansion Resilience:** Full typography and layout safety across all 6 P0 launch locales (`en`, `zh-CN`, `ja`, `zh-TW`, `vi`, `th`).

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
| **Celadon Jade** | `#2D5A4C` | High-confidence badges, natural harmony indicators, verified states |
| **Persimmon Amber** | `#D97706` | Cautionary tips, alternative exploration, and spotlight notes |
| **Whisper Border** | `#E7E5E4` | 1px subtle structural dividing lines |

### 2.2 Typography System
- **Headlines & Display:** `Plus Jakarta Sans` — weight 600–800, tracking `-0.02em`, sharp and contemporary.
- **Body Text & Explanations:** `Manrope` — weight 400–600, line-height 1.6, optimized for CJK, Vietnamese tone marks, and Thai glyphs.
- **Metrics & Coordinates:** `Monospace` — tabular figures for contrast ratios, lighting scores, and confidence bands.

### 2.3 Elevation & Geometry
- **Corner Roundness:** `ROUND_TWELVE` (12px on cards/buttons, 16px on hero containers, 999px on chips).
- **Shadows:** Diffused whisper shadows (`0 1px 3px rgba(28, 25, 23, 0.05)`, `0 4px 20px rgba(28, 25, 23, 0.06)`).

---

## 3. Stitch Screen Specifications & Generated Artifacts

### 3.1 Screen 1: Personal Color Analysis & Explainable Dashboard
- **Stitch Screen ID:** `01739f0380424dc2acd1d1ec574aecd3`
- **Dimensions:** Mobile (780px × 5292px)
- **Key Features:**
  1. **Selfie Shooting Guide:** Expandable accordion with natural daylight guidance, angle checks, and filter warnings.
  2. **Live Capture Stage:** Face centering oval guide, natural lighting check badge, and 100% on-device privacy guarantee.
  3. **Progressive Analysis State:** 3-step visual loading feedback (skin pixel detection → contrast evaluation → palette harmony).
  4. **Key Metrics Bar:** Undertone tendency (Warm/Neutral/Cool), Visible Depth (Light/Medium/Deep), Contrast index.
  5. **4–6 Evidence & Observation Cards:**
     - Skin Undertone overtone tendency under current lighting.
     - Facial Contrast between skin, eyes, and hair.
     - Lightness & Depth reflectance range.
     - Saturation Tolerance (nuanced muted tones vs high-chroma primaries).
  6. **Comparative Color Analysis Box:** "Why Navy Works (Clear facial definition)" vs "Why Mustard Fails (Yellowish shadows)".
  7. **Side-by-side Warm vs Cool Comparison:** Interactive toggle allowing instant comparison between matched season and alternative tone.
  8. **Harmonious Palette Swatches:** Color chips with exact hex codes and styling notes.
  9. **Hanbok Bridge:** Direct primary CTA linking active palette to the Hanbok Matcher.

### 3.2 Screen 2: Hanbok Matcher & Lookbook Recommendation
- **Stitch Screen ID:** `e2d2834775804957a7c0a4ba27861922`
- **Dimensions:** Mobile (780px × 3586px)
- **Key Features:**
  1. **Personal Color Integration:** Pre-populates recommended palettes (Jade & Ivory, Dusty Rose & Navy, Moon Blue & White).
  2. **Interactive Preference Selectors:**
     - Mood: Traditional Elegant, Royal Dramatic, Soft Romantic, Modern Minimal, K-Drama Cinematic.
     - Trip Priority: Walking First vs Balanced vs Photos First (comfort vs drama ratio).
     - Destination: Gyeongbokgung Stone Walls, Hyangwonjeong Pond, Bukchon Hanok Alleys.
     - Season: Spring/Autumn Silk Organza, Summer Ramie Gauze, Winter Quilted Jacquard.
  3. **Top 3 Recommended Hanbok Looks:**
     - **Look 1 (Featured - 96% Match):** The Ethereal Jade & Crimson Moon (Celadon Jeogori + Royal Plum Chima).
     - **Look 2 (91% Match):** Modern Minimalist Moonlight Silk (Lavender Jeogori + Charcoal Indigo Chima).
     - **Look 3 (88% Match):** Royal Dancheong Heritage (Ivory Silk Jeogori + Soft Rosegold Chima).
  4. **Look Card Metadata:** Dual color swatches, fabric textures, recommended traditional accessories (Silver Jade Norigae, Silk Daenggi), backdrop compatibility rating, and walking comfort score.
  5. **Explainable Observation Cards:** 3 bullet cards detailing why the look flatters the traveler's skin tone and photo backdrop.
  6. **Boutique Map & Walking Buffer:** Walking distance notification from Gyeongbokgung Station (Exit 2 & 4) and rental return guidance.

### 3.3 Screen 3: K-Culture Lab & Daily Harmony Companion
- **Stitch Screen ID:** `d32eb460dec644db97000a6f2770b673`
- **Dimensions:** Mobile (780px × 5306px)
- **Key Features:**
  1. **"What is This?" Cultural Guide:** Respectful educational introduction to Korean seasonal harmony, Five Elements (Ohaeng / 오행), and Cheongan-Jiji calendar astronomy.
  2. **Daily Travel Harmony Card (Today's Vibe):**
     - Dominant Energy: Luminous Wood & Clear Water (Harmonious Refresh).
     - Lucky Direction: North-West (Towards Seochon alleys & Inwangsan view).
     - Energy Accent Color: Deep Celadon Forest (`#2D5A4C`).
     - Nourishing Meal Recommendation: Samgyetang / Seolleongtang to balance seasonal breeze.
  3. **Traditional Zodiac & Four Pillars Explorer:** Interactive birth year & element explorer with 100% local privacy guarantee.
  4. **Curated Palace Moment:** Gyeongbokgung Hidden Pavilion Walk (Hyangwonjeong & Jipokjae) with Golden Hour timing (16:30 – 17:45).
  5. **Integrated Action Group:** Direct cross-links to Personal Color analysis and Palace guides.

---

## 4. Mobile Navigation & Accessibility Architecture

- **Mobile Sticky Bottom Navigation Bar (`.mobileBottomNav`):** Fixed at the bottom of the viewport (`height: 64px`), providing instant one-thumb access to Color, Hanbok, Gyeongbokgung, K-Culture, and Credits.
- **Quick Help Floating Trigger:** Positioned safely above the mobile bottom navigation bar (`bottom: 80px` on mobile, `bottom: 20px` on desktop) to prevent overlapping.
- **High-Contrast Touch Targets:** All interactive controls maintain a minimum height of `44px` with clear `:focus-visible` outlines.
- **Text Overflow Safety:** Managed through `src/app/locale-overflow.css` with `overflow-wrap: anywhere`, `line-break: strict` for CJK, and `line-break: loose` for Thai.

---

## 5. Summary of Modified Files & Boundaries

### Modified UI Layer Files
- `src/features/color/color-scanner.tsx`: Full explainable personal color experience.
- `src/features/color/color-scanner.module.css`: Contemporary Korean design tokens & layout.
- `src/features/hanbok/hanbok-matcher.tsx`: Hanbok Lookbook with Top 3 recommendations.
- `src/app/[locale]/culture/page.tsx`: K-Culture Lab with Daily Harmony & Zodiac Explorer.
- `src/app/globals.css`: Color variables, typography, mobile bottom bar, and card components.
- `src/app/[locale]/layout.tsx`: Mobile navigation integration and brand header.
- `messages/public/*.json`: All 6 locales (`en`, `zh-CN`, `ja`, `zh-TW`, `vi`, `th`) with complete parity.
- `messages/hanbok/*.json`: All 6 locales (`en`, `zh-CN`, `ja`, `zh-TW`, `vi`, `th`) with complete parity.
- `docs/UI_STITCH_SPEC.md`: This specification file.

### Protected Boundaries Preserved (Untouched)
- `.github/**` and private CI/deployment configurations.
- `src/lib/**` calculation, deterministic engines, security, and credit economics.
- Server wallet and payment routing.
- Core document handoff and roadmap files.
