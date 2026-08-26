import type { Depth, Undertone } from './analyze-visible-tone';

export type PaletteId =
  | 'jadeWarmIvory'
  | 'peachSage'
  | 'creamCrimson'
  | 'softWhiteJade'
  | 'dustyRoseNavy'
  | 'mutedPlumIvory'
  | 'moonBlueSoftWhite'
  | 'lilacPlum'
  | 'roseDeepNavy';

export type PaletteRecommendation = {
  id: PaletteId;
  colors: string[];
};

const base: Record<Undertone, PaletteRecommendation[]> = {
  warm: [
    { id: 'jadeWarmIvory', colors: ['#F2E5C9', '#3F7160', '#B7754D', '#C99A4A'] },
    { id: 'peachSage', colors: ['#F1C7B7', '#879B75', '#F4E8D6', '#A85B4C'] },
    { id: 'creamCrimson', colors: ['#FFF1D9', '#A13E43', '#D0A25C', '#3B5B4B'] },
  ],
  neutral: [
    { id: 'softWhiteJade', colors: ['#F6F2E9', '#4F7468', '#C39B73', '#7B596B'] },
    { id: 'dustyRoseNavy', colors: ['#D4A9B1', '#293E5B', '#E7D8C4', '#9D705F'] },
    { id: 'mutedPlumIvory', colors: ['#76536F', '#EEE5D8', '#B68A9F', '#58695D'] },
  ],
  cool: [
    { id: 'moonBlueSoftWhite', colors: ['#7897B5', '#F2F4F5', '#465B78', '#C3A9C6'] },
    { id: 'lilacPlum', colors: ['#D9C8E1', '#684B70', '#F0ECE9', '#8B9FB5'] },
    { id: 'roseDeepNavy', colors: ['#C991A5', '#263A58', '#E2D8D4', '#81729D'] },
  ],
};

export function getPalettes(undertone: Undertone, depth: Depth) {
  const palettes = base[undertone];
  if (depth === 'deep') return [palettes[2], palettes[0], palettes[1]];
  if (depth === 'light') return [palettes[1], palettes[0], palettes[2]];
  return palettes;
}
