import * as crypto from 'node:crypto';
import { resolveStripePriceId, isApprovedProductKey, type ProductKey, PRODUCT_CATALOG } from './catalog';

export type StripeCheckoutParams = {
  productKey: ProductKey;
  locale: string;
  userId?: string;
  siteUrl?: string;
};

export type CreateCheckoutResult =
  | { success: true; url: string; sessionId: string }
  | { success: false; error: string; code: 'INVALID_PRODUCT' | 'MISSING_PRICE_CONFIG' | 'MISSING_STRIPE_SECRET' | 'STRIPE_ERROR' };

export type WebhookVerificationResult =
  | { success: true; event: StripeWebhookEvent }
  | { success: false; error: string; code: 'MISSING_SECRET' | 'INVALID_SIGNATURE' | 'PAYLOAD_ERROR' };

export type StripeWebhookEvent = {
  id: string;
  type: string;
  data: {
    object: {
      id: string;
      payment_status?: string;
      metadata?: Record<string, string>;
      client_reference_id?: string;
      customer_email?: string;
    };
  };
};

/**
 * Validates Stripe signature according to Stripe's official HMAC-SHA256 scheme (t=timestamp,v1=signature).
 * Uses crypto.timingSafeEqual to guard against timing attacks.
 */
export function verifyStripeWebhookSignature(
  rawBody: string,
  signatureHeader: string | null | undefined,
  webhookSecret: string | null | undefined,
): WebhookVerificationResult {
  const secret = webhookSecret ?? process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return { success: false, error: 'STRIPE_WEBHOOK_SECRET is not configured on the server.', code: 'MISSING_SECRET' };
  }

  if (!signatureHeader) {
    return { success: false, error: 'Missing stripe-signature header.', code: 'INVALID_SIGNATURE' };
  }

  const elements = signatureHeader.split(',');
  const parsedHeader: Record<string, string[]> = {};
  for (const element of elements) {
    const [key, value] = element.split('=');
    if (key && value) {
      if (!parsedHeader[key]) parsedHeader[key] = [];
      parsedHeader[key].push(value);
    }
  }

  const timestamp = parsedHeader['t']?.[0];
  const signatures = parsedHeader['v1'] ?? [];

  if (!timestamp || signatures.length === 0) {
    return { success: false, error: 'Invalid stripe-signature header structure.', code: 'INVALID_SIGNATURE' };
  }

  // Prevent timestamp replay tolerance (tolerance: 5 minutes = 300s)
  const timestampNum = parseInt(timestamp, 10);
  const now = Math.floor(Date.now() / 1000);
  if (isNaN(timestampNum) || Math.abs(now - timestampNum) > 300) {
    return { success: false, error: 'Webhook timestamp outside tolerance window.', code: 'INVALID_SIGNATURE' };
  }

  const payloadToSign = `${timestamp}.${rawBody}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payloadToSign, 'utf8')
    .digest('hex');

  const expectedBuffer = Buffer.from(expectedSignature, 'hex');
  let isValid = false;

  for (const signature of signatures) {
    const sigBuffer = Buffer.from(signature, 'hex');
    if (sigBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      isValid = true;
      break;
    }
  }

  if (!isValid) {
    return { success: false, error: 'Stripe signature verification failed.', code: 'INVALID_SIGNATURE' };
  }

  try {
    const event = JSON.parse(rawBody) as StripeWebhookEvent;
    return { success: true, event };
  } catch (err) {
    return { success: false, error: 'Failed to parse webhook JSON payload.', code: 'PAYLOAD_ERROR' };
  }
}

/**
 * Creates a Stripe-hosted Checkout Session.
 * Server owns price IDs, URLs, and allowed products.
 * Never includes raw birth data, face photos, or sensitive PII in Stripe metadata.
 */
export async function createStripeCheckoutSession(
  params: StripeCheckoutParams,
): Promise<CreateCheckoutResult> {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) {
    return {
      success: false,
      error: 'STRIPE_SECRET_KEY is not configured on the server.',
      code: 'MISSING_STRIPE_SECRET',
    };
  }

  if (!isApprovedProductKey(params.productKey)) {
    return {
      success: false,
      error: `Invalid or unapproved product key: ${params.productKey}`,
      code: 'INVALID_PRODUCT',
    };
  }

  const priceRes = resolveStripePriceId(params.productKey);
  if (!priceRes.priceId) {
    return {
      success: false,
      error: priceRes.error ?? 'Missing Stripe Price ID.',
      code: 'MISSING_PRICE_CONFIG',
    };
  }

  const siteUrl = (params.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://korea.avocadoss.co.kr').replace(/\/+$/, '');
  const locale = params.locale || 'en';

  const successUrl = `${siteUrl}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}&product=${params.productKey}`;
  const cancelUrl = `${siteUrl}/${locale}/hanbok`;

  // Server-sanitized metadata: only opaque IDs and product key
  const body = new URLSearchParams({
    mode: 'payment',
    'line_items[0][price]': priceRes.priceId,
    'line_items[0][quantity]': '1',
    success_url: successUrl,
    cancel_url: cancelUrl,
    'metadata[productKey]': params.productKey,
  });

  if (params.userId) {
    body.set('client_reference_id', params.userId);
  }

  try {
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    const data = await response.json();
    if (!response.ok || !data.url) {
      return {
        success: false,
        error: data.error?.message || 'Stripe Checkout Session creation failed.',
        code: 'STRIPE_ERROR',
      };
    }

    return {
      success: true,
      url: data.url,
      sessionId: data.id,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error communicating with Stripe.',
      code: 'STRIPE_ERROR',
    };
  }
}
