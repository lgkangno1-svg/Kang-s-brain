import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'..');
const gate=readFileSync(path.join(root,'src/features/color/color-consent-gate.tsx'),'utf8');
const page=readFileSync(path.join(root,'src/app/[locale]/color/page.tsx'),'utf8');

assert.match(page,/ColorConsentGate/,'Color route must render the consent gate rather than exposing the scanner immediately');
assert.match(gate,/if\(consented\) return <ColorScanner\/>/,'Color scanner must stay unmounted until the visitor explicitly continues');
assert.match(gate,/setConsented\(true\)/,'Consent gate must require an explicit visitor action');
assert.match(gate,/not uploaded|不会上传|アップロードされず|không được tải lên|ไม่ถูกอัปโหลด/,'P0 copy must explain that the photo is not uploaded');
assert.match(gate,/AI service|AI 服务|AI サービス|dịch vụ AI|บริการ AI/,'P0 copy must explain that the photo is not sent to AI');
assert.match(gate,/race, ethnicity, nationality, health or attractiveness|种族、族裔、国籍、健康状况或吸引力|人種、民族、国籍、健康状態、魅力度|chủng tộc, sắc tộc, quốc tịch, sức khỏe hoặc mức độ hấp dẫn|เชื้อชาติ ชาติพันธุ์ สัญชาติ สุขภาพ หรือความน่าดึงดูด/,'Consent copy must bound sensitive-trait inference');
assert.match(gate,/href="\/privacy"/,'Consent gate must link to the privacy notice');
assert.doesNotMatch(gate,/localStorage|sessionStorage|indexedDB|fetch\(|XMLHttpRequest/,'Consent state must remain ephemeral and must not add persistence or network transfer');
for (const locale of ['en','zh-CN','ja','zh-TW','vi','th']) {
  const quoted=`'${locale}':{title`;
  const unquoted=`${locale}:{title`;
  assert.ok(gate.includes(quoted)||gate.includes(unquoted),`Missing consent copy for ${locale}`);
}

console.log('Personal Color consent contracts passed: scanner is gated behind explicit, ephemeral, six-locale browser-local photo consent with privacy handoff.');
