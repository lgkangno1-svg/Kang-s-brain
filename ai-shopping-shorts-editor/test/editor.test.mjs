import test from 'node:test';
import assert from 'node:assert/strict';
import { buildEdl, chooseJudgeReplacement } from '../src/core/editor.mjs';

test('fallback editor keeps choosing the best remaining eligible scene', async () => {
  const beats = [
    { id: 'b1', start: 0, end: 1, duration: 1, text: '첫 장면' },
    { id: 'b2', start: 1, end: 2, duration: 1, text: '두 번째 장면' }
  ];
  const segments = [
    { id: 's1', sourceId: 'V1', sourcePath: '/tmp/v1.mp4', start: 0, end: 2, duration: 2, visualQuality: 10, productVisibility: 10 },
    { id: 's2', sourceId: 'V2', sourcePath: '/tmp/v2.mp4', start: 0, end: 2, duration: 2, visualQuality: 9, productVisibility: 9 },
    { id: 's3', sourceId: 'V3', sourcePath: '/tmp/v3.mp4', start: 0, end: 2, duration: 2, visualQuality: 1, productVisibility: 1 }
  ];

  const edl = await buildEdl({ beats, segments, apiKey: '', settings: {}, usage: {}, workDir: '/tmp' });

  assert.deepEqual(edl.map((clip) => clip.segmentId), ['s1', 's2']);
});

test('quality judge replacement skips segments already occupied by another beat', () => {
  const clip = { segmentId: 's1', sourceId: 'V1', alternatives: ['s2', 's3', 's4'] };
  const beat = { id: 'b1', duration: 1.5 };
  const segments = new Map([
    ['s2', { id: 's2', sourceId: 'V2', duration: 2.0 }],
    ['s3', { id: 's3', sourceId: 'V3', duration: 1.0 }],
    ['s4', { id: 's4', sourceId: 'V4', duration: 2.0 }]
  ]);

  const replacement = chooseJudgeReplacement(clip, beat, segments, new Set(['s2']));

  assert.equal(replacement?.id, 's4');
});
