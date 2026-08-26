import test from 'node:test';
import assert from 'node:assert/strict';
import { validateJudgeResponse } from '../src/core/opencode.mjs';

test('Quality Judge integrity accepts exactly one judgment per beat regardless of response order', () => {
  const items = [{ beatId: 'b1' }, { beatId: 'b2' }];
  const parsed = [{ beatId: 'b2', score: 80 }, { beatId: 'b1', score: 70 }];
  assert.equal(validateJudgeResponse(items, parsed), parsed);
});

test('Quality Judge integrity rejects missing, duplicate, unexpected, and malformed beat coverage', () => {
  const items = [{ beatId: 'b1' }, { beatId: 'b2' }];
  assert.throws(() => validateJudgeResponse(items, [{ beatId: 'b1' }]), /missing=\[b2\]/);
  assert.throws(() => validateJudgeResponse(items, [{ beatId: 'b1' }, { beatId: 'b1' }]), /duplicate=\[b1\]/);
  assert.throws(() => validateJudgeResponse(items, [{ beatId: 'b1' }, { beatId: 'alien' }]), /unexpected=\[alien\]/);
  assert.throws(() => validateJudgeResponse(items, {}), /Judge did not return an array/);
});
