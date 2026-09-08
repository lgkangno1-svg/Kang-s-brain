import {NextResponse} from 'next/server';
import {createStripeCheckoutSession} from '@/lib/payments/stripe';
import {isLaunchCheckoutProductKey} from '@/lib/payments/catalog';
import {DEFAULT_LOCALE, P0_LOCALES} from '@/lib/i18n/locales';

const CHECKOUT_ENABLED = process.env.STRIPE_CHECKOUT_ENABLED === 'true';
const OWNERSHIP_READY = process.env.KOREA_PAYMENT_OWNERSHIP_READY === 'true';
const FULFILLMENT_READY = process.env.KOREA_PAYMENT_FULFILLMENT_READY === 'true';
const WEBHOOK_PERSISTENCE_READY = process.env.KOREA_PAYMENT_WEBHOOK_PERSISTENCE_READY === 'true';
const DURABLE_PAYMENT_PERSISTENCE_IMPLEMENTED = false;

function normalizeLocale(value: unknown) {
  return typeof value === 'string' && (P0_LOCALES as readonly string[]).includes(value)
    ? value
    : DEFAULT_LOCALE;
}

export async function POST(request: Request) {
  if (!CHECKOUT_ENABLED || !OWNERSHIP_READY || !FULFILLMENT_READY || !WEBHOOK_PERSISTENCE_READY || !DURABLE_PAYMENT_PERSISTENCE_IMPLEMENTED) {
    return NextResponse.json(
      {
        error: 'Checkout is not enabled for this environment.',
        code: 'CHECKOUT_DISABLED',
        readiness: {
          checkout: CHECKOUT_ENABLED,
          ownership: OWNERSHIP_READY,
          fulfillment: FULFILLMENT_READY,
          webhookPersistence: WEBHOOK_PERSISTENCE_READY && DURABLE_PAYMENT_PERSISTENCE_IMPLEMENTED,
        },
      },
      {status: 503},
    );
  }

  try {
    const body = await request.json();
    const {productKey, locale} = body ?? {};

    if (!isLaunchCheckoutProductKey(productKey)) {
      return NextResponse.json(
        {error: 'This product is not enabled for launch checkout.', code: 'PRODUCT_NOT_LAUNCH_ENABLED'},
        {status: 400},
      );
    }

    // This path becomes reachable only in the same patch that replaces the
    // compile-time durable-persistence gate with a tested server-owned order flow.
    // Never accept a client-supplied user/account identifier as payment ownership.
    const result = await createStripeCheckoutSession({
      productKey,
      locale: normalizeLocale(locale),
    });

    if (!result.success) {
      const status = result.code === 'MISSING_PRICE_CONFIG' || result.code === 'MISSING_STRIPE_SECRET' ? 503 : 400;
      return NextResponse.json(
        {error: result.error, code: result.code},
        {status},
      );
    }

    return NextResponse.json({url: result.url, sessionId: result.sessionId});
  } catch {
    return NextResponse.json(
      {error: 'Malformed request payload.'},
      {status: 400},
    );
  }
}
