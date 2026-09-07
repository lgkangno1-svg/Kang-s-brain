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
 * All images: Korea.net / KOCIS official cultural showcase photography, CC BY-SA 2.0.
 * Source: Korea Cultural and Information Service (KOCIS) via Korea.net Flickr stream.
 * These are professional fashion-show and heritage-event photographs — not street or market photos.
 *
 * 1. Princess / Prince: Luminous pastel chima-jeogori, youthful and photo-magical.
 * 2. Queen / King: Jewel-tone silk, formal court runway elegance.
 * 3. Royal: Grand ceremonial couture with gold embroidery, maximum palace drama.
 */
export const HANBOK_STYLE_CATEGORIES: readonly HanbokVisualReference[] = [
  {
    id: 'princess-prince',
    name: 'Princess / Prince',
    badge: 'Soft & Graceful',
    feminineRef: {
      title: 'Luminous Pastel Chima-Jeogori — Fashion Showcase',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Korea_Hanbok_Fashion_Show_02_%288423373334%29.jpg?width=1200',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Korea_Hanbok_Fashion_Show_02_(8423373334).jpg',
      sourceLabel: 'Korea.net · Official Hanbok Fashion Showcase',
      credit: 'Korea.net / Korean Culture and Information Service (Jeon Han)',
      license: 'CC BY-SA 2.0',
      sourceWidth: 2667,
      sourceHeight: 3883,
      objectPosition: 'center 15%',
    },
    masculineRef: {
      title: 'Bright Palace Stroll Hanbok — Fashion Showcase',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Korea_Hanbok_Fashion_Show_05_%288422277933%29.jpg?width=1200',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Korea_Hanbok_Fashion_Show_05_(8422277933).jpg',
      sourceLabel: 'Korea.net · Official Hanbok Fashion Showcase',
      credit: 'Republic of Korea / Korea.net (Jeon Han)',
      license: 'CC BY-SA 2.0',
      sourceWidth: 2706,
      sourceHeight: 4227,
      objectPosition: 'center 18%',
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
      title: 'Jewel-Tone Court Hanbok — Fashion Showcase',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Korea_Hanbok_Fashion_Show_15_%288423372530%29.jpg?width=1200',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Korea_Hanbok_Fashion_Show_15_(8423372530).jpg',
      sourceLabel: 'Korea.net · Official Hanbok Fashion Showcase',
      credit: 'Korea.net / Korean Culture and Information Service (Jeon Han)',
      license: 'CC BY-SA 2.0',
      sourceWidth: 2738,
      sourceHeight: 3823,
      objectPosition: 'center 12%',
    },
    masculineRef: {
      title: 'Noble Scholar Dopo Robe — Fashion Showcase',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Korea_Hanbok_Fashion_Show_23_%288422278167%29.jpg?width=1200',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Korea_Hanbok_Fashion_Show_23_(8422278167).jpg',
      sourceLabel: 'Korea.net · Official Hanbok Fashion Showcase',
      credit: 'Korea.net / Korean Culture and Information Service (Jeon Han)',
      license: 'CC BY-SA 2.0',
      sourceWidth: 2308,
      sourceHeight: 3318,
      objectPosition: 'center 15%',
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
      title: 'Grand Ceremonial Couture — Fashion Showcase',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Korea_Hanbok_Fashion_Show_19_%288422278471%29.jpg?width=1200',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Korea_Hanbok_Fashion_Show_19_(8422278471).jpg',
      sourceLabel: 'Korea.net · Official Hanbok Fashion Showcase',
      credit: 'Korea.net / Korean Culture and Information Service (Jeon Han)',
      license: 'CC BY-SA 2.0',
      sourceWidth: 2585,
      sourceHeight: 4097,
      objectPosition: 'center 12%',
    },
    masculineRef: {
      title: 'Grand Court Ceremonial Robe — Fashion Showcase',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Korea_Hanbok_Fashion_Show_21_%288423372170%29.jpg?width=1200',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Korea_Hanbok_Fashion_Show_21_(8423372170).jpg',
      sourceLabel: 'Korea.net · Official Hanbok Fashion Showcase',
      credit: 'Korea.net / Korean Culture and Information Service (Jeon Han)',
      license: 'CC BY-SA 2.0',
      sourceWidth: 2658,
      sourceHeight: 3864,
      objectPosition: 'center 12%',
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

