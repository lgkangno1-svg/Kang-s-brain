import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeOrder } from '../src/domain/order.mjs';
import { buildPromptContext, CUSTOMER_FIRST_PRECEDENCE } from '../src/orchestration/prompt-context.mjs';

const base = {
  planId: 'standard',
  productName: '테스트 고구마',
  category: 'vegetable',
  productDescription: '비세척 고구마',
  mainVisualStyle: 'farm_documentary',
  modelShotCount: 2,
  tone: 'beige',
  copyMood: 'trust',
  infoDensity: 'rich',
  highlightPoints: ['origin', 'taste'],
  thumbnailStyle: 'premium',
  acceptedImageTextRisk: true,
};

test('customer options remain above master defaults and missing optional facts are absent', () => {
  const order = normalizeOrder({ ...base, specification: '', salePrice: '' });
  const context = buildPromptContext(order, { route: 'direct_conversion_master', facts: { origin: '국내산' } });
  assert.equal(context.customerDirection.tone, 'beige');
  assert.equal(context.customerDirection.modelShotCount, 2);
  assert.equal(context.product.facts.origin, '국내산');
  assert.equal('salePrice' in context.product.facts, false);
  assert.equal('specification' in context.product.facts, false);
  assert.equal(CUSTOMER_FIRST_PRECEDENCE[0], 'uploaded_ground_truth');
});
