export const P0_LOCALES = ["en", "zh-CN", "ja", "zh-TW", "vi", "th"] as const;
export const P1_LOCALES = ["id", "ms"] as const;
export const P2_LOCALES = ["fr", "de", "es", "ru", "fil"] as const;

export const SUPPORTED_LOCALES = [...P0_LOCALES, ...P1_LOCALES, ...P2_LOCALES] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export type LocaleStatus = "p0" | "p1" | "p2";

export type LocaleDefinition = {
  code: SupportedLocale;
  nativeName: string;
  englishName: string;
  status: LocaleStatus;
  htmlLang: string;
  markets: readonly string[];
};

export const LOCALES: readonly LocaleDefinition[] = [
  { code: "en", nativeName: "English", englishName: "English", status: "p0", htmlLang: "en", markets: ["Global", "United States", "Canada", "United Kingdom", "Australia", "Singapore", "Philippines"] },
  { code: "zh-CN", nativeName: "简体中文", englishName: "Simplified Chinese", status: "p0", htmlLang: "zh-Hans", markets: ["Mainland China"] },
  { code: "ja", nativeName: "日本語", englishName: "Japanese", status: "p0", htmlLang: "ja", markets: ["Japan"] },
  { code: "zh-TW", nativeName: "繁體中文", englishName: "Traditional Chinese", status: "p0", htmlLang: "zh-Hant", markets: ["Taiwan", "Hong Kong"] },
  { code: "vi", nativeName: "Tiếng Việt", englishName: "Vietnamese", status: "p0", htmlLang: "vi", markets: ["Vietnam"] },
  { code: "th", nativeName: "ไทย", englishName: "Thai", status: "p0", htmlLang: "th", markets: ["Thailand"] },
  { code: "id", nativeName: "Bahasa Indonesia", englishName: "Indonesian", status: "p1", htmlLang: "id", markets: ["Indonesia"] },
  { code: "ms", nativeName: "Bahasa Melayu", englishName: "Malay", status: "p1", htmlLang: "ms", markets: ["Malaysia"] },
  { code: "fr", nativeName: "Français", englishName: "French", status: "p2", htmlLang: "fr", markets: ["France"] },
  { code: "de", nativeName: "Deutsch", englishName: "German", status: "p2", htmlLang: "de", markets: ["Germany"] },
  { code: "es", nativeName: "Español", englishName: "Spanish", status: "p2", htmlLang: "es", markets: ["Spain", "Mexico", "Latin America"] },
  { code: "ru", nativeName: "Русский", englishName: "Russian", status: "p2", htmlLang: "ru", markets: ["Russia"] },
  { code: "fil", nativeName: "Filipino", englishName: "Filipino", status: "p2", htmlLang: "fil", markets: ["Philippines"] },
] as const;

export const DEFAULT_LOCALE: SupportedLocale = "en";

export function isSupportedLocale(value: string): value is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function getLocaleDefinition(locale: SupportedLocale): LocaleDefinition {
  return LOCALES.find((item) => item.code === locale) ?? LOCALES[0];
}
