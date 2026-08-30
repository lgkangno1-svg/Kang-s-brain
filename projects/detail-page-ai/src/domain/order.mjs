import {
  CATEGORIES,
  COPY_MOODS,
  HIGHLIGHT_POINTS,
  INFO_DENSITIES,
  MAIN_VISUAL_STYLES,
  MODEL_SHOT_COUNTS,
  PLANS,
  THUMBNAIL_STYLES,
  TONES,
  chooseBodyCount,
} from '../config/catalog.mjs';
import { IMAGE_TEXT_RISK_DISCLOSURE } from '../policy/disclosure.mjs';

function cleanOptional(value) {
  if (value === undefined || value === null) return null;
  const cleaned = String(value).trim();
  return cleaned.length ? cleaned : null;
}

function requireString(name, value) {
  const cleaned = cleanOptional(value);
  if (!cleaned) throw new Error(`${name} is required`);
  return cleaned;
}

function requireEnum(name, value, allowed) {
  if (!allowed.includes(value)) throw new Error(`${name} is invalid`);
  return value;
}

function normalizeHighlights(values = []) {
  const unique = [...new Set(Array.isArray(values) ? values : [])];
  for (const value of unique) requireEnum('highlightPoint', value, HIGHLIGHT_POINTS);
  return unique;
}

export function normalizeOrder(input) {
  const planId = requireEnum('planId', input.planId, Object.keys(PLANS));
  const infoDensity = requireEnum('infoDensity', input.infoDensity ?? 'standard', INFO_DENSITIES);
  if (input.acceptedImageTextRisk !== true) {
    throw new Error(`Disclosure acceptance required: ${IMAGE_TEXT_RISK_DISCLOSURE.id}`);
  }

  const specification = cleanOptional(input.specification);
  const salePrice = cleanOptional(input.salePrice);

  return Object.freeze({
    planId,
    productName: requireString('productName', input.productName),
    category: requireEnum('category', input.category, CATEGORIES),
    productDescription: requireString('productDescription', input.productDescription),
    specification,
    salePrice,
    mainVisualStyle: requireEnum('mainVisualStyle', input.mainVisualStyle ?? 'product_only', MAIN_VISUAL_STYLES),
    modelShotCount: requireEnum('modelShotCount', Number(input.modelShotCount ?? 0), MODEL_SHOT_COUNTS),
    tone: requireEnum('tone', input.tone ?? 'white', TONES),
    copyMood: requireEnum('copyMood', input.copyMood ?? 'sales', COPY_MOODS),
    infoDensity,
    highlightPoints: normalizeHighlights(input.highlightPoints),
    thumbnailStyle: requireEnum('thumbnailStyle', input.thumbnailStyle ?? 'strong_sales', THUMBNAIL_STYLES),
    mustInclude: cleanOptional(input.mustInclude),
    mustExclude: cleanOptional(input.mustExclude),
    uploads: Array.isArray(input.uploads) ? input.uploads : [],
    disclosureId: IMAGE_TEXT_RISK_DISCLOSURE.id,
    output: Object.freeze({
      thumbnailCount: PLANS[planId].thumbnailCount,
      bodyCount: chooseBodyCount(planId, infoDensity),
      imageQuality: PLANS[planId].imageQuality,
      maxRetriesPerFailedAsset: PLANS[planId].maxRetriesPerFailedAsset,
      maxReferenceImages: PLANS[planId].maxReferenceImages,
    }),
    omissionRules: Object.freeze({
      specification: specification === null,
      salePrice: salePrice === null,
    }),
  });
}
