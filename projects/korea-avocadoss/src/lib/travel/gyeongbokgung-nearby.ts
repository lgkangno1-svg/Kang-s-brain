import type {NearbyStop} from '@/lib/travel/gyeongbokgung-nearby-core';

const OFFICIAL={
 seochon:'https://english.visitseoul.net/PalaceArea/Seochon-Hanok-Village/ENN000624',
 bukchon:'https://english.visitseoul.net/area/Bukchon-Hanok-Village/ENP000261',
 insadong:'https://english.visitseoul.net/attractions/insa-dong/ENP000080',
 gwanghwamun:'https://english.visitseoul.net/attractions/gwanghwamun-square/ENP001899',
 info:'https://english.visitseoul.net/attractions/Gwanghwamun-Tourist-Information-Center/ENP027225'
} as const;

export const GYEONGBOKGUNG_NEARBY_STOPS:readonly NearbyStop[]=[
 {id:'gwanghwamun',name:'Gwanghwamun Square',koreanName:'광화문광장',mapQuery:'Gwanghwamun Square Seoul',minutes:30,transferMinutes:5,note:'Low-friction city-center stop with a broad palace-axis view.',sourceUrl:OFFICIAL.gwanghwamun,checkedAt:'2026-09-09'},
 {id:'info',name:'Gwanghwamun Tourist Information Center',koreanName:'광화문 관광안내소',mapQuery:'Gwanghwamun Tourist Information Center Seoul',minutes:15,transferMinutes:5,note:'Useful for maps and in-person travel help; official listing notes English, Chinese and Japanese assistance.',sourceUrl:OFFICIAL.info,checkedAt:'2026-09-11',restrictedWindow:{openMinute:600,closeMinute:1140,note:'Official listing: 10:00–19:00.'},closedWeekdays:[6],closedDates:['2026-02-17','2026-09-25'],closureNote:'Official Visit Seoul listing: closed Saturdays, Lunar New Year and Chuseok. Exact 2026 festival dates are modeled; adjacent holiday days, temporary closures and other years still require a source re-check.'},
 {id:'seochon',name:'Seochon old alleys',koreanName:'서촌 골목',mapQuery:'Seochon Hanok Village Seoul',minutes:45,transferMinutes:12,note:'Quieter west-side neighborhood with old alleys, small shops and cultural traces.',sourceUrl:OFFICIAL.seochon,checkedAt:'2026-09-09'},
 {id:'suseongdong',name:'Suseongdong Valley direction',koreanName:'수성동계곡 방향',mapQuery:'Suseongdong Valley Seoul',minutes:45,transferMinutes:18,note:'A longer westward extension when you want a calmer walk rather than shopping.',sourceUrl:OFFICIAL.seochon,checkedAt:'2026-09-09'},
 {id:'bukchon',name:'Bukchon Hanok Village',koreanName:'북촌한옥마을',mapQuery:'Bukchon Hanok Village Seoul',minutes:60,transferMinutes:18,note:'Residential hanok neighborhood. Keep voices low and respect resident-only or restricted access signs.',sourceUrl:OFFICIAL.bukchon,checkedAt:'2026-09-09',restrictedWindow:{openMinute:600,closeMinute:1020,note:'The official tourism listing notes 10:00–17:00 for the restricted Bukchon-ro 11-gil road area.'}},
 {id:'insadong',name:'Insadong',koreanName:'인사동',mapQuery:'Insadong Seoul',minutes:55,transferMinutes:15,note:'Traditional crafts, galleries, tea houses and souvenir browsing in a compact area.',sourceUrl:OFFICIAL.insadong,checkedAt:'2026-09-09'}
];
