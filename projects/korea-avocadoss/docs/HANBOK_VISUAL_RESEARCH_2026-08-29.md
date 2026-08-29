# Hanbok Visual Reference Research — 2026-08-29

## Goal
Improve the free Hanbok experience from swatch-heavy prototype UI toward a real visual lookbook without creating copyright, personality-right, provenance, privacy, latency or misleading-product risks.

## Fresh discovery

### Official / licensing guidance
**Creative Commons reuse guidance — ADOPT.**
- Attribution, source and license information must be preserved for CC-licensed assets.
- ShareAlike / NoDerivatives / NonCommercial conditions must be evaluated per file before commercial reuse or modification.
- CC0 is preferred for low-friction commercial styling examples, while ethical source attribution is still useful.

### Wikimedia Commons candidates
**`Hanbok 1.jpg` — ADOPT for first visual slice.**
- License: CC0 1.0.
- Value: full-body silhouette; useful for explaining proportion beyond color swatches.
- Provenance: clear source/author page.
- Privacy/personality: use as a styling reference only; do not imply endorsement, identity, or rental inventory.

**`Blackpink Hanbok at MFA.jpg` — ADAPT.**
- License: CC BY 4.0 for the museum photograph.
- Value: a celebrity-linked stage Hanbok can be referenced through a garment-on-display image without copying a celebrity portrait or drama still.
- Product use: label generically as a K-pop stage / museum garment reference; preserve source and license; no endorsement claim.

**`Korean.clothes-Hanbok-01.jpg` — ADOPT WITH ATTRIBUTION.**
- License: CC BY 2.0.
- Value: real Seoul Hanbok shop palette context; useful for showing that the customer has more than three abstract HEX swatches to choose from.
- Product use: source/credit/license shown directly on the card.

**CC BY-SA people/model images — DEFER / CASE-BY-CASE.**
- Copyright reuse can be valid, but personality-right/model-release context may still be relevant for a commercial product.
- Prefer owned/model-released photography for future prominent hero/result imagery.

### Celebrity / drama / Instagram
**Direct scrape/self-host/crop/background removal — REJECT unless rights are explicitly verified.**
- Strong as internal inspiration and trend discovery.
- Not acceptable as a default production asset merely because it is popular.
- Official source link/embed may be considered separately, but does not transfer ownership or endorsement rights.

### GitHub
Repository searches for dedicated Hanbok image datasets returned no implementation-grade candidate worth adopting for this slice.
- Runtime dependency: **REJECT**.
- Reason: no clear provenance/license/maintenance advantage over directly rights-reviewed source assets.

### Hugging Face
Dataset discovery was attempted, but the installed Hugging Face connector reported `dataset_search is disabled by server configuration`.
- Evidence status: **UNAVAILABLE**.
- No HF dataset/model adoption is claimed.

### Public Threads/web
Search for attributable Threads discussion did not produce implementation-grade evidence for a visual asset library in this pass.
- Community trend evidence: **NO ADOPTION**.
- Do not invent engagement/popularity metrics.

## Implementation decision

### ADOPT now
- Separate rights-reviewed visual-reference library with source/license/credit metadata.
- Three visual cards: museum stage garment, classic full-body reference, Seoul boutique palette.
- P0 localized explanatory copy.
- Clear `styling reference, not rental inventory or endorsement` notice.
- Separate CSS module to avoid unnecessary collision with the existing Stitch/global CSS work.

### ADAPT now
Remote Wikimedia image URLs are used for the first thin slice to avoid adding unverified binary assets and to keep provenance easy to inspect.

Trade-offs:
- **License/provenance:** strong.
- **Maintenance:** source URLs are externally controlled.
- **Privacy:** the browser makes a third-party image request; no Korea Concierge PII is intentionally attached, but the remote host receives normal network metadata.
- **Latency:** external image loading can be slower than local optimized assets.
- **Bundle/compute:** near-zero application bundle cost and no AI inference.
- **Inference cost:** $0.
- **Margin:** no API cost.
- **Product quality:** large improvement over swatches, but not yet equivalent to owned premium lookbook photography.

### Next improvement
- Ingest approved assets into a first-party optimized asset pipeline once binary/provenance handling is available.
- Prefer model-released/owned photography for the primary Hanbok result cards.
- Use background-removed cutouts only from sources explicitly allowing modification.
- Later map approved visuals to deterministic look archetypes without claiming the pictured item is the actual rental garment.
