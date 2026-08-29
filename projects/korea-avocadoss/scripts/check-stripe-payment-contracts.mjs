import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync, existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import crypto from 'node:crypto';
import ts from 'typescript';

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(here, '..');
const moduleCache = new Map();

function loadTsModule(relativePath) {
  const fullPath = path.resolve(projectRoot, relativePath);
  if (moduleCache.has(fullPath)) return moduleCache.get(fullPath);
  const source = readFileSync(fullPath, 'utf8');
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, strict: true},
    fileName: fullPath,
    reportDiagnostics: true,
  });
  const errors = (transpiled.diagnostics ?? []).filter((item) => item.category === ts.DiagnosticCategory.Error);
  assert.equal(errors.length, 0, `Transpile error in ${relativePath}: ${errors.map((e) => e.messageText).join('; ')}`);
  const runtimeModule = {exports: {}};
  moduleCache.set(fullPath, runtimeModule.exports);
  const baseRequire = createRequire(fullPath);
  const customRequire = (specifier) => {
    if (specifier.startsWith('.')) {
      const candidateTs = path.resolve(path.dirname(fullPath), specifier.endsWith('.ts') ? specifier : specifier + '.ts');
      if (existsSync(candidateTs)) {
        return loadTsModule(path.relative(projectRoot, candidateTs));
      }
    }
    return baseRequire(specifier);
  };
  const execute = new Function('exports', 'module', 'require', '__filename', '__dirname', transpiled.outputText);
  execute(runtimeModule.exports, runtimeModule, customRequire, fullPath, path.dirname(fullPath));
  return runtimeModule.exports;
}

const catalogMod = loadTsModule('src/lib/payments/catalog.ts');
const stripeMod = loadTsModule('src/lib/payments/stripe.ts');

const {
  APPROVED_PRODUCT_KEYS,
  PRODUCT_CATALOG,
  isApprovedProductKey,
  resolveStripePriceId,
} = catalogMod;

const {
  verifyStripeWebhookSignature,
  createStripeCheckoutSession,
} = stripeMod;

console.log('--- Testing Stripe Global Payment Foundations (Security & Contracts) ---');

// 1. Catalog & Approved Keys
assert.ok(APPROVED_PRODUCT_KEYS.includes('premium_hanbok_match'));
assert.ok(APPROVED_PRODUCT_KEYS.includes('premium_naming_studio'));
assert.ok(APPROVED_PRODUCT_KEYS.includes('trip_pass_basic'));
assert.equal(isApprovedProductKey('premium_hanbok_match'), true);
assert.equal(isApprovedProductKey('random_injected_product'), false);
assert.equal(isApprovedProductKey(null), false);

// 2. Client Amount / Price Injection Prevention
// Product catalog strictly controls price env var mappings
assert.equal(PRODUCT_CATALOG.premium_hanbok_match.priceEnvVar, 'STRIPE_PRICE_ID_HANBOK_MATCH');

// Unconfigured Price ID fails safely without inventing a fake price
delete process.env.STRIPE_PRICE_ID_HANBOK_MATCH;
const missingPriceRes = resolveStripePriceId('premium_hanbok_match');
assert.equal(missingPriceRes.priceId, null);
assert.ok(missingPriceRes.error.includes('is not configured'));

// Configured Price ID resolves correctly
process.env.STRIPE_PRICE_ID_HANBOK_MATCH = 'price_test_12345';
const configuredPriceRes = resolveStripePriceId('premium_hanbok_match');
assert.equal(configuredPriceRes.priceId, 'price_test_12345');

// 3. Checkout Session Creation Security
// Missing secret key fails safely
delete process.env.STRIPE_SECRET_KEY;
const missingSecretRes = await createStripeCheckoutSession({
  productKey: 'premium_hanbok_match',
  locale: 'en',
});
assert.equal(missingSecretRes.success, false);
assert.equal(missingSecretRes.code, 'MISSING_STRIPE_SECRET');

// Unapproved product key fails safely
process.env.STRIPE_SECRET_KEY = 'sk_test_mock_key';
const invalidProductRes = await createStripeCheckoutSession({
  productKey: 'injected_custom_amount_key',
  locale: 'en',
});
assert.equal(invalidProductRes.success, false);
assert.equal(invalidProductRes.code, 'INVALID_PRODUCT');

// Missing Price ID configuration fails safely
delete process.env.STRIPE_PRICE_ID_NAMING_STUDIO;
const missingPriceCheckout = await createStripeCheckoutSession({
  productKey: 'premium_naming_studio',
  locale: 'en',
});
assert.equal(missingPriceCheckout.success, false);
assert.equal(missingPriceCheckout.code, 'MISSING_PRICE_CONFIG');

// 4. Webhook Signature Verification (HMAC-SHA256)
const mockWebhookSecret = 'whsec_test_mock_secret_12345';
const mockPayload = JSON.stringify({
  id: 'evt_test_123',
  type: 'checkout.session.completed',
  data: {
    object: {
      id: 'cs_test_session_999',
      payment_status: 'paid',
      metadata: { productKey: 'premium_hanbok_match' },
      client_reference_id: 'user_opaque_123',
    },
  },
});

const timestamp = Math.floor(Date.now() / 1000).toString();
const payloadToSign = `${timestamp}.${mockPayload}`;
const validSignature = crypto
  .createHmac('sha256', mockWebhookSecret)
  .update(payloadToSign, 'utf8')
  .digest('hex');

const validHeader = `t=${timestamp},v1=${validSignature}`;

// Valid signature passes
const validVerify = verifyStripeWebhookSignature(mockPayload, validHeader, mockWebhookSecret);
assert.equal(validVerify.success, true);
assert.equal(validVerify.event?.id, 'evt_test_123');
assert.equal(validVerify.event?.type, 'checkout.session.completed');

// Tampered payload fails
const tamperedPayload = mockPayload + ' ';
const tamperedVerify = verifyStripeWebhookSignature(tamperedPayload, validHeader, mockWebhookSecret);
assert.equal(tamperedVerify.success, false);
assert.equal(tamperedVerify.code, 'INVALID_SIGNATURE');

// Invalid signature string fails
const invalidSigHeader = `t=${timestamp},v1=deadbeef1234567890`;
const invalidSigVerify = verifyStripeWebhookSignature(mockPayload, invalidSigHeader, mockWebhookSecret);
assert.equal(invalidSigVerify.success, false);
assert.equal(invalidSigVerify.code, 'INVALID_SIGNATURE');

// Expired timestamp (> 300s tolerance) fails
const expiredTimestamp = (Math.floor(Date.now() / 1000) - 400).toString();
const expiredPayloadToSign = `${expiredTimestamp}.${mockPayload}`;
const expiredSignature = crypto
  .createHmac('sha256', mockWebhookSecret)
  .update(expiredPayloadToSign, 'utf8')
  .digest('hex');
const expiredHeader = `t=${expiredTimestamp},v1=${expiredSignature}`;

const expiredVerify = verifyStripeWebhookSignature(mockPayload, expiredHeader, mockWebhookSecret);
assert.equal(expiredVerify.success, false);
assert.equal(expiredVerify.code, 'INVALID_SIGNATURE');

// Missing secret fails
const missingSecretVerify = verifyStripeWebhookSignature(mockPayload, validHeader, null);
assert.equal(missingSecretVerify.success, false);
assert.equal(missingSecretVerify.code, 'MISSING_SECRET');

console.log('✓ All Stripe Payment Security & Webhook Signature tests passed!');
