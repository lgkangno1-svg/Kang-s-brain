import test from 'node:test';
import assert from 'node:assert/strict';
import { buildEdl } from '../src/core/editor.mjs';

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
