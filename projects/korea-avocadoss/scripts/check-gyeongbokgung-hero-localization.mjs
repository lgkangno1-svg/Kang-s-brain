import fs from 'node:fs';

const source=fs.readFileSync(new URL('../src/app/[locale]/explore/gyeongbokgung/page.tsx',import.meta.url),'utf8');
const required=[
 ['en',"en:'Gyeonghoeru Pavilion at Gyeongbokgung Palace'"],
 ['zh-CN',"'zh-CN':'景福宫庆会楼'"],
 ['ja',"ja:'景福宮の慶会楼'"],
 ['zh-TW',"'zh-TW':'景福宮慶會樓'"],
 ['vi',"vi:'Lầu Gyeonghoeru tại Cung điện Gyeongbokgung'"],
 ['th',"th:'ศาลาคยองฮเวรูในพระราชวังคยองบกกุง'"]
];
for(const [locale,signal] of required){
 if(!source.includes(signal))throw new Error(`Missing localized Gyeongbokgung hero alt for ${locale}`);
}
if(!source.includes('const safeHeroAlt=heroAlt[locale]??heroAlt.en;'))throw new Error('Gyeongbokgung hero alt must fail safely to English');
if(!source.includes('alt={safeHeroAlt}'))throw new Error('Gyeongbokgung hero image must render the localized alt');
if(source.includes('alt="Gyeonghoeru Pavilion at Gyeongbokgung Palace"'))throw new Error('Gyeongbokgung hero image must not hard-code English alt text');
console.log('gyeongbokgung hero localization contracts passed');
