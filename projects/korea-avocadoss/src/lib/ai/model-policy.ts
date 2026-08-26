export type AiFeature =
  | "color.explain"
  | "color.vision"
  | "hanbok.explain"
  | "hanbok.vision"
  | "place.explain"
  | "travel.itinerary"
  | "travel.replan"
  | "translation.short"
  | "culture.saju.explain"
  | "concierge.premium";

export type AiPrivacyClass = "public" | "profile" | "sensitive-media";

export type AiModelPolicy = {
  model: string;
  fallbackModel?: string;
  privacy: AiPrivacyClass;
  requireZdr: boolean;
  denyDataCollection: boolean;
  allowRawMedia: boolean;
  maxInputTokens: number;
  maxOutputTokens: number;
  maxAiCostUsd: number;
};

const QWEN_CHEAP = "qwen/qwen3-30b-a3b-instruct-2507";
const DEEPSEEK_REASONING = "deepseek/deepseek-v3.2";
const QWEN_VISION = "qwen/qwen3.5-35b-a3b";
const KIMI_PREMIUM = "moonshotai/kimi-k2.5";

export const AI_MODEL_POLICY: Record<AiFeature, AiModelPolicy> = {
  "color.explain": {
    model: QWEN_CHEAP,
    fallbackModel: DEEPSEEK_REASONING,
    privacy: "profile",
    requireZdr: false,
    denyDataCollection: true,
    allowRawMedia: false,
    maxInputTokens: 1_500,
    maxOutputTokens: 600,
    maxAiCostUsd: 0.001,
  },
  "color.vision": {
    model: QWEN_VISION,
    fallbackModel: KIMI_PREMIUM,
    privacy: "sensitive-media",
    requireZdr: true,
    denyDataCollection: true,
    allowRawMedia: true,
    maxInputTokens: 3_000,
    maxOutputTokens: 700,
    maxAiCostUsd: 0.006,
  },
  "hanbok.explain": {
    model: QWEN_CHEAP,
    fallbackModel: DEEPSEEK_REASONING,
    privacy: "profile",
    requireZdr: false,
    denyDataCollection: true,
    allowRawMedia: false,
    maxInputTokens: 2_000,
    maxOutputTokens: 700,
    maxAiCostUsd: 0.0015,
  },
  "hanbok.vision": {
    model: QWEN_VISION,
    fallbackModel: KIMI_PREMIUM,
    privacy: "sensitive-media",
    requireZdr: true,
    denyDataCollection: true,
    allowRawMedia: true,
    maxInputTokens: 3_500,
    maxOutputTokens: 800,
    maxAiCostUsd: 0.008,
  },
  "place.explain": {
    model: QWEN_CHEAP,
    fallbackModel: DEEPSEEK_REASONING,
    privacy: "public",
    requireZdr: false,
    denyDataCollection: true,
    allowRawMedia: false,
    maxInputTokens: 2_500,
    maxOutputTokens: 500,
    maxAiCostUsd: 0.001,
  },
  "travel.itinerary": {
    model: DEEPSEEK_REASONING,
    privacy: "profile",
    requireZdr: false,
    denyDataCollection: true,
    allowRawMedia: false,
    maxInputTokens: 5_000,
    maxOutputTokens: 1_400,
    maxAiCostUsd: 0.006,
  },
  "travel.replan": {
    model: DEEPSEEK_REASONING,
    privacy: "profile",
    requireZdr: false,
    denyDataCollection: true,
    allowRawMedia: false,
    maxInputTokens: 3_000,
    maxOutputTokens: 900,
    maxAiCostUsd: 0.004,
  },
  "translation.short": {
    model: QWEN_CHEAP,
    privacy: "public",
    requireZdr: false,
    denyDataCollection: true,
    allowRawMedia: false,
    maxInputTokens: 1_200,
    maxOutputTokens: 600,
    maxAiCostUsd: 0.001,
  },
  "culture.saju.explain": {
    model: QWEN_CHEAP,
    fallbackModel: DEEPSEEK_REASONING,
    privacy: "profile",
    requireZdr: false,
    denyDataCollection: true,
    allowRawMedia: false,
    maxInputTokens: 2_000,
    maxOutputTokens: 1_000,
    maxAiCostUsd: 0.002,
  },
  "concierge.premium": {
    model: DEEPSEEK_REASONING,
    privacy: "profile",
    requireZdr: false,
    denyDataCollection: true,
    allowRawMedia: false,
    maxInputTokens: 5_000,
    maxOutputTokens: 1_500,
    maxAiCostUsd: 0.007,
  },
};

export function getAiModelPolicy(feature: AiFeature): AiModelPolicy {
  return AI_MODEL_POLICY[feature];
}
