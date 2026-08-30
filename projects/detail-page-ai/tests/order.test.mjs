import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeOrder } from '../src/domain/order.mjs';

const base = {
  planId: 'trial',
  productName: '테스트 사과',
  category: 'fruit',
  productDescription: '아삭한 식감의 과일입니다.',
  mainVisualStyle: 'product_only',
  modelShotCount: 0,
  tone: 'white',
  copyMood: 'sales',
  infoDensity: 'standard',
  highlightPoints: ['taste'],
  thumbnailStyle: 'strong_sales',
  acceptedImageTextRisk: true,
};

test('trial contract is fixed to 1 thumbnail + 8 body at medium', () => {
  const order = normalizeOrder(base);
  assert.equal(order.output.thumbnailCount, 1);
  assert.equal(order.output.bodyCount, 8);
  assert.equal(order.output.imageQuality, 'medium');
});

test('blank spec and price are omitted instead of fabricated', () => {
  const order = normalizeOrder({ ...base, specification: '   ', salePrice: '' });
  assert.equal(order.specification, null);
  assert.equal(order.salePrice, null);
  assert.equal(order.omissionRules.specification, true);
  assert.equal(order.omissionRules.salePrice, true);
});

test('standard body count follows information density', () => {
  assert.equal(normalizeOrder({ ...base, planId: 'standard', infoDensity: 'simple' }).output.bodyCount, 10);
  assert.equal(normalizeOrder({ ...base, planId: 'standard', infoDensity: 'standard' }).output.bodyCount, 11);
  assert.equal(normalizeOrder({ ...base, planId: 'standard', infoDensity: 'rich' }).output.bodyCount, 12);
});

test('order cannot proceed without typo-risk acknowledgement', () => {
  assert.throws(() => normalizeOrder({ ...base, acceptedImageTextRisk: false }), /Disclosure acceptance required/);
});
