import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=(p)=>readFileSync(path.join(root,p),'utf8');

const decoder=read('src/features/color/decode-color-image.ts');
const validation=read('src/features/color/validate-color-upload.ts');
const analysis=read('src/features/color/analyze-visible-tone.ts');

assert.match(decoder,/typeof createImageBitmap==='function'/,'Personal Color decoder must feature-detect createImageBitmap');
assert.match(decoder,/imageOrientation:'from-image'/,'Primary decoder must request source image orientation');
assert.match(decoder,/return decodeWithImageElement\(file\)/,'Decoder must fall back to the browser image element path');
assert.match(decoder,/URL\.createObjectURL\(file\)/,'Fallback decoder must stay browser-local');
assert.match(decoder,/URL\.revokeObjectURL\(url\)/,'Fallback decoder must release object URLs');
assert.match(decoder,/image\.naturalWidth/,'Fallback decoder must validate decoded dimensions');
assert.doesNotMatch(decoder,/fetch\s*\(/,'Personal Color decode recovery must not add a remote image path');

assert.match(validation,/decodeColorImage\(file\)/,'Upload validation must use the shared resilient decoder');
assert.match(validation,/decoded\?\.release\(\)/,'Upload validation must release decoded image resources');
assert.match(analysis,/decodeColorImage\(file\)/,'Visible-tone analysis must use the same resilient decoder');
assert.match(analysis,/decoded\?\.release\(\)/,'Visible-tone analysis must release decoded image resources');
assert.doesNotMatch(validation,/createImageBitmap\(file\)/,'Validation must not bypass the compatibility decoder');
assert.doesNotMatch(analysis,/createImageBitmap\(file\)/,'Analysis must not bypass the compatibility decoder');

console.log('Personal Color decode recovery contracts passed: orientation-aware ImageBitmap first, local image-element fallback, and resource cleanup.');
