export const CATEGORIES = Object.freeze(['fruit', 'vegetable', 'meat', 'seafood', 'processed_food']);
export const MAIN_VISUAL_STYLES = Object.freeze(['male_model', 'female_model', 'farm_documentary', 'product_only', 'premium_studio']);
export const MODEL_SHOT_COUNTS = Object.freeze([0, 2, 4, 6]);
export const TONES = Object.freeze(['white', 'beige', 'black', 'natural_green', 'luxury_dark']);
export const COPY_MOODS = Object.freeze(['emotional', 'professional', 'trust', 'sales', 'gift']);
export const INFO_DENSITIES = Object.freeze(['simple', 'standard', 'rich']);
export const HIGHLIGHT_POINTS = Object.freeze(['freshness', 'price', 'origin', 'taste', 'nutrition', 'gift', 'bulk', 'value']);
export const THUMBNAIL_STYLES = Object.freeze(['strong_sales', 'emotional', 'premium', 'information']);

export const PLANS = Object.freeze({
  trial: Object.freeze({
    id: 'trial',
    priceKrw: 9900,
    thumbnailCount: 1,
    bodyCount: 8,
    imageQuality: 'medium',
    maxReferenceImages: 3,
    maxRetriesPerFailedAsset: 1,
  }),
  standard: Object.freeze({
    id: 'standard',
    priceKrw: 14900,
    thumbnailCount: 2,
    bodyCountRange: Object.freeze([10, 12]),
    imageQuality: 'high',
    maxReferenceImages: 6,
    maxRetriesPerFailedAsset: 2,
  }),
});

export function chooseBodyCount(planId, infoDensity = 'standard') {
  if (planId === 'trial') return PLANS.trial.bodyCount;
  if (planId !== 'standard') throw new Error(`Unknown plan: ${planId}`);
  if (infoDensity === 'simple') return 10;
  if (infoDensity === 'rich') return 12;
  return 11;
}
