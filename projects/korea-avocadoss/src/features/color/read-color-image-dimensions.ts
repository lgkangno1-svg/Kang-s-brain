export type ColorImageDimensions={width:number;height:number};

function ascii(bytes:Uint8Array,start:number,length:number){
 return String.fromCharCode(...bytes.subarray(start,start+length));
}

function readU16BE(bytes:Uint8Array,offset:number){return (bytes[offset]<<8)|bytes[offset+1];}
function readU16LE(bytes:Uint8Array,offset:number){return bytes[offset]|(bytes[offset+1]<<8);}
function readU24LE(bytes:Uint8Array,offset:number){return bytes[offset]|(bytes[offset+1]<<8)|(bytes[offset+2]<<16);}
function readU32BE(bytes:Uint8Array,offset:number){return ((bytes[offset]*0x1000000)+(bytes[offset+1]<<16)+(bytes[offset+2]<<8)+bytes[offset+3])>>>0;}

function readPng(bytes:Uint8Array):ColorImageDimensions|null{
 if(bytes.length<24)return null;
 const signature=[0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a];
 if(!signature.every((value,index)=>bytes[index]===value)||ascii(bytes,12,4)!=='IHDR')return null;
 const width=readU32BE(bytes,16),height=readU32BE(bytes,20);
 return width>0&&height>0?{width,height}:null;
}

const JPEG_SOF_MARKERS=new Set([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf]);
function readJpeg(bytes:Uint8Array):ColorImageDimensions|null{
 if(bytes.length<4||bytes[0]!==0xff||bytes[1]!==0xd8)return null;
 let offset=2;
 while(offset+3<bytes.length){
  while(offset<bytes.length&&bytes[offset]===0xff)offset++;
  if(offset>=bytes.length)return null;
  const marker=bytes[offset++];
  if(marker===0xd8||marker===0x01||(marker>=0xd0&&marker<=0xd9))continue;
  if(offset+1>=bytes.length)return null;
  const segmentLength=readU16BE(bytes,offset);
  if(segmentLength<2||offset+segmentLength>bytes.length)return null;
  if(JPEG_SOF_MARKERS.has(marker)){
   if(segmentLength<7)return null;
   const height=readU16BE(bytes,offset+3),width=readU16BE(bytes,offset+5);
   return width>0&&height>0?{width,height}:null;
  }
  offset+=segmentLength;
 }
 return null;
}

function readWebp(bytes:Uint8Array):ColorImageDimensions|null{
 if(bytes.length<30||ascii(bytes,0,4)!=='RIFF'||ascii(bytes,8,4)!=='WEBP')return null;
 const chunk=ascii(bytes,12,4);
 if(chunk==='VP8X'){
  const width=readU24LE(bytes,24)+1,height=readU24LE(bytes,27)+1;
  return width>0&&height>0?{width,height}:null;
 }
 if(chunk==='VP8 '){
  if(bytes[23]!==0x9d||bytes[24]!==0x01||bytes[25]!==0x2a)return null;
  const width=readU16LE(bytes,26)&0x3fff,height=readU16LE(bytes,28)&0x3fff;
  return width>0&&height>0?{width,height}:null;
 }
 if(chunk==='VP8L'){
  if(bytes[20]!==0x2f)return null;
  const b1=bytes[21],b2=bytes[22],b3=bytes[23],b4=bytes[24];
  const width=1+(((b2&0x3f)<<8)|b1);
  const height=1+(((b4&0x0f)<<10)|(b3<<2)|((b2&0xc0)>>6));
  return width>0&&height>0?{width,height}:null;
 }
 return null;
}

export async function readColorImageDimensions(file:File):Promise<ColorImageDimensions>{
 // Reading compressed bytes is deliberately bounded by the existing 12 MB upload cap.
 // It lets validation reject extreme pixel dimensions before allocating a full decoded bitmap.
 const bytes=new Uint8Array(await file.arrayBuffer());
 const dimensions=file.type==='image/jpeg'?readJpeg(bytes):file.type==='image/png'?readPng(bytes):file.type==='image/webp'?readWebp(bytes):null;
 if(!dimensions)throw new Error('invalidImageHeader');
 return dimensions;
}
