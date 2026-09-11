import { promises as fs } from 'node:fs';
import path from 'node:path';
import { run } from './process.mjs';
import { clamp, ensureDir, round3, sha256File } from './utils.mjs';

export async function assertMediaTools() {
  await run('ffmpeg', ['-version']);
  await run('ffprobe', ['-version']);
}

export async function probe(filePath) {
  const { stdout } = await run('ffprobe', [
    '-v', 'error', '-print_format', 'json', '-show_format', '-show_streams', filePath
  ]);
  const data = JSON.parse(stdout);
  const video = data.streams?.find((s) => s.codec_type === 'video');
  const audio = data.streams?.find((s) => s.codec_type === 'audio');
  const duration = Number(data.format?.duration || video?.duration || audio?.duration || 0);
  const fpsRaw = video?.avg_frame_rate || video?.r_frame_rate || '0/1';
  const [a, b] = fpsRaw.split('/').map(Number);
  const fps = b ? a / b : Number(fpsRaw || 0);
  return {
    duration,
    width: Number(video?.width || 0),
    height: Number(video?.height || 0),
    fps,
    videoCodec: video?.codec_name || null,
    audioCodec: audio?.codec_name || null,
    hasAudio: Boolean(audio)
  };
}

export async function detectSceneChanges(filePath, threshold = 0.32) {
  try {
    const { stderr } = await run('ffmpeg', [
      '-hide_banner', '-i', filePath,
      '-vf', `select='gt(scene,${threshold})',showinfo`,
      '-an', '-f', 'null', '-'
    ]);
    const times = [];
    for (const match of stderr.matchAll(/pts_time:([0-9.]+)/g)) {
      const t = Number(match[1]);
      if (Number.isFinite(t)) times.push(t);
    }
    return [...new Set(times)].sort((x, y) => x - y);
  } catch {
    return [];
  }
}

export function normalizeSegments(boundaries, duration, options = {}) {
  const min = options.min ?? 1.0;
  const ideal = options.ideal ?? 2.6;
  const max = options.max ?? 4.8;
  const maxSegments = options.maxSegments ?? 90;
  const points = [0, ...boundaries.filter((t) => t > 0.2 && t < duration - 0.2), duration]
    .sort((a, b) => a - b);
  const raw = [];
  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i];
    const end = points[i + 1];
    if (end - start < 0.15) continue;
    raw.push({ start, end });
  }

  const merged = [];
  for (const seg of raw) {
    const d = seg.end - seg.start;
    if (d < min && merged.length) {
      const prev = merged.at(-1);
      if (seg.end - prev.start <= max + min) {
        prev.end = seg.end;
        continue;
      }
    }
    merged.push({ ...seg });
  }

  const split = [];
  for (const seg of merged) {
    const d = seg.end - seg.start;
    if (d <= max) {
      split.push(seg);
      continue;
    }
    const n = Math.ceil(d / ideal);
    const piece = d / n;
    for (let i = 0; i < n; i++) {
      split.push({ start: seg.start + i * piece, end: i === n - 1 ? seg.end : seg.start + (i + 1) * piece });
    }
  }

  if (split.length <= maxSegments) return split.map((s) => ({ start: round3(s.start), end: round3(s.end) }));
  const stride = split.length / maxSegments;
  const sampled = [];
  for (let i = 0; i < maxSegments; i++) sampled.push(split[Math.floor(i * stride)]);
  return sampled.map((s) => ({ start: round3(s.start), end: round3(s.end) }));
}

export async function extractRepresentativeFrame(filePath, segment, outPath, width = 512) {
  await ensureDir(path.dirname(outPath));
  const t = clamp(segment.start + (segment.end - segment.start) * 0.5, segment.start, Math.max(segment.start, segment.end - 0.05));
  await run('ffmpeg', [
    '-hide_banner', '-loglevel', 'error', '-y',
    '-ss', String(t), '-i', filePath,
    '-frames:v', '1', '-vf', `scale=${width}:-2`,
    '-q:v', '6', outPath
  ]);
  return outPath;
}

export async function extractFrameAt(filePath, time, outPath, width = 640) {
  await ensureDir(path.dirname(outPath));
  await run('ffmpeg', [
    '-hide_banner', '-loglevel', 'error', '-y',
    '-ss', String(Math.max(0, time)), '-i', filePath,
    '-frames:v', '1', '-vf', `scale=${width}:-2`, '-q:v', '5', outPath
  ]);
  return outPath;
}

export async function analyzeSourceLocally(filePath, sourceId, cacheDir, settings = {}) {
  const hash = await sha256File(filePath);
  const meta = await probe(filePath);
  const boundaries = await detectSceneChanges(filePath, settings.sceneThreshold ?? 0.32);
  const segments = normalizeSegments(boundaries, meta.duration, settings.segmenting);
  const frameDir = await ensureDir(path.join(cacheDir, hash, 'frames'));
  const result = [];
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const id = `${sourceId}_s${String(i + 1).padStart(3, '0')}`;
    const framePath = path.join(frameDir, `${id}.jpg`);
    try { await fs.access(framePath); } catch { await extractRepresentativeFrame(filePath, seg, framePath, settings.analysisWidth ?? 512); }
    result.push({
      id,
      sourceId,
      sourcePath: filePath,
      start: seg.start,
      end: seg.end,
      duration: round3(seg.end - seg.start),
      framePath,
      description: `Unanalyzed scene from ${sourceId}`,
      actions: [], subjects: [], usabilityTags: [],
      shotType: 'unknown', productVisibility: 0.5, visualQuality: 0.5,
      motionLevel: 0.5, confidence: 0.1
    });
  }
  return { hash, meta, segments: result };
}

export async function detectSilences(audioPath, noise = '-35dB', minDuration = 0.25) {
  try {
    const { stderr } = await run('ffmpeg', [
      '-hide_banner', '-i', audioPath,
      '-af', `silencedetect=noise=${noise}:d=${minDuration}`,
      '-f', 'null', '-'
    ]);
    const starts = [...stderr.matchAll(/silence_start: ([0-9.]+)/g)].map((m) => Number(m[1]));
    const ends = [...stderr.matchAll(/silence_end: ([0-9.]+)/g)].map((m) => Number(m[1]));
    const pairs = [];
    for (let i = 0; i < Math.min(starts.length, ends.length); i++) pairs.push({ start: starts[i], end: ends[i] });
    return pairs;
  } catch { return []; }
}
