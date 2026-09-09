import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=(p)=>readFileSync(path.join(root,p),'utf8');

const decoder=read('src/features/color/decode-color-image.ts');
const dimensions=read('src/features/color/read-color-image-dimensions.ts');
const validation=read('src/features/color/validate-color-upload.ts');
const analysis=read('src/features/color/analyze-visible-tone.ts');

assert.match(decoder,/typeof createImageBitmap==='function'/,'Personal Color decoder must feature-detect createImageBitmap');
assert.match(decoder,/imageOrientation:'from-image'/,'Primary decoder must request source image orientation');
assert.match(decoder,/return decodeWithImageElement\(file\)/,'Decoder must fall back to the browser image element path');
assert.match(decoder,/URL\.createObjectURL\(file\)/,'Fallback decoder must stay browser-local');
assert.match(decoder,/URL\.revokeObjectURL\(url\)/,'Fallback decoder must release object URLs');
assert.match(decoder,/image\.naturalWidth/,'Fallback decoder must validate decoded dimensions');
assert.doesNotMatch(decoder,/fetch\s*\(/,'Personal Color decode recovery must not add a remote image path');

assert.match(dimensions,/file\.arrayBuffer\(\)/,'Dimension preflight must inspect compressed browser-local bytes');
assert.match(dimensions,/JPEG_SOF_MARKERS/,'Dimension preflight must recognize JPEG frame headers');
assert.match(dimensions,/IHDR/,'Dimension preflight must recognize PNG IHDR dimensions');
assert.match(dimensions,/VP8X/,'Dimension preflight must recognize extended WebP dimensions');
assert.match(dimensions,/VP8L/,'Dimension preflight must recognize lossless WebP dimensions');
assert.match(dimensions,/VP8 /,'Dimension preflight must recognize lossy WebP dimensions');
assert.doesNotMatch(dimensions,/createImageBitmap|new Image\s*\(|fetch\s*\(/,'Dimension preflight must not decode pixels or use a network path');

assert.match(validation,/readColorImageDimensions\(file\)/,'Upload validation must inspect dimensions before any pixel decode');
assert.doesNotMatch(validation,/decodeColorImage|createImageBitmap|new Image\s*\(/,'Upload validation must not allocate a decoded bitmap just to enforce pixel caps');
assert.match(validation,/width\*height>COLOR_UPLOAD_LIMITS\.maxPixels/,'Pixel cap must be enforced against header dimensions');
assert.match(analysis,/decodeColorImage\(file\)/,'Accepted photos must still use the resilient orientation-aware decoder for analysis');
assert.match(analysis,/decoded\?\.release\(\)/,'Visible-tone analysis must release decoded image resources');
assert.doesNotMatch(analysis,/createImageBitmap\(file\)/,'Analysis must not bypass the compatibility decoder');

console.log('Personal Color decode recovery contracts passed: header-first pixel-cap preflight, orientation-aware decode fallback, local-only processing, and resource cleanup.');
