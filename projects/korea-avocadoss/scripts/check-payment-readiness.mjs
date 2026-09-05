import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(here, '..');
const checkoutRoute = readFileSync(path.join(projectRoot, 'src/app/api/checkout/stripe/route.ts'), 'utf8');
const webhookRoute = readFileSync(path.join(projectRoot, 'src/app/api/stripe/webhook/route.ts'), 'utf8');

console.log('--- Testing Payment Launch Readiness Guards ---');

assert.match(checkoutRoute, /STRIPE_CHECKOUT_ENABLED/,
  'Stripe checkout must remain behind an explicit environment activation flag.');
assert.match(checkoutRoute, /CHECKOUT_DISABLED/,
  'Disabled environments must fail closed instead of attempting live checkout.');
assert.doesNotMatch(checkoutRoute, /const\s*\{[^}]*userId[^}]*\}\s*=\s*body/,
  'Checkout route must never trust a client-supplied userId as the payment recipient.');
assert.match(checkoutRoute, /P0_LOCALES/,
  'Checkout locale must be constrained to supported launch locales.');
assert.match(webhookRoute, /verifyStripeWebhookSignature/,
  'Stripe webhook must verify signatures before processing events.');

console.log('✓ Payment activation guards are present.');
