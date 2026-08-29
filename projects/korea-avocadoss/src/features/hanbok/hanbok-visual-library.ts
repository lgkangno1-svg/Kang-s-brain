export type HanbokStyleCategory = 'princess-prince' | 'queen-king' | 'royal';

type HanbokReferenceImage = {
  title: string;
  imageUrl: string;
  sourceUrl: string;
  sourceLabel: string;
  credit: string;
  license: string;
  sourceWidth: number;
  sourceHeight: number;
  objectPosition?: string;
};

export type HanbokVisualReference = {
  id: HanbokStyleCategory;
  name: string;
  badge: string;
  feminineRef: HanbokReferenceImage;
  masculineRef: HanbokReferenceImage;
  matcherPreset: {
    color: 'jadeIvory' | 'roseNavy' | 'moonBlue';
    mood: 'romantic' | 'elegant' | 'royal';
    comfort: 'photoFirst' | 'balanced' | 'walking';
  };
};

/**
 * 3 Core Palace Experience Style Categories for Korea Concierge Hanbok Studio.
 *
 * Primary references intentionally avoid runway/fashion-show photography. They are rights-reviewed
 * palace-wear or royal-ceremony references with explicit source/license metadata and high-resolution originals.
 * These images are visual references, not claims that the pictured garments are bookable inventory.
 */
export const HANBOK_STYLE_CATEGORIES: readonly HanbokVisualReference[] = [
  {
    id: 'princess-prince',
    name: 'Princess / Prince',
    badge: 'Soft & Graceful',
    feminineRef: {
      title: 'Classic Palace Chima-Jeogori',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/One_girl_wearing_traditional_Korean_costume_in_Gyeongbokgung%2Cthe_Seoul_palace_04.jpg?width=1200',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:One_girl_wearing_traditional_Korean_costume_in_Gyeongbokgung,the_Seoul_palace_04.jpg',
      sourceLabel: 'Wikimedia Commons · Gyeongbokgung',
      credit: 'Andamy',
      license: 'CC BY-SA 4.0',
      sourceWidth: 3000,
      sourceHeight: 4000,
      objectPosition: 'center 22%',
    },
    masculineRef: {
      title: 'Classic Palace Hanbok',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Gyeongbokgung_Hanbok_01_%2832928645842%29.jpg?width=1200',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Gyeongbokgung_Hanbok_01_(32928645842).jpg',
      sourceLabel: 'Korea.net · Gyeongbokgung Palace',
      credit: 'Republic of Korea / Korea.net (Jeon Han)',
      license: 'CC BY-SA 2.0',
      sourceWidth: 4659,
      sourceHeight: 2694,
      objectPosition: 'center 25%',
    },
    matcherPreset: {
      color: 'jadeIvory',
      mood: 'romantic',
      comfort: 'photoFirst',
    },
  },
  {
    id: 'queen-king',
    name: 'Queen / King',
    badge: 'Dignified & Traditional',
    feminineRef: {
      title: 'Formal Palace Hanbok',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Gyeongbokgung_Hanbok_12_%2832269591293%29.jpg?width=1200',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Gyeongbokgung_Hanbok_12_(32269591293).jpg',
      sourceLabel: 'Korea.net · Gyeongbokgung Palace',
      credit: 'Republic of Korea / Korea.net (Jeon Han)',
      license: 'CC BY-SA 2.0',
      sourceWidth: 3474,
      sourceHeight: 5189,
      objectPosition: 'center 20%',
    },
    masculineRef: {
      title: 'Royal Wedding Ceremony Reference',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/KOCIS_Korea_Royal_Wedding_11_%289890520874%29.jpg?width=1200',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:KOCIS_Korea_Royal_Wedding_11_(9890520874).jpg',
      sourceLabel: 'Korea.net · Royal Wedding Reenactment',
      credit: 'Korea.net / Korean Culture and Information Service (Jeon Han)',
      license: 'CC BY-SA 2.0',
      sourceWidth: 4976,
      sourceHeight: 3128,
      objectPosition: 'center 22%',
    },
    matcherPreset: {
      color: 'moonBlue',
      mood: 'elegant',
      comfort: 'balanced',
    },
  },
  {
    id: 'royal',
    name: 'Royal',
    badge: 'Luxurious & Ornate',
    feminineRef: {
      title: 'Grand Royal Wedding Ceremony',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/KOCIS_Korea_Royal_Wedding_01_%289890617553%29.jpg?width=1200',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:KOCIS_Korea_Royal_Wedding_01_(9890617553).jpg',
      sourceLabel: 'Korea.net · Royal Wedding Reenactment',
      credit: 'Korea.net / Korean Culture and Information Service (Jeon Han)',
      license: 'CC BY-SA 2.0',
      sourceWidth: 3084,
      sourceHeight: 5004,
      objectPosition: 'center 18%',
    },
    masculineRef: {
      title: 'Grand Ceremonial Court Reference',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/KOCIS_Korea_Royal_Wedding_12_%289890629013%29.jpg?width=1200',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:KOCIS_Korea_Royal_Wedding_12_(9890629013).jpg',
      sourceLabel: 'Korea.net · Royal Wedding Reenactment',
      credit: 'Korea.net / Korean Culture and Information Service (Jeon Han)',
      license: 'CC BY-SA 2.0',
      sourceWidth: 4597,
      sourceHeight: 2849,
      objectPosition: 'center 20%',
    },
    matcherPreset: {
      color: 'roseNavy',
      mood: 'royal',
      comfort: 'photoFirst',
    },
  },
] as const;

export function isValidHanbokStyle(style: string | null | undefined): style is HanbokStyleCategory {
  return Boolean(style && ['princess-prince', 'queen-king', 'royal'].includes(style));
}
