import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import ts from 'typescript';

const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=readFileSync(path.join(root,'src/features/color/read-color-image-dimensions.ts'),'utf8');
const transpiled=ts.transpileModule(source,{
 compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022},
 fileName:'read-color-image-dimensions.ts'
}).outputText;
const moduleUrl=`data:text/javascript;base64,${Buffer.from(transpiled).toString('base64')}`;
const {readColorImageDimensions}=await import(moduleUrl);

const u16be=(value)=>[(value>>8)&0xff,value&0xff];
const u16le=(value)=>[value&0xff,(value>>8)&0xff];
const u32le=(value)=>[value&0xff,(value>>8)&0xff,(value>>16)&0xff,(value>>24)&0xff];
const segment=(marker,payload)=>[0xff,marker,...u16be(payload.length+2),...payload];

function exifPayload(orientation){
 // Exif header + little-endian TIFF with one Orientation (0x0112) SHORT entry.
 return [
  0x45,0x78,0x69,0x66,0x00,0x00,
  0x49,0x49,0x2a,0x00,...u32le(8),
  ...u16le(1),
  0x12,0x01,0x03,0x00,...u32le(1),...u16le(orientation),0x00,0x00,
  ...u32le(0)
 ];
}

function sof0Payload(width,height){
 return [
  0x08,...u16be(height),...u16be(width),0x03,
  0x01,0x11,0x00,
  0x02,0x11,0x00,
  0x03,0x11,0x00
 ];
}

function cameraJpeg({width,height,orientation}){
 const bytes=new Uint8Array([
  0xff,0xd8,
  ...segment(0xe1,exifPayload(orientation)),
  ...segment(0xc0,sof0Payload(width,height)),
  0xff,0xd9
 ]);
 return {
  type:'image/jpeg',
  async arrayBuffer(){return bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength);}
 };
}

for(const orientation of [1,3,6,8]){
 const file=cameraJpeg({width:4032,height:3024,orientation});
 const dimensions=await readColorImageDimensions(file);
 assert.deepEqual(dimensions,{width:4032,height:3024},`EXIF orientation ${orientation} must not break camera-JPEG header preflight`);
}

const portraitEncoded=cameraJpeg({width:3024,height:4032,orientation:6});
assert.deepEqual(
 await readColorImageDimensions(portraitEncoded),
 {width:3024,height:4032},
 'Preflight must preserve encoded pixel dimensions; display orientation is applied by the browser decoder after validation'
);

console.log('Personal Color rotated JPEG fixture passed: EXIF-bearing camera JPEG headers survive bounded local preflight for orientations 1/3/6/8.');
