import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const requiredFiles=[
 'src/app/[locale]/page.tsx',
 'src/app/[locale]/layout.tsx',
 'src/app/[locale]/loading.tsx',
 'src/app/[locale]/error.tsx',
 'src/app/[locale]/not-found.tsx',
 'src/app/[locale]/style/page.tsx',
 'src/app/[locale]/color/page.tsx',
 'src/app/[locale]/hanbok/page.tsx',
 'src/app/[locale]/culture/page.tsx',
 'src/app/[locale]/culture/saju/page.tsx',
 'src/app/[locale]/culture/naming/page.tsx',
 'src/app/[locale]/explore/gyeongbokgung/page.tsx',
 'src/app/[locale]/explore/food/page.tsx',
 'src/app/[locale]/explore/nearby/page.tsx',
 'src/app/[locale]/about/page.tsx',
 'src/app/[locale]/contact/page.tsx',
 'src/app/[locale]/privacy/page.tsx',
 'src/app/[locale]/terms/page.tsx',
 'src/app/robots.ts',
 'src/app/sitemap.ts',
];

const failures=[];
for(const relative of requiredFiles){
 const absolute=path.join(root,relative);
 if(!fs.existsSync(absolute))failures.push(`Missing beta surface: ${relative}`);
}

function read(relative){return fs.readFileSync(path.join(root,relative),'utf8');}
function requireText(source,label,needles){for(const needle of needles){if(!source.includes(needle))failures.push(`${label} missing contract: ${needle}`);}}

if(!failures.length){
 const layout=read('src/app/[locale]/layout.tsx');
 requireText(layout,'localized shell',['QuickHelp','LanguageSwitcher','/explore/gyeongbokgung','/style','/color','/hanbok','/culture','/about','/contact','/privacy','/terms','mobileBottomNav']);
 const mobile=layout.split('className="mobileBottomNav"')[1]?.split('</nav>')[0]??'';
 const mobileItems=(mobile.match(/className="mobileNavItem"/g)??[]).length;
 if(mobileItems!==5)failures.push(`Mobile beta navigation should expose 5 primary destinations, found ${mobileItems}`);
 if(mobile.includes('href="/credits"'))failures.push('Credits must not occupy a primary mobile beta slot while real checkout is disabled');
 if(!layout.includes("beta:'BETA'"))failures.push('Visible beta status is missing from the localized shell');

 const home=read('src/app/[locale]/page.tsx');
 requireText(home,'home',['/style','/color','/hanbok','/culture/saju','/culture/naming','/explore/gyeongbokgung','#quick-help']);

 const legal=read('src/features/legal/LegalPage.tsx');
 requireText(legal,'trust surface',['privacy','terms','contact','Real checkout is currently disabled','Travel information']);

 const robots=read('src/app/robots.ts');
 const sitemap=read('src/app/sitemap.ts');
 requireText(robots,'robots',['robots']);
 requireText(sitemap,'sitemap',['sitemap','P0_LOCALES','PUBLIC_LOCALE_PATHS']);
}

if(failures.length){
 console.error('Beta surface gate failed:');
 for(const failure of failures)console.error(`- ${failure}`);
 process.exit(1);
}
console.log(`Beta surface gate passed: ${requiredFiles.length} required surfaces + shell/trust/SEO contracts.`);
