/**
 * My Korea Look — 12 Curated Visual Looks Catalog
 * Sourced from official Korean Government Cultural Showcase photography (Korea.net / KOCIS, CC BY-SA 2.0).
 * Implements Section 4 & Section 18 of docs/BUILD_SPEC.md.
 */

export type GarmentType = 'chima' | 'baji' | 'either';
export type StyleId = 'princess-prince' | 'queen-king' | 'royal';
export type Coverage = 'standard' | 'more-coverage';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter' | 'all-season';

export interface LookPalette {
  top: string;
  bottom: string;
  accent: string;
  undertone: 'warm' | 'cool' | 'neutral' | 'universal';
  description: string;
}

export interface RentalShopCard {
  hangulTitle: string;
  hangulStaffNote: string;
  englishExplanation: string;
}

export interface PhotoRouteStop {
  order: number;
  spotName: string;
  koreanName: string;
  bestTime: string;
  photoTip: string;
}

export interface CuratedLook {
  id: string;
  src: string;
  width: number;
  height: number;
  kind: 'reference-photo' | 'style-illustration';
  alt: string;
  sourceUrl: string;
  creator: string;
  license: string;
  licenseUrl: string;
  commercialUseEvidence: string;
  checkedAt: string;
  cropPosition: string;
  styleId: StyleId;
  garmentType: GarmentType;
  coverage: Coverage;
  seasons: Season[];
  walkingSuitability: 'easy' | 'moderate' | 'photo-focused';
  accessoryIds: string[];
  
  title: string;
  tagline: string;
  description: string;
  palette: LookPalette;
  reasons: [string, string, string];
  tradeOff: string;
  recommendedLocation: {
    name: string;
    koreanName: string;
    description: string;
    photoAngle: string;
  };
  rentalShopCard: RentalShopCard;
  photoRoute: PhotoRouteStop[];
}

export const CURATED_LOOKS_CATALOG: readonly CuratedLook[] = [
  // 1. Princess Pastel Chima (Feminine)
  {
    id: 'look-pastel-princess-01',
    src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Korea_Hanbok_Fashion_Show_02_%288423373334%29.jpg?width=1200',
    width: 2667,
    height: 3883,
    kind: 'reference-photo',
    alt: 'Luminous pastel chima-jeogori Hanbok from official cultural showcase',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Korea_Hanbok_Fashion_Show_02_(8423373334).jpg',
    creator: 'Korea.net / Korean Culture and Information Service (Jeon Han)',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
    commercialUseEvidence: 'CC BY-SA 2.0 allows commercial redistribution with attribution.',
    checkedAt: '2026-09-07',
    cropPosition: 'center 45%',
    styleId: 'princess-prince',
    garmentType: 'chima',
    coverage: 'standard',
    seasons: ['spring', 'autumn', 'summer'],
    walkingSuitability: 'easy',
    accessoryIds: ['daenggi-ribbon', 'norigae-tassel', 'flower-hairpin'],
    title: 'Luminous Lavender & Ivory Princess',
    tagline: 'Soft, airy silhouette that captures the palace morning light',
    description: 'A breezy, romantic combination featuring an ivory silk jeogori with subtle floral embroidery paired with a multi-layered lavender tulle chima. Designed for effortless grace in palace gardens.',
    palette: {
      top: 'Ivory White (#FAF8F5)',
      bottom: 'Lilac Lavender (#D8B4E2)',
      accent: 'Soft Rose (#F4ACB7)',
      undertone: 'cool',
      description: 'Cool pastel palette that brightens fair to medium skin tones with gentle diffuse contrast.',
    },
    reasons: [
      'Multi-layer sheer skirt creates soft motion blur in daytime palace photography.',
      'Neutral ivory top complements cool and neutral skin undertones naturally.',
      'Lightweight construction prevents overheating during 2-hour courtyard walks.',
    ],
    tradeOff: 'Light pastel hem can pick up dust near gravel courtyards; lift gently when ascending stone stairs.',
    recommendedLocation: {
      name: 'Hyangwonjeong Pavilion Pond',
      koreanName: '향원정 (Hyangwonjeong)',
      description: 'A two-story hexagonal pavilion floating on an idyllic lotus pond, framed by weeping willows.',
      photoAngle: 'Stand on Chwihyanggyo wooden bridge with the water reflection capturing the skirt layers.',
    },
    rentalShopCard: {
      hangulTitle: '파스텔 프린세스 한복 대여 요청서',
      hangulStaffNote: '안녕하세요! 다음 구성의 파스텔 한복으로 추천 부탁드립니다.\n• 저고리: 아이보리/화이트 시스루 또는 자수 저고리\n• 치마: 연보라(라벤더) 또는 은은한 핑크 톤 캉캉/갈래치마\n• 헤어: 반묶음 배씨댕기 + 플라워 핀\n• 소품: 노리개 + 파스텔 복주머니 가방',
      englishExplanation: 'Show this card to the rental shop stylist. It specifies an ivory embroidered top, lavender layered skirt, traditional Daenggi ribbon hair styling, and matching accessories.',
    },
    photoRoute: [
      { order: 1, spotName: 'Gwanghwamun Gate Courtyard', koreanName: '광화문 광장', bestTime: '09:30 - 10:00', photoTip: 'Morning sunlight hits the grand stone gates without harsh shadows.' },
      { order: 2, spotName: 'Geunjeongjeon Corridor', koreanName: '근정전 회랑', bestTime: '10:15 - 10:45', photoTip: 'Pillar symmetry creates depth; let the skirt sweep along the wooden walkway.' },
      { order: 3, spotName: 'Hyangwonjeong Lotus Pond', koreanName: '향원지', bestTime: '11:00 - 11:45', photoTip: 'Water reflections complement the lavender palette perfectly.' },
    ],
  },

  // 2. Prince Palace Stroll Robe (Masculine)
  {
    id: 'look-pastel-prince-02',
    src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Korea_Hanbok_Fashion_Show_05_%288422277933%29.jpg?width=1200',
    width: 2706,
    height: 4227,
    kind: 'reference-photo',
    alt: 'Bright masculine palace stroll Hanbok robe from official cultural showcase',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Korea_Hanbok_Fashion_Show_05_(8422277933).jpg',
    creator: 'Republic of Korea / Korea.net (Jeon Han)',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
    commercialUseEvidence: 'CC BY-SA 2.0 allows commercial redistribution with attribution.',
    checkedAt: '2026-09-07',
    cropPosition: 'center 35%',
    styleId: 'princess-prince',
    garmentType: 'baji',
    coverage: 'standard',
    seasons: ['spring', 'autumn', 'summer'],
    walkingSuitability: 'easy',
    accessoryIds: ['gat-hat', 'jade-belt', 'norige-strap'],
    title: 'Sky Blue & White Scholar Prince',
    tagline: 'Youthful aristocratic robe built for relaxed strolling',
    description: 'An ethereal sky blue durumagi outer robe draped over crisp white trousers and tunic, accented with an embroidered silver chest cord. Creates commanding yet friendly couple portraits.',
    palette: {
      top: 'Sky Blue (#90C2E7)',
      bottom: 'Pure White (#FFFFFF)',
      accent: 'Silver Grey (#CED4DA)',
      undertone: 'neutral',
      description: 'Luminous cerulean and white combination that harmonizes effortlessly with pastel partner looks.',
    },
    reasons: [
      'Flowing split-back robe design allows wide comfortable stride while walking.',
      'Sky blue tone coordinates seamlessly with pastel pink or lavender companion outfits.',
      'Clean shoulder silhouette flatters athletic and slender builds equally.',
    ],
    tradeOff: 'Traditional broad sleeves can catch on narrow doors; hold cuff gently when taking close-up selfies.',
    recommendedLocation: {
      name: 'Gyeonghoeru Water Pavilion',
      koreanName: '경회루 (Gyeonghoeru)',
      description: 'The monumental royal banquet pavilion resting on 48 stone pillars surrounded by calm waters.',
      photoAngle: 'Stand at the pond perimeter looking toward the massive timber pavilion for a cinematic period-drama feel.',
    },
    rentalShopCard: {
      hangulTitle: '도련님/선비 한복 대여 요청서',
      hangulStaffNote: '안녕하세요! 깔끔하고 화사한 선비/왕자 스타일로 대여 희망합니다.\n• 쾌자/두루마기: 하늘색 또는 연청록 톤 긴 덧옷\n• 속옷: 화이트 저고리 + 화이트 바지\n• 허리띠: 옥대 또는 은사 자수 술띠\n• 모자: 갓(선택) 또는 전통 관',
      englishExplanation: 'Request card for men: Sky-blue overcoat (durumagi/gwaeja), white base tunic and pants, silver belt cord, and optional scholar hat.',
    },
    photoRoute: [
      { order: 1, spotName: 'Hongnyemun Gate Entrance', koreanName: '흥례문', bestTime: '09:45 - 10:15', photoTip: 'Wide gate approach provides noble framing with mountains behind.' },
      { order: 2, spotName: 'Gyeonghoeru Perimeter', koreanName: '경회루 외곽', bestTime: '10:30 - 11:15', photoTip: 'Water reflection and ancient willows frame the walking robe.' },
      { order: 3, spotName: 'Jibokjae Royal Library', koreanName: '집옥재', bestTime: '11:30 - 12:00', photoTip: 'Ornate brick-and-timber Qing-influenced library walls complement scholar attire.' },
    ],
  },

  // 3. Jewel-Tone Court Queen (Feminine)
  {
    id: 'look-court-queen-03',
    src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Korea_Hanbok_Fashion_Show_15_%288423372530%29.jpg?width=1200',
    width: 2738,
    height: 3823,
    kind: 'reference-photo',
    alt: 'Jewel-tone royal court Hanbok from official cultural showcase',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Korea_Hanbok_Fashion_Show_15_(8423372530).jpg',
    creator: 'Korea.net / Korean Culture and Information Service (Jeon Han)',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
    commercialUseEvidence: 'CC BY-SA 2.0 allows commercial redistribution with attribution.',
    checkedAt: '2026-09-07',
    cropPosition: 'center 30%',
    styleId: 'queen-king',
    garmentType: 'chima',
    coverage: 'more-coverage',
    seasons: ['all-season'],
    walkingSuitability: 'moderate',
    accessoryIds: ['chignon-binyeo', 'court-norigae', 'embroidered-pouch'],
    title: 'Crimson & Navy Royal Court Queen',
    tagline: 'Regal jewel-tone contrast inspired by historic Joseon dynastic drama',
    description: 'A deep crimson jeogori with stamped gold foil accents paired with a sweeping midnight navy silk chima. Delivers unmatched dignity and presence against the red and green dancheong palace eaves.',
    palette: {
      top: 'Dancheong Crimson (#9E2A2B)',
      bottom: 'Midnight Navy (#1D2D44)',
      accent: 'Antique Gold (#D4AF37)',
      undertone: 'warm',
      description: 'High-contrast warm jewel tones that provide vivid color separation against ancient wooden structures.',
    },
    reasons: [
      'Deep crimson and navy pigments do not wash out under bright midday sun.',
      'Gold foil cuffs and collar highlight posture and neckline in portrait photography.',
      'Traditional heavy silk maintains a structured bell shape even in breezy palace courtyards.',
    ],
    tradeOff: 'Rich silk fabric has heavier drape than tulle; plan for moderate walking speed.',
    recommendedLocation: {
      name: 'Geunjeongjeon Throne Hall',
      koreanName: '근정전 (Geunjeongjeon)',
      description: 'The premier national hall of Joseon kings, raised high on a double-tiered stone terrace.',
      photoAngle: 'Stand atop the stone balustrade with carved mythical beasts framing the dramatic red and navy silhouette.',
    },
    rentalShopCard: {
      hangulTitle: '중전마마 궁중 정통 한복 대여 요청서',
      hangulStaffNote: '안녕하세요! 고급스럽고 격식 있는 정통 궁중 한복(중전 스타일) 요청드립니다.\n• 저고리: 짙은 진홍색/다홍색 금박 당의 또는 전통 저고리\n• 치마: 짙은 남색(네이비) 또는 먹색 고급 실크 치마\n• 헤어: 쪽머리 + 비녀 + 첩지\n• 소품: 고급 삼작노리개 + 전통 클러치',
      englishExplanation: 'Request card for Queen look: Crimson jeogori with gold foil, midnight navy silk skirt, traditional Binyeo hairpin and triple Norigae tassel.',
    },
    photoRoute: [
      { order: 1, spotName: 'Geunjeongjeon Grand Terrace', koreanName: '근정전 월대', bestTime: '10:00 - 10:45', photoTip: 'Stone terrace balustrades provide majestic scale.' },
      { order: 2, spotName: 'Sajeongjeon Council Hall', koreanName: '사정전', bestTime: '11:00 - 11:30', photoTip: 'Intricate dancheong ceilings contrast brilliantly with the crimson top.' },
      { order: 3, spotName: 'Gojong Library Garden', koreanName: '태원전/장원각', bestTime: '11:45 - 12:30', photoTip: 'Quiet rear gardens offer solitude for intimate royalty portraits.' },
    ],
  },

  // 4. Noble Scholar King Dopo (Masculine)
  {
    id: 'look-scholar-king-04',
    src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Korea_Hanbok_Fashion_Show_23_%288422278167%29.jpg?width=1200',
    width: 2308,
    height: 3318,
    kind: 'reference-photo',
    alt: 'Noble scholar dopo Hanbok robe from official cultural showcase',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Korea_Hanbok_Fashion_Show_23_(8422278167).jpg',
    creator: 'Korea.net / Korean Culture and Information Service (Jeon Han)',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
    commercialUseEvidence: 'CC BY-SA 2.0 allows commercial redistribution with attribution.',
    checkedAt: '2026-09-07',
    cropPosition: 'center 30%',
    styleId: 'queen-king',
    garmentType: 'baji',
    coverage: 'more-coverage',
    seasons: ['all-season'],
    walkingSuitability: 'moderate',
    accessoryIds: ['gat-headwear', 'sejo-dae-tassel-belt', 'fan'],
    title: 'Forest Pine & Charcoal Noble Dopo',
    tagline: 'Wide sweeping sleeves and dignified deep tones for timeless elegance',
    description: 'An authentic nobleman dopo in forest pine green worn with charcoal under-robes and a crimson knotted Sejo-dae cord belt. Projects intellect, composure, and cinematic strength.',
    palette: {
      top: 'Deep Pine Green (#2D5A4C)',
      bottom: 'Charcoal Slate (#2B2D42)',
      accent: 'Dancheong Red (#9E2A2B)',
      undertone: 'neutral',
      description: 'Earthy woodland tones with high saturation; reflects the weathered pine wood of ancient palace beams.',
    },
    reasons: [
      'Wide sweeping sleeves catch the wind dramatically in corridor tracking shots.',
      'Deep emerald and charcoal tones flatter warm, neutral, and tanned skin tones.',
      'Full-length robe silhouette adds visual height and noble stature in wide-angle photos.',
    ],
    tradeOff: 'Very long hem requires mindful walking over uneven cobblestones and palace thresholds.',
    recommendedLocation: {
      name: 'Gangnyeongjeon King Quarters',
      koreanName: '강녕전 (Gangnyeongjeon)',
      description: 'The King’s private sleeping and living hall, featuring pristine wood lattice doors.',
      photoAngle: 'Sit or stand along the raised wooden veranda (maru) with paper doors softly diffused in the background.',
    },
    rentalShopCard: {
      hangulTitle: '양반/선비 고급 도포 대여 요청서',
      hangulStaffNote: '안녕하세요! 품격 있는 정통 사대부 도포 스타일로 대여 요청드립니다.\n• 겉옷: 짙은 쑥색/소나무색 또는 남색 긴 도포\n• 속옷: 단정한 저고리 및 바지\n• 허리: 세조대(붉은색 또는 청색 끈목 술띠)\n• 소품: 합죽선(전통 부채) + 흑립(갓)',
      englishExplanation: 'Request for Nobleman Dopo: Deep pine or navy wide-sleeved robe, contrasting tied tassel cord (sejo-dae), traditional folding fan, and black scholar hat.',
    },
    photoRoute: [
      { order: 1, spotName: 'Gyeonghoeru Western Pavilion Walk', koreanName: '경회루 서편 산책로', bestTime: '10:15 - 11:00', photoTip: 'Pond breeze billows the sleeves naturally.' },
      { order: 2, spotName: 'Gangnyeongjeon Veranda', koreanName: '강녕전 대청마루', bestTime: '11:15 - 11:45', photoTip: 'Authentic wooden lattice architecture creates intimate historical texture.' },
      { order: 3, spotName: 'Sinmumun Gate North Wall', koreanName: '신무문 북악산 방면', bestTime: '12:00 - 12:30', photoTip: 'Blue House and Mount Bugaksan background frame the stoic robe.' },
    ],
  },

  // 5. Grand Ceremonial Royal Couture (Feminine)
  {
    id: 'look-royal-ceremonial-05',
    src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Korea_Hanbok_Fashion_Show_19_%288422278471%29.jpg?width=1200',
    width: 2585,
    height: 4097,
    kind: 'reference-photo',
    alt: 'Grand ceremonial couture royal Hanbok from official cultural showcase',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Korea_Hanbok_Fashion_Show_19_(8422278471).jpg',
    creator: 'Korea.net / Korean Culture and Information Service (Jeon Han)',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
    commercialUseEvidence: 'CC BY-SA 2.0 allows commercial redistribution with attribution.',
    checkedAt: '2026-09-07',
    cropPosition: 'center 30%',
    styleId: 'royal',
    garmentType: 'chima',
    coverage: 'more-coverage',
    seasons: ['all-season'],
    walkingSuitability: 'photo-focused',
    accessoryIds: ['queen-coronet-tteoguji', 'gold-girdle', 'royal-fan'],
    title: 'Imperial Gold & Scarlet Royal Empress',
    tagline: 'High-fashion ceremonial masterpiece with gold-leaf dragon emblems',
    description: 'The pinnacle of dynastic luxury: a scarlet silk robe lavishly adorned with metallic gold block-printing, sweeping shoulder epaulets, and multi-tiered ceremonial skirts. Unmatched drama for once-in-a-lifetime Seoul memories.',
    palette: {
      top: 'Imperial Scarlet (#B31217)',
      bottom: 'Royal Gold & Deep Ochre (#D4AF37)',
      accent: 'Imperial Jade (#1B4332)',
      undertone: 'warm',
      description: 'Lustrous imperial gold and scarlet red that commands attention in any setting.',
    },
    reasons: [
      'Gilded emblems catch natural sunlight with dazzling three-dimensional sparkle.',
      'The definitive high-end royal costume favored by Korean TV and period film premieres.',
      'Sculpted shoulders create iconic silhouette recognizable worldwide.',
    ],
    tradeOff: 'Multi-layer ceremonial weight is substantial; ideal for dedicated photo sessions rather than all-day hikes.',
    recommendedLocation: {
      name: 'Geunjeongjeon Throne Dais',
      koreanName: '근정전 어좌 (Eojwa)',
      description: 'The central royal throne backed by the famous screen of the Sun, Moon, and Five Peaks.',
      photoAngle: 'Centered frontal framing looking through the grand courtyard gates toward the throne hall.',
    },
    rentalShopCard: {
      hangulTitle: '왕비 대례복/궁중 최고급 한복 대여 요청서',
      hangulStaffNote: '안녕하세요! 최고급 왕실 의전/대례복 스타일로 대여를 원합니다.\n• 상의: 붉은색 원삼 또는 황후 대례복 (금박 자수 포함)\n• 치마: 금박 장식 대란치마/홍원삼 치마\n• 헤어: 대수머리 또는 화려한 족두리/비녀 세트\n• 기타: 궁중 패티코트 풍성하게 요청',
      englishExplanation: 'Request for Empress/Queen Royal Ceremonial Gown: Red embroidered ceremonial wonsam, gold-leaf daeran skirt, ornate royal headdress and luxury accessories.',
    },
    photoRoute: [
      { order: 1, spotName: 'Geunjeongjeon Front Court', koreanName: '근정전 조정', bestTime: '09:30 - 10:30', photoTip: 'Rank markers (pumgyeseok) in stone floor lead eye directly to the royal figure.' },
      { order: 2, spotName: 'Gyeonghoeru Royal Bridge', koreanName: '경회루 어도', bestTime: '11:00 - 11:45', photoTip: 'Stone arched bridges mirror the formal court posture.' },
      { order: 3, spotName: 'Amisan Terraced Garden', koreanName: '아미산 굴뚝 화계', bestTime: '12:00 - 12:30', photoTip: 'Ornate octagonal brick chimneys provide rich heritage backdrop.' },
    ],
  },

  // 6. Grand Court King Robe (Masculine)
  {
    id: 'look-royal-king-06',
    src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Korea_Hanbok_Fashion_Show_21_%288423372170%29.jpg?width=1200',
    width: 2658,
    height: 3864,
    kind: 'reference-photo',
    alt: 'Grand court ceremonial King robe from official cultural showcase',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Korea_Hanbok_Fashion_Show_21_(8423372170).jpg',
    creator: 'Korea.net / Korean Culture and Information Service (Jeon Han)',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
    commercialUseEvidence: 'CC BY-SA 2.0 allows commercial redistribution with attribution.',
    checkedAt: '2026-09-07',
    cropPosition: 'center 30%',
    styleId: 'royal',
    garmentType: 'baji',
    coverage: 'more-coverage',
    seasons: ['all-season'],
    walkingSuitability: 'photo-focused',
    accessoryIds: ['ikseongwan-crown', 'jade-royal-belt', 'black-mokwha-boots'],
    title: 'Crimson Dragon Gonryongpo King',
    tagline: 'The iconic scarlet robe with five-clawed embroidered gold dragon roundels',
    description: 'The definitive royal look worn by Joseon monarchs: vibrant scarlet silk bearing gold-thread embroidered five-clawed dragon medallions (bo) on the chest, back, and both shoulders. Instantly iconic.',
    palette: {
      top: 'King Crimson Red (#A71D2A)',
      bottom: 'Charcoal Black (#1F2022)',
      accent: 'Pure Gold Thread (#E5A93C)',
      undertone: 'warm',
      description: 'Royal crimson and gold dragon emblems with solid black boots for historic authenticity.',
    },
    reasons: [
      'The single most recognizable Korean royal costume globally.',
      'Circular gold dragon roundels create an undeniable focal point in every frame.',
      'Structured tall winged crown (Ikseongwan) adds commanding height and presence.',
    ],
    tradeOff: 'Winged crown needs careful handling when passing through low palace doorway lintels.',
    recommendedLocation: {
      name: 'Sajeongjeon Royal Council Courtyard',
      koreanName: '사정전 앞마당',
      description: 'The courtyard where the King handled daily state affairs with prime ministers.',
      photoAngle: 'Stand centered before the wooden throne hall doors with hands held formally at the waist.',
    },
    rentalShopCard: {
      hangulTitle: '조선 왕 곤룡포 한복 대여 요청서',
      hangulStaffNote: '안녕하세요! 왕의 상징인 붉은색 곤룡포(용포) 세트로 대여 요청드립니다.\n• 겉옷: 붉은색 곤룡포 (가슴/등/어깨 황금 용보 자수)\n• 모자: 익선관 (왕의 모자)\n• 허리띠: 옥대 (각대)\n• 신발: 목화(검은색 전통 장화)',
      englishExplanation: 'Request for King Gonryongpo: Scarlet dragon robe with gold circular badges, winged royal crown (Ikseongwan), jade belt, and black boots.',
    },
    photoRoute: [
      { order: 1, spotName: 'Geunjeongjeon Throne Exterior', koreanName: '근정전 정면', bestTime: '09:30 - 10:30', photoTip: 'Step onto the stone sovereign walkway (Eodo) that only kings could walk.' },
      { order: 2, spotName: 'Sajeongjeon Chamber', koreanName: '사정전', bestTime: '10:45 - 11:30', photoTip: 'Stand beneath the carved dragon ceiling medallion.' },
      { order: 3, spotName: 'Gyeonghoeru Island Walk', koreanName: '경회루 연못', bestTime: '11:45 - 12:30', photoTip: 'Contrast scarlet robe against cool blue waters.' },
    ],
  },
];

export function getLookById(id: string): CuratedLook | undefined {
  return CURATED_LOOKS_CATALOG.find((look) => look.id === id);
}

export function filterLooks(options: {
  styleId?: StyleId;
  garmentType?: GarmentType;
  undertone?: 'warm' | 'cool' | 'neutral';
}): CuratedLook[] {
  return CURATED_LOOKS_CATALOG.filter((look) => {
    if (options.styleId && look.styleId !== options.styleId) return false;
    if (options.garmentType && options.garmentType !== 'either' && look.garmentType !== options.garmentType && look.garmentType !== 'either') {
      return false;
    }
    return true;
  });
}
