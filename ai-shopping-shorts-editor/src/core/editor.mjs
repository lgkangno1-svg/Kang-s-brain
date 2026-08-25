import { promises as fs } from 'node:fs';
import path from 'node:path';
import { run } from './process.mjs';
import { clamp, round3 } from './utils.mjs';
import { extractFrameAt, probe } from './media.mjs';
import { judgeSelectionsVision, planTimelineAI } from './opencode.mjs';

function eligibleSegments(segments, beatDuration) {
  return segments.filter((s) => s.duration + 0.04 >= beatDuration);
}

function fallbackPlan(beats, segments) {
  const used = new Set();
  let lastSource = null; let sameSourceCount = 0;
  const choices = [];
  for (let i = 0; i < beats.length; i++) {
    const beat = beats[i];
    let candidates = eligibleSegments(segments, beat.duration).filter((s) => !used.has(s.id));
    if (!candidates.length) candidates = eligibleSegments(segments, beat.duration);
    if (!candidates.length) throw new Error(`No source segment is long enough for beat ${beat.id} (${beat.duration}s).`);
    candidates.sort((a, b) => {
      const diversityA = (a.sourceId === lastSource && sameSourceCount >= 2) ? -2 : 0;
      const diversityB = (b.sourceId === lastSource && sameSourceCount >= 2) ? -2 : 0;
      return (diversityB + b.visualQuality + b.productVisibility) - (diversityA + a.visualQuality + a.productVisibility);
    });
    const chosen = candidates[0];
    used.add(chosen.id);
    if (chosen.sourceId === lastSource) sameSourceCount++; else { lastSource = chosen.sourceId; sameSourceCount = 1; }
    choices.push({ beatId: beat.id, segmentId: chosen.id, sourceStart: chosen.start, score: 50, reason: 'Deterministic fallback selection', alternatives: candidates.slice(1, 4).map((s) => s.id) });
  }
  return { choices };
}

function repairChoices(plan, beats, segments) {
  const bySeg = new Map(segments.map((s) => [s.id, s]));
  const raw = Array.isArray(plan?.choices) ? plan.choices : [];
  const map = new Map(raw.map((c) => [c.beatId, c]));
  const used = new Set();
  const repaired = [];
  let lastSource = null; let sourceRun = 0;

  for (const beat of beats) {
    let c = map.get(beat.id);
    let seg = c ? bySeg.get(c.segmentId) : null;
    const valid = (s) => s && s.duration + 0.04 >= beat.duration;
    const altIds = [...(c?.alternatives || [])];
    const pool = eligibleSegments(segments, beat.duration)
      .filter((s) => !used.has(s.id))
      .sort((a, b) => (b.visualQuality + b.productVisibility) - (a.visualQuality + a.productVisibility));

    if (!valid(seg) || used.has(seg.id)) seg = altIds.map((id) => bySeg.get(id)).find((s) => valid(s) && !used.has(s.id)) || pool[0] || eligibleSegments(segments, beat.duration)[0];
    if (!seg) throw new Error(`Unable to repair choice for ${beat.id}.`);

    if (seg.sourceId === lastSource && sourceRun >= 2) {
      const diverse = altIds.map((id) => bySeg.get(id)).find((s) => valid(s) && !used.has(s.id) && s.sourceId !== lastSource)
        || pool.find((s) => s.sourceId !== lastSource);
      if (diverse) seg = diverse;
    }

    const maxStart = Math.max(seg.start, seg.end - beat.duration);
    const requested = Number(c?.sourceStart);
    const sourceStart = round3(clamp(Number.isFinite(requested) ? requested : seg.start, seg.start, maxStart));
    const sourceEnd = round3(sourceStart + beat.duration);
    if (seg.sourceId === lastSource) sourceRun++; else { lastSource = seg.sourceId; sourceRun = 1; }
    used.add(seg.id);
    repaired.push({
      beatId: beat.id, text: beat.text, programStart: beat.start, programEnd: beat.end,
      sourceId: seg.sourceId, sourcePath: seg.sourcePath, segmentId: seg.id,
      sourceStart, sourceEnd,
      score: Number(c?.score ?? 50), reason: c?.reason || 'Auto-repaired selection',
      alternatives: altIds.filter((id) => id !== seg.id).slice(0, 4)
    });
  }
  return repaired;
}

export function chooseJudgeReplacement(clip, beat, segMap, occupiedSegmentIds = new Set()) {
  if (!clip || !beat) return null;
  return (clip.alternatives || [])
    .map((id) => segMap.get(id))
    .find((s) => s
      && s.duration + 0.04 >= beat.duration
      && s.sourceId !== clip.sourceId
      && !occupiedSegmentIds.has(s.id)) || null;
}

export function validateEdl(edl, sourceMeta = new Map()) {
  const errors = [];
  let cursor = 0;
  const seen = new Set();
  edl.forEach((c, i) => {
    if (Math.abs(c.programStart - cursor) > 0.08) errors.push(`clip ${i}: program gap/overlap (${c.programStart} vs ${cursor})`);
    if (!(c.sourceEnd > c.sourceStart)) errors.push(`clip ${i}: invalid source range`);
    const meta = sourceMeta.get(c.sourceId);
    if (meta && c.sourceEnd > meta.duration + 0.08) errors.push(`clip ${i}: sourceEnd exceeds source duration`);
    if (c.sourceStart < -0.001) errors.push(`clip ${i}: negative sourceStart`);
    if (seen.has(c.segmentId)) errors.push(`clip ${i}: duplicate segment ${c.segmentId}`);
    seen.add(c.segmentId);
    cursor = c.programEnd;
  });
  return { ok: errors.length === 0, errors, duration: round3(cursor) };
}

export async function buildEdl({ beats, segments, apiKey, settings, usage, workDir, onStatus }) {
  let plan;
  if (apiKey) {
    onStatus?.('AI가 자막과 영상 장면을 매칭하는 중');
    try {
      plan = await planTimelineAI(beats, segments, { apiKey, model: settings.plannerModel, usage });
    } catch (error) {
      if (settings.failOnAiError !== false) throw new Error(`OpenCode 편집 계획 실패: ${error.message}`);
      onStatus?.(`AI 편집 계획 실패, 명시적 fallback 설정에 따라 대체 선택 사용: ${error.message}`);
      plan = fallbackPlan(beats, segments);
    }
  } else plan = fallbackPlan(beats, segments);

  let edl = repairChoices(plan, beats, segments);

  if (apiKey && settings.qualityMode === 'quality') {
    onStatus?.('선택 장면 의미 일치도를 2차 검수하는 중');
    const segMap = new Map(segments.map((s) => [s.id, s]));
    const judgeDir = path.join(workDir, 'judge');
    await fs.mkdir(judgeDir, { recursive: true });
    const items = [];
    for (const clip of edl) {
      const span = clip.sourceEnd - clip.sourceStart;
      const times = [0.12, 0.5, 0.88].map((ratio) => clip.sourceStart + span * ratio);
      const framePaths = [];
      for (let i = 0; i < times.length; i++) {
        const framePath = path.join(judgeDir, `${clip.beatId}-${i + 1}.jpg`);
        await extractFrameAt(clip.sourcePath, times[i], framePath, 512);
        framePaths.push(framePath);
      }
      items.push({ beatId: clip.beatId, text: clip.text, framePaths });
    }
    try {
      const judgments = await judgeSelectionsVision(items, { apiKey, model: settings.visionModel, usage });
      const scores = new Map(judgments.map((j) => [j.beatId, j]));
      const occupiedSegmentIds = new Set(edl.map((clip) => clip.segmentId));
      for (const clip of edl) {
        const j = scores.get(clip.beatId);
        if (j) { clip.judgeScore = Number(j.score); clip.judgeReason = j.reason; }
        if (j && Number(j.score) < (settings.judgeThreshold ?? 62)) {
          const beat = beats.find((b) => b.id === clip.beatId);
          occupiedSegmentIds.delete(clip.segmentId);
          const replacement = chooseJudgeReplacement(clip, beat, segMap, occupiedSegmentIds);
          if (replacement) {
            clip.segmentId = replacement.id; clip.sourceId = replacement.sourceId; clip.sourcePath = replacement.sourcePath;
            clip.sourceStart = replacement.start; clip.sourceEnd = round3(replacement.start + beat.duration);
            clip.reason = `Judge ${j.score}: replaced with alternative`;
          }
          occupiedSegmentIds.add(clip.segmentId);
        }
      }
    } catch (error) {
      onStatus?.(`2차 AI 검수는 건너뜀: ${error.message}`);
    }
  }

  return edl;
}

export async function renderEdl({ edl, outputPath, ttsPath, fitMode = 'crop' }) {
  const uniqueSources = [...new Set(edl.map((c) => c.sourcePath))];
  const inputIndex = new Map(uniqueSources.map((p, i) => [p, i]));
  const args = ['-hide_banner', '-loglevel', 'error', '-y'];
  for (const source of uniqueSources) args.push('-i', source);
  let audioIndex = null;
  if (ttsPath) { audioIndex = uniqueSources.length; args.push('-i', ttsPath); }

  const filters = [];
  const labels = [];
  edl.forEach((c, i) => {
    const idx = inputIndex.get(c.sourcePath);
    const label = `v${i}`;
    const fit = fitMode === 'contain'
      ? 'scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2'
      : 'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920';
    filters.push(`[${idx}:v]trim=start=${c.sourceStart}:end=${c.sourceEnd},setpts=PTS-STARTPTS,${fit},setsar=1,fps=30[${label}]`);
    labels.push(`[${label}]`);
  });
  filters.push(`${labels.join('')}concat=n=${labels.length}:v=1:a=0[vout]`);
  args.push('-filter_complex', filters.join(';'), '-map', '[vout]');
  if (audioIndex != null) args.push('-map', `${audioIndex}:a:0?`, '-shortest', '-c:a', 'aac', '-b:a', '192k');
  args.push('-c:v', 'libx264', '-preset', 'fast', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', outputPath);
  await run('ffmpeg', args);
  return probe(outputPath);
}
