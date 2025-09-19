import type { Cookies } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';
import { Resource } from 'sst';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

let DEV_CSRF_SECRET: string | undefined;

/**
 * Resolve the shared secret used for both issuing and verifying CSRF tokens.
 * Prefers env.BOOKING_API_SECRET, then SST Resource.BookingApiSecret in
 * deployed environments, and finally an in-memory secret in dev.
 */
function getSecret(): string | undefined {
  let secret: string | undefined = env.BOOKING_API_SECRET;
  if (!secret) {
    try {
      secret = (Resource as any).BookingApiSecret?.value as string | undefined;
    } catch {
      // ignore - handled by dev fallback below
    }
  }
  if (!secret && dev) {
    DEV_CSRF_SECRET ||= randomBytes(32).toString('hex');
    secret = DEV_CSRF_SECRET;
  }
  return secret;
}

function signCsrf(payload: string, secret: string) {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

/**
 * Issue a CSRF token and set the corresponding HttpOnly signature cookie.
 * Returns the token payload to embed in a hidden form field.
 */
export function issueCsrf(cookies: Cookies) {
  const secret = getSecret();
  if (!secret) return { csrfToken: undefined } as const;
  const ts = Date.now();
  const nonce = randomBytes(12).toString('base64url');
  const payload = `${ts}.${nonce}`;
  const sig = signCsrf(payload, secret);

  cookies.set('csrf_sig', sig, {
    httpOnly: true,
    sameSite: 'lax',
    secure: !dev,
    path: '/',
    maxAge: 60 * 10, // 10 minutes
  });
  return { csrfToken: payload } as const;
}

/**
 * Verify a submitted CSRF token against the signature cookie and TTL.
 * Returns true when valid, false otherwise.
 */
export function verifyCsrf(cookies: Cookies, hidden: string, maxAgeMs = 10 * 60 * 1000) {
  try {
    const secret = getSecret();
    if (!secret) return false;
    const sigCookie = cookies.get('csrf_sig') || '';
    if (!hidden || !sigCookie) return false;

    const tsNum = Number(hidden.split('.')[0]);
    const now = Date.now();
    if (!Number.isFinite(tsNum) || now - tsNum > maxAgeMs) return false;

    const expected = signCsrf(hidden, secret);
    return timingSafeEqual(Buffer.from(expected), Buffer.from(sigCookie));
  } catch {
    return false;
  }
}
