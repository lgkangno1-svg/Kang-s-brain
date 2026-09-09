import {decodeColorImage} from './decode-color-image';

export type ColorUploadErrorCode='unsupportedType'|'tooLarge'|'tooSmall'|'tooManyPixels'|'decodeFailed';

export class ColorUploadError extends Error{
 constructor(public readonly code:ColorUploadErrorCode){super(code);this.name='ColorUploadError';}
}

export const COLOR_UPLOAD_LIMITS={
 maxBytes:12*1024*1024,
 minWidth:240,
 minHeight:240,
 maxPixels:36_000_000,
} as const;

const SUPPORTED_TYPES=new Set(['image/jpeg','image/png','image/webp']);

export async function validateColorUpload(file:File):Promise<{width:number;height:number}>{
 if(!SUPPORTED_TYPES.has(file.type))throw new ColorUploadError('unsupportedType');
 if(file.size<=0||file.size>COLOR_UPLOAD_LIMITS.maxBytes)throw new ColorUploadError('tooLarge');
 let decoded:Awaited<ReturnType<typeof decodeColorImage>>|undefined;
 try{
  decoded=await decodeColorImage(file);
  const {width,height}=decoded;
  if(width<COLOR_UPLOAD_LIMITS.minWidth||height<COLOR_UPLOAD_LIMITS.minHeight)throw new ColorUploadError('tooSmall');
  if(width*height>COLOR_UPLOAD_LIMITS.maxPixels)throw new ColorUploadError('tooManyPixels');
  return {width,height};
 }catch(error){
  if(error instanceof ColorUploadError)throw error;
  throw new ColorUploadError('decodeFailed');
 }finally{
  decoded?.release();
 }
}
