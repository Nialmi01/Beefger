import crypto from 'crypto';

export interface WompiCheckoutData {
  reference: string;
  amountInCents: number;
  currency: string;
  integritySignature: string;
  publicKey: string;
  redirectUrl: string;
}

/**
 * Calculates the SHA-256 integrity signature required by Wompi.
 * Formula: SHA256(reference + amountInCents + currency + integritySecret)
 */
export function generateWompiIntegritySignature(
  reference: string,
  amountInCents: number,
  currency: string = 'COP',
  integritySecret?: string
): string {
  const secret = integritySecret || process.env.WOMPI_INTEGRITY_SECRET || 'test_integrity_BEFFGER';
  const concatenated = `${reference}${amountInCents}${currency}${secret}`;
  return crypto.createHash('sha256').update(concatenated).digest('hex');
}

/**
 * Generates parameters for client-side Wompi widget / checkout
 */
export function createWompiTransactionData(
  orderId: string,
  orderNumber: string,
  amountInPesos: number,
  siteUrl?: string
): WompiCheckoutData {
  const amountInCents = Math.round(amountInPesos * 100);
  const reference = `${orderNumber}-${Date.now()}`;
  const currency = 'COP';
  const signature = generateWompiIntegritySignature(reference, amountInCents, currency);
  const baseUrl = siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    reference,
    amountInCents,
    currency,
    integritySignature: signature,
    publicKey: process.env.WOMPI_PUBLIC_KEY || 'pub_test_BEFFGER_SANDBOX',
    redirectUrl: `${baseUrl}/pedidos/${orderNumber}?payment_reference=${reference}`,
  };
}

/**
 * Validates a Wompi webhook event using WOMPI_EVENTS_SECRET
 */
export function verifyWompiEventChecksum(
  eventData: any,
  checksumHeader: string,
  eventsSecret?: string
): boolean {
  const secret = eventsSecret || process.env.WOMPI_EVENTS_SECRET || 'test_events_secret_BEFFGER';
  if (!eventData || !eventData.data || !eventData.data.transaction) return false;

  const transaction = eventData.data.transaction;
  const timestamp = eventData.timestamp;
  const concatenated = `${transaction.id}${transaction.status}${transaction.amount_in_cents}${timestamp}${secret}`;
  const computedChecksum = crypto.createHash('sha256').update(concatenated).digest('hex');

  return computedChecksum === checksumHeader;
}
