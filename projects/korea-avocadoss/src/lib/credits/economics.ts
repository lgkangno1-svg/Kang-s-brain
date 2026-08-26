export type CreditPlanId = "basic" | "advanced" | "ultra";

export type CreditPlan = {
  id: CreditPlanId;
  name: string;
  priceUsd: number;
  credits: number;
  badge?: string;
  description: string;
};

export type FeatureCreditPrice = {
  feature: string;
  label: string;
  credits: number;
  estimatedVariableCostUsd: number;
  valueTier: "free" | "basic" | "advanced" | "premium";
};

/**
 * Launch hypotheses, intentionally centralized and server-owned.
 * Prices must be revalidated after payment-provider fees and real p95 AI usage are measured.
 */
export const CREDIT_PLANS: CreditPlan[] = [
  {
    id: "basic",
    name: "Basic",
    priceUsd: 6.99,
    credits: 300,
    description: "For a few personalized Korea experiences during one trip.",
  },
  {
    id: "advanced",
    name: "Advanced",
    priceUsd: 14.99,
    credits: 850,
    badge: "Best value",
    description: "For travelers using styling, culture and itinerary features throughout the trip.",
  },
  {
    id: "ultra",
    name: "Ultra",
    priceUsd: 29.99,
    credits: 2_200,
    badge: "Lowest cost per credit",
    description: "For power users, couples or groups who want repeated premium personalization.",
  },
];

export const FEATURE_CREDIT_PRICES: FeatureCreditPrice[] = [
  { feature: "color.basic", label: "First personal-color scan", credits: 0, estimatedVariableCostUsd: 0.0002, valueTier: "free" },
  { feature: "color.report", label: "Detailed personal-color report", credits: 4, estimatedVariableCostUsd: 0.0010, valueTier: "basic" },
  { feature: "color.vision", label: "Premium photo color review", credits: 12, estimatedVariableCostUsd: 0.0080, valueTier: "advanced" },
  { feature: "hanbok.recommend", label: "Hanbok match", credits: 5, estimatedVariableCostUsd: 0.0015, valueTier: "basic" },
  { feature: "hanbok.vision", label: "Premium Hanbok photo review", credits: 15, estimatedVariableCostUsd: 0.0100, valueTier: "premium" },
  { feature: "travel.itinerary", label: "AI itinerary", credits: 8, estimatedVariableCostUsd: 0.0070, valueTier: "advanced" },
  { feature: "travel.replan", label: "Itinerary re-plan", credits: 3, estimatedVariableCostUsd: 0.0045, valueTier: "basic" },
  { feature: "culture.saju", label: "Saju cultural reading", credits: 8, estimatedVariableCostUsd: 0.0025, valueTier: "advanced" },
  { feature: "concierge.premium", label: "Premium Korea concierge answer", credits: 10, estimatedVariableCostUsd: 0.0080, valueTier: "premium" },
];

export const ECONOMICS_ASSUMPTIONS = {
  /** Conservative planning assumptions, not provider contract claims. */
  paymentPercentReserve: 0.06,
  paymentFixedReserveUsd: 0.35,
  retryAndRefundReservePercent: 0.15,
  minimumVariableGrossMargin: 0.80,
} as const;

export function effectiveUsdPerCredit(plan: CreditPlan): number {
  return plan.priceUsd / plan.credits;
}

export function lowestUsdPerCredit(): number {
  return Math.min(...CREDIT_PLANS.map(effectiveUsdPerCredit));
}

export function featureRevenueAtCheapestPlan(feature: FeatureCreditPrice): number {
  return feature.credits * lowestUsdPerCredit();
}

export function estimatedFeatureVariableMargin(feature: FeatureCreditPrice): number | null {
  const revenue = featureRevenueAtCheapestPlan(feature);
  if (revenue <= 0) return null;
  return (revenue - feature.estimatedVariableCostUsd) / revenue;
}

/**
 * Cost-protection floor. Feature pricing can stay ABOVE this floor for perceived value,
 * but should not be configured below it without an intentional acquisition subsidy.
 */
export function minimumCreditsForCost(
  estimatedVariableCostUsd: number,
  targetMargin = ECONOMICS_ASSUMPTIONS.minimumVariableGrossMargin,
): number {
  if (estimatedVariableCostUsd <= 0) return 0;
  const maxCostShare = 1 - targetMargin;
  const revenueRequired = estimatedVariableCostUsd / maxCostShare;
  return Math.max(1, Math.ceil(revenueRequired / lowestUsdPerCredit()));
}
