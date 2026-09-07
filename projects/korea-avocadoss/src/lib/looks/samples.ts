/**
 * My Korea Look — 3 Public Curated Sample Stylebooks
 * Implements Section 2 & Section 18 Slice S1 of docs/BUILD_SPEC.md.
 * 
 * NOTE: Personas are fictitious adult examples created for demonstration.
 * They are clearly labelled as public curated samples, not real customer reviews.
 */

import { CURATED_LOOKS_CATALOG, type CuratedLook } from './catalog';

export interface SampleStylebook {
  slug: string;
  badge: string;
  title: string;
  tagline: string;
  persona: {
    name: string;
    summary: string;
    travelContext: string;
    selectedUndertone: string;
    selectedStyle: string;
  };
  overview: string;
  looks: CuratedLook[];
  colorAnalysisSummary: {
    paletteTitle: string;
    paletteNotes: string;
    primaryHex: string;
    secondaryHex: string;
    accentHex: string;
  };
  koreanShopCardSummary: {
    shopType: string;
    instructionKorean: string;
    instructionEnglish: string;
  };
  totalEstimatedTime: string;
  priceUSD: number;
}

export const SAMPLE_STYLEBOOKS: Record<string, SampleStylebook> = {
  'palace-elegance': {
    slug: 'palace-elegance',
    badge: 'Curated Public Sample · Queen & King Court Harmony',
    title: 'Joseon Court Dignity & Jewel-Tone Elegance',
    tagline: 'Deep navy, crimson silk, and pine greens designed to stand out against ancient palace timbers.',
    persona: {
      name: 'Sample Persona: Elena & David (Couple, Spring Seoul Visit)',
      summary: 'Seeking dignified, non-touristy palace photos with historic presence rather than pastel glitter.',
      travelContext: '2-hour morning booking near Gyeongbokgung Station Exit 2.',
      selectedUndertone: 'Warm Neutral with high-contrast preference',
      selectedStyle: 'Queen / King Dignified Heritage',
    },
    overview: 'This sample illustrates the complete My Korea Look guidebook for a couple desiring dignified palace court presence. It combines rich jewel tones with period-accurate silhouette structure, plus verified shop cards for rapid in-store fitting.',
    looks: [
      CURATED_LOOKS_CATALOG[2], // Jewel-tone Court Queen
      CURATED_LOOKS_CATALOG[3], // Noble Scholar Dopo
      CURATED_LOOKS_CATALOG[0], // Pastel Princess (as alternate light day option)
    ],
    colorAnalysisSummary: {
      paletteTitle: 'Crimson Dancheong & Midnight Navy Court Harmony',
      paletteNotes: 'High-chroma contrast ensures couple separates sharply from stone courtyards and wooden halls without washing out in sunlight.',
      primaryHex: '#9E2A2B',
      secondaryHex: '#1D2D44',
      accentHex: '#D4AF37',
    },
    koreanShopCardSummary: {
      shopType: 'Traditional Heritage Rental Shops near Anguk & Gyeongbokgung',
      instructionKorean: '중전마마 스타일 진홍색 당의/남색 치마와 사대부 도포 세트로 대여 부탁드립니다.',
      instructionEnglish: 'Show this card on your phone to shop staff for an instant matched royal couple fitting.',
    },
    totalEstimatedTime: '2 hours 15 minutes',
    priceUSD: 12,
  },

  'modern-pastel': {
    slug: 'modern-pastel',
    badge: 'Curated Public Sample · Princess & Prince Pastel',
    title: 'Luminous Lavender & Garden Light',
    tagline: 'Airy sheer pastel layers crafted for radiant natural-light portraits at lotus ponds and pine groves.',
    persona: {
      name: 'Sample Persona: Chloe (Solo Traveler, First Trip to Korea)',
      summary: 'Loves K-drama aesthetics and wants whimsical, luminous outdoor photography in palace gardens.',
      travelContext: 'Solo portrait morning walk, 09:30 AM early admission.',
      selectedUndertone: 'Cool Summer Light',
      selectedStyle: 'Princess Soft & Graceful',
    },
    overview: 'Designed for effortless elegance in natural daylight. Features sheer organza layers, soft lilac lavender and ivory highlights that shimmer under morning sunlight.',
    looks: [
      CURATED_LOOKS_CATALOG[0], // Luminous Lavender Princess
      CURATED_LOOKS_CATALOG[1], // Sky Blue Prince
      CURATED_LOOKS_CATALOG[4], // Imperial Gold Empress (dramatic alternative)
    ],
    colorAnalysisSummary: {
      paletteTitle: 'Soft Lilac, Ivory Lace & Blossom Pink',
      paletteNotes: 'Diffuse pastel tones soften facial shadows and glow beautifully against the green waters of Hyangwonjeong.',
      primaryHex: '#FAF8F5',
      secondaryHex: '#D8B4E2',
      accentHex: '#F4ACB7',
    },
    koreanShopCardSummary: {
      shopType: 'Modern Fusion / Pastel Hanbok Shops (Seochon & Samcheong-dong)',
      instructionKorean: '파스텔톤(아이보리 저고리 + 연보라 갈래치마)에 반묶음 댕기머리 세팅 부탁드립니다.',
      instructionEnglish: 'Instant rental request for soft ivory top, layered lilac skirt, and half-tied Daenggi hair styling.',
    },
    totalEstimatedTime: '1 hour 45 minutes',
    priceUSD: 12,
  },

  'royal-ceremony': {
    slug: 'royal-ceremony',
    badge: 'Curated Public Sample · High Imperial Grandeur',
    title: 'Imperial Scarlet & Gold Dragon Royalty',
    tagline: 'The ultimate royal court experience with gold-leaf embroidery and monarch ceremonial crowns.',
    persona: {
      name: 'Sample Persona: Kenji & Mai (Anniversary Milestone Trip)',
      summary: 'Looking for the most theatrical, cinematic Hanbok styling possible for once-in-a-lifetime keepsake photos.',
      travelContext: 'Midday photoshoot session with professional photographer hire.',
      selectedUndertone: 'Warm Golden Imperial',
      selectedStyle: 'Royal Ceremonial High Luxury',
    },
    overview: 'Full Joseon dynastic luxury. Red Dragon Gonryongpo robe for him with gold chest medallions, and Scarlet Wonsam with gold foil daeran skirt for her. Guaranteed maximum impact.',
    looks: [
      CURATED_LOOKS_CATALOG[4], // Imperial Gold Empress
      CURATED_LOOKS_CATALOG[5], // Crimson Dragon King
      CURATED_LOOKS_CATALOG[2], // Court Queen (alternate)
    ],
    colorAnalysisSummary: {
      paletteTitle: 'Imperial Scarlet Red, Royal Gold & Onyx Black',
      paletteNotes: 'Sovereign colors reserved historically for royal banquets and enthronement ceremonies.',
      primaryHex: '#B31217',
      secondaryHex: '#D4AF37',
      accentHex: '#1F2022',
    },
    koreanShopCardSummary: {
      shopType: 'Premium Ceremonial & Drama Hanbok Boutiques',
      instructionKorean: '왕 붉은색 곤룡포(용보 포함)와 왕비 최고급 대례복(금박 원삼) 세트로 대여 요청합니다.',
      instructionEnglish: 'Show this card to request the full King Gonryongpo and Queen Ceremonial Wonsam with dragon embroidery.',
    },
    totalEstimatedTime: '2 hours 30 minutes',
    priceUSD: 12,
  },
};

export function getSampleBySlug(slug: string): SampleStylebook | undefined {
  return SAMPLE_STYLEBOOKS[slug];
}

export function getAllSampleSlugs(): string[] {
  return Object.keys(SAMPLE_STYLEBOOKS);
}

