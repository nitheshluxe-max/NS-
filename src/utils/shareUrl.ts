/**
 * Shared App URL Resolution Helper
 * 
 * In Google AI Studio, there are two distinct environments:
 * 1. Development App URL (https://ais-dev-*.run.app): Restricted to the project owner/author.
 *    Anyone else opening an `ais-dev-` link receives:
 *    "Google 403 That's an error. We're sorry, but you do not have access to this page."
 * 
 * 2. Shared App / Public Preview URL (https://ais-pre-*.run.app): Accessible to ANYONE (friends, clients, public).
 * 
 * This helper guarantees that any link shared via WhatsApp, Telegram, Email,
 * Copy Link, or QR code ALWAYS generates the public `ais-pre-` URL so your
 * friends and clients never hit the Google 403 error.
 */

// Public shared preview URL for this project
export const PUBLIC_SHARED_APP_URL = 'https://ais-pre-iwndiyzigsglaztxgszw2g-775754830492.asia-southeast1.run.app';

export function getPublicShareUrl(): string {
  if (typeof window === 'undefined') {
    return PUBLIC_SHARED_APP_URL;
  }

  const origin = window.location.origin;

  // If the user is viewing inside the private dev sandbox (ais-dev-*.run.app),
  // automatically transform it to the public preview link (ais-pre-*.run.app)
  if (origin.includes('ais-dev-')) {
    return origin.replace('ais-dev-', 'ais-pre-');
  }

  // If on localhost or custom domain without dev prefix, use the verified public shared app URL
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
    return PUBLIC_SHARED_APP_URL;
  }

  // If already on ais-pre- or production custom domain, use that origin
  return origin;
}
