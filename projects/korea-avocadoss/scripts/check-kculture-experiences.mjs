import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {existsSync,readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import ts from 'typescript';

const here=path.dirname(fileURLToPath(import.meta.url));
const projectRoot=path.join(here,'..');
const cache=new Map();
function loadTs(relativePath){
 const fullPath=path.resolve(projectRoot,relativePath);if(cache.has(fullPath))return cache.get(fullPath);
 const source=readFileSync(fullPath,'utf8');
 const transpiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,strict:true},fileName:fullPath,reportDiagnostics:true});
 const errors=(transpiled.diagnostics??[]).filter(x=>x.category===ts.DiagnosticCategory.Error);assert.equal(errors.length,0,`Transpile error in ${relativePath}`);
 const runtime={exports:{}};cache.set(fullPath,runtime.exports);const baseRequire=createRequire(fullPath);
 const customRequire=(specifier)=>{if(specifier.startsWith('.')){const candidate=path.resolve(path.dirname(fullPath),specifier.endsWith('.ts')?specifier:`${specifier}.ts`);if(existsSync(candidate))return loadTs(path.relative(projectRoot,candidate));}return baseRequire(specifier);};
 new Function('exports','module','require','__filename','__dirname',transpiled.outputText)(runtime.exports,runtime,customRequire,fullPath,path.dirname(fullPath));cache.set(fullPath,runtime.exports);return runtime.exports;
}

const saju=loadTs('src/lib/saju/experience.ts');
const naming=loadTs('src/lib/naming/korean-name-generator.ts');
assert.deepEqual(saju.dayPillarForGregorianDate(2000,1,7),{stem:'甲',branch:'子'},'2000-01-07 trusted day pillar');
const officialLichun=Date.parse('2024-02-04T08:27:00Z');
assert.ok(Math.abs(saju.approximateSolarTermInstantMs(2024,2)-officialLichun)<=30*60*1000,'LiChun approximation must stay inside the explicit 30-minute safety band');

const exact=saju.calculateSajuExperience({year:2000,month:1,day:7,timeZone:'Asia/Seoul',time:{mode:'exact',hour:16,minute:0}});
assert.deepEqual(exact.pillars.year,{stem:'己',branch:'卯'});
assert.deepEqual(exact.pillars.month,{stem:'丁',branch:'丑'});
assert.deepEqual(exact.pillars.day,{stem:'甲',branch:'子'});
assert.deepEqual(exact.pillars.hour,{stem:'壬',branch:'申'});
assert.equal(exact.scope,'four-pillars');

const unknown=saju.calculateSajuExperience({year:2000,month:1,day:7,timeZone:'Asia/Seoul',time:{mode:'unknown'}});
assert.equal(unknown.pillars.hour,undefined,'unknown birth time must never get a guessed hour');
assert.equal(unknown.candidates.hour.length,12,'unknown birth time keeps all 12 double-hour candidates');

const boundary=saju.calculateSajuExperience({year:2024,month:2,day:4,timeZone:'Asia/Seoul',time:{mode:'exact',hour:17,minute:27}});
assert.equal(boundary.scope,'boundary-uncertain','official LiChun boundary minute must not be presented as precise with an approximate solver');
assert.ok(boundary.candidates.year.length>=2,'LiChun boundary exposes both year-pillar candidates');

assert.ok(naming.getNamingCatalogSize()>=24,'Naming Studio needs a meaningful curated catalog');
const input={vibe:'modern',sound:'balanced',surname:'kim',seed:'ocean'};
const namesA=naming.generateKoreanNames(input,6);const namesB=naming.generateKoreanNames(input,6);
assert.equal(namesA.length,6);assert.deepEqual(namesA,namesB,'same naming input must be deterministic');
assert.equal(new Set(namesA.map(x=>x.fullHangul)).size,6,'name ideas must be distinct');

for(const required of ['src/app/[locale]/culture/page.tsx','src/app/[locale]/culture/saju/page.tsx','src/app/[locale]/culture/naming/page.tsx','src/features/culture/SajuExperience.tsx','src/features/culture/NamingStudio.tsx'])assert.ok(existsSync(path.join(projectRoot,required)),`${required} must exist`);
const layout=readFileSync(path.join(projectRoot,'src/app/[locale]/layout.tsx'),'utf8');
const cultureHub=readFileSync(path.join(projectRoot,'src/app/[locale]/culture/page.tsx'),'utf8');
assert.match(layout,/href="\/culture"/,'primary navigation must expose the K-Culture hub');
assert.match(cultureHub,/href="\/culture\/saju"/,'K-Culture hub must link to Saju');
assert.match(cultureHub,/href="\/culture\/naming"/,'K-Culture hub must link to Naming Studio');
assert.doesNotMatch(layout,/stitchDisabledNav[^\n]+\{shell\.naming\}/,'Naming Studio must not remain a disabled nav placeholder');
console.log('K-Culture experience checks passed: real Saju base pillars, unknown-time safety, boundary safety, deterministic Naming Studio, and hub-linked live routes.');
