export type HanbokStyleCategory = 'princess-prince' | 'queen-king' | 'royal';

export type HanbokVisualReference = {
  id: HanbokStyleCategory;
  name: string;
  badge: string;
  feminineRef: {
    title: string;
    imageUrl: string;
    sourceUrl: string;
    sourceLabel: string;
    credit: string;
    license: string;
    objectPosition?: string;
  };
  masculineRef: {
    title: string;
    imageUrl: string;
    sourceUrl: string;
    sourceLabel: string;
    credit: string;
    license: string;
    objectPosition?: string;
  };
  matcherPreset: {
    color: 'jadeIvory' | 'roseNavy' | 'moonBlue';
    mood: 'romantic' | 'elegant' | 'royal';
    comfort: 'photoFirst' | 'balanced' | 'walking';
  };
};

/**
 * 3 Core Palace Experience Style Categories for Korea Concierge Hanbok Studio.
 *
 * 1. Princess / Prince: Soft, graceful, pastel, youthful, classic palace photo-friendly look.
 * 2. Queen / King: Elegant, traditional, dignified, formal court-inspired look with rich colors.
 * 3. Royal: Luxurious, ornate, ceremonial, highly decorated premium look with gold embroidery and dramatic presence.
 */
export const HANBOK_STYLE_CATEGORIES: readonly HanbokVisualReference[] = [
  {
    id: 'princess-prince',
    name: 'Princess / Prince',
    badge: 'Soft & Graceful',
    feminineRef: {
      title: 'Princess Pastel Chima-Jeogori',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Korea_Hanbok_Fashion_Show_08_%288423372986%29.jpg?width=900',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Korea_Hanbok_Fashion_Show_08_(8423372986).jpg',
      sourceLabel: 'Korea.net · Culture Showcase',
      credit: 'Korea.net / Korean Culture and Information Service (Jeon Han)',
      license: 'CC BY-SA 2.0',
      objectPosition: 'center 20%',
    },
    masculineRef: {
      title: 'Prince Palace Stroll Robe',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Gyeongbokgung_Hanbok_01_%2832928645842%29.jpg?width=900',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Gyeongbokgung_Hanbok_01_(32928645842).jpg',
      sourceLabel: 'Republic of Korea · Palace Series',
      credit: 'Republic of Korea / Korea.net (Jeon Han)',
      license: 'CC BY-SA 2.0',
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
      title: 'Queen Ceremonial Silk Robe',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Gyeongbokgung_Hanbok_12_%2832269591293%29.jpg?width=900',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Gyeongbokgung_Hanbok_12_(32269591293).jpg',
      sourceLabel: 'Republic of Korea · Heritage Series',
      credit: 'Republic of Korea / Korea.net (Jeon Han)',
      license: 'CC BY-SA 2.0',
      objectPosition: 'center 20%',
    },
    masculineRef: {
      title: 'King Noble Scholar Dopo',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Korea_Hanbok_Fashion_Show_11_%288423372792%29.jpg?width=900',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Korea_Hanbok_Fashion_Show_11_(8423372792).jpg',
      sourceLabel: 'Korea.net · Formal Runway',
      credit: 'Korea.net / Korean Culture and Information Service (Jeon Han)',
      license: 'CC BY-SA 2.0',
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
      title: 'Royal Grand Court Couture',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Korea_Hanbok_Fashion_Show_01_%288423373422%29.jpg?width=900',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Korea_Hanbok_Fashion_Show_01_(8423373422).jpg',
      sourceLabel: 'Korea.net · Royal Showcase',
      credit: 'Korea.net / Korean Culture and Information Service (Jeon Han)',
      license: 'CC BY-SA 2.0',
      objectPosition: 'center 20%',
    },
    masculineRef: {
      title: 'Royal Crown Robe & Gold Emblems',
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Korea_Hanbok_Fashion_Show_04_%288422279531%29.jpg?width=900',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Korea_Hanbok_Fashion_Show_04_(8422279531).jpg',
      sourceLabel: 'Korea.net · Ceremonial Showcase',
      credit: 'Korea.net / Korean Culture and Information Service (Jeon Han)',
      license: 'CC BY-SA 2.0',
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
