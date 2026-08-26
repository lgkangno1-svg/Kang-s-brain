export type QuickHelpChoice = { labelKey: string; nextId: string };
export type QuickHelpCta = { labelKey: string; href: string };
export type QuickHelpNode = {
  id: string;
  titleKey: string;
  answerKey: string;
  choices?: QuickHelpChoice[];
  cta?: QuickHelpCta;
};

export const QUICK_HELP_ROOT_ID = "root";

export const QUICK_HELP_NODES: Record<string, QuickHelpNode> = {
  root: {
    id: "root",
    titleKey: "nodes.root.title",
    answerKey: "nodes.root.answer",
    choices: [
      { labelKey: "nodes.root.choices.palace", nextId: "palace" },
      { labelKey: "nodes.root.choices.hanbok", nextId: "hanbok" },
      { labelKey: "nodes.root.choices.color", nextId: "color" },
      { labelKey: "nodes.root.choices.food", nextId: "food" },
      { labelKey: "nodes.root.choices.culture", nextId: "culture" },
      { labelKey: "nodes.root.choices.credits", nextId: "credits" },
      { labelKey: "nodes.root.choices.privacy", nextId: "privacy" },
    ],
  },
  palace: {
    id: "palace",
    titleKey: "nodes.palace.title",
    answerKey: "nodes.palace.answer",
    choices: [
      { labelKey: "nodes.palace.choices.hanbok", nextId: "palace-hanbok" },
      { labelKey: "nodes.palace.choices.time", nextId: "palace-time" },
      { labelKey: "nodes.palace.choices.nearby", nextId: "palace-nearby" },
    ],
    cta: { labelKey: "nodes.palace.cta", href: "/explore/gyeongbokgung" },
  },
  "palace-hanbok": {
    id: "palace-hanbok",
    titleKey: "nodes.palaceHanbok.title",
    answerKey: "nodes.palaceHanbok.answer",
    cta: { labelKey: "nodes.palaceHanbok.cta", href: "/hanbok" },
  },
  "palace-time": {
    id: "palace-time",
    titleKey: "nodes.palaceTime.title",
    answerKey: "nodes.palaceTime.answer",
    cta: { labelKey: "nodes.palaceTime.cta", href: "/explore/gyeongbokgung" },
  },
  "palace-nearby": {
    id: "palace-nearby",
    titleKey: "nodes.palaceNearby.title",
    answerKey: "nodes.palaceNearby.answer",
    cta: { labelKey: "nodes.palaceNearby.cta", href: "/explore/gyeongbokgung" },
  },
  hanbok: {
    id: "hanbok",
    titleKey: "nodes.hanbok.title",
    answerKey: "nodes.hanbok.answer",
    choices: [
      { labelKey: "nodes.hanbok.choices.colors", nextId: "hanbok-colors" },
      { labelKey: "nodes.hanbok.choices.style", nextId: "hanbok-style" },
      { labelKey: "nodes.hanbok.choices.comfort", nextId: "hanbok-comfort" },
    ],
    cta: { labelKey: "nodes.hanbok.cta", href: "/hanbok" },
  },
  "hanbok-colors": {
    id: "hanbok-colors",
    titleKey: "nodes.hanbokColors.title",
    answerKey: "nodes.hanbokColors.answer",
    cta: { labelKey: "nodes.hanbokColors.cta", href: "/color" },
  },
  "hanbok-style": {
    id: "hanbok-style",
    titleKey: "nodes.hanbokStyle.title",
    answerKey: "nodes.hanbokStyle.answer",
    cta: { labelKey: "nodes.hanbokStyle.cta", href: "/hanbok" },
  },
  "hanbok-comfort": {
    id: "hanbok-comfort",
    titleKey: "nodes.hanbokComfort.title",
    answerKey: "nodes.hanbokComfort.answer",
    cta: { labelKey: "nodes.hanbokComfort.cta", href: "/hanbok" },
  },
  color: {
    id: "color",
    titleKey: "nodes.color.title",
    answerKey: "nodes.color.answer",
    choices: [
      { labelKey: "nodes.color.choices.what", nextId: "color-what" },
      { labelKey: "nodes.color.choices.correct", nextId: "color-correct" },
      { labelKey: "nodes.color.choices.sensitive", nextId: "color-sensitive" },
    ],
    cta: { labelKey: "nodes.color.cta", href: "/color" },
  },
  "color-what": {
    id: "color-what",
    titleKey: "nodes.colorWhat.title",
    answerKey: "nodes.colorWhat.answer",
    cta: { labelKey: "nodes.colorWhat.cta", href: "/color" },
  },
  "color-correct": {
    id: "color-correct",
    titleKey: "nodes.colorCorrect.title",
    answerKey: "nodes.colorCorrect.answer",
    cta: { labelKey: "nodes.colorCorrect.cta", href: "/color" },
  },
  "color-sensitive": {
    id: "color-sensitive",
    titleKey: "nodes.colorSensitive.title",
    answerKey: "nodes.colorSensitive.answer",
    cta: { labelKey: "nodes.colorSensitive.cta", href: "/color" },
  },
  food: {
    id: "food",
    titleKey: "nodes.food.title",
    answerKey: "nodes.food.answer",
    cta: { labelKey: "nodes.food.cta", href: "/explore/gyeongbokgung" },
  },
  culture: {
    id: "culture",
    titleKey: "nodes.culture.title",
    answerKey: "nodes.culture.answer",
    cta: { labelKey: "nodes.culture.cta", href: "/culture" },
  },
  credits: {
    id: "credits",
    titleKey: "nodes.credits.title",
    answerKey: "nodes.credits.answer",
    cta: { labelKey: "nodes.credits.cta", href: "/credits" },
  },
  privacy: {
    id: "privacy",
    titleKey: "nodes.privacy.title",
    answerKey: "nodes.privacy.answer",
  },
};
