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
 * Sourced from iconic K-Drama cultural showcases (Love in the Moonlight at Gyeongbokgung)
 * and official Ministry of Culture Hanbok Day Gyeongbokgung showcases.
 *
 * 1. Princess / Prince: Kim Yoo-jung & Park Bo-gum iconic K-Drama palace styles.
 * 2. Queen / King: Dignified court Jang-ot cloak silk & noble champagne scholar dopo.
 * 3. Royal: Grand floral fantasy ombre couture & imperial court ceremonial robe.
 */
export const HANBOK_STYLE_CATEGORIES: readonly HanbokVisualReference[] = [
  {
    id: 'princess-prince',
    name: 'Princess / Prince',
    badge: 'Soft & Graceful',
    feminineRef: {
      title: 'Kim Yoo-jung Luminous Pastel Hanbok & Floral Crown',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/161019_%EA%B5%AC%EB%A5%B4%EB%AF%B8_%EA%B7%B8%EB%A6%B0_%EB%8B%AC%EB%B9%9B_%ED%8C%AC%EC%82%AC%EC%9D%B8%ED%9A%8C_%284%29.jpg?width=1200',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:161019_구르미_그린_달빛_팬사인회_(4).jpg',
      sourceLabel: 'KBS · Love in the Moonlight Gyeongbokgung Showcase',
      credit: 'Sayomi (사요미)',
      license: 'CC BY 4.0',
      sourceWidth: 2216,
      sourceHeight: 3103,
      objectPosition: 'center 20%',
    },
    masculineRef: {
      title: 'Park Bo-gum Crown Prince Scholar Robe & Traditional Gat',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/161019_%EA%B5%AC%EB%A5%B4%EB%AF%B8_%EA%B7%B8%EB%A6%B0_%EB%8B%AC%EB%B9%9B_%ED%8C%AC%EC%82%AC%EC%9D%B8%ED%9A%8C_%285%29.jpg?width=1200',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:161019_구르미_그린_달빛_팬사인회_(5).jpg',
      sourceLabel: 'KBS · Love in the Moonlight Gyeongbokgung Showcase',
      credit: 'Sayomi (사요미)',
      license: 'CC BY 4.0',
      sourceWidth: 2800,
      sourceHeight: 3400,
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
      title: 'Dignified Royal Court Silk Chima-Jeogori & Jang-ot Cloak',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Hanbok_Day_2016_18_%2829871548393%29.jpg?width=1200',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Hanbok_Day_2016_18_(29871548393).jpg',
      sourceLabel: 'MCST · Official Hanbok Day Gyeongbokgung Showcase',
      credit: 'Korea.net / Korean Culture and Information Service (Jeon Han)',
      license: 'CC BY-SA 2.0',
      sourceWidth: 2934,
      sourceHeight: 4401,
      objectPosition: 'center 20%',
    },
    masculineRef: {
      title: 'Noble Scholar Prince Champagne Silk Durumagi Robe',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Hanbok_Day_2016_30_%2829871510983%29.jpg?width=1200',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Hanbok_Day_2016_30_(29871510983).jpg',
      sourceLabel: 'MCST · Official Hanbok Day Gyeongbokgung Showcase',
      credit: 'Korea.net / Korean Culture and Information Service (Jeon Han)',
      license: 'CC BY-SA 2.0',
      sourceWidth: 2772,
      sourceHeight: 4284,
      objectPosition: 'center 20%',
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
      title: 'Grand Floral Fantasy Ombre Palace Gown Hanbok',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Hanbok_Day_2016_35_%2829871497173%29.jpg?width=1200',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Hanbok_Day_2016_35_(29871497173).jpg',
      sourceLabel: 'MCST · Official Hanbok Day Gyeongbokgung Showcase',
      credit: 'Korea.net / Korean Culture and Information Service (Jeon Han)',
      license: 'CC BY-SA 2.0',
      sourceWidth: 3108,
      sourceHeight: 4338,
      objectPosition: 'center 25%',
    },
    masculineRef: {
      title: 'Grand Court Imperial Black Silk Robe & Wonyugwan Crown',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Hanbok_Day_2016_21_%2830386985862%29.jpg?width=1200',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Hanbok_Day_2016_21_(30386985862).jpg',
      sourceLabel: 'MCST · Official Hanbok Day Gyeongbokgung Showcase',
      credit: 'Korea.net / Korean Culture and Information Service (Jeon Han)',
      license: 'CC BY-SA 2.0',
      sourceWidth: 3240,
      sourceHeight: 4728,
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
