import { promises as fs } from 'node:fs';
import path from 'node:path';
import { assertMediaTools, analyzeSourceLocally, probe } from './media.mjs';
import { buildBeats, adaptBeatsToAvailableSegments } from './beats.mjs';
import { analyzeSegmentsVision, UsageTracker, validateVisionBatchResponse } from './opencode.mjs';
import { alternativesAfterReplacement, buildEdl, renderEdl, validateEdl } from './editor.mjs';
import { ensureDir, readJson, writeJson, sha256Text } from './utils.mjs';

export const DEFAULT_SETTINGS = {
  qualityMode: 'balanced',
  visionModel: 'deepseek-v4-flash-vision-exp',
  plannerModel: 'deepseek-v4-flash',
  sceneThreshold: 0.32,
  analysisWidth: 512,
  visionBatchSize: 10,
  judgeThreshold: 62,
  failOnAiError: true,
  fitMode: 'crop',
  segmenting: { min: 1.0, ideal: 3.0, max: 5.2, maxSegments: 80 }
};

export const VISION_CACHE_SCHEMA = 2;

const MODE_PRESETS = {
  economy: { analysisWidth: 384, visionBatchSize: 14, sceneThreshold: 0.36, segmenting: { maxSegments: 60 } },
  balanced: { analysisWidth: 512, visionBatchSize: 10, sceneThreshold: 0.32, segmenting: { maxSegments: 80 } },
  quality: { analysisWidth: 640, visionBatchSize: 8, sceneThreshold: 0.28, segmenting: { maxSegments: 100 } }
};

export function resolveSettings(input = {}) {
  const mode = input.qualityMode || DEFAULT_SETTINGS.qualityMode;
  const preset = MODE_PRESETS[mode] || MODE_PRESETS.balanced;
  return {
    ...DEFAULT_SETTINGS,
    ...preset,
    ...input,
    qualityMode: mode,
    segmenting: { ...DEFAULT_SETTINGS.segmenting, ...(preset.segmenting || {}), ...(input.segmenting || {}) }
  };
}

export function makeVisionCacheFingerprint({ model, sourceHashes, analysisWidth, sceneThreshold, segmenting }, schema = VISION_CACHE_SCHEMA) {
  return sha256Text(JSON.stringify({ schema, model, sourceHashes, analysisWidth, sceneThreshold, segmenting })).slice(0, 20);
}

export function isVisionCachePayloadValid(allSegments, cached) {
  try {
    validateVisionBatchResponse(allSegments, cached);
    return true;
  } catch {
    return false;
  }
}

export function assertManualReplacementAvailable(clips, beatId, segmentId) {
  const owner = clips.find((clip) => clip.beatId !== beatId && clip.segmentId === segmentId);
  if (owner) throw new Error(`Selected alternative is already used by ${owner.beatId}.`);
}

export function refreshManualReplacementAlternatives(clip, previousSegmentId, replacementSegmentId) {
  clip.alternatives = alternativesAfterReplacement(clip.alternatives, previousSegmentId, replacementSegmentId);
  return clip.alternatives;
}

export function makeStagedOutputPath(outputPath, nonce = `${process.pid}-${Date.now()}`) {
  const ext = path.extname(outputPath);
  const stem = path.basename(outputPath, ext);
  return path.join(path.dirname(outputPath), `.${stem}.${nonce}.tmp${ext}`);
}

export async function renderReplacementStaged({ edl, outputPath, ttsPath, fitMode, render = renderEdl, nonce }) {
  const stagedPath = makeStagedOutputPath(outputPath, nonce);
  try {
    const outputMeta = await render({ edl, outputPath: stagedPath, ttsPath, fitMode });
    return { stagedPath, outputMeta };
  } catch (error) {
    await fs.rm(stagedPath, { force: true }).catch(() => {});
    throw error;
  }
}

export async function runProject({ projectDir, videoPaths, script, srtPath, ttsPath, apiKey, settings = {}, onStatus = () => {} }) {
  settings = resolveSettings(settings);
  const cacheDir = await ensureDir(path.join(projectDir, 'cache'));
  const workDir = await ensureDir(path.join(projectDir, 'work'));
  const outputDir = await ensureDir(path.join(projectDir, 'output'));
  const usage = new UsageTracker();
  await assertMediaTools();

  onStatus('원본 영상 메타데이터와 장면 전환을 분석하는 중');
  const allSegments = [];
  const sourceMeta = new Map();
  const sourceHashes = [];
  for (let i = 0; i < videoPaths.length; i++) {
    const sourceId = `V${i + 1}`;
    const local = await analyzeSourceLocally(videoPaths[i], sourceId, cacheDir, settings);
    sourceMeta.set(sourceId, local.meta);
    sourceHashes.push({ sourceId, hash: local.hash, duration: local.meta.duration });
    allSegments.push(...local.segments);
    onStatus(`장면 분석 ${i + 1}/${videoPaths.length}: ${local.segments.length}개 후보`);
  }

  let segments = allSegments;
  const cacheFingerprint = makeVisionCacheFingerprint({ model: settings.visionModel, sourceHashes, analysisWidth: settings.analysisWidth, sceneThreshold: settings.sceneThreshold, segmenting: settings.segmenting });
  const visionCachePath = path.join(cacheDir, `vision-${cacheFingerprint}.json`);
  if (apiKey) {
    const cached = await readJson(visionCachePath, null);
    const cacheValid = isVisionCachePayloadValid(allSegments, cached);
    if (cacheValid) {
      onStatus('AI 영상 분석 캐시 재사용');
      const baseMap = new Map(allSegments.map((s) => [s.id, s]));
      segments = cached.map((s) => ({ ...baseMap.get(s.id), ...s }));
    } else {
      onStatus(`OpenCode Vision으로 ${allSegments.length}개 장면 의미 분석 중`);
      try {
        segments = await analyzeSegmentsVision(allSegments, {
          apiKey, model: settings.visionModel, batchSize: settings.visionBatchSize, usage,
          onProgress: (p) => onStatus(`AI 장면 분석 ${Math.round(p * 100)}%`)
        });
        await writeJson(visionCachePath, segments.map(({ framePath, sourcePath, ...rest }) => rest));
      } catch (error) {
        if (settings.failOnAiError !== false) throw new Error(`OpenCode Vision 분석 실패: ${error.message}`);
        onStatus(`Vision API 분석 실패. 명시적 fallback 설정에 따라 로컬 장면 정보로 계속 진행: ${error.message}`);
        segments = allSegments;
      }
    }
  } else onStatus('API 키 없음: 의미 분석 없이 파이프라인 기능 테스트 모드');

  const srtText = srtPath ? await fs.readFile(srtPath, 'utf8') : '';
  onStatus('자막/TTS 타임라인을 편집 Beat로 변환하는 중');
  let beats = await buildBeats({ script, srtText, ttsPath, maxBeat: 3.2 });
  const beforeAdaptiveSplit = beats.length;
  beats = adaptBeatsToAvailableSegments(beats, segments);
  if (beats.length > beforeAdaptiveSplit) onStatus(`짧은 원본 컷에 맞춰 편집 Beat를 ${beforeAdaptiveSplit}개에서 ${beats.length}개로 세분화`);
  await writeJson(path.join(workDir, 'beats.json'), beats);
  await writeJson(path.join(workDir, 'segments.json'), segments.map(({ framePath, ...rest }) => rest));

  const edl = await buildEdl({ beats, segments, apiKey, settings, usage, workDir, onStatus });
  const validation = validateEdl(edl, sourceMeta);
  if (!validation.ok) throw new Error(`EDL validation failed: ${validation.errors.join('; ')}`);
  await writeJson(path.join(workDir, 'edl.json'), { version: 1, clips: edl });

  onStatus('FFmpeg로 최종 9:16 컷 편집 영상 렌더링 중');
  const outputPath = path.join(outputDir, 'shorts.mp4');
  const outputMeta = await renderEdl({ edl, outputPath, ttsPath, fitMode: settings.fitMode });
  const expectedDuration = beats.at(-1)?.end || validation.duration;
  const durationError = Math.abs(outputMeta.duration - expectedDuration);
  const qa = {
    ok: outputMeta.width === 1080 && outputMeta.height === 1920 && durationError <= 0.25,
    expectedDuration, actualDuration: outputMeta.duration, durationError,
    resolution: `${outputMeta.width}x${outputMeta.height}`,
    edl: validation,
    clips: edl.length,
    apiUsage: usage.snapshot(),
    settings
  };
  await writeJson(path.join(outputDir, 'qa.json'), qa);
  onStatus(qa.ok ? '완료: 자동 QA 통과' : '완료: QA 경고 확인 필요');
  return { outputPath, qa, beats, edl, apiUsage: usage.snapshot() };
}

export async function replaceClipAndRerender({ projectDir, project, beatId, segmentId, onStatus = () => {} }) {
  const workDir = path.join(projectDir, 'work');
  const outputDir = path.join(projectDir, 'output');
  const edlPath = path.join(workDir, 'edl.json');
  const qaPath = path.join(outputDir, 'qa.json');
  const edlDoc = await readJson(edlPath, null);
  const beats = await readJson(path.join(workDir, 'beats.json'), []);
  const segments = await readJson(path.join(workDir, 'segments.json'), []);
  if (!edlDoc?.clips?.length) throw new Error('EDL not found. Run automatic edit first.');
  const beat = beats.find((b) => b.id === beatId);
  const seg = segments.find((x) => x.id === segmentId);
  const clip = edlDoc.clips.find((x) => x.beatId === beatId);
  if (!beat || !seg || !clip) throw new Error('Beat, segment, or clip not found.');
  if (seg.duration + 0.04 < beat.duration) throw new Error('Selected alternative is shorter than this narration beat.');
  assertManualReplacementAvailable(edlDoc.clips, beatId, segmentId);
  const sourceIndex = Number(String(seg.sourceId).replace(/^V/, '')) - 1;
  const sourcePath = seg.sourcePath || project.videos?.[sourceIndex];
  if (!sourcePath) throw new Error('Source video path could not be resolved.');
  const previousSegmentId = clip.segmentId;
  clip.segmentId = seg.id; clip.sourceId = seg.sourceId; clip.sourcePath = sourcePath;
  clip.sourceStart = seg.start; clip.sourceEnd = Math.round((seg.start + beat.duration) * 1000) / 1000;
  clip.reason = 'Manual alternative selected; no AI call used.'; clip.score = null; clip.judgeScore = null; clip.locked = true;
  refreshManualReplacementAlternatives(clip, previousSegmentId, seg.id);

  const sourceMeta = new Map();
  for (let i = 0; i < (project.videos || []).length; i++) sourceMeta.set(`V${i+1}`, await probe(project.videos[i]));
  const validation = validateEdl(edlDoc.clips, sourceMeta);
  if (!validation.ok) throw new Error(`Replacement EDL validation failed: ${validation.errors.join('; ')}`);

  onStatus('선택한 컷으로 AI 호출 없이 재렌더링 중');
  const settings = resolveSettings(project.settings || {});
  const outputPath = path.join(outputDir, 'shorts.mp4');
  const { stagedPath, outputMeta } = await renderReplacementStaged({
    edl: edlDoc.clips,
    outputPath,
    ttsPath: project.ttsPath,
    fitMode: settings.fitMode
  });
  const expectedDuration = beats.at(-1)?.end || edlDoc.clips.at(-1)?.programEnd || 0;
  const durationError = Math.abs(outputMeta.duration - expectedDuration);
  const priorQa = await readJson(qaPath, {});
  const qa = {
    ...priorQa,
    ok: validation.ok && outputMeta.width === 1080 && outputMeta.height === 1920 && durationError <= 0.25,
    expectedDuration, actualDuration: outputMeta.duration, durationError,
    resolution: `${outputMeta.width}x${outputMeta.height}`,
    edl: validation, clips: edlDoc.clips.length,
    lastManualReplace: { beatId, segmentId, at: new Date().toISOString(), apiCallsAdded: 0 }
  };

  try {
    await fs.rename(stagedPath, outputPath);
    await writeJson(edlPath, edlDoc);
    await writeJson(qaPath, qa);
  } catch (error) {
    await fs.rm(stagedPath, { force: true }).catch(() => {});
    throw error;
  }

  onStatus(qa.ok ? '재렌더 완료: QA 통과' : '재렌더 완료: QA 경고');
  return { outputPath, qa };
}