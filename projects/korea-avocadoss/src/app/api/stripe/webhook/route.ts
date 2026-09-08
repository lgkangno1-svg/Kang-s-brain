import {NextResponse} from 'next/server';
import {verifyStripeWebhookSignature} from '@/lib/payments/stripe';

const WEBHOOK_PERSISTENCE_READY = process.env.KOREA_PAYMENT_WEBHOOK_PERSISTENCE_READY === 'true';
// Deliberate compile-time launch block. Change only in the same patch that writes
// verified Stripe events idempotently to the dedicated Korea database and queues fulfillment.
const DURABLE_PAYMENT_PERSISTENCE_IMPLEMENTED = false;

export async function POST(request: Request) {
  try {
    const signature = request.headers.get('stripe-signature');
    const rawBody = await request.text();
    const verification = verifyStripeWebhookSignature(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);

    if (!verification.success) {
      return NextResponse.json(
        {error: verification.error, code: verification.code},
        {status: 400},
      );
    }

    if (!WEBHOOK_PERSISTENCE_READY || !DURABLE_PAYMENT_PERSISTENCE_IMPLEMENTED) {
      // Do not return 2xx for a verified payment event until it has a durable,
      // idempotent persistence path. Stripe should retry rather than letting us
      // silently lose a paid order.
      return NextResponse.json(
        {error: 'Durable payment event persistence is not launch-ready.', code: 'WEBHOOK_PERSISTENCE_DISABLED'},
        {status: 503},
      );
    }

    // Unreachable while the compile-time persistence gate above is false.
    // The implementation patch that flips the gate must:
    // 1) insert provider+event ID idempotently,
    // 2) resolve a server-owned order,
    // 3) transition the order state transactionally,
    // 4) enqueue fulfillment once,
    // 5) return 2xx only after durable acceptance.
    return NextResponse.json({received: true});
  } catch {
    return NextResponse.json(
      {error: 'Internal webhook handling error.'},
      {status: 500},
    );
  }
}
