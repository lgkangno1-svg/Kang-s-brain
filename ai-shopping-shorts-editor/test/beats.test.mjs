import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSrt, splitScript, buildBeats, adaptBeatsToAvailableSegments } from '../src/core/beats.mjs';
import { normalizeSegments } from '../src/core/media.mjs';
import { validateEdl } from '../src/core/editor.mjs';

test('parseSrt parses Korean captions', () => {
  const rows = parseSrt('1\n00:00:00,000 --> 00:00:02,000\n안녕하세요\n\n2\n00:00:02,000 --> 00:00:04,500\n상품입니다');
  assert.equal(rows.length, 2); assert.equal(rows[1].end, 4.5);
});

test('splitScript respects newlines', () => {
  assert.deepEqual(splitScript('첫 문장입니다.\n두 번째입니다.'), ['첫 문장입니다.', '두 번째입니다.']);
});

test('normalizeSegments splits long shots', () => {
  const s = normalizeSegments([], 12, { ideal: 2.5, max: 4, min: 1 });
  assert.ok(s.length >= 4); assert.equal(s[0].start, 0); assert.equal(s.at(-1).end, 12);
});

test('validateEdl catches gaps', () => {
  const x = validateEdl([{ programStart: 0, programEnd: 2, sourceStart: 0, sourceEnd: 2, segmentId: 'a', sourceId: 'V1' }, { programStart: 2.5, programEnd: 4, sourceStart: 1, sourceEnd: 2.5, segmentId: 'b', sourceId: 'V2' }]);
  assert.equal(x.ok, false);
});

test('buildBeats closes normal SRT caption gaps so EDL timing stays contiguous', async () => {
  const srt = '1\n00:00:00,200 --> 00:00:01,000\n첫 장면\n\n2\n00:00:01,200 --> 00:00:02,200\n두 번째 장면';
  const out = await buildBeats({ script: '', srtText: srt, ttsPath: null, minBeat: 0.2, maxBeat: 3.2 });
  assert.equal(out.length, 2);
  assert.equal(out[0].start, 0);
  assert.equal(out[0].end, 1.2);
  assert.equal(out[1].start, 1.2);
  assert.equal(out[1].end, 2.2);
});

test('buildBeats trims partial SRT overlap while preserving caption order', async () => {
  const srt = '1\n00:00:00,200 --> 00:00:02,000\n첫 장면\n\n2\n00:00:01,500 --> 00:00:03,000\n두 번째 장면\n\n3\n00:00:03,200 --> 00:00:04,000\n세 번째 장면';
  const out = await buildBeats({ script: '', srtText: srt, ttsPath: null, minBeat: 0.2, maxBeat: 3.2 });
  assert.equal(out.length, 3);
  assert.equal(out[0].start, 0);
  assert.equal(out[0].end, 2);
  assert.equal(out[1].start, 2);
  assert.equal(out[1].end, 3.2);
  assert.equal(out[1].text, '두 번째 장면');
  assert.equal(out[2].start, 3.2);
  assert.equal(out[2].end, 4);
});

test('buildBeats folds a fully-contained overlapping SRT cue into the previous beat', async () => {
  const srt = '1\n00:00:00,000 --> 00:00:02,000\n첫 장면\n\n2\n00:00:01,000 --> 00:00:01,500\n강조 문구\n\n3\n00:00:02,000 --> 00:00:03,000\n다음 장면';
  const out = await buildBeats({ script: '', srtText: srt, ttsPath: null, minBeat: 0.2, maxBeat: 3.2 });
  assert.equal(out.length, 2);
  assert.equal(out[0].start, 0);
  assert.equal(out[0].end, 2);
  assert.equal(out[0].text, '첫 장면 강조 문구');
  assert.equal(out[1].start, 2);
  assert.equal(out[1].end, 3);
});

test('buildBeats merges a leading micro-beat forward when it fits maxBeat', async () => {
  const srt = '1\n00:00:00,000 --> 00:00:00,300\n자\n\n2\n00:00:00,300 --> 00:00:01,800\n상품을 보여드릴게요\n\n3\n00:00:01,800 --> 00:00:03,200\n포장도 확인하세요';
  const out = await buildBeats({ script: '', srtText: srt, ttsPath: null, minBeat: 0.85, maxBeat: 3.2 });
  assert.equal(out.length, 2);
  assert.equal(out[0].start, 0);
  assert.equal(out[0].end, 1.8);
  assert.equal(out[0].duration, 1.8);
  assert.equal(out[0].text, '자 상품을 보여드릴게요');
  assert.equal(out[1].start, 1.8);
});

test('adaptBeatsToAvailableSegments splits narration when every source shot is shorter', () => {
  const beats = [{ id:'b1', start:0, end:3, duration:3, text:'빠른 장면에서도 자막 타이밍에 맞춰 편집합니다' }];
  const segments = [{ duration:1.2 }, { duration:1.1 }, { duration:1.0 }];
  const out = adaptBeatsToAvailableSegments(beats, segments);
  assert.ok(out.length >= 3);
  assert.equal(out[0].start, 0);
  assert.equal(out.at(-1).end, 3);
  assert.ok(out.every((b) => b.duration <= 1.24));
});
