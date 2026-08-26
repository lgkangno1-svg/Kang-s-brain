import type { Depth, Undertone } from './analyze-visible-tone';

export type PaletteRecommendation = {
  name: string;
  note: string;
  colors: string[];
};

const base: Record<Undertone, PaletteRecommendation[]> = {
  warm: [
    { name: 'Jade & Warm Ivory', note: 'A classic palace-friendly combination with warmth near the face.', colors: ['#F2E5C9', '#3F7160', '#B7754D', '#C99A4A'] },
    { name: 'Peach & Sage', note: 'Soft and friendly for daylight photos and quieter neighborhood walks.', colors: ['#F1C7B7', '#879B75', '#F4E8D6', '#A85B4C'] },
    { name: 'Cream & Crimson', note: 'Stronger contrast for palace architecture and formal Hanbok styling.', colors: ['#FFF1D9', '#A13E43', '#D0A25C', '#3B5B4B'] },
  ],
  neutral: [
    { name: 'Soft White & Jade', note: 'Balanced and flexible across traditional and modern Hanbok looks.', colors: ['#F6F2E9', '#4F7468', '#C39B73', '#7B596B'] },
    { name: 'Dusty Rose & Navy', note: 'A refined combination that photographs well against palace stone and wood.', colors: ['#D4A9B1', '#293E5B', '#E7D8C4', '#9D705F'] },
    { name: 'Muted Plum & Ivory', note: 'A calm romantic palette without relying on very bright saturation.', colors: ['#76536F', '#EEE5D8', '#B68A9F', '#58695D'] },
  ],
  cool: [
    { name: 'Moon Blue & Soft White', note: 'Clean contrast for palace courtyards and stone backgrounds.', colors: ['#7897B5', '#F2F4F5', '#465B78', '#C3A9C6'] },
    { name: 'Lilac & Plum', note: 'A polished modern-romantic Hanbok direction.', colors: ['#D9C8E1', '#684B70', '#F0ECE9', '#8B9FB5'] },
    { name: 'Rose & Deep Navy', note: 'A stronger photo palette with cool depth and restrained warmth.', colors: ['#C991A5', '#263A58', '#E2D8D4', '#81729D'] },
  ],
};

export function getPalettes(undertone: Undertone, depth: Depth) {
  const palettes = base[undertone];
  if (depth === 'deep') return [palettes[2], palettes[0], palettes[1]];
  if (depth === 'light') return [palettes[1], palettes[0], palettes[2]];
  return palettes;
}
