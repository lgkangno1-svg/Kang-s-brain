const $ = (id) => document.getElementById(id);
let projectId = null;

async function request(url, options = {}) {
  const r = await fetch(url, options); const text = await r.text();
  let data; try { data = JSON.parse(text); } catch { data = text; }
  if (!r.ok) throw new Error(data?.error || `${r.status} ${text}`);
  return data;
}
async function upload(id, file, kind) {
  if (!file) return;
  return request(`/api/projects/${id}/upload?kind=${kind}&name=${encodeURIComponent(file.name)}`, { method: 'POST', headers: { 'content-type': 'application/octet-stream' }, body: file });
}
function log(message) { const d=document.createElement('div'); d.textContent=message; $('logs').appendChild(d); $('logs').scrollTop=$('logs').scrollHeight; }
async function poll(id) {
  const state = await request(`/api/projects/${id}/status`);
  $('status').textContent = state.status || '진행 중';
  $('logs').innerHTML = ''; (state.logs || []).forEach((x) => log(x.message));
  const msg = state.status || '';
  const m = msg.match(/(\d+)%/); if (m) $('progress').value = Number(m[1]); else if (state.running) $('progress').value = Math.min(90, $('progress').value + 1);
  if (state.running) return setTimeout(() => poll(id), 1200);
  $('run').disabled = false;
  if (state.error) { $('progress').value=0; log('ERROR: '+state.error); return; }
  $('progress').value=100; await showResult(id);
}
async function showResult(id) {
  const qa = await request(`/api/projects/${id}/qa`); const edl = await request(`/api/projects/${id}/edl`); const segments = await request(`/api/projects/${id}/segments`); const segMap=new Map(segments.map(s=>[s.id,s]));
  $('qa').textContent = JSON.stringify(qa, null, 2);
  $('preview').src = `/api/projects/${id}/video?ts=${Date.now()}`;
  $('download').href = `/api/projects/${id}/video`;
  $('timeline').innerHTML = '';
  for (const c of edl.clips || []) {
    const el=document.createElement('div'); el.className='clip';
    const title=document.createElement('div'); title.innerHTML=`<b>${c.beatId}</b> ${escapeHtml(c.text||'')}<br><span>${c.sourceId} · ${c.sourceStart.toFixed(2)}–${c.sourceEnd.toFixed(2)}s · score ${c.score ?? '-'}${c.judgeScore != null ? ' · judge '+c.judgeScore : ''}</span><br>${escapeHtml(c.reason||'')}`; el.appendChild(title);
    const ids=[c.segmentId,...(c.alternatives||[])].filter((x,i,a)=>x&&a.indexOf(x)===i);
    if(ids.length>1){const select=document.createElement('select'); select.className='alt-select'; for(const id of ids){const s=segMap.get(id); if(!s)continue; const o=document.createElement('option');o.value=id;o.selected=id===c.segmentId;o.textContent=`${s.sourceId} ${Number(s.start).toFixed(1)}–${Number(s.end).toFixed(1)}s · ${(s.description||id).slice(0,70)}`;select.appendChild(o);} const btn=document.createElement('button');btn.className='small-btn';btn.textContent='이 컷으로 교체';btn.onclick=async()=>{if(select.value===c.segmentId)return;btn.disabled=true;btn.textContent='재렌더 중…';try{await request(`/api/projects/${id}/replace`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({beatId:c.beatId,segmentId:select.value})}); await poll(id);}catch(e){alert(e.message);btn.disabled=false;btn.textContent='이 컷으로 교체';}};el.appendChild(select);el.appendChild(btn);}
    $('timeline').appendChild(el);
  }
  $('result').classList.remove('hidden');
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

$('run').addEventListener('click', async () => {
  const videos=[...$('videos').files]; const tts=$('tts').files[0]; const srt=$('srt').files[0]; const script=$('script').value.trim();
  if (videos.length < 2) return alert('원본 영상을 최소 2개 선택하세요.');
  if (!script && !srt) return alert('대본 또는 SRT가 필요합니다.');
  $('run').disabled=true; $('result').classList.add('hidden'); $('logs').innerHTML=''; $('progress').value=2;
  try {
    const p=await request('/api/projects',{method:'POST'}); projectId=p.id; log(`프로젝트 ${projectId} 생성`);
    for(let i=0;i<videos.length;i++){log(`영상 업로드 ${i+1}/${videos.length}: ${videos[i].name}`); await upload(projectId,videos[i],'video'); $('progress').value=5+Math.round((i+1)/videos.length*15);}
    if(tts){log('TTS 업로드');await upload(projectId,tts,'tts');} if(srt){log('SRT 업로드');await upload(projectId,srt,'srt');}
    await request(`/api/projects/${projectId}/run`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({script,apiKey:$('apiKey').value.trim(),settings:{qualityMode:$('quality').value,fitMode:$('fit').value,visionBatchSize:$('quality').value==='economy'?14:10}})});
    poll(projectId);
  } catch(e) { $('run').disabled=false; log('ERROR: '+e.message); alert(e.message); }
});
