'use client';

import {useMemo,useState} from 'react';
import {useLocale} from 'next-intl';
import {Link} from '@/i18n/navigation';
import type {SampleStylebook} from '@/lib/looks/samples';
import {getHanbokCatalogPresentation} from '@/features/hanbok/catalog-localization';
import {getSampleCopy,getSampleShell,safeSampleLocale} from './sample-localization';
import styles from './looks.module.css';

interface SampleViewProps{stylebook:SampleStylebook;currentSlug:string}
const SAMPLE_SLUGS=['palace-elegance','modern-pastel','royal-ceremony'] as const;

export function SampleView({stylebook,currentSlug}:SampleViewProps){
 const locale=useLocale();const l=safeSampleLocale(locale);const c=getSampleShell(l);const s=getSampleCopy(l,currentSlug,stylebook);
 const [status,setStatus]=useState('');
 const sampleTabs=useMemo(()=>SAMPLE_SLUGS.map(slug=>({slug,label:getSampleCopy(l,slug,stylebook).tabLabel})),[l,stylebook]);
 async function handleCopy(){
  setStatus('');
  try{
   if(!navigator.clipboard?.writeText)throw new Error('clipboard unavailable');
   await navigator.clipboard.writeText(stylebook.koreanShopCardSummary.instructionKorean);
   setStatus(c.copied);
  }catch{setStatus(c.copyFailed);}
 }
 return <div className={styles.container}>
  <div className={styles.sampleBanner}>
   <div className={styles.sampleBadge}><span>★ {c.sampleBadge} · {s.badge}</span></div>
   <p className={styles.sampleDisclaimer}>{c.disclaimer('My Korea Look')}</p>
  </div>

  <header className={styles.headerSection}>
   <div className={styles.eyebrow}>{c.eyebrow}</div><h1 className={styles.mainTitle}>{s.title}</h1><p className={styles.subtitle}>{s.tagline}</p>
   <div className={styles.priceTagWrapper}><span className={styles.priceTag}>{c.plannedPrice}</span><span className={styles.priceDesc}>{c.priceDesc}</span></div>
  </header>

  <nav className={styles.sampleTabs} aria-label={c.sampleNav}>
   {sampleTabs.map(({slug,label},index)=><Link key={slug} href={`/style/sample/${slug}`} aria-current={currentSlug===slug?'page':undefined} className={`${styles.tabBtn} ${currentSlug===slug?styles.tabBtnActive:''}`}>{index+1}. {label}</Link>)}
  </nav>

  <section className={styles.personaCard} aria-labelledby="sample-persona-title">
   <div><div id="sample-persona-title" className={styles.personaTitle}>{c.personaTitle}</div><div className={styles.personaName}>{s.personaName}</div><p className={styles.personaText}>{s.personaSummary}</p><p className={styles.personaText}>{s.travelContext}</p><p className={styles.personaText}><strong>{c.selectedVibe}:</strong> {s.selectedStyle}<br/><strong>{c.colorHarmony}:</strong> {s.selectedUndertone}</p></div>
   <div className={styles.palettePreview}>
    <div className={styles.swatchGroup} aria-label={s.paletteTitle}>
     <div className={styles.colorSwatch} style={{backgroundColor:stylebook.colorAnalysisSummary.primaryHex}} title={c.primaryTone}/>
     <div className={styles.colorSwatch} style={{backgroundColor:stylebook.colorAnalysisSummary.secondaryHex}} title={c.secondaryTone}/>
     <div className={styles.colorSwatch} style={{backgroundColor:stylebook.colorAnalysisSummary.accentHex}} title={c.accentTone}/>
    </div>
    <div><strong style={{fontSize:'13px',display:'block'}}>{s.paletteTitle}</strong><span style={{fontSize:'12px',color:'var(--stone-muted, #78716C)'}}>{s.paletteNotes}</span></div>
   </div>
  </section>

  <section className={styles.looksSection} aria-labelledby="sample-looks-title">
   <h2 id="sample-looks-title" className={styles.sectionHeading}><span>{c.looksHeading}</span></h2>
   {l!=='en'?<p><small>{c.englishDetailNote}</small></p>:null}
   <div className={styles.looksGrid}>
    {stylebook.looks.map((look,idx)=>{const p=getHanbokCatalogPresentation(l,look);return <article key={look.id} className={styles.lookCard}>
     <div className={styles.imageFrame}><span className={styles.lookIndexBadge}>{c.lookOf(idx+1)}</span><img src={look.src} alt={p.alt} className={styles.lookImg} loading="lazy" referrerPolicy="no-referrer" style={{objectPosition:look.cropPosition}}/></div>
     <div className={styles.cardBody}><h3 className={styles.lookTitle}>{p.title}</h3><div className={styles.lookTagline}>{l==='en'?look.tagline:p.description}</div><p className={styles.lookDesc}>{p.description}</p>
      {l==='en'?<><ul className={styles.reasonsList}>{look.reasons.map((reason,rIdx)=><li key={rIdx} className={styles.reasonItem}><span className={styles.reasonDot}>✓</span><span>{reason}</span></li>)}</ul><div className={styles.tradeOffBox}><strong>{c.practicalNote}:</strong> {look.tradeOff}</div></>:null}
      <div className={styles.locationTip}><strong>{c.suggestedSpot}:</strong> {l==='en'?`${look.recommendedLocation.name} (${look.recommendedLocation.koreanName})`:look.recommendedLocation.koreanName}{l==='en'?<><br/><span style={{fontSize:'11px',color:'var(--stone-muted, #78716C)'}}>{c.photoIdea}: {look.recommendedLocation.photoAngle}</span></>:null}</div>
     </div>
     <div className={styles.sourceCredit}><span>{c.source}: {look.creator.split('/')[0]}</span><a href={look.sourceUrl} target="_blank" rel="noreferrer noopener" className={styles.sourceLink}>{c.viewSource} ({look.license})</a><span>{c.checked}: {look.checkedAt}</span></div>
    </article>})}
   </div>
  </section>

  <section className={styles.shopCardSection} aria-labelledby="sample-shop-title">
   <div className={styles.shopCardHeader}><span className={styles.shopCardBadge}>{c.shopBadge}</span><button type="button" onClick={handleCopy} style={{padding:'6px 14px',borderRadius:'999px',border:'1px solid var(--dancheong-crimson, #9E2A2B)',background:'#FFFFFF',color:'var(--dancheong-crimson, #9E2A2B)',fontSize:'12px',fontWeight:'700',cursor:'pointer'}}>{c.copyKorean}</button></div>
   <h3 id="sample-shop-title" style={{fontSize:'18px',fontWeight:'800',margin:'0 0 8px'}}>{c.shopHeading}</h3><p style={{fontSize:'14px',color:'var(--stone-muted, #78716C)',margin:'0 0 16px'}}>{s.shopExplanation}</p>
   <div className={styles.hangulBox} lang="ko"><span className={styles.hangulLabel}>{c.koreanLabel} (한국어 대여 요청 문구)</span>{stylebook.koreanShopCardSummary.instructionKorean}</div>
   {status?<p role="status" aria-live="polite"><strong>{status}</strong></p>:null}
  </section>

  <section className={styles.routeSection} aria-labelledby="sample-route-title">
   <h3 id="sample-route-title" style={{fontSize:'18px',fontWeight:'800',margin:'0 0 4px'}}>{c.routeHeading}</h3><p style={{fontSize:'13px',color:'var(--stone-muted, #78716C)',margin:0}}>{c.routeDisclaimer}</p>
   <div className={styles.routeTimeline}>{stylebook.looks[0].photoRoute.map(stop=><div key={stop.order} className={styles.routeStop}><div className={styles.stopHeader}><span className={styles.stopOrder}>{c.stop} {stop.order}</span><span className={styles.stopTime}>{stop.bestTime}</span></div><div className={styles.stopName}>{stop.spotName}</div><div className={styles.stopKorean}>{stop.koreanName}</div>{l==='en'?<p className={styles.stopTip}>{stop.photoTip}</p>:null}</div>)}</div>
  </section>

  <section className={styles.ctaBox}><h2 className={styles.ctaTitle}>{c.ctaTitle}</h2><p className={styles.ctaDesc}>{c.ctaDesc}</p><Link href="/style" className={styles.ctaBtn}><span>{c.ctaButton}</span><span aria-hidden="true">→</span></Link></section>
 </div>;
}
