# Hanbok Visual Source Policy

**Purpose:** make Hanbok recommendations feel visually compelling while preserving copyright, personality-right, provenance, and commercial-use safety.

## Product intent

The Hanbok experience should not feel like a color-swatch prototype. Users should see realistic, aspirational examples that resemble the visual language they already understand from K-drama, celebrity styling, palace photography, fashion editorials, and popular social content.

However, visual appeal does **not** override rights clearance. A beautiful reference that cannot be safely reused is inspiration, not a production asset.

## Source priority

### Tier A — preferred production assets

Use these first for images rendered directly in the product:

1. our own commissioned/owned photography with explicit model/property releases where needed;
2. CC0 / public-domain imagery suitable for commercial reuse;
3. clearly licensed Creative Commons imagery whose commercial-use and attribution/share-alike requirements are compatible with the product;
4. licensed stock/editorial assets where the license explicitly permits our intended website/commercial use;
5. official tourism/cultural institution imagery only when the specific asset's license permits the intended use.

Every production image should store provenance metadata alongside the asset or in an asset manifest:

- source URL;
- author/rights holder;
- license name/version;
- attribution text;
- whether modification/cropping/background removal is allowed;
- whether share-alike applies;
- date license was verified;
- personality/model-release caveat when known.

### Tier B — celebrity / drama / social inspiration

Celebrity Instagram posts, drama stills, music-video frames, fashion-editorial photos, and other copyrighted social/media images are highly useful for **style discovery and visual benchmarking**.

Use them for:

- internal moodboards;
- identifying popular silhouette/color/accessory combinations;
- generating descriptive style tags;
- linking to or embedding an official source where platform terms and rights permit it;
- finding a legally reusable equivalent look.

Do **not** download, crop, background-remove, mirror, recolor, or self-host those images as normal product assets unless explicit reuse rights have been verified.

An official embed does not automatically mean we own the image. Do not imply endorsement by the celebrity, actor, broadcaster, designer, or rights holder.

### Tier C — celebrity-linked garments without celebrity portrait

Prefer legally reusable photographs of the **garment itself** when a culturally recognizable outfit is useful. Example: a museum/exhibition photograph of a famous performance Hanbok can communicate the style without copying the celebrity portrait, provided the photograph's own license permits reuse.

This is preferable to copying a drama still or Instagram portrait.

### Tier D — reject for production

Do not use as direct product assets:

- Pinterest/repost images with unclear origin;
- scraped Instagram/TikTok images;
- fan-account reposts;
- drama screenshots without rights;
- watermarked stock previews;
- images where the license cannot be verified;
- AI-generated images presented as a real rental product or real celebrity look;
- background-removed cutouts made from an unlicensed source image.

## Background-removed / cutout images

Cutout-style imagery is encouraged because it works well for Hanbok comparison cards.

But the base image must already be legally reusable. Background removal is a derivative modification, so the source license must permit modification and any attribution/share-alike obligations must still be satisfied.

Preferred production pattern:

- licensed/CC0 full-body Hanbok photo → background removal → transparent WebP/AVIF → attribution/provenance manifest;
- our own model photo → cutout → direct product use;
- original illustration/3D render → cutout-style display;
- generated visual → clearly label as an illustrative styling example when it does not depict a real rentable item.

## Popularity / 'people reacted well' criterion

Popularity can help select examples, but do not invent engagement metrics.

Acceptable signals:

- visible engagement counts from an attributable public source;
- repeated appearance in reputable fashion/culture coverage;
- repeated community preference across independent discussions;
- internal click/save/selection data once Korea Concierge has enough traffic.

Record popularity as a qualitative or measured signal, not as a fabricated score.

## Recommended starting sources

Fresh research on 2026-08-29 found useful reusable Hanbok pools on Wikimedia Commons, including:

- `Category:Hanbok` — broad discovery pool;
- `Hanbok 1.jpg` — CC0;
- `올릴사진.jpg` — CC0;
- Korea.net / Korean Culture and Information Service Hanbok imagery with explicit Creative Commons terms where individually verified;
- `Blackpink Hanbok at MFA.jpg` — photograph of the Hanbok outfit on museum display, CC BY 4.0, useful as a celebrity-linked garment reference without relying on a celebrity portrait.

Each candidate must still be checked individually before shipping because licenses and personality-right caveats differ by file.

## UI direction

The free Hanbok result should evolve toward a visual lookbook:

- large garment/model visual first;
- palette second;
- concise reason for fit;
- destination/photo backdrop pairing;
- accessories and season/fabric notes;
- alternate look/colorway;
- clear distinction between `real reusable reference`, `illustrative styling`, and `real rental product`.

Celebrity/drama-inspired labels should describe the **style**, not imply endorsement. Prefer phrases like `cinematic palace look`, `modern idol-inspired color blocking`, or `historical-drama-inspired silhouette` unless an exact licensed source is being cited.

## Research/update rule

Before each material Hanbok visual refresh:

1. inspect latest repo/branches first;
2. search fresh reusable image sources and current licensing terms;
3. compare against any concurrent Stitch/UI work;
4. record ADOPT / ADAPT / REJECT for candidate sources;
5. preserve asset provenance in code/docs;
6. never trade rights safety for visual polish.
