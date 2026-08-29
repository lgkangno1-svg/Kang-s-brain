export type HanbokVisualReference = {
  id:
    | 'royalCourtCouture'
    | 'softPastelElegance'
    | 'contemporaryPalaceChic'
    | 'nobleScholarDopo'
    | 'romanticPalaceWalk'
    | 'modernStageFusion';
  imageUrl: string;
  sourceUrl: string;
  sourceLabel: string;
  license: string;
  credit: string;
  suggestedMood: 'royal' | 'romantic' | 'kdrama' | 'elegant' | 'minimal';
  suggestedColor: 'roseNavy' | 'jadeIvory' | 'moonBlue';
};

/**
 * Editorial & celebrity-inspired visual references for Korea Concierge Hanbok Studio.
 *
 * These showcase real-world aspirational silhouettes from cultural runway showcases,
 * royal palace photography, and modern haute-couture Hanbok styling.
 * They are visual inspiration references and do not imply celebrity endorsement
 * or rental shop inventory guarantees.
 */
export const HANBOK_VISUAL_REFERENCES: readonly HanbokVisualReference[] = [
  {
    id: 'royalCourtCouture',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Korea_Hanbok_Fashion_Show_01_%288423373422%29.jpg?width=900',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Korea_Hanbok_Fashion_Show_01_(8423373422).jpg',
    sourceLabel: 'Korea.net · Fashion Runway',
    license: 'CC BY-SA 2.0',
    credit: 'Korea.net / Korean Culture and Information Service (Jeon Han)',
    suggestedMood: 'royal',
    suggestedColor: 'roseNavy',
  },
  {
    id: 'softPastelElegance',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Korea_Hanbok_Fashion_Show_08_%288423372986%29.jpg?width=900',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Korea_Hanbok_Fashion_Show_08_(8423372986).jpg',
    sourceLabel: 'Korea.net · Couture Showcase',
    license: 'CC BY-SA 2.0',
    credit: 'Korea.net / Korean Culture and Information Service (Jeon Han)',
    suggestedMood: 'romantic',
    suggestedColor: 'jadeIvory',
  },
  {
    id: 'contemporaryPalaceChic',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Korea_Hanbok_Fashion_Show_04_%288422279531%29.jpg?width=900',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Korea_Hanbok_Fashion_Show_04_(8422279531).jpg',
    sourceLabel: 'Korea.net · Modern Editorial',
    license: 'CC BY-SA 2.0',
    credit: 'Korea.net / Korean Culture and Information Service (Jeon Han)',
    suggestedMood: 'kdrama',
    suggestedColor: 'moonBlue',
  },
  {
    id: 'nobleScholarDopo',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Korea_Hanbok_Fashion_Show_11_%288423372792%29.jpg?width=900',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Korea_Hanbok_Fashion_Show_11_(8423372792).jpg',
    sourceLabel: 'Korea.net · Noble Robe Runway',
    license: 'CC BY-SA 2.0',
    credit: 'Korea.net / Korean Culture and Information Service (Jeon Han)',
    suggestedMood: 'elegant',
    suggestedColor: 'moonBlue',
  },
  {
    id: 'romanticPalaceWalk',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Gyeongbokgung_Hanbok_01_%2832928645842%29.jpg?width=900',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Gyeongbokgung_Hanbok_01_(32928645842).jpg',
    sourceLabel: 'Republic of Korea · Palace Series',
    license: 'CC BY-SA 2.0',
    credit: 'Republic of Korea / Korea.net (Jeon Han)',
    suggestedMood: 'romantic',
    suggestedColor: 'roseNavy',
  },
  {
    id: 'modernStageFusion',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Korea_Hanbok_Fashion_Show_05_%288422277933%29.jpg?width=900',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Korea_Hanbok_Fashion_Show_05_(8422277933).jpg',
    sourceLabel: 'Korea.net · Fusion Stage',
    license: 'CC BY-SA 2.0',
    credit: 'Korea.net / Korean Culture and Information Service (Jeon Han)',
    suggestedMood: 'minimal',
    suggestedColor: 'jadeIvory',
  },
] as const;
