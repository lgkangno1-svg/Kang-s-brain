import { probe, detectSilences } from './media.mjs';
import { clamp, round3 } from './utils.mjs';

function parseTimecode(tc) {
  const m = String(tc).trim().match(/(\d+):(\d+):(\d+)[,.](\d+)/);
  if (!m) return null;
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]) + Number(m[4].padEnd(3, '0').slice(0, 3)) / 1000;
}

export function parseSrt(text) {
  const blocks = String(text).replace(/\r/g, '').trim().split(/\n{2,}/);
  const items = [];
  for (const block of blocks) {
    const lines = block.split('\n');
    const timeLineIndex = lines.findIndex((l) => l.includes('-->'));
    if (timeLineIndex < 0) continue;
    const [a, b] = lines[timeLineIndex].split('-->').map((s) => s.trim());
    const start = parseTimecode(a); const end = parseTimecode(b);
    if (start == null || end == null || end <= start) continue;
    const caption = lines.slice(timeLineIndex + 1).join(' ').replace(/<[^>]+>/g, '').trim();
    if (!caption) continue;
    items.push({ id: `b${items.length + 1}`, start: round3(start), end: round3(end), text: caption });
  }
  return items;
}

export function splitScript(script) {
  const normalized = String(script || '').replace(/\r/g, '').trim();
  if (!normalized) return [];
  const sentences = normalized
    .split(/(?<=[.!?。！？])\s+|\n+/)
    .flatMap((s) => s.split(/(?<=다[.!?]?)\s+(?=[가-힣A-Za-z0-9])/))
    .map((s) => s.trim())
    .filter(Boolean);
  return sentences.length ? sentences : [normalized];
}

function textWeight(text) {
  return Math.max(1, String(text).replace(/\s/g, '').length);
}

function chooseBoundary(target, candidates, min, max) {
  const valid = candidates.filter((x) => x > min && x < max);
  if (!valid.length) return clamp(target, min, max);
  return valid.reduce((best, x) => Math.abs(x - target) < Math.abs(best - target) ? x : best, valid[0]);
}

export async function buildBeats({ script, srtText, ttsPath, maxBeat = 3.2, minBeat = 0.85 }) {
  let beats = srtText ? parseSrt(srtText) : [];
  if (!beats.length) {
    const phrases = splitScript(script);
    if (!phrases.length) throw new Error('Script or SRT is required.');
    let duration = phrases.length * 2.4;
    let silenceMids = [];
    if (ttsPath) {
      duration = (await probe(ttsPath)).duration || duration;
      const silences = await detectSilences(ttsPath);
      silenceMids = silences.map((s) => (s.start + s.end) / 2);
    }
    const totalWeight = phrases.reduce((a, t) => a + textWeight(t), 0);
    let cursor = 0;
    let usedWeight = 0;
    beats = phrases.map((text, idx) => {
      usedWeight += textWeight(text);
      const rawEnd = idx === phrases.length - 1 ? duration : duration * usedWeight / totalWeight;
      const end = idx === phrases.length - 1 ? duration : chooseBoundary(rawEnd, silenceMids, cursor + 0.35, duration - 0.2);
      const item = { id: `b${idx + 1}`, start: round3(cursor), end: round3(Math.max(cursor + 0.2, end)), text };
      cursor = item.end;
      return item;
    });
  }

  const normalized = [];
  for (const beat of beats) {
    const duration = beat.end - beat.start;
    if (duration <= maxBeat + 0.05) {
      normalized.push({ ...beat, id: `b${normalized.length + 1}` });
      continue;
    }
    const words = beat.text.split(/\s+/).filter(Boolean);
    const parts = Math.ceil(duration / maxBeat);
    const sizes = [];
    for (let i = 0; i < parts; i++) {
      const from = Math.floor(i * words.length / parts);
      const to = Math.floor((i + 1) * words.length / parts);
      sizes.push(words.slice(from, to).join(' ') || beat.text);
    }
    for (let i = 0; i < parts; i++) {
      const start = beat.start + duration * i / parts;
      const end = beat.start + duration * (i + 1) / parts;
      normalized.push({ id: `b${normalized.length + 1}`, start: round3(start), end: round3(end), text: sizes[i] });
    }
  }

  const final = [];
  for (const beat of normalized) {
    const d = beat.end - beat.start;
    if (d < minBeat && final.length && (beat.end - final.at(-1).start) <= maxBeat) {
      const prev = final.at(-1);
      prev.end = beat.end;
      prev.text = `${prev.text} ${beat.text}`.trim();
    } else final.push({ ...beat });
  }
  return final.map((b, i) => ({ ...b, id: `b${i + 1}`, duration: round3(b.end - b.start) }));
}
