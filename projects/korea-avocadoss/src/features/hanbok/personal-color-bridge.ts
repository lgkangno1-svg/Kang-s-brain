export type PersonalColorUndertone = 'warm' | 'neutral' | 'cool';
export type PersonalColorDepth = 'light' | 'medium' | 'deep';
export type PersonalColorContrast = 'soft' | 'medium' | 'high';

export type HanbokMatcherColorId = 'jadeIvory' | 'roseNavy' | 'moonBlue';

export type HanbokPersonalColorContext = {
  undertone: PersonalColorUndertone;
  depth?: PersonalColorDepth;
  contrast?: PersonalColorContrast;
};

const PERSONAL_COLOR_TO_HANBOK_COLOR: Readonly<Record<PersonalColorUndertone, HanbokMatcherColorId>> = {
  warm: 'jadeIvory',
  neutral: 'roseNavy',
  cool: 'moonBlue',
};

export function isPersonalColorUndertone(value: string | null | undefined): value is PersonalColorUndertone {
  return value === 'warm' || value === 'neutral' || value === 'cool';
}

export function isPersonalColorDepth(value: string | null | undefined): value is PersonalColorDepth {
  return value === 'light' || value === 'medium' || value === 'deep';
}

export function isPersonalColorContrast(value: string | null | undefined): value is PersonalColorContrast {
  return value === 'soft' || value === 'medium' || value === 'high';
}

/**
 * Bridges the browser-local Personal Color preview into the deterministic Hanbok matcher.
 * This is an explicit product mapping, not a confidence score and not an AI inference.
 */
export function hanbokColorForUndertone(undertone: PersonalColorUndertone): HanbokMatcherColorId {
  return PERSONAL_COLOR_TO_HANBOK_COLOR[undertone];
}
