import {timingSafeEqual} from 'node:crypto';
import {revalidateTag} from 'next/cache';
import {NextResponse} from 'next/server';
import {CONTENT_TAGS} from '@/lib/content/travel-content';

const ALLOWED_TAGS=new Set<string>(Object.values(CONTENT_TAGS));

function sameSecret(provided:string,expected:string){
 const left=Buffer.from(provided);const right=Buffer.from(expected);
 return left.length===right.length&&timingSafeEqual(left,right);
}

export async function POST(request:Request){
 const expected=process.env.CONTENT_REVALIDATE_SECRET?.trim();
 const provided=request.headers.get('x-korea-content-secret')?.trim();
 if(!expected||!provided||!sameSecret(provided,expected))return NextResponse.json({ok:false},{status:401});
 let body:unknown;
 try{body=await request.json();}catch{return NextResponse.json({ok:false,error:'invalid_json'},{status:400});}
 const tag=body&&typeof body==='object'&&'tag' in body?String((body as {tag:unknown}).tag):'';
 if(!ALLOWED_TAGS.has(tag))return NextResponse.json({ok:false,error:'unsupported_tag'},{status:400});
 revalidateTag(tag,'max');
 return NextResponse.json({ok:true,tag});
}
