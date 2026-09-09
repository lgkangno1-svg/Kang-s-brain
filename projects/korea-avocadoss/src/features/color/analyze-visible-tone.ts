import {findLikelyFaceRegion,isLikelySkinPixel,trimPixelsByLuminance,type PixelRgb} from './skin-region';

export type Undertone='warm'|'neutral'|'cool';
export type Depth='light'|'medium'|'deep';
export type Contrast='soft'|'medium'|'high';
export type VisibleToneWarning='darkPhoto'|'overexposedPhoto'|'limitedPixels';
export type VisibleToneErrorCode='canvasUnavailable'|'insufficientPixels';

export class VisibleToneError extends Error{
  constructor(public readonly code:VisibleToneErrorCode){super(code);this.name='VisibleToneError';}
}

export type VisibleToneResult={undertone:Undertone;depth:Depth;contrast:Contrast;confidence:number;lightness:number;warnings:VisibleToneWarning[]};
type RGB=PixelRgb;
const clamp=(value:number,min:number,max:number)=>Math.min(max,Math.max(min,value));

function srgbToLinear(channel:number){const c=channel/255;return c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4;}
function rgbToLab({r,g,b}:RGB){
  const rl=srgbToLinear(r),gl=srgbToLinear(g),bl=srgbToLinear(b);
  const x=(rl*0.4124+gl*0.3576+bl*0.1805)/0.95047;
  const y=rl*0.2126+gl*0.7152+bl*0.0722;
  const z=(rl*0.0193+gl*0.1192+bl*0.9505)/1.08883;
  const f=(v:number)=>(v>0.008856?Math.cbrt(v):7.787*v+16/116);
  const fx=f(x),fy=f(y),fz=f(z);
  return{l:116*fy-16,a:500*(fx-fy),b:200*(fy-fz)};
}
function getStats(pixels:RGB[]){
  const robust=trimPixelsByLuminance(pixels);
  const totals=robust.reduce((acc,pixel)=>({r:acc.r+pixel.r,g:acc.g+pixel.g,b:acc.b+pixel.b}),{r:0,g:0,b:0});
  const average={r:totals.r/robust.length,g:totals.g/robust.length,b:totals.b/robust.length};
  const luminances=robust.map(({r,g,b})=>0.2126*r+0.7152*g+0.0722*b);
  const mean=luminances.reduce((sum,value)=>sum+value,0)/luminances.length;
  const variance=luminances.reduce((sum,value)=>sum+(value-mean)**2,0)/luminances.length;
  return{average,luminanceStdDev:Math.sqrt(variance),robustCount:robust.length};
}

export async function analyzeVisibleTone(file:File):Promise<VisibleToneResult>{
  let bitmap:ImageBitmap|undefined;
  try{
    bitmap=await createImageBitmap(file);
    const detectionMax=220;
    const scale=Math.min(1,detectionMax/Math.max(bitmap.width,bitmap.height));
    const detectionWidth=Math.max(32,Math.round(bitmap.width*scale));
    const detectionHeight=Math.max(32,Math.round(bitmap.height*scale));
    const detectionCanvas=document.createElement('canvas');
    detectionCanvas.width=detectionWidth;detectionCanvas.height=detectionHeight;
    const detectionContext=detectionCanvas.getContext('2d',{willReadFrequently:true});
    if(!detectionContext)throw new VisibleToneError('canvasUnavailable');
    detectionContext.drawImage(bitmap,0,0,detectionWidth,detectionHeight);
    const detectionData=detectionContext.getImageData(0,0,detectionWidth,detectionHeight);
    const detectedRegion=findLikelyFaceRegion(detectionData.data,detectionWidth,detectionHeight);

    const sampleCanvas=document.createElement('canvas');
    const width=180,height=180;sampleCanvas.width=width;sampleCanvas.height=height;
    const context=sampleCanvas.getContext('2d',{willReadFrequently:true});
    if(!context)throw new VisibleToneError('canvasUnavailable');

    if(detectedRegion){
      const sx=detectedRegion.x/detectionWidth*bitmap.width;
      const sy=detectedRegion.y/detectionHeight*bitmap.height;
      const sw=detectedRegion.width/detectionWidth*bitmap.width;
      const sh=detectedRegion.height/detectionHeight*bitmap.height;
      context.drawImage(bitmap,sx,sy,sw,sh,0,0,width,height);
    }else{
      // Conservative fallback for portraits where the colour mask cannot form a stable component.
      const sourceWidth=bitmap.width*0.5,sourceHeight=bitmap.height*0.48;
      const sourceX=bitmap.width*0.25,sourceY=bitmap.height*0.12;
      context.drawImage(bitmap,sourceX,sourceY,sourceWidth,sourceHeight,0,0,width,height);
    }

    const data=context.getImageData(0,0,width,height).data;
    const candidates:RGB[]=[],fallback:RGB[]=[];
    for(let index=0;index<data.length;index+=16){
      const r=data[index],g=data[index+1],b=data[index+2];
      const max=Math.max(r,g,b),min=Math.min(r,g,b),brightness=(r+g+b)/3;
      if(brightness>38&&brightness<242&&max-min<120)fallback.push({r,g,b});
      if(isLikelySkinPixel(r,g,b))candidates.push({r,g,b});
    }
    const pixels=candidates.length>=120?candidates:fallback;
    if(pixels.length<80)throw new VisibleToneError('insufficientPixels');
    const {average,luminanceStdDev,robustCount}=getStats(pixels);
    const lab=rgbToLab(average);

    // Styling guidance only: visible colour tendency under the captured light, not identity or ethnicity inference.
    const warmthIndex=lab.b-lab.a*0.22;
    let undertone:Undertone='neutral';
    if(warmthIndex>=10.5)undertone='warm';
    if(warmthIndex<=6.2)undertone='cool';
    let depth:Depth='medium';
    if(lab.l>=70)depth='light';
    if(lab.l<=47)depth='deep';
    let contrast:Contrast='medium';
    if(luminanceStdDev<=24)contrast='soft';
    if(luminanceStdDev>=42)contrast='high';

    const sampledPixels=Math.max(1,data.length/16);
    const skinRatio=candidates.length/sampledPixels;
    const warnings:VisibleToneWarning[]=[];
    if(lab.l<35)warnings.push('darkPhoto');
    if(lab.l>86)warnings.push('overexposedPhoto');
    if(skinRatio<0.08||!detectedRegion||robustCount<120)warnings.push('limitedPixels');
    const regionBonus=detectedRegion?0.08:0;
    const confidence=clamp(0.38+regionBonus+skinRatio*1.7-warnings.length*0.06,0.34,0.88);
    return{undertone,depth,contrast,confidence,lightness:Math.round(lab.l),warnings};
  }finally{
    bitmap?.close();
  }
}
