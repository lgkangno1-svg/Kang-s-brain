# Korea Concierge — Responsive QA Baseline

**Status:** active product requirement  
**Applies to:** all public, account, credit, payment, result and helper surfaces

## Why this exists

The early UI accumulated several Stitch screenshot-fidelity CSS layers with different fixed widths and breakpoints. That made individual screenshots look close to a reference while producing inconsistent behavior across real devices. Responsive behavior is now a first-class product contract rather than a per-page afterthought.

## Current layout contract

### Viewport bands

| Band | Representative widths | Required behavior |
|---|---:|---|
| Small phone | 320–379 px | No horizontal scroll; compact header; one-column cards; circular Quick Help launcher; 44 px touch targets |
| Phone | 380–519 px | One-column service cards; safe-area bottom navigation; full-width feature flows |
| Large phone / small tablet | 520–859 px | Two-column home service grid where copy fits; feature pages stack; bottom navigation active |
| Tablet / small laptop | 860–1179 px | Desktop header where it fits; disabled roadmap nav items hidden; denser multi-column content allowed |
| Desktop | 1180–1439 px | Full navigation and multi-column layouts; content uses available width rather than legacy screenshot shell |
| Large desktop | 1440 px+ | App caps at 1440 px to preserve readable line lengths; key feature content caps around 1200 px |

### Global invariants

- Minimum supported CSS viewport width: **320 px**.
- No page may require horizontal scrolling for normal translated content.
- Mobile bottom navigation and Quick Help must respect `env(safe-area-inset-bottom)`.
- Interactive controls on coarse pointers should be at least **44 px** high where practical.
- Long English, Vietnamese, Thai, Japanese, Simplified Chinese and Traditional Chinese labels must wrap safely.
- Core text should not depend on screenshot-scale 8–10 px typography for readability.
- Public pages must remain usable at 200% browser zoom without trapping horizontal content.
- Images, video, SVG and canvas content may not exceed their container width.
- Reduced-motion preference must disable decorative motion.

## 2026-09-05 audit findings and fixes

### 1. Desktop shell was locked to the reference screenshot

**Finding:** `stitch-reference-match.css` capped the application near 1034 px, while another layer capped it near 1040 px. On 1280–1600 px screens this made the site look undersized and left excessive dead space.

**Fix:** final responsive layer expands the application up to 1440 px and primary feature content up to 1200 px.

### 2. Breakpoints were inconsistent

**Finding:** core CSS used 860 px, personal color used 760 px, Stitch reference layers used 980/860/520 px, and feature polish used 760 px. The same device could therefore receive conflicting layouts.

**Fix:** a final shared system owns 1180 / 860 / 520 / 380 px behavior and resolves conflicts after feature-specific fidelity layers.

### 3. Header collision risk on translated locales

**Finding:** brand + six navigation items + a 136 px language selector could collide on mid-size laptop/tablet widths, especially in Japanese, Vietnamese and Thai.

**Fix:** roadmap-only disabled items disappear before the core navigation; mobile receives a compact brand/language header plus bottom navigation.

### 4. Mobile navigation and Quick Help competed for the same bottom area

**Finding:** fixed bottom navigation and the fixed Quick Help launcher/panel used hard-coded offsets and did not account for iOS safe-area insets.

**Fix:** both use safe-area-aware offsets; Quick Help uses dynamic viewport height and collapses to a compact launcher on very small phones.

### 5. Screenshot-fidelity text was too small

**Finding:** several route, Saju, credit, color-result and helper descriptions were rendered at 8–11 px.

**Fix:** final layer raises key body/help typography while preserving the existing visual hierarchy.

### 6. Feature widths varied substantially

**Finding:** Gyeongbokgung, credits, Hanbok, personal color and Saju each used different maximum widths and mobile edge treatment.

**Fix:** shared 1200 px content cap on desktop; full-width/stacked feature treatment on mobile.

## Required route matrix

Run responsive QA on all P0 locales (`en`, `zh-CN`, `ja`, `zh-TW`, `vi`, `th`) for:

- `/[locale]`
- `/[locale]/color` before upload, analyzing, result and manual correction states
- `/[locale]/hanbok` feminine/masculine, matcher and recommendation result states
- `/[locale]/explore/gyeongbokgung`
- `/[locale]/culture`
- `/[locale]/credits`
- checkout/success/error routes as they become active
- Quick Help closed/open/deep-topic states

## Viewport QA matrix

At minimum validate:

- 320 × 568
- 360 × 800
- 390 × 844
- 430 × 932
- 768 × 1024
- 1024 × 768
- 1280 × 800
- 1440 × 900
- 1920 × 1080

Also test 200% zoom on desktop and landscape orientation on a phone-sized viewport.

## Automated guard

`npm run check:responsive` statically verifies that:

- the final responsive stylesheet remains imported last;
- device-width + viewport-fit configuration remains present;
- large/mobile/small-phone breakpoints remain present;
- safe-area handling, dynamic viewport Quick Help, coarse-pointer touch targets and reduced-motion handling remain present.

This static guard does **not** replace rendered browser QA.

## Rendered QA limitation in this session

The connected Browser development plugin is not available in the current session, and the container cannot clone GitHub over the network. Therefore this pass performed source-level responsive auditing and committed safeguards, but did not claim screenshot/browser validation. A future run with Browser/Playwright access must execute the route/viewport matrix above before production cutover.
