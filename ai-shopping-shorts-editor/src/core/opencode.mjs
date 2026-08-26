import { promises as fs } from 'node:fs';
import path from 'node:path';
import { extractJson } from './utils.mjs';

const BASE = process.env.OPENCODE_GO_BASE_URL || 'https://opencode.ai/zen/go/v1';

const PRICE_USD_PER_M = {
  'deepseek-v4-flash': { off: { input: 0.22, output: 0.66, cached: 0.007 }, peak: { input: 0.44, output: 1.32, cached: 0.014 } },
  'deepseek-v4-flash-vision-exp': { off: { input: 0.22, output: 0.66, cached: 0.007 }, peak: { input: 0.44, output: 1.32, cached: 0.014 } }
};

export class UsageTracker {
  constructor() { this.calls = 0; this.promptTokens = 0; this.completionTokens = 0; this.cachedTokens = 0; this.totalTokens = 0; this.byModel = {}; }
  add(usage, model = 'unknown') {
    const prompt = Number(usage?.prompt_tokens || usage?.input_tokens || 0);
    const completion = Number(usage?.completion_tokens || usage?.output_tokens || 0);
    const cached = Number(usage?.prompt_tokens_details?.cached_tokens || usage?.input_tokens_details?.cached_tokens || 0);
    const total = Number(usage?.total_tokens || prompt + completion);
    this.calls += 1; this.promptTokens += prompt; this.completionTokens += completion; this.cachedTokens += cached; this.totalTokens += total;
    const row = this.byModel[model] ||= { calls: 0, promptTokens: 0, completionTokens: 0, cachedTokens: 0, totalTokens: 0 };
    row.calls += 1; row.promptTokens += prompt; row.completionTokens += completion; row.cachedTokens += cached; row.totalTokens += total;
  }
  estimateCost() {
    let off = 0, peak = 0;
    for (const [model, row] of Object.entries(this.byModel)) {
      const price = PRICE_USD_PER_M[model]; if (!price) continue;
      const uncached = Math.max(0, row.promptTokens - row.cachedTokens);
      off += (uncached * price.off.input + row.cachedTokens * price.off.cached + row.completionTokens * price.off.output) / 1_000_000;
      peak += (uncached * price.peak.input + row.cachedTokens * price.peak.cached + row.completionTokens * price.peak.output) / 1_000_000;
    }
    return { minUsd: Math.round(off * 1e6) / 1e6, maxUsd: Math.round(peak * 1e6) / 1e6, pricingAsOf: '2026-08-25', note: 'Estimate for configured DeepSeek Go models; actual billing/usage rules may change.' };
  }
  snapshot() { return { calls: this.calls, promptTokens: this.promptTokens, completionTokens: this.completionTokens, cachedTokens: this.cachedTokens, totalTokens: this.totalTokens, byModel: this.byModel, estimatedCost: this.estimateCost() }; }
}

async function postChat({ apiKey, model, messages, temperature = 0.1, maxTokens = 5000, usage }) {
  if (!apiKey) throw new Error('OpenCode Go API key is missing.');
  const response = await fetch(`${BASE}/chat/completions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages, temperature, max_tokens: maxTokens })
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`OpenCode API ${response.status}: ${text.slice(0, 1000)}`);
  const data = JSON.parse(text);
  usage?.add(data.usage, model);
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('OpenCode returned no message content.');
  return content;
}

async function imageDataUrl(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
  const bytes = await fs.readFile(filePath);
  return `data:${mime};base64,${bytes.toString('base64')}`;
}

export function validateVisionBatchResponse(batch, parsed) {
  if (!Array.isArray(parsed)) throw new Error('Vision analysis did not return an array.');
  const expectedIds = batch.map((seg) => seg.id);
  const expected = new Set(expectedIds);
  const seen = new Set();
  const duplicate = [];
  const unexpected = [];

  for (const row of parsed) {
    const id = String(row?.id || '');
    if (!expected.has(id)) unexpected.push(id || '(missing id)');
    else if (seen.has(id)) duplicate.push(id);
    else seen.add(id);
  }

  const missing = expectedIds.filter((id) => !seen.has(id));
  if (parsed.length !== batch.length || missing.length || duplicate.length || unexpected.length) {
    throw new Error(`Vision analysis batch integrity failed: missing=[${missing.join(', ')}] duplicate=[${duplicate.join(', ')}] unexpected=[${unexpected.join(', ')}]`);
  }

  return new Map(parsed.map((row) => [row.id, row]));
}

export function validatePlannerResponse(beats, parsed) {
  if (!parsed || !Array.isArray(parsed.choices)) throw new Error('Planner did not return a choices array.');
  const expectedIds = beats.map((beat) => beat.id);
  const expected = new Set(expectedIds);
  const seen = new Set();
  const duplicate = [];
  const unexpected = [];
  const invalidFields = [];

  for (const choice of parsed.choices) {
    const beatId = String(choice?.beatId || '');
    if (!expected.has(beatId)) unexpected.push(beatId || '(missing beatId)');
    else if (seen.has(beatId)) duplicate.push(beatId);
    else seen.add(beatId);

    if (typeof choice?.segmentId !== 'string' || !choice.segmentId.trim()) invalidFields.push(`${beatId || '(missing beatId)'}.segmentId`);
    if (typeof choice?.sourceStart !== 'number' || !Number.isFinite(choice.sourceStart)) invalidFields.push(`${beatId || '(missing beatId)'}.sourceStart`);
    if (typeof choice?.score !== 'number' || !Number.isFinite(choice.score) || choice.score < 0 || choice.score > 100) invalidFields.push(`${beatId || '(missing beatId)'}.score`);
    if (!Array.isArray(choice?.alternatives) || choice.alternatives.some((id) => typeof id !== 'string' || !id.trim())) invalidFields.push(`${beatId || '(missing beatId)'}.alternatives`);
  }

  const missing = expectedIds.filter((id) => !seen.has(id));
  if (parsed.choices.length !== beats.length || missing.length || duplicate.length || unexpected.length || invalidFields.length) {
    throw new Error(`Planner beat integrity failed: missing=[${missing.join(', ')}] duplicate=[${duplicate.join(', ')}] unexpected=[${unexpected.join(', ')}] invalidFields=[${invalidFields.join(', ')}]`);
  }

  return parsed;
}

export function validateJudgeResponse(items, parsed) {
  if (!Array.isArray(parsed)) throw new Error('Judge did not return an array.');
  const expectedIds = items.map((item) => item.beatId);
  const expected = new Set(expectedIds);
  const seen = new Set();
  const duplicate = [];
  const unexpected = [];
  const invalidScores = [];

  for (const judgment of parsed) {
    const beatId = String(judgment?.beatId || '');
    if (!expected.has(beatId)) unexpected.push(beatId || '(missing beatId)');
    else if (seen.has(beatId)) duplicate.push(beatId);
    else seen.add(beatId);

    const score = judgment?.score;
    if (typeof score !== 'number' || !Number.isFinite(score) || score < 0 || score > 100) {
      invalidScores.push(`${beatId || '(missing beatId)'}=${String(score)}`);
    }
  }

  const missing = expectedIds.filter((id) => !seen.has(id));
  if (parsed.length !== items.length || missing.length || duplicate.length || unexpected.length || invalidScores.length) {
    throw new Error(`Judge response integrity failed: missing=[${missing.join(', ')}] duplicate=[${duplicate.join(', ')}] unexpected=[${unexpected.join(', ')}] invalidScores=[${invalidScores.join(', ')}]`);
  }

  return parsed;
}

export async function analyzeSegmentsVision(segments, { apiKey, model = 'deepseek-v4-flash-vision-exp', batchSize = 10, usage, onProgress }) {
  const output = [];
  for (let offset = 0; offset < segments.length; offset += batchSize) {
    const batch = segments.slice(offset, offset + batchSize);
    const content = [{
      type: 'text',
      text: `You are a video-shot analyst for ecommerce shopping Shorts. Each following image is the CENTER frame of a distinct shot, in exactly this order:\n${batch.map((s, i) => `${i + 1}. ${s.id} (${s.sourceId}, ${s.start}-${s.end}s)`).join('\n')}\n\nReturn ONLY a JSON array with one object per image, same order. Schema: {"id":string,"description":string,"subjects":string[],"actions":string[],"usabilityTags":string[],"shotType":"close_up|medium|wide|macro|unknown","productVisibility":0..1,"visualQuality":0..1,"motionLevel":0..1,"confidence":0..1}. Describe visible evidence only. Write description and usabilityTags in concise Korean (keep visible brand/product names as written). Keep description under 80 Korean characters and each list to at most 5 items. Tags should help match shopping narration such as 신선함, 식감, 크기, 포장, 선별, 손질, 먹는장면, 배송, 비교, 디테일.`
    }];
    for (const seg of batch) content.push({ type: 'image_url', image_url: { url: await imageDataUrl(seg.framePath), detail: 'low' } });
    const raw = await postChat({
      apiKey, model, usage,
      messages: [{ role: 'user', content }],
      maxTokens: Math.max(2500, batch.length * 420)
    });
    const parsed = extractJson(raw);
    const byId = validateVisionBatchResponse(batch, parsed);
    for (const seg of batch) output.push({ ...seg, ...byId.get(seg.id) });
    onProgress?.(Math.min(1, (offset + batch.length) / segments.length));
  }
  return output;
}

export async function planTimelineAI(beats, segments, { apiKey, model = 'deepseek-v4-flash', usage }) {
  const compactSegments = segments.map((s) => ({
    id: s.id, sourceId: s.sourceId, start: s.start, end: s.end, duration: s.duration,
    description: String(s.description || '').slice(0, 140),
    actions: (s.actions || []).slice(0, 5), subjects: (s.subjects || []).slice(0, 5),
    tags: (s.usabilityTags || []).slice(0, 5), shotType: s.shotType,
    productVisibility: Math.round(Number(s.productVisibility || 0) * 100) / 100,
    visualQuality: Math.round(Number(s.visualQuality || 0) * 100) / 100
  }));
  const prompt = `You are the edit director for a CUT-ONLY YouTube Shopping Shorts video.\nGoal: map each narration beat to the most semantically relevant visual from several source videos.\nRules:\n- Do not simply concatenate sources. Mix sources throughout.\n- Prefer a visual action/product detail that directly supports the narration.\n- Avoid using the same segment twice.\n- Avoid the same source more than 2 times consecutively when comparable alternatives exist.\n- Each chosen source segment must be long enough for beat.duration.\n- sourceStart must be within the candidate segment and leave enough time for the full beat.\n- Keep cuts aligned exactly to beat boundaries.\n- Return 3 alternative segment IDs for each beat when possible.\n\nBEATS:\n${JSON.stringify(beats)}\n\nSEGMENTS:\n${JSON.stringify(compactSegments)}\n\nReturn ONLY JSON object: {"choices":[{"beatId":string,"segmentId":string,"sourceStart":number,"score":0..100,"reason":string,"alternatives":string[]}]} . Include exactly one choice per beat.`;
  const raw = await postChat({
    apiKey, model, usage,
    messages: [
      { role: 'system', content: 'Be precise, conservative, and output valid JSON only.' },
      { role: 'user', content: prompt }
    ],
    maxTokens: Math.max(3500, beats.length * 220)
  });
  return validatePlannerResponse(beats, extractJson(raw));
}

export async function judgeSelectionsVision(items, { apiKey, model = 'deepseek-v4-flash-vision-exp', usage, batchSize = 6 }) {
  const results = [];
  for (let offset = 0; offset < items.length; offset += batchSize) {
    const batch = items.slice(offset, offset + batchSize);
    const content = [{ type: 'text', text: `각 자막 Beat와 선택된 영상 동작이 얼마나 잘 맞는지 평가하세요. 각 Beat 뒤에는 시간순으로 시작/중간/끝 3프레임이 제공됩니다. 정지 이미지 미학보다 세 프레임 전체의 상품/행동 의미가 내레이션을 뒷받침하는지를 우선하세요.\n${batch.map((x, i) => `${i + 1}. ${x.beatId}: ${x.text}`).join('\n')}\nReturn ONLY JSON array: [{"beatId":string,"score":0..100,"reason":string}].` }];
    for (const item of batch) {
      const paths = item.framePaths?.length ? item.framePaths : [item.framePath].filter(Boolean);
      for (const framePath of paths) content.push({ type: 'image_url', image_url: { url: await imageDataUrl(framePath), detail: 'low' } });
    }
    const raw = await postChat({ apiKey, model, usage, messages: [{ role: 'user', content }], maxTokens: 2500 });
    const parsed = validateJudgeResponse(batch, extractJson(raw));
    results.push(...parsed);
  }
  return results;
}
