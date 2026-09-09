export type ColorUploadErrorCode='unsupportedType'|'tooLarge'|'tooSmall'|'tooManyPixels'|'decodeFailed';

export class ColorUploadError extends Error{
 constructor(public readonly code:ColorUploadErrorCode){super(code);this.name='ColorUploadError';}
}

export const COLOR_UPLOAD_LIMITS={
 maxBytes:12*1024*1024,
 minWidth:240,
 minHeight:240,
 maxPixels:36_000_000,
 maxProcessingEdge:1280,
} as const;

export type PreparedColorUpload={
 width:number;
 height:number;
 blob:Blob;
};

const SUPPORTED_TYPES=new Set(['image/jpeg','image/png','image/webp']);

function canvasToBlob(canvas:HTMLCanvasElement,type:string):Promise<Blob>{
 return new Promise((resolve,reject)=>{
  canvas.toBlob((blob)=>blob?resolve(blob):reject(new ColorUploadError('decodeFailed')),type,type==='image/png'?undefined:0.92);
 });
}

export async function validateColorUpload(file:File):Promise<PreparedColorUpload>{
 if(!SUPPORTED_TYPES.has(file.type))throw new ColorUploadError('unsupportedType');
 if(file.size<=0||file.size>COLOR_UPLOAD_LIMITS.maxBytes)throw new ColorUploadError('tooLarge');
 let bitmap:ImageBitmap|undefined;
 try{
  // Make orientation handling explicit for camera photos, then normalize once into a bounded,
  // metadata-free browser-local blob. The original full-resolution File is not retained by the UI.
  bitmap=await createImageBitmap(file,{imageOrientation:'from-image'});
  const {width,height}=bitmap;
  if(width<COLOR_UPLOAD_LIMITS.minWidth||height<COLOR_UPLOAD_LIMITS.minHeight)throw new ColorUploadError('tooSmall');
  if(width*height>COLOR_UPLOAD_LIMITS.maxPixels)throw new ColorUploadError('tooManyPixels');

  const scale=Math.min(1,COLOR_UPLOAD_LIMITS.maxProcessingEdge/Math.max(width,height));
  const targetWidth=Math.max(1,Math.round(width*scale));
  const targetHeight=Math.max(1,Math.round(height*scale));
  const canvas=document.createElement('canvas');
  canvas.width=targetWidth;canvas.height=targetHeight;
  const context=canvas.getContext('2d');
  if(!context)throw new ColorUploadError('decodeFailed');
  if(file.type==='image/png'){
   context.fillStyle='#fff';
   context.fillRect(0,0,targetWidth,targetHeight);
  }
  context.drawImage(bitmap,0,0,targetWidth,targetHeight);
  const outputType=file.type==='image/png'?'image/png':file.type==='image/webp'?'image/webp':'image/jpeg';
  const blob=await canvasToBlob(canvas,outputType);
  return {width,height,blob};
 }catch(error){
  if(error instanceof ColorUploadError)throw error;
  throw new ColorUploadError('decodeFailed');
 }finally{
  bitmap?.close();
 }
}
