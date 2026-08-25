import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const server = http.createServer(async (req, res) => {
  let raw=''; for await (const c of req) raw += c.toString();
  const body=JSON.parse(raw); const content=body.messages?.at(-1)?.content;
  let answer;
  if (Array.isArray(content)) {
    answer = JSON.stringify([{ id:'V1_s001', description:'hand holding a product', subjects:['product','hand'], actions:['holding'], usabilityTags:['detail'], shotType:'close_up', productVisibility:.9, visualQuality:.8, motionLevel:.3, confidence:.95 }]);
  } else {
    answer = JSON.stringify({choices:[{beatId:'b1',segmentId:'V1_s001',sourceStart:0,score:91,reason:'matches product detail',alternatives:[]}]});
  }
  res.writeHead(200,{'content-type':'application/json'}); res.end(JSON.stringify({choices:[{message:{content:answer}}],usage:{prompt_tokens:100,completion_tokens:20,total_tokens:120,prompt_tokens_details:{cached_tokens:10}}}));
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const port=server.address().port; process.env.OPENCODE_GO_BASE_URL=`http://127.0.0.1:${port}`;
const { analyzeSegmentsVision, planTimelineAI, UsageTracker, validateVisionBatchResponse } = await import('../src/core/opencode.mjs');

test.after(()=>server.close());

test('OpenCode compatible vision and planner protocol', async()=>{
  const dir=await fs.mkdtemp(path.join(os.tmpdir(),'shorts-ai-')); const frame=path.join(dir,'x.jpg'); await fs.writeFile(frame,Buffer.from([1,2,3]));
  const usage=new UsageTracker();
  const segments=await analyzeSegmentsVision([{id:'V1_s001',sourceId:'V1',start:0,end:3,duration:3,framePath:frame}],{apiKey:'fake',usage,batchSize:1});
  assert.equal(segments[0].description,'hand holding a product');
  const plan=await planTimelineAI([{id:'b1',start:0,end:2,duration:2,text:'제품을 보여드립니다'}],segments,{apiKey:'fake',usage});
  assert.equal(plan.choices[0].segmentId,'V1_s001');
  const snap=usage.snapshot(); assert.equal(snap.calls,2); assert.equal(snap.cachedTokens,20); assert.ok(snap.estimatedCost.maxUsd>=snap.estimatedCost.minUsd);
});

test('Vision batch integrity accepts every expected id exactly once regardless of response order', () => {
  const batch = [{ id: 's1' }, { id: 's2' }];
  const byId = validateVisionBatchResponse(batch, [{ id: 's2', description: 'two' }, { id: 's1', description: 'one' }]);
  assert.equal(byId.get('s1').description, 'one');
  assert.equal(byId.get('s2').description, 'two');
});

test('Vision batch integrity rejects missing, duplicate, and unexpected ids', () => {
  const batch = [{ id: 's1' }, { id: 's2' }];
  assert.throws(() => validateVisionBatchResponse(batch, [{ id: 's1' }]), /missing=\[s2\]/);
  assert.throws(() => validateVisionBatchResponse(batch, [{ id: 's1' }, { id: 's1' }]), /duplicate=\[s1\]/);
  assert.throws(() => validateVisionBatchResponse(batch, [{ id: 's1' }, { id: 'alien' }]), /unexpected=\[alien\]/);
});
