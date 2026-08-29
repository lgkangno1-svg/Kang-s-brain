import {NextResponse} from 'next/server';
import {createStripeCheckoutSession} from '@/lib/payments/stripe';
import {isApprovedProductKey} from '@/lib/payments/catalog';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {productKey, locale, userId} = body ?? {};

    if (!isApprovedProductKey(productKey)) {
      return NextResponse.json(
        {error: 'Invalid or unapproved product key. Amount/price injection is prohibited.'},
        {status: 400},
      );
    }

    const result = await createStripeCheckoutSession({
      productKey,
      locale: typeof locale === 'string' && locale ? locale : 'en',
      userId: typeof userId === 'string' ? userId : undefined,
    });

    if (!result.success) {
      const status = result.code === 'MISSING_PRICE_CONFIG' || result.code === 'MISSING_STRIPE_SECRET' ? 503 : 400;
      return NextResponse.json(
        {error: result.error, code: result.code},
        {status},
      );
    }

    return NextResponse.json({url: result.url, sessionId: result.sessionId});
  } catch (err) {
    return NextResponse.json(
      {error: 'Malformed request payload.'},
      {status: 400},
    );
  }
}
