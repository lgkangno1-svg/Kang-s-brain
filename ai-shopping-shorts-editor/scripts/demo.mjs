import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { run } from '../src/core/process.mjs';
import { runProject } from '../src/core/pipeline.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'workspace', 'demo'); const inputs=path.join(dir,'inputs'); await fs.mkdir(inputs,{recursive:true});
const vids=[];
for(let i=0;i<3;i++){
  const out=path.join(inputs,`video${i+1}.mp4`); vids.push(out);
  await run('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','lavfi','-i',`testsrc2=size=720x1280:rate=30:duration=12`,'-vf',`hue=h=${i*60},drawbox=x=${40+i*90}:y=${200+i*120}:w=260:h=260:color=white@0.35:t=fill`,'-c:v','libx264','-pix_fmt','yuv420p',out]);
}
const tts=path.join(inputs,'tts.wav'); await run('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','lavfi','-i','sine=frequency=440:duration=9','-c:a','pcm_s16le',tts]);
const srt=path.join(inputs,'captions.srt');
await fs.writeFile(srt,`1\n00:00:00,000 --> 00:00:02,000\n첫 번째 상품 장면입니다.\n\n2\n00:00:02,000 --> 00:00:04,500\n다른 각도의 모습을 보여드립니다.\n\n3\n00:00:04,500 --> 00:00:07,000\n가까이에서 디테일을 확인합니다.\n\n4\n00:00:07,000 --> 00:00:09,000\n마지막으로 전체 모습을 확인하세요.\n`);
const result=await runProject({projectDir:dir,videoPaths:vids,script:'',srtPath:srt,ttsPath:tts,apiKey:'',settings:{qualityMode:'economy'},onStatus:(s)=>console.log('[demo]',s)});
console.log(JSON.stringify({output:result.outputPath,qa:result.qa},null,2));
