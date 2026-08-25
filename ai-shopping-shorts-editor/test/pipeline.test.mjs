import test from 'node:test';
import assert from 'node:assert/strict';
import { assertManualReplacementAvailable } from '../src/core/pipeline.mjs';

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
