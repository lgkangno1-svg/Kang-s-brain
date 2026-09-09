import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(here, '..');
const checkoutRoute = readFileSync(path.join(projectRoot, 'src/app/api/checkout/stripe/route.ts'), 'utf8');
const stripeHelper = readFileSync(path.join(projectRoot, 'src/lib/payments/stripe.ts'), 'utf8');
const webhookRoute = readFileSync(path.join(projectRoot, 'src/app/api/stripe/webhook/route.ts'), 'utf8');
const catalog = readFileSync(path.join(projectRoot, 'src/lib/payments/catalog.ts'), 'utf8');
const envExample = readFileSync(path.join(projectRoot, '.env.example'), 'utf8');

console.log('--- Testing Payment Launch Readiness Guards ---');

const gates=['STRIPE_CHECKOUT_ENABLED','KOREA_PAYMENT_OWNERSHIP_READY','KOREA_PAYMENT_FULFILLMENT_READY','KOREA_PAYMENT_WEBHOOK_PERSISTENCE_READY'];
for (const flag of gates) {
  assert.match(checkoutRoute, new RegExp(flag), `${flag} must gate checkout.`);
  assert.match(envExample, new RegExp(`^${flag}=false$`, 'm'), `${flag} must default false in the example environment.`);
}
assert.match(checkoutRoute, /DURABLE_PAYMENT_PERSISTENCE_IMPLEMENTED\s*=\s*false/,
  'Checkout must remain compile-time blocked until durable event persistence is implemented in code.');
assert.match(checkoutRoute, /!CHECKOUT_ENABLED[\s\S]*!OWNERSHIP_READY[\s\S]*!FULFILLMENT_READY[\s\S]*!WEBHOOK_PERSISTENCE_READY[\s\S]*!DURABLE_PAYMENT_PERSISTENCE_IMPLEMENTED/,
  'Checkout must require all launch readiness gates simultaneously.');
assert.match(checkoutRoute, /CHECKOUT_DISABLED/,
  'Disabled environments must fail closed instead of attempting live checkout.');
assert.doesNotMatch(checkoutRoute, /const\s*\{[^}]*userId[^}]*\}\s*=\s*body/,
  'Checkout route must never trust a client-supplied userId as the payment recipient.');
assert.doesNotMatch(stripeHelper, /\buserId\??\s*:/,
  'Stripe checkout helper must not expose a userId parameter before authenticated order ownership exists.');
assert.doesNotMatch(stripeHelper, /body\.set\(['"]client_reference_id['"]/,
  'Stripe checkout helper must not attach client_reference_id before it can come from verified server ownership.');
assert.match(stripeHelper, /verified server session/i,
  'Stripe checkout helper must require future payment ownership to originate from a verified server session.');
assert.match(stripeHelper, /durable[\s\S]{0,80}server-created order/i,
  'Stripe checkout helper must require future payment ownership to be attached through a durable server-created order.');
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
  'Stripe webhook must verify signatures before any handling.');
assert.match(webhookRoute, /DURABLE_PAYMENT_PERSISTENCE_IMPLEMENTED\s*=\s*false/,
  'Webhook must remain compile-time blocked until durable persistence is implemented.');
assert.match(webhookRoute, /WEBHOOK_PERSISTENCE_DISABLED/,
  'Verified events must return a retryable failure instead of false success before persistence exists.');
assert.doesNotMatch(webhookRoute, /console\.log\(`\[Stripe Webhook\]/,
  'Webhook must not substitute logging for durable payment event acceptance.');

console.log('✓ Payment remains fail-closed behind checkout, verified ownership, fulfillment, webhook and compile-time persistence gates.');
