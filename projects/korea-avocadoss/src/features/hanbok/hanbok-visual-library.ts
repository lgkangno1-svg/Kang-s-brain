export type HanbokVisualReference = {
  id: 'stageMuseum' | 'classicFullBody' | 'boutiquePalette';
  imageUrl: string;
  sourceUrl: string;
  license: string;
  credit: string;
};

/**
 * Rights-reviewed visual references for the free Hanbok lookbook.
 *
 * These are styling references, not rental inventory and not endorsements.
 * Keep source/license metadata attached to every item. Before replacing or
 * adding an image, re-check the source page and docs/HANBOK_VISUAL_SOURCE_POLICY.md.
 */
export const HANBOK_VISUAL_REFERENCES: readonly HanbokVisualReference[] = [
  {
    id: 'stageMuseum',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Blackpink%20Hanbok%20at%20MFA.jpg?width=900',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Blackpink_Hanbok_at_MFA.jpg',
    license: 'CC BY 4.0',
    credit: 'Nkon21 / Wikimedia Commons',
  },
  {
    id: 'classicFullBody',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Hanbok%201.jpg?width=900',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Hanbok_1.jpg',
    license: 'CC0 1.0',
    credit: 'Brücke-Osteuropa / Wikimedia Commons',
  },
  {
    id: 'boutiquePalette',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Korean.clothes-Hanbok-01.jpg?width=900',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Korean.clothes-Hanbok-01.jpg',
    license: 'CC BY 2.0',
    credit: 'frakorea / Wikimedia Commons',
  },
] as const;
