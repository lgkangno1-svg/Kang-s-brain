export type DecodedColorImage={
 source:CanvasImageSource;
 width:number;
 height:number;
 release:()=>void;
};

function decodeWithImageElement(file:File):Promise<DecodedColorImage>{
 return new Promise((resolve,reject)=>{
  const url=URL.createObjectURL(file);
  const image=new Image();
  let settled=false;
  const release=()=>{
   if(settled)return;
   settled=true;
   image.onload=null;
   image.onerror=null;
   URL.revokeObjectURL(url);
  };
  image.onload=()=>{
   const width=image.naturalWidth;
   const height=image.naturalHeight;
   if(width<=0||height<=0){release();reject(new Error('decodeFailed'));return;}
   // Keep the object URL alive until drawing has finished. Browsers apply image
   // orientation while decoding <img>, which is the compatibility path for
   // older/mobile engines without a reliable createImageBitmap implementation.
   resolve({source:image,width,height,release});
  };
  image.onerror=()=>{release();reject(new Error('decodeFailed'));};
  image.decoding='async';
  image.src=url;
 });
}

export async function decodeColorImage(file:File):Promise<DecodedColorImage>{
 if(typeof createImageBitmap==='function'){
  try{
   const bitmap=await createImageBitmap(file,{imageOrientation:'from-image'});
   return {source:bitmap,width:bitmap.width,height:bitmap.height,release:()=>bitmap.close()};
  }catch{
   // Some otherwise capable mobile browsers reject ImageBitmap decoding for
   // specific files or options. Fall through to the standards-based <img>
   // decoder so a recoverable photo does not become a dead-end.
  }
 }
 return decodeWithImageElement(file);
}
