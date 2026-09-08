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
 * All references are authentic, full-body (전신), neat and graceful (단아·단정) traditional Hanbok looks
 * photographed at Gyeongbokgung and official royal palace heritage showcases:
 *
 * 1. Princess / Prince:
 *    - Feminine: Classic white silk jeogori and vibrant flowing silk chima with traditional Norigae (full-body).
 *    - Masculine: Noble scholar prince in shimmering champagne-gold silk durumagi robe (full-body).
 * 2. Queen / King:
 *    - Feminine: Dignified royal court lady in crimson silk jeogori & sheer white ceremonial jang-ot cloak (full-body).
 *    - Masculine: Aristocratic Joseon scholar in traditional black Gat and pleated scarlet dopo (full-body).
 * 3. Royal:
 *    - Feminine: Formal royal Empress/Queen ceremonial Dangui and Daeran chima with gold dragon bands (full-body).
 *    - Masculine: Joseon King in royal scarlet dragon robe (Gonryongpo), gold dragon emblems & Ikseongwan crown (full-body).
 */
export const HANBOK_STYLE_CATEGORIES: readonly HanbokVisualReference[] = [
  {
    id: 'princess-prince',
    name: 'Princess / Prince',
    badge: 'Soft & Graceful',
    feminineRef: {
      title: 'Graceful Silk Chima-Jeogori & Traditional Norigae',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Hanbok_Day_2016_19_%2829871546933%29.jpg?width=1200',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Hanbok_Day_2016_19_(29871546933).jpg',
      sourceLabel: 'MCST · Official Hanbok Day Gyeongbokgung Showcase',
      credit: 'Korea.net / Korean Culture and Information Service (Jeon Han)',
      license: 'CC BY-SA 2.0',
      sourceWidth: 2742,
      sourceHeight: 4113,
      objectPosition: 'center 15%',
    },
    masculineRef: {
      title: 'Noble Scholar Prince Champagne Gold Silk Durumagi Robe',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Hanbok_Day_2016_30_%2829871510983%29.jpg?width=1200',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Hanbok_Day_2016_30_(29871510983).jpg',
      sourceLabel: 'MCST · Official Hanbok Day Gyeongbokgung Showcase',
      credit: 'Korea.net / Korean Culture and Information Service (Jeon Han)',
      license: 'CC BY-SA 2.0',
      sourceWidth: 2772,
      sourceHeight: 4284,
      objectPosition: 'center 15%',
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
      title: 'Dignified Royal Court Silk Chima-Jeogori & Jang-ot Cloak',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Hanbok_Day_2016_18_%2829871548393%29.jpg?width=1200',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Hanbok_Day_2016_18_(29871548393).jpg',
      sourceLabel: 'MCST · Official Hanbok Day Gyeongbokgung Showcase',
      credit: 'Korea.net / Korean Culture and Information Service (Jeon Han)',
      license: 'CC BY-SA 2.0',
      sourceWidth: 2934,
      sourceHeight: 4401,
      objectPosition: 'center 15%',
    },
    masculineRef: {
      title: 'Aristocratic Joseon Scholar Scarlet Pleated Dopo & Traditional Gat',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/KOCIS_Reenactment_of_a_royal_wedding_on_Mar_5%2C_2012_%286812201458%29.jpg?width=1200',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:KOCIS_Reenactment_of_a_royal_wedding_on_Mar_5,_2012_(6812201458).jpg',
      sourceLabel: 'Korea.net · Royal Palace Reenactment Series',
      credit: 'Republic of Korea / Korea.net (Jeon Han)',
      license: 'CC BY-SA 2.0',
      sourceWidth: 3872,
      sourceHeight: 2592,
      objectPosition: '22% 20%',
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
      title: 'Imperial Palace Formal Ceremonial Hanbok & Gold Dragon Bands',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/KOCIS_Hanbok_fashion_show_%286557977631%29.jpg?width=1200',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:KOCIS_Hanbok_fashion_show_(6557977631).jpg',
      sourceLabel: 'MCST · Royal Court Heritage Showcase',
      credit: 'Korea.net / Korean Culture and Information Service (Jeon Han)',
      license: 'CC BY-SA 2.0',
      sourceWidth: 1640,
      sourceHeight: 1940,
      objectPosition: '20% 15%',
    },
    masculineRef: {
      title: 'Joseon Monarch Royal Scarlet Dragon Robe (Gonryongpo) & Winged Crown',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/KOCIS_Reenactment_of_a_royal_wedding_on_Mar_5%2C_2012_%286812206070%29.jpg?width=1200',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:KOCIS_Reenactment_of_a_royal_wedding_on_Mar_5,_2012_(6812206070).jpg',
      sourceLabel: 'Korea.net · Royal Palace Reenactment Series',
      credit: 'Republic of Korea / Korea.net (Jeon Han)',
      license: 'CC BY-SA 2.0',
      sourceWidth: 3872,
      sourceHeight: 2592,
      objectPosition: '75% 25%',
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
