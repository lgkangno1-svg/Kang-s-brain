import {NextResponse} from 'next/server';
import {verifyStripeWebhookSignature} from '@/lib/payments/stripe';

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

    const {event} = verification;

    // Handle supported Stripe events
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const productKey = session.metadata?.productKey;
        const clientRefId = session.client_reference_id;
        
        // Log clean telemetry without PII
        console.log(`[Stripe Webhook] Verified checkout completed: session=${session.id} product=${productKey} ref=${clientRefId}`);
        break;
      }
      default:
        // Ignore unhandled event types cleanly
        break;
    }

    return NextResponse.json({received: true});
  } catch (err) {
    return NextResponse.json(
      {error: 'Internal webhook handling error.'},
      {status: 500},
    );
  }
}
