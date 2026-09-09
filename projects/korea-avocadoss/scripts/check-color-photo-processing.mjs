import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=(p)=>readFileSync(path.join(root,p),'utf8');
const upload=read('src/features/color/validate-color-upload.ts');
const scanner=read('src/features/color/color-scanner.tsx');
const analyzer=read('src/features/color/analyze-visible-tone.ts');

const edgeMatch=upload.match(/maxProcessingEdge:(\d+)/);
assert.ok(edgeMatch,'Personal Color upload contract must define a bounded processing edge.');
const maxProcessingEdge=Number(edgeMatch[1]);
assert.ok(maxProcessingEdge>=720&&maxProcessingEdge<=1600,'Personal Color working image must stay useful while remaining mobile-memory bounded.');
assert.match(upload,/createImageBitmap\(file,\{imageOrientation:'from-image'\}\)/,'Camera photo orientation handling must be explicit before normalization.');
assert.match(upload,/Math\.min\(1,COLOR_UPLOAD_LIMITS\.maxProcessingEdge\/Math\.max\(width,height\)\)/,'Upload normalization must preserve aspect ratio while bounding the longest edge.');
assert.match(upload,/canvasToBlob\(canvas,outputType\)/,'Validated photos must be normalized into a browser-local Blob before the UI retains them.');
assert.match(upload,/bitmap\?\.close\(\)/,'Full-resolution upload bitmap must be released after normalization.');
assert.doesNotMatch(upload,/fetch\s*\(/,'Photo preparation must remain browser-local.');

assert.match(scanner,/useState<Blob \| null>/,'The scanner must retain only the normalized Blob, not the original full-resolution File.');
assert.match(scanner,/const prepared=await validateColorUpload\(selected\)/,'The scanner must wait for bounded photo preparation before retaining an image.');
assert.match(scanner,/setFile\(prepared\.blob\)/,'Analysis must consume the bounded prepared Blob.');
assert.match(scanner,/URL\.createObjectURL\(prepared\.blob\)/,'Preview must use the same bounded prepared Blob rather than re-decoding the original File.');
assert.doesNotMatch(scanner,/setFile\(selected\)/,'The original full-resolution File must not remain in scanner state.');
assert.doesNotMatch(scanner,/URL\.createObjectURL\(selected\)/,'The preview must not retain the original full-resolution File.');

assert.match(analyzer,/analyzeVisibleTone\(source:Blob\)/,'Visible-tone analysis must accept the normalized Blob contract.');
assert.match(analyzer,/createImageBitmap\(source,\{imageOrientation:'from-image'\}\)/,'Visible-tone analysis must preserve explicit browser-native orientation handling.');
assert.doesNotMatch(analyzer,/fetch\s*\(/,'Visible-tone analysis must remain zero-API.');

console.log(`Personal Color photo processing contract passed: explicit camera orientation, one full-resolution normalization step, and <=${maxProcessingEdge}px retained working image.`);
