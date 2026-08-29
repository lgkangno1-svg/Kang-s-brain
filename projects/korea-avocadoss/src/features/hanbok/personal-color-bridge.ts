export type PersonalColorUndertone = 'warm' | 'neutral' | 'cool';

export type HanbokMatcherColorId = 'jadeIvory' | 'roseNavy' | 'moonBlue';

const PERSONAL_COLOR_TO_HANBOK_COLOR: Readonly<Record<PersonalColorUndertone, HanbokMatcherColorId>> = {
  warm: 'jadeIvory',
  neutral: 'roseNavy',
  cool: 'moonBlue',
};

export function isPersonalColorUndertone(value: string | null | undefined): value is PersonalColorUndertone {
  return value === 'warm' || value === 'neutral' || value === 'cool';
}

/**
 * Bridges the browser-local Personal Color preview into the deterministic Hanbok matcher.
 * This is an explicit product mapping, not a confidence score and not an AI inference.
 */
export function hanbokColorForUndertone(undertone: PersonalColorUndertone): HanbokMatcherColorId {
  return PERSONAL_COLOR_TO_HANBOK_COLOR[undertone];
}
