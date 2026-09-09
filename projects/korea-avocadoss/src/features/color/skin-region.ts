export type PixelRgb={r:number;g:number;b:number};
export type PixelRegion={x:number;y:number;width:number;height:number;skinPixels:number;score:number};

export function isLikelySkinPixel(r:number,g:number,b:number){
  const y=0.299*r+0.587*g+0.114*b;
  const cb=128-0.168736*r-0.331264*g+0.5*b;
  const cr=128+0.5*r-0.418688*g-0.081312*b;
  const max=Math.max(r,g,b),min=Math.min(r,g,b);
  return y>35&&y<242&&cb>=72&&cb<=138&&cr>=128&&cr<=184&&max-min>8;
}

function clamp(value:number,min:number,max:number){return Math.min(max,Math.max(min,value));}

/**
 * Finds a likely face/skin region from a small whole-photo raster without face recognition.
 * It uses connected skin-colour components plus a soft upper-centre portrait prior. The
 * result is only a crop hint for colour sampling; it is not an identity/biometric output.
 */
export function findLikelyFaceRegion(data:Uint8ClampedArray,width:number,height:number):PixelRegion|null{
  if(width<8||height<8||data.length<width*height*4)return null;
  const mask=new Uint8Array(width*height);
  for(let y=0;y<height;y+=1){
    for(let x=0;x<width;x+=1){
      const i=(y*width+x)*4;
      if(isLikelySkinPixel(data[i],data[i+1],data[i+2]))mask[y*width+x]=1;
    }
  }
  const seen=new Uint8Array(mask.length);
  let best:PixelRegion|null=null;
  const queueX=new Int16Array(mask.length),queueY=new Int16Array(mask.length);
  for(let sy=0;sy<height;sy+=1){
    for(let sx=0;sx<width;sx+=1){
      const start=sy*width+sx;
      if(!mask[start]||seen[start])continue;
      let head=0,tail=0,count=0,minX=sx,maxX=sx,minY=sy,maxY=sy;
      queueX[tail]=sx;queueY[tail]=sy;tail+=1;seen[start]=1;
      while(head<tail){
        const x=queueX[head],y=queueY[head];head+=1;count+=1;
        if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;
        const neighbors:[[number,number],[number,number],[number,number],[number,number]]=[[x-1,y],[x+1,y],[x,y-1],[x,y+1]];
        for(const [nx,ny] of neighbors){
          if(nx<0||ny<0||nx>=width||ny>=height)continue;
          const ni=ny*width+nx;
          if(mask[ni]&&!seen[ni]){seen[ni]=1;queueX[tail]=nx;queueY[tail]=ny;tail+=1;}
        }
      }
      if(count<Math.max(24,Math.round(width*height*0.0025)))continue;
      const boxW=maxX-minX+1,boxH=maxY-minY+1;
      const cx=(minX+maxX+1)/(2*width),cy=(minY+maxY+1)/(2*height);
      const areaRatio=count/(width*height);
      const centrePrior=1-Math.min(1,Math.hypot((cx-0.5)/0.65,(cy-0.38)/0.7));
      const aspect=boxW/Math.max(1,boxH);
      const aspectPrior=1-Math.min(1,Math.abs(aspect-0.82)/1.1);
      const lowerPenalty=cy>0.72?0.35:0;
      const score=areaRatio*8+centrePrior*0.9+aspectPrior*0.35-lowerPenalty;
      if(!best||score>best.score){
        const padX=Math.round(boxW*0.35),padY=Math.round(boxH*0.28);
        const x=clamp(minX-padX,0,width-1),y=clamp(minY-padY,0,height-1);
        const right=clamp(maxX+padX+1,x+1,width),bottom=clamp(maxY+padY+1,y+1,height);
        best={x,y,width:right-x,height:bottom-y,skinPixels:count,score};
      }
    }
  }
  return best;
}

export function trimPixelsByLuminance(pixels:PixelRgb[],lower=0.08,upper=0.92):PixelRgb[]{
  if(pixels.length<25)return pixels;
  const enriched=pixels.map(pixel=>({pixel,l:0.2126*pixel.r+0.7152*pixel.g+0.0722*pixel.b})).sort((a,b)=>a.l-b.l);
  const start=Math.floor(enriched.length*lower),end=Math.max(start+1,Math.ceil(enriched.length*upper));
  return enriched.slice(start,end).map(item=>item.pixel);
}
