export const PROMPT_ROUTES = Object.freeze({
  DIRECT_CONVERSION: 'direct_conversion_master',
  TED_GOLDEN_CIRCLE: 'ted_autofill_then_master_v3',
});

/**
 * Customer never chooses a route. Both routes produce a sales-conversion detail page.
 * Richer evidence/story uses the Q1-Q10 -> V3 path; sparse commodity inputs use the direct master.
 */
export function choosePromptRoute({ confirmedEvidenceCount = 0, differentiatedFactsCount = 0, descriptionLength = 0, hasProofDocument = false }) {
  const evidenceScore = Math.min(3, confirmedEvidenceCount) + Math.min(3, differentiatedFactsCount) + (hasProofDocument ? 2 : 0) + (descriptionLength >= 500 ? 1 : 0);
  return evidenceScore >= 4 ? PROMPT_ROUTES.TED_GOLDEN_CIRCLE : PROMPT_ROUTES.DIRECT_CONVERSION;
}
