import test from 'node:test';
import assert from 'node:assert/strict';
import { assertManualReplacementAvailable, isVisionCachePayloadValid, makeVisionCacheFingerprint, VISION_CACHE_SCHEMA } from '../src/core/pipeline.mjs';

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

test('Vision cache accepts a complete payload matching the current semantic contract', () => {
  const segments = [{ id: 's1' }, { id: 's2' }];
  const cached = segments.map(({ id }) => ({
    id,
    description: `${id} description`,
    subjects: ['상품'],
    actions: ['보여주기'],
    usabilityTags: ['디테일'],
    shotType: 'close_up',
    productVisibility: 0.9,
    visualQuality: 0.8,
    motionLevel: 0.3,
    confidence: 0.95
  }));

  assert.equal(isVisionCachePayloadValid(segments, cached), true);
});

test('Vision cache rejects duplicate IDs that hide a missing segment', () => {
  const segments = [{ id: 's1' }, { id: 's2' }];
  const row = {
    id: 's1',
    description: '상품 클로즈업',
    subjects: ['상품'],
    actions: ['보여주기'],
    usabilityTags: ['디테일'],
    shotType: 'close_up',
    productVisibility: 0.9,
    visualQuality: 0.8,
    motionLevel: 0.3,
    confidence: 0.95
  };

  assert.equal(isVisionCachePayloadValid(segments, [row, { ...row }]), false);
});

test('Vision cache rejects malformed semantic fields even when IDs and length match', () => {
  const segments = [{ id: 's1' }];
  const cached = [{
    id: 's1',
    description: '상품 클로즈업',
    subjects: ['상품'],
    actions: '보여주기',
    usabilityTags: ['디테일'],
    shotType: 'close_up',
    productVisibility: 0.9,
    visualQuality: 0.8,
    motionLevel: 0.3,
    confidence: 0.95
  }];

  assert.equal(isVisionCachePayloadValid(segments, cached), false);
});