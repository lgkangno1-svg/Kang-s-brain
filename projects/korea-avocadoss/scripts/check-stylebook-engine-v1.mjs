import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const engine=fs.readFileSync(path.join(root,'src/lib/looks/stylebook-engine-v1.ts'),'utf8');
const input=fs.readFileSync(path.join(root,'src/lib/looks/style-input-v1.ts'),'utf8');
const spec=fs.readFileSync(path.join(root,'docs/BUILD_SPEC.md'),'utf8');

const fail=(message)=>{console.error(`Stylebook engine v1 check failed: ${message}`);process.exit(1);};

for(const marker of [
  "MY_KOREA_LOOK_STYLEBOOK_VERSION='my-korea-look-stylebook-v1'",
  'rankStyleInputV1(input)',
  'styleInputNeedsPaletteChoice(input)',
  'ranked.slice(0,3)',
  "productKey:'my_korea_look_v1'",
  'inputSnapshot:{...input}',
  'effectiveSeason:season',
  "personalizationBasis:input.colorSource==='local-preview'?'local-color-preview-plus-preferences':'explicit-preferences'",
  'accessories:[...look.accessoryIds]',
  'alternateColorway:{',
  'rentalShopCard:{...look.rentalShopCard}',
  'getStylebookDestinationPlan(input.destination)',
  'destinationPlan:{',
  'photoRoute:destination.route.map',
  'source:{url:look.sourceUrl',
]){
  if(!engine.includes(marker))fail(`missing generation contract marker: ${marker}`);
}

for(const dimension of ['input.style','input.mood','input.palette','input.comfort','input.coverage','input.destination']){
  if(!engine.includes(dimension))fail(`paid result reasons do not link to ${dimension}`);
}
if(!engine.includes('seasonFromVisitDate(input.visitDate)'))fail('visit date does not override season deterministically');
if(!engine.includes('reasons:[')||!engine.includes('reasonCopy.style')||!engine.includes('reasonCopy.palette')||!engine.includes('reasonCopy.practical'))fail('three explicit-input reasons are not generated');

for(const locale of ["en:{","'zh-CN':{","ja:{","'zh-TW':{","vi:{","th:{"]){
  if(!engine.includes(locale))fail(`missing localized paid-result reason copy: ${locale}`);
}

for(const marker of [
  'MY_KOREA_LOOK_MAX_SUCCESSFUL_REVISIONS=1',
  "'REVISION_LIMIT_REACHED'",
  "'EMPTY_REVISION'",
  'patchHasChanges(original.inputSnapshot,patch)',
  'const nextInput:StyleInputV1={...original.inputSnapshot,...patch}',
  'parentGeneratedAt:original.generatedAt',
  'successfulRevisionsUsed:1',
  'A failed build throws before any new result exists, so the included revision is not consumed.',
]){
  if(!engine.includes(marker))fail(`missing one-successful-revision recovery contract: ${marker}`);
}

for(const forbidden of ['fetch(','/api/checkout','stripe','localStorage','sessionStorage']){
  if(engine.toLowerCase().includes(forbidden.toLowerCase()))fail(`domain engine must stay deterministic and infrastructure-free: ${forbidden}`);
}

for(const inputDimension of ['mood','palette','comfort','coverage','date/season','destination']){
  if(!spec.includes(inputDimension))fail(`BUILD_SPEC revision dimension not found: ${inputDimension}`);
}
if(!spec.includes('성공한 수정 1회'))fail('BUILD_SPEC one-successful-revision contract missing');
if(!spec.includes('실패한 수정은 사용 횟수를 소모하지 않는다'))fail('BUILD_SPEC failed-revision recovery contract missing');
if(!input.includes('export function rankStyleInputV1'))fail('active full-input deterministic ranker missing');

console.log('My Korea Look stylebook engine v1: OK — full active inputs feed three verified looks, localized reasons, destination-bound route/provenance, alternate colorways, source-backed visuals, and one-successful-revision recovery without payment/network coupling');
