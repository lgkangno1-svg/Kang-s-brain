import test from 'node:test';
import assert from 'node:assert/strict';
import { selectReferences } from '../src/orchestration/reference-selector.mjs';

const files = [
  { id: 'a', role: 'product_full', qualityScore: 0.95, productIdentityScore: 1, usefulnessScore: 0.9, duplicateGroupId: 'g1' },
  { id: 'b', role: 'product_full', qualityScore: 0.90, productIdentityScore: 0.9, usefulnessScore: 0.8, duplicateGroupId: 'g1' },
  { id: 'c', role: 'cross_section', qualityScore: 0.8, productIdentityScore: 0.9, usefulnessScore: 0.95, duplicateGroupId: 'g2' },
  { id: 'd', role: 'packaging', qualityScore: 0.75, productIdentityScore: 0.8, usefulnessScore: 0.8, duplicateGroupId: 'g3' },
  { id: 'e', role: 'proof_document', qualityScore: 0.7, productIdentityScore: 0.2, usefulnessScore: 1, duplicateGroupId: 'g4' },
];

test('selects diverse references and skips near-duplicate group', () => {
  const selected = selectReferences(files, 3);
  assert.equal(selected.length, 3);
  assert.ok(selected.some((file) => file.role === 'product_full'));
  assert.ok(selected.some((file) => file.role === 'cross_section'));
  assert.equal(selected.filter((file) => file.duplicateGroupId === 'g1').length, 1);
});
