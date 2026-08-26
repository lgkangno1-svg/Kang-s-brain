export type CreditPlanId = "basic" | "advanced" | "ultra";

export type CreditPlan = {
  id: CreditPlanId;
  name: string;
  priceUsd: number;
  credits: number;
  badge?: string;
  description: string;
  purchaseKind: "trip_pass";
};

export type TopUpPack = {
  id: string;
  priceUsd: number;
  credits: number;
};

export type FeatureCreditPrice = {
  feature: string;
  label: string;
  credits: number;
  /** Raw expected supplier/API cost before reserves. Recalibrate from measured p95 usage. */
  estimatedVariableCostUsd: number;
  valueTier: "free" | "basic" | "advanced" | "premium";
};

/**
 * Launch pricing hypotheses for one-time Trip Passes.
 * Tourists should not be forced into an auto-renewing subscription at launch.
 * Prices remain server-owned/configurable and must be revalidated from real conversion data.
 */
export const CREDIT_PLANS: CreditPlan[] = [
  {
    id: "basic",
    name: "Basic",
    priceUsd: 7.99,
    credits: 120,
    purchaseKind: "trip_pass",
    description: "For a short Seoul trip with several personalized recommendations.",
  },
  {
    id: "advanced",
    name: "Advanced",
    priceUsd: 14.99,
    credits: 400,
    purchaseKind: "trip_pass",
    badge: "Best value",
    description: "For travelers using styling, culture and itinerary features throughout the trip.",
  },
  {
    id: "ultra",
    name: "Ultra",
    priceUsd: 24.99,
    credits: 1_000,
    purchaseKind: "trip_pass",
    badge: "Lowest cost per credit",
    description: "For couples, families and power users who want repeated premium personalization.",
  },
];

/**
 * Optional one-time refills after a user already understands the product.
 * They are intentionally less generous than the main Advanced/Ultra passes.
 */
export const TOP_UP_PACKS: TopUpPack[] = [
  { id: "topup-60", priceUsd: 4.99, credits: 60 },
  { id: "topup-160", priceUsd: 9.99, credits: 160 },
  { id: "topup-400", priceUsd: 19.99, credits: 400 },
];

/**
 * Customer-facing prices are fixed per action and shown before confirmation.
 * Never expose token-variable billing to the traveler. We absorb model/provider variation
 * and reprice only after observing real p50/p95 supplier cost.
 */
export const FEATURE_CREDIT_PRICES: FeatureCreditPrice[] = [
  { feature: "color.first_scan", label: "First personal-color scan", credits: 0, estimatedVariableCostUsd: 0.0002, valueTier: "free" },
  { feature: "color.repeat_scan", label: "Repeat personal-color scan", credits: 3, estimatedVariableCostUsd: 0.0002, valueTier: "basic" },
  { feature: "color.report", label: "Detailed personal-color report", credits: 8, estimatedVariableCostUsd: 0.0010, valueTier: "basic" },
  { feature: "color.vision", label: "Premium photo color review", credits: 20, estimatedVariableCostUsd: 0.0060, valueTier: "advanced" },
  { feature: "hanbok.recommend", label: "Hanbok match", credits: 8, estimatedVariableCostUsd: 0.0015, valueTier: "basic" },
  { feature: "travel.itinerary", label: "AI itinerary", credits: 12, estimatedVariableCostUsd: 0.0060, valueTier: "advanced" },
  { feature: "travel.replan", label: "Itinerary re-plan", credits: 4, estimatedVariableCostUsd: 0.0030, valueTier: "basic" },
  { feature: "culture.zodiac", label: "Korean / Western zodiac", credits: 0, estimatedVariableCostUsd: 0, valueTier: "free" },
  { feature: "culture.saju.quick", label: "Saju quick cultural summary", credits: 3, estimatedVariableCostUsd: 0.0005, valueTier: "basic" },
  { feature: "culture.saju", label: "Full Saju cultural reading", credits: 15, estimatedVariableCostUsd: 0.0025, valueTier: "advanced" },
  { feature: "culture.saju.deep", label: "Extended Saju reading", credits: 25, estimatedVariableCostUsd: 0.0050, valueTier: "premium" },
  { feature: "concierge.standard", label: "Korea concierge answer", credits: 2, estimatedVariableCostUsd: 0.0005, valueTier: "basic" },
  { feature: "concierge.premium", label: "Premium multi-step concierge answer", credits: 8, estimatedVariableCostUsd: 0.0040, valueTier: "premium" },
];

export const ECONOMICS_ASSUMPTIONS = {
  /** OpenRouter currently charges a funding fee when buying platform credits. */
  openRouterFundingFeePercent: 0.055,
  /** Covers provider fallback/retry variance before we have enough p95 production data. */
  providerRetryReservePercent: 0.25,
  /** Conservative blended allowance for PSP, PayPal/card, FX and payment friction. */
  paymentPercentReserve: 0.10,
  paymentFixedReserveUsd: 0.35,
  /** Even if every purchased credit is redeemed, supplier cost should stay below this budget. */
  maxGuardedSupplierCostPerCreditUsd: 0.001,
  minimumFeatureVariableGrossMargin: 0.85,
  minimumPlanContributionMargin: 0.80,
} as const;

export function effectiveUsdPerCredit(plan: CreditPlan): number {
  return plan.priceUsd / plan.credits;
}

export function lowestUsdPerCredit(): number {
  return Math.min(...CREDIT_PLANS.map(effectiveUsdPerCredit));
}

export function guardedSupplierCost(rawSupplierCostUsd: number): number {
  if (rawSupplierCostUsd <= 0) return 0;
  return rawSupplierCostUsd
    * (1 + ECONOMICS_ASSUMPTIONS.openRouterFundingFeePercent)
    * (1 + ECONOMICS_ASSUMPTIONS.providerRetryReservePercent);
}

export function featureRevenueAtCheapestPlan(feature: FeatureCreditPrice): number {
  return feature.credits * lowestUsdPerCredit();
}

export function estimatedFeatureVariableMargin(feature: FeatureCreditPrice): number | null {
  const revenue = featureRevenueAtCheapestPlan(feature);
  if (revenue <= 0) return null;
  const cost = guardedSupplierCost(feature.estimatedVariableCostUsd);
  return (revenue - cost) / revenue;
}

export function worstCasePlanContributionMargin(plan: CreditPlan): number {
  const paymentReserve = plan.priceUsd * ECONOMICS_ASSUMPTIONS.paymentPercentReserve
    + ECONOMICS_ASSUMPTIONS.paymentFixedReserveUsd;
  const maxSupplierCost = plan.credits * ECONOMICS_ASSUMPTIONS.maxGuardedSupplierCostPerCreditUsd;
  return (plan.priceUsd - paymentReserve - maxSupplierCost) / plan.priceUsd;
}

/**
 * Cost-protection floor. The commercial/value floor for a feature may be higher.
 * `estimatedVariableCostUsd` is raw measured/estimated supplier cost.
 */
export function minimumCreditsForCost(
  estimatedVariableCostUsd: number,
  targetMargin = ECONOMICS_ASSUMPTIONS.minimumFeatureVariableGrossMargin,
): number {
  if (estimatedVariableCostUsd <= 0) return 0;

  const guardedCost = guardedSupplierCost(estimatedVariableCostUsd);
  const maxCostShare = 1 - targetMargin;
  const revenueRequired = guardedCost / maxCostShare;
  const marginFloor = Math.ceil(revenueRequired / lowestUsdPerCredit());
  const supplierBudgetFloor = Math.ceil(
    guardedCost / ECONOMICS_ASSUMPTIONS.maxGuardedSupplierCostPerCreditUsd,
  );

  return Math.max(1, marginFloor, supplierBudgetFloor);
}
