export type NamingVibe = 'gentle' | 'elegant' | 'bright' | 'strong' | 'modern';
export type NamingSound = 'soft' | 'crisp' | 'balanced';
export type KoreanSurnameKey = 'none' | 'kim' | 'lee' | 'park' | 'choi' | 'jeong';

export type KoreanNameCandidate = {
  id: string;
  fullHangul: string;
  fullRomanized: string;
  givenHangul: string;
  givenRomanized: string;
  surnameHangul?: string;
  surnameRomanized?: string;
  hanja: string;
  hanjaMeaning: string;
  pronunciation: string;
  vibes: NamingVibe[];
  sound: NamingSound;
};

export type KoreanNameInput = {vibe: NamingVibe; sound: NamingSound; surname: KoreanSurnameKey; seed?: string};
type GivenName = Omit<KoreanNameCandidate, 'fullHangul' | 'fullRomanized' | 'surnameHangul' | 'surnameRomanized'>;

const SURNAMES: Record<Exclude<KoreanSurnameKey, 'none'>, {hangul: string; romanized: string; hanja: string}> = {
  kim:{hangul:'김',romanized:'Kim',hanja:'金'}, lee:{hangul:'이',romanized:'Lee',hanja:'李'}, park:{hangul:'박',romanized:'Park',hanja:'朴'}, choi:{hangul:'최',romanized:'Choi',hanja:'崔'}, jeong:{hangul:'정',romanized:'Jeong',hanja:'鄭'},
};

const GIVEN_NAMES: GivenName[] = [
  {id:'ji-u',givenHangul:'지우',givenRomanized:'Ji-u',hanja:'智祐',hanjaMeaning:'wisdom + support',pronunciation:'jee-oo',vibes:['gentle','modern'],sound:'soft'},
  {id:'seo-jun',givenHangul:'서준',givenRomanized:'Seo-jun',hanja:'瑞俊',hanjaMeaning:'auspicious + talented',pronunciation:'suh-joon',vibes:['elegant','modern'],sound:'balanced'},
  {id:'su-hyeon',givenHangul:'수현',givenRomanized:'Su-hyeon',hanja:'秀賢',hanjaMeaning:'excellent + virtuous',pronunciation:'soo-hyun',vibes:['elegant','gentle'],sound:'soft'},
  {id:'do-yun',givenHangul:'도윤',givenRomanized:'Do-yun',hanja:'道潤',hanjaMeaning:'way + enrichment',pronunciation:'doh-yoon',vibes:['elegant','strong'],sound:'balanced'},
  {id:'yu-jin',givenHangul:'유진',givenRomanized:'Yu-jin',hanja:'裕眞',hanjaMeaning:'abundance + truth',pronunciation:'yoo-jin',vibes:['bright','modern'],sound:'crisp'},
  {id:'ji-min',givenHangul:'지민',givenRomanized:'Ji-min',hanja:'智敏',hanjaMeaning:'wisdom + quick-mindedness',pronunciation:'jee-min',vibes:['bright','modern'],sound:'crisp'},
  {id:'min-seo',givenHangul:'민서',givenRomanized:'Min-seo',hanja:'敏瑞',hanjaMeaning:'quick-minded + auspicious',pronunciation:'min-suh',vibes:['gentle','bright'],sound:'balanced'},
  {id:'seo-hyeon',givenHangul:'서현',givenRomanized:'Seo-hyeon',hanja:'瑞賢',hanjaMeaning:'auspicious + virtuous',pronunciation:'suh-hyun',vibes:['elegant','gentle'],sound:'soft'},
  {id:'ji-an',givenHangul:'지안',givenRomanized:'Ji-an',hanja:'智安',hanjaMeaning:'wisdom + peace',pronunciation:'jee-ahn',vibes:['gentle','modern'],sound:'soft'},
  {id:'yun-seo',givenHangul:'윤서',givenRomanized:'Yun-seo',hanja:'潤瑞',hanjaMeaning:'enrichment + auspiciousness',pronunciation:'yoon-suh',vibes:['elegant','bright'],sound:'soft'},
  {id:'hyeon-u',givenHangul:'현우',givenRomanized:'Hyeon-u',hanja:'賢祐',hanjaMeaning:'virtue + support',pronunciation:'hyun-oo',vibes:['strong','elegant'],sound:'balanced'},
  {id:'min-jun',givenHangul:'민준',givenRomanized:'Min-jun',hanja:'敏俊',hanjaMeaning:'quick-minded + talented',pronunciation:'min-joon',vibes:['strong','modern'],sound:'crisp'},
  {id:'ye-jun',givenHangul:'예준',givenRomanized:'Ye-jun',hanja:'藝俊',hanjaMeaning:'artistry + talent',pronunciation:'yeh-joon',vibes:['bright','elegant'],sound:'balanced'},
  {id:'eun-u',givenHangul:'은우',givenRomanized:'Eun-u',hanja:'恩祐',hanjaMeaning:'grace + support',pronunciation:'uhn-oo',vibes:['gentle','elegant'],sound:'soft'},
  {id:'seo-jin',givenHangul:'서진',givenRomanized:'Seo-jin',hanja:'瑞眞',hanjaMeaning:'auspicious + true',pronunciation:'suh-jin',vibes:['modern','elegant'],sound:'crisp'},
  {id:'da-hyeon',givenHangul:'다현',givenRomanized:'Da-hyeon',hanja:'多賢',hanjaMeaning:'abundant + virtuous',pronunciation:'dah-hyun',vibes:['bright','gentle'],sound:'balanced'},
  {id:'jeong-u',givenHangul:'정우',givenRomanized:'Jeong-u',hanja:'正祐',hanjaMeaning:'upright + support',pronunciation:'jung-oo',vibes:['strong','elegant'],sound:'crisp'},
  {id:'seon-u',givenHangul:'선우',givenRomanized:'Seon-u',hanja:'善祐',hanjaMeaning:'goodness + support',pronunciation:'sun-oo',vibes:['gentle','bright'],sound:'soft'},
  {id:'tae-yun',givenHangul:'태윤',givenRomanized:'Tae-yun',hanja:'泰潤',hanjaMeaning:'calm strength + enrichment',pronunciation:'teh-yoon',vibes:['strong','elegant'],sound:'balanced'},
  {id:'yeon-u',givenHangul:'연우',givenRomanized:'Yeon-u',hanja:'延祐',hanjaMeaning:'continuity + support',pronunciation:'yun-oo',vibes:['gentle','modern'],sound:'soft'},
  {id:'jae-hyeon',givenHangul:'재현',givenRomanized:'Jae-hyeon',hanja:'才賢',hanjaMeaning:'talent + virtue',pronunciation:'jeh-hyun',vibes:['strong','modern'],sound:'crisp'},
  {id:'yu-hyeon',givenHangul:'유현',givenRomanized:'Yu-hyeon',hanja:'裕賢',hanjaMeaning:'abundance + virtue',pronunciation:'yoo-hyun',vibes:['elegant','modern'],sound:'soft'},
  {id:'ha-jun',givenHangul:'하준',givenRomanized:'Ha-jun',hanja:'河俊',hanjaMeaning:'river + talent',pronunciation:'hah-joon',vibes:['bright','strong'],sound:'crisp'},
  {id:'si-u',givenHangul:'시우',givenRomanized:'Si-u',hanja:'始祐',hanjaMeaning:'beginning + support',pronunciation:'shee-oo',vibes:['bright','modern'],sound:'soft'},
];

function hashSeed(value: string): number { let hash=2166136261; for(let i=0;i<value.length;i+=1){hash^=value.charCodeAt(i);hash=Math.imul(hash,16777619);} return hash>>>0; }

export function generateKoreanNames(input: KoreanNameInput, limit=6): KoreanNameCandidate[] {
  if(!['gentle','elegant','bright','strong','modern'].includes(input.vibe)) throw new RangeError('Unsupported naming vibe.');
  if(!['soft','crisp','balanced'].includes(input.sound)) throw new RangeError('Unsupported sound preference.');
  if(!['none','kim','lee','park','choi','jeong'].includes(input.surname)) throw new RangeError('Unsupported surname.');
  const count=Math.max(1,Math.min(12,Math.trunc(limit)));
  const seed=hashSeed(`${input.vibe}|${input.sound}|${input.surname}|${(input.seed??'').slice(0,80)}`);
  const ranked=GIVEN_NAMES.map((name,index)=>{let score=0;if(name.vibes.includes(input.vibe))score+=6;if(name.sound===input.sound)score+=4;if(name.vibes.includes('modern'))score+=1;score+=((seed+index*2654435761)>>>0)/0xffffffff;return{name,score};}).sort((a,b)=>b.score-a.score||a.name.id.localeCompare(b.name.id));
  const surname=input.surname==='none'?undefined:SURNAMES[input.surname];
  return ranked.slice(0,count).map(({name})=>({...name,surnameHangul:surname?.hangul,surnameRomanized:surname?.romanized,fullHangul:surname?`${surname.hangul}${name.givenHangul}`:name.givenHangul,fullRomanized:surname?`${surname.romanized} ${name.givenRomanized}`:name.givenRomanized,hanja:surname?`${surname.hanja}${name.hanja}`:name.hanja}));
}
export function getNamingCatalogSize(): number {return GIVEN_NAMES.length;}
