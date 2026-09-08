import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(here, '..');
const checkoutRoute = readFileSync(path.join(projectRoot, 'src/app/api/checkout/stripe/route.ts'), 'utf8');
const webhookRoute = readFileSync(path.join(projectRoot, 'src/app/api/stripe/webhook/route.ts'), 'utf8');
const catalog = readFileSync(path.join(projectRoot, 'src/lib/payments/catalog.ts'), 'utf8');
const envExample = readFileSync(path.join(projectRoot, '.env.example'), 'utf8');

console.log('--- Testing Payment Launch Readiness Guards ---');

for (const flag of ['STRIPE_CHECKOUT_ENABLED','KOREA_PAYMENT_OWNERSHIP_READY','KOREA_PAYMENT_FULFILLMENT_READY']) {
  assert.match(checkoutRoute, new RegExp(flag), `${flag} must gate checkout.`);
  assert.match(envExample, new RegExp(`^${flag}=false$`, 'm'), `${flag} must default false in the example environment.`);
}
assert.match(checkoutRoute, /!CHECKOUT_ENABLED\s*\|\|\s*!OWNERSHIP_READY\s*\|\|\s*!FULFILLMENT_READY/,
  'Checkout must require all launch readiness gates simultaneously.');
assert.match(checkoutRoute, /CHECKOUT_DISABLED/,
  'Disabled environments must fail closed instead of attempting live checkout.');
assert.doesNotMatch(checkoutRoute, /const\s*\{[^}]*userId[^}]*\}\s*=\s*body/,
  'Checkout route must never trust a client-supplied userId as the payment recipient.');
assert.match(checkoutRoute, /P0_LOCALES/,
  'Checkout locale must be constrained to supported launch locales.');
assert.match(checkoutRoute, /isLaunchCheckoutProductKey/,
  'First-product checkout must reject legacy/future SKUs even if they remain in the development catalog.');
assert.match(catalog, /LAUNCH_CHECKOUT_PRODUCT_KEY\s*=\s*'my_korea_look_v1'/,
  'Launch checkout SKU must match the commercialization contract.');
assert.match(catalog, /STRIPE_PRICE_ID_MY_KOREA_LOOK_V1/,
  'Launch SKU must have a dedicated server-owned provider price mapping.');
assert.match(envExample, /NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=/,
  'Auth/data configuration should use a publishable browser key.');
assert.match(envExample, /SUPABASE_SECRET_KEY=/,
  'Server-only database credential must have an explicit non-public variable.');
assert.doesNotMatch(envExample, /NEXT_PUBLIC_SUPABASE_(SERVICE_ROLE|SECRET)/,
  'Supabase server secrets must never be exposed as NEXT_PUBLIC variables.');
assert.match(webhookRoute, /verifyStripeWebhookSignature/,
  'Stripe webhook must verify signatures before processing events.');

console.log('✓ Payment remains fail-closed behind checkout, ownership and fulfillment readiness gates.');
