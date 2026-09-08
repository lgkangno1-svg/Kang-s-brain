import {NextResponse} from 'next/server';
import {createStripeCheckoutSession} from '@/lib/payments/stripe';
import {isLaunchCheckoutProductKey} from '@/lib/payments/catalog';
import {DEFAULT_LOCALE, P0_LOCALES} from '@/lib/i18n/locales';

const CHECKOUT_ENABLED = process.env.STRIPE_CHECKOUT_ENABLED === 'true';

function normalizeLocale(value: unknown) {
  return typeof value === 'string' && (P0_LOCALES as readonly string[]).includes(value)
    ? value
    : DEFAULT_LOCALE;
}

export async function POST(request: Request) {
  if (!CHECKOUT_ENABLED) {
    return NextResponse.json(
      {error: 'Checkout is not enabled for this environment.', code: 'CHECKOUT_DISABLED'},
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

    // Authentication and durable ownership must be resolved server-side before this
    // pre-launch checkout can ever be enabled. Never accept a client-supplied
    // userId/account id as the authoritative payment recipient.
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
