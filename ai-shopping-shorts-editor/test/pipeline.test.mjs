import test from 'node:test';
import assert from 'node:assert/strict';
import { assertManualReplacementAvailable, makeVisionCacheFingerprint, VISION_CACHE_SCHEMA } from '../src/core/pipeline.mjs';

test('manual replacement rejects a segment already used by another beat before rerender', () => {
  const clips = [
    { beatId: 'b1', segmentId: 's1' },
    { beatId: 'b2', segmentId: 's2' }
  ];

  assert.throws(
    () => assertManualReplacementAvailable(clips, 'b1', 's2'),
    /already used by b2/
  );
});

test('manual replacement allows the current beat segment and an unused segment', () => {
  const clips = [
    { beatId: 'b1', segmentId: 's1' },
    { beatId: 'b2', segmentId: 's2' }
  ];

  assert.doesNotThrow(() => assertManualReplacementAvailable(clips, 'b1', 's1'));
  assert.doesNotThrow(() => assertManualReplacementAvailable(clips, 'b1', 's3'));
});

test('Vision cache fingerprint changes when the semantic cache schema changes', () => {
  const input = {
    model: 'deepseek-v4-flash-vision-exp',
    sourceHashes: [{ sourceId: 'V1', hash: 'abc123', duration: 9 }],
    analysisWidth: 512,
    sceneThreshold: 0.32,
    segmenting: { min: 1, ideal: 3, max: 5.2, maxSegments: 80 }
  };

  const current = makeVisionCacheFingerprint(input);
  const previousContract = makeVisionCacheFingerprint(input, VISION_CACHE_SCHEMA - 1);

  assert.equal(current, makeVisionCacheFingerprint(input));
  assert.notEqual(current, previousContract);
});
