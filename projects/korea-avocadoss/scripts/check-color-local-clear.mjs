import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'..');
const scanner=readFileSync(path.join(root,'src/features/color/color-scanner.tsx'),'utf8');

assert.match(scanner,/function clearLocalPhoto\(\)/,'Personal Color must provide an explicit local photo removal action');
assert.match(scanner,/URL\.revokeObjectURL\(photoUrl\)/,'Removing a Personal Color photo must revoke its object URL');
assert.match(scanner,/setFile\(null\)/,'Removing a Personal Color photo must release the File reference');
assert.match(scanner,/setPhotoUrl\(''\)/,'Removing a Personal Color photo must clear the displayed local photo');
assert.match(scanner,/setResult\(DEFAULT_RESULT\)/,'Removing a photo must also clear the derived local result');
assert.match(scanner,/setStatus\('idle'\)/,'Removing a photo must return the scanner to a recoverable idle state');
assert.match(scanner,/role="status" aria-live="polite"/,'Photo removal must be announced to assistive technology');
for (const locale of ['en','zh-CN','ja','zh-TW','vi','th']) {
  assert.ok(scanner.includes(locale === 'en' ? "en:{checking" : `'${locale}':{checking`) || scanner.includes(`${locale}:{checking`), `Missing clear-photo copy for ${locale}`);
}
assert.doesNotMatch(scanner,/localStorage|sessionStorage|indexedDB/i,'Personal Color photo/result removal must not introduce browser persistence');

console.log('Personal Color local-deletion contracts passed: visitor can revoke the photo, clear derived state, recover to idle, and receives an accessible status update.');
