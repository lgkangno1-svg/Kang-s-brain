/**
 * My Korea Look — 3 Public Curated Sample Stylebooks
 * Implements Section 2 & Section 18 Slice S1 of docs/BUILD_SPEC.md.
 *
 * NOTE: Personas are fictitious adult examples created for demonstration.
 * They are clearly labelled as public curated samples, not real customer reviews.
 * V1 is a one-adult SKU, so every public sample models one adult only.
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
      name: 'Sample Persona: Elena (Solo Traveler, Spring Seoul Visit)',
      summary: 'Seeking dignified, non-touristy palace photos with historic presence rather than pastel glitter.',
      travelContext: '2-hour morning visit near Gyeongbokgung Station Exit 2.',
      selectedUndertone: 'Warm Neutral with high-contrast preference',
      selectedStyle: 'Queen / King Dignified Heritage',
    },
    overview: 'This sample illustrates the planned My Korea Look guidebook for one adult who prefers dignified palace styling. It compares three distinct directions, rich jewel tones, and a practical in-store request card without claiming live rental inventory.',
    looks: [
      CURATED_LOOKS_CATALOG[2], // Jewel-tone Court Queen
      CURATED_LOOKS_CATALOG[3], // Noble Scholar Dopo
      CURATED_LOOKS_CATALOG[0], // Pastel Princess (as alternate light day option)
    ],
    colorAnalysisSummary: {
      paletteTitle: 'Crimson Dancheong & Midnight Navy Court Harmony',
      paletteNotes: 'High-chroma contrast helps the outfit separate visually from stone courtyards and wooden halls in bright daylight.',
      primaryHex: '#9E2A2B',
      secondaryHex: '#1D2D44',
      accentHex: '#D4AF37',
    },
    koreanShopCardSummary: {
      shopType: 'Traditional Heritage Rental Shops near Anguk & Gyeongbokgung',
      instructionKorean: '진홍색과 남색 계열의 단정한 궁중풍 한복을 찾고 있습니다. 비슷한 색 조합과 장신구가 있는지, 추가 요금이 있는지 확인 부탁드립니다.',
      instructionEnglish: 'Show this card to ask whether a similar crimson-and-navy court-inspired outfit and accessories are available, and to confirm any extra charge.',
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
      travelContext: 'Solo portrait morning walk, 09:30 AM entry.',
      selectedUndertone: 'Cool Summer Light',
      selectedStyle: 'Princess Soft & Graceful',
    },
    overview: 'Designed as a one-adult sample for effortless elegance in natural daylight. It compares three distinct directions and uses soft lilac, lavender, and ivory highlights without implying that a specific shop has them in stock.',
    looks: [
      CURATED_LOOKS_CATALOG[0], // Luminous Lavender Princess
      CURATED_LOOKS_CATALOG[1], // Sky Blue Prince
      CURATED_LOOKS_CATALOG[4], // Imperial Gold Empress (dramatic alternative)
    ],
    colorAnalysisSummary: {
      paletteTitle: 'Soft Lilac, Ivory Lace & Blossom Pink',
      paletteNotes: 'Diffuse pastel tones can photograph softly against the green waters and foliage around Hyangwonjeong.',
      primaryHex: '#FAF8F5',
      secondaryHex: '#D8B4E2',
      accentHex: '#F4ACB7',
    },
    koreanShopCardSummary: {
      shopType: 'Modern Fusion / Pastel Hanbok Shops (Seochon & Samcheong-dong)',
      instructionKorean: '아이보리 저고리와 연보라 계열 하의의 부드러운 파스텔 한복을 찾고 있습니다. 비슷한 색 조합과 반묶음 댕기 연출이 가능한지, 추가 요금이 있는지 확인 부탁드립니다.',
      instructionEnglish: 'Show this card to ask whether a soft ivory-and-lilac pastel outfit and half-tied daenggi styling are available, and to confirm any extra charge.',
    },
    totalEstimatedTime: '1 hour 45 minutes',
    priceUSD: 12,
  },

  'royal-ceremony': {
    slug: 'royal-ceremony',
    badge: 'Curated Public Sample · High Ceremonial Grandeur',
    title: 'Ceremonial Scarlet & Gold Royal Drama',
    tagline: 'A dramatic ceremonial direction built around scarlet, gold, and high-impact palace photography.',
    persona: {
      name: 'Sample Persona: Kenji (Solo Traveler, Milestone Trip)',
      summary: 'Looking for a theatrical, cinematic Hanbok direction for a memorable palace portrait session.',
      travelContext: 'Midday palace portrait walk with extra time reserved for fitting and return.',
      selectedUndertone: 'Warm Golden',
      selectedStyle: 'Royal Ceremonial Drama',
    },
    overview: 'This one-adult sample explores ornate ceremonial references and strong scarlet-and-gold contrast. It is inspiration for a rental-shop conversation, not a claim that any specific historic-grade garment, embroidery, crown, or inventory is available.',
    looks: [
      CURATED_LOOKS_CATALOG[4], // Imperial Gold Empress
      CURATED_LOOKS_CATALOG[5], // Crimson Dragon King
      CURATED_LOOKS_CATALOG[2], // Court Queen (alternate)
    ],
    colorAnalysisSummary: {
      paletteTitle: 'Ceremonial Scarlet Red, Gold & Onyx Black',
      paletteNotes: 'High-contrast ceremonial colors create a dramatic visual direction against palace architecture.',
      primaryHex: '#B31217',
      secondaryHex: '#D4AF37',
      accentHex: '#1F2022',
    },
    koreanShopCardSummary: {
      shopType: 'Ceremonial & Drama-Inspired Hanbok Boutiques',
      instructionKorean: '진한 붉은색과 금색 포인트가 있는 화려한 궁중풍 한복을 찾고 있습니다. 비슷한 의상과 장신구가 있는지, 추가 요금이 있는지 확인 부탁드립니다.',
      instructionEnglish: 'Show this card to ask whether a dramatic red-and-gold court-inspired outfit and accessories are available, and to confirm any extra charge.',
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
