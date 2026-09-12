# Korea Concierge visual redesign — 2026-09-12

## Direction

The visual system now follows a premium editorial travel/culture direction rather than the previous fixed-width Stitch screenshot shell.

Reference principles reviewed:
- Six Senses: emotionally led destination storytelling, restrained luxury typography, large photographic moments.
- Airbnb Experiences: clear answer to what the guest will do, why it is distinctive, and practical logistics.
- VISITKOREA: travel planning and current trip utility remain visible alongside inspiration.

## Design system

- Warm paper canvas rather than flat white.
- Editorial serif display typography with modern sans UI typography.
- Deep celadon/jade as the primary action color, muted persimmon/gold as accent, restrained dancheong red.
- Larger image-led homepage hero with generous desktop width.
- Service cards use real imagery, lighter framing and responsive 5/3/2/1-column behavior.
- Forms use 48px controls, clear focus states, softer borders and readable helper text.
- Header/footer use translucent paper surfaces and reduced visual chrome.

## Saju page

The Saju experience keeps the deterministic calculation unchanged but now presents the input state as a premium editorial two-column page on desktop. The copy line `A glimpse into what lies ahead.` is decorative brand language; the existing cultural/entertainment disclaimer remains visible and the result is still described as symbolic, not guaranteed.

Mobile collapses to one column, keeps all controls full width, and preserves touch target sizing. The result state uses the same tool card surface and readable Four Pillars / Five Elements / five-year sections.

## Functional constraints preserved

- No new AI call is introduced by the redesign.
- No payment gate is opened.
- Existing Saju calculation, unknown-time handling, privacy behavior, locale routing, Quick Help and feature links remain unchanged.
- Responsive design must remain usable at 320px and at 200% desktop zoom.

## QA targets

Desktop: 1280, 1440, 1920 widths.
Mobile: 320, 360, 390, 430 widths.
Locales: en, zh-CN, ja, zh-TW, vi, th.
Critical pages: home, Saju, Personal Color, Hanbok, My Korea Look, Gyeongbokgung planner.
