import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveSettings } from '../src/core/pipeline.mjs';

test('quality mode keeps the intended smaller Vision batch', () => {
  const s = resolveSettings({ qualityMode: 'quality' });
  assert.equal(s.visionBatchSize, 8);
  assert.equal(s.analysisWidth, 640);
  assert.equal(s.failOnAiError, true);
});

test('economy mode uses the larger low-cost Vision batch', () => {
  const s = resolveSettings({ qualityMode: 'economy' });
  assert.equal(s.visionBatchSize, 14);
  assert.equal(s.analysisWidth, 384);
});
