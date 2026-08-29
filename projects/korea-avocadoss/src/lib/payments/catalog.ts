/**
 * Korea Concierge Stripe Product & Price Catalog.
 *
 * Strict Security Rules:
 * 1. Clients ONLY pass an internal product key from `APPROVED_PRODUCT_KEYS`.
 * 2. Clients NEVER specify amounts, currencies, or arbitrary Stripe price IDs.
 * 3. Server maps internal product key -> approved configured Stripe Price ID.
 * 4. Zero invented/placeholder prices. When Stripe Price ID is not configured, returns explicit unconfigured status.
 */

export const APPROVED_PRODUCT_KEYS = [
  'premium_hanbok_match',
  'premium_naming_studio',
  'trip_pass_basic',
  'trip_pass_advanced',
  'trip_pass_ultra',
] as const;

export type ProductKey = (typeof APPROVED_PRODUCT_KEYS)[number];

export type ProductDefinition = {
  key: ProductKey;
  name: string;
  description: string;
  priceEnvVar: string;
  category: 'styling' | 'naming' | 'trip_pass';
};

export const PRODUCT_CATALOG: Record<ProductKey, ProductDefinition> = {
  premium_hanbok_match: {
    key: 'premium_hanbok_match',
    name: 'Premium Hanbok Match',
    description: 'Consented photo-aware explainable Hanbok styling recommendation with personalized palette analysis.',
    priceEnvVar: 'STRIPE_PRICE_ID_HANBOK_MATCH',
    category: 'styling',
  },
  premium_naming_studio: {
    key: 'premium_naming_studio',
    name: 'Premium Naming Studio',
    description: 'Curated Korean & Asian naming consultation with Hangul, Hanja, pronunciation, and onomastics rationale.',
    priceEnvVar: 'STRIPE_PRICE_ID_NAMING_STUDIO',
    category: 'naming',
  },
  trip_pass_basic: {
    key: 'trip_pass_basic',
    name: 'Basic Trip Pass',
    description: '120 credits for short Seoul trips with personalized recommendations.',
    priceEnvVar: 'STRIPE_PRICE_ID_TRIP_PASS_BASIC',
    category: 'trip_pass',
  },
  trip_pass_advanced: {
    key: 'trip_pass_advanced',
    name: 'Advanced Trip Pass',
    description: '400 credits for travelers exploring styling, culture, and itinerary features.',
    priceEnvVar: 'STRIPE_PRICE_ID_TRIP_PASS_ADVANCED',
    category: 'trip_pass',
  },
  trip_pass_ultra: {
    key: 'trip_pass_ultra',
    name: 'Ultra Trip Pass',
    description: '1,000 credits for power users, couples, and repeated premium personalization.',
    priceEnvVar: 'STRIPE_PRICE_ID_TRIP_PASS_ULTRA',
    category: 'trip_pass',
  },
};

export function isApprovedProductKey(key: unknown): key is ProductKey {
  return typeof key === 'string' && (APPROVED_PRODUCT_KEYS as readonly string[]).includes(key);
}

export function resolveStripePriceId(key: ProductKey): { priceId: string | null; error?: string } {
  const product = PRODUCT_CATALOG[key];
  if (!product) {
    return { priceId: null, error: `Unknown product key: ${key}` };
  }

  const envPriceId = process.env[product.priceEnvVar]?.trim();
  if (!envPriceId) {
    return {
      priceId: null,
      error: `Stripe Price ID for product '${key}' is not configured (${product.priceEnvVar} is missing).`,
    };
  }

  return { priceId: envPriceId };
}
