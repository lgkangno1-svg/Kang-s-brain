export type QuickHelpChoice = { label: string; nextId: string };
export type QuickHelpCta = { label: string; href: string };
export type QuickHelpNode = {
  id: string;
  title: string;
  answer: string;
  choices?: QuickHelpChoice[];
  cta?: QuickHelpCta;
};

export const QUICK_HELP_ROOT_ID = "root";

export const QUICK_HELP_NODES: Record<string, QuickHelpNode> = {
  root: {
    id: "root",
    title: "Korea Quick Help",
    answer: "Hi! Choose a topic and I’ll give you an instant answer. This helper is free and does not call an AI API.",
    choices: [
      { label: "Gyeongbokgung", nextId: "palace" },
      { label: "Hanbok", nextId: "hanbok" },
      { label: "Personal color", nextId: "color" },
      { label: "Food & cafés", nextId: "food" },
      { label: "K-Culture", nextId: "culture" },
      { label: "Credits & payments", nextId: "credits" },
      { label: "Privacy", nextId: "privacy" },
    ],
  },
  palace: {
    id: "palace",
    title: "Gyeongbokgung",
    answer: "Pick the part of your palace visit you want help with.",
    choices: [
      { label: "Do I need Hanbok?", nextId: "palace-hanbok" },
      { label: "How long should I plan?", nextId: "palace-time" },
      { label: "What can I do nearby?", nextId: "palace-nearby" },
    ],
    cta: { label: "Open Gyeongbokgung guide", href: "/explore/gyeongbokgung" },
  },
  "palace-hanbok": {
    id: "palace-hanbok",
    title: "Do I need Hanbok?",
    answer: "No. Hanbok is optional. Many visitors rent it for the experience and photos, but normal clothes are completely fine. Time-sensitive admission and opening rules should always be checked against current official information before you visit.",
    cta: { label: "Find a Hanbok style", href: "/hanbok" },
  },
  "palace-time": {
    id: "palace-time",
    title: "How long should I plan?",
    answer: "A focused palace visit can fit into about 1–2 hours. For Hanbok, photos, a meal, a café and nearby neighborhoods, roughly half a day is more comfortable.",
    cta: { label: "Explore the palace area", href: "/explore/gyeongbokgung" },
  },
  "palace-nearby": {
    id: "palace-nearby",
    title: "What can I do nearby?",
    answer: "Seochon, Bukchon, Anguk, Insadong and Gwanghwamun are all useful nearby areas. The best order depends on your remaining time, walking tolerance and whether you are returning a rental Hanbok.",
    cta: { label: "Explore nearby", href: "/explore/gyeongbokgung" },
  },
  hanbok: {
    id: "hanbok",
    title: "Hanbok help",
    answer: "A good Hanbok choice balances color, photo mood, weather, movement and how long you plan to wear it.",
    choices: [
      { label: "Which colors should I try?", nextId: "hanbok-colors" },
      { label: "Traditional or modern?", nextId: "hanbok-style" },
      { label: "What about comfort?", nextId: "hanbok-comfort" },
    ],
    cta: { label: "Open Hanbok matcher", href: "/hanbok" },
  },
  "hanbok-colors": {
    id: "hanbok-colors",
    title: "Which colors should I try?",
    answer: "Start with colors that work well near your face, then choose the lower garment for the mood you want. Softer contrast feels calm and romantic; stronger contrast reads more dramatic in palace photos. Treat personal color as guidance, not a list of forbidden colors.",
    cta: { label: "Find my colors", href: "/color" },
  },
  "hanbok-style": {
    id: "hanbok-style",
    title: "Traditional or modern?",
    answer: "Choose based on the experience you want. A traditional silhouette suits a heritage-focused visit, while modern or fusion styling can work well for a fashion-led photo day. We label the style family so you can compare clearly.",
    cta: { label: "Compare Hanbok styles", href: "/hanbok" },
  },
  "hanbok-comfort": {
    id: "hanbok-comfort",
    title: "What about comfort?",
    answer: "For a long rental, consider weather, sleeve length, skirt volume, footwear, coverage and walking distance before decorative details. Comfort matters more after the first hour than it does in the fitting room.",
    cta: { label: "Open Hanbok matcher", href: "/hanbok" },
  },
  color: {
    id: "color",
    title: "Personal color",
    answer: "The color feature focuses only on visible color characteristics under the current lighting.",
    choices: [
      { label: "What does it analyze?", nextId: "color-what" },
      { label: "What if it feels wrong?", nextId: "color-correct" },
      { label: "Does it identify ethnicity?", nextId: "color-sensitive" },
    ],
    cta: { label: "Start personal color", href: "/color" },
  },
  "color-what": {
    id: "color-what",
    title: "What does it analyze?",
    answer: "The goal is to estimate visible warm/neutral/cool tendency, depth and contrast, then suggest colors worth trying near your face. Lighting can change the result, so confidence and manual correction are important.",
    cta: { label: "Start personal color", href: "/color" },
  },
  "color-correct": {
    id: "color-correct",
    title: "What if it feels wrong?",
    answer: "Use the manual correction controls or retake the photo in more neutral light. The result is a styling aid, not an objective diagnosis, so your own preference should always win.",
    cta: { label: "Open color tool", href: "/color" },
  },
  "color-sensitive": {
    id: "color-sensitive",
    title: "Does it identify ethnicity?",
    answer: "No. The product is not designed to infer race, ethnicity, nationality, religion, health or attractiveness from a selfie. Photo analysis is limited to the visible styling signals needed for color guidance.",
    cta: { label: "Read the color approach", href: "/color" },
  },
  food: {
    id: "food",
    title: "Food & cafés",
    answer: "Free discovery should help you narrow nearby choices by walking distance, budget, cuisine mood and route position. Current opening hours, menus and dietary claims must come from verified data rather than an AI guess.",
    cta: { label: "Explore Gyeongbokgung food", href: "/explore/gyeongbokgung" },
  },
  culture: {
    id: "culture",
    title: "K-Culture",
    answer: "Korea Concierge will explain Korean zodiac and Saju as cultural and entertainment experiences. Saju calculations should be deterministic; AI is used only for optional narrative explanation, not for high-impact life advice.",
    cta: { label: "Open K-Culture Lab", href: "/culture" },
  },
  credits: {
    id: "credits",
    title: "Credits & payments",
    answer: "Basic travel discovery and this Quick Help are free. Credits are for heavier personalization. Every paid action shows a fixed credit cost before you confirm, and failed paid jobs should release or refund reserved credits.",
    cta: { label: "See Trip Passes", href: "/credits" },
  },
  privacy: {
    id: "privacy",
    title: "Privacy",
    answer: "This Quick Help runs entirely from fixed website content and sends no question to an AI provider. Selfies and birth information use separate privacy rules, explicit consent and minimum-data handling.",
  },
};
