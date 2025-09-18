import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

function sanitizeString(input: unknown, maxLen = 500) {
  const s = typeof input === 'string' ? input : '';
  return s.trim().replace(/\s+/g, ' ').replace(/[<>]/g, '').slice(0, maxLen);
}

function sanitizeEmail(input: unknown) {
  const s = sanitizeString(input, 254).toLowerCase();
  const ok = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(s);
  return ok ? s : '';
}

function sanitizePhone(input: unknown) {
  const digits = String(input ?? '').replace(/\D/g, '').slice(0, 20);
  return digits;
}

export const actions: Actions = {
  default: async ({ request, fetch }) => {
    const data = await request.formData();

    // Anti-bot honeypot and time-trap
    const referrer = String(data.get('referrer') ?? '').trim();
    const formTsRaw = String(data.get('form_ts') ?? '').trim();
    const formTs = Number(formTsRaw);
    const now = Date.now();

    // If honeypot filled, silently fail with generic error
    if (referrer) {
      return fail(400, {
        error: 'Please fill out all required fields with valid values.'
      });
    }

    // Require at least 3 seconds between render and submit
    if (!Number.isFinite(formTs) || now - formTs < 3000) {
      return fail(400, {
        error: 'Please fill out all required fields with valid values.'
      });
    }

    const firstName = sanitizeString(data.get('firstName'), 100);
    const lastName = sanitizeString(data.get('lastName'), 100);
    const email = sanitizeEmail(data.get('email'));
    const phone = sanitizePhone(data.get('phone'));
    const address = sanitizeString(data.get('address'), 200);
    const details = sanitizeString(data.get('details'), 5000);

    if (!firstName || !lastName || !email || !phone || !address) {
      return fail(400, {
        firstName,
        lastName,
        email,
        phone,
        address,
        details,
        error: 'Please fill out all required fields with valid values.'
      });
    }

    // Ensure secret is configured server-side
    const apiKey = env.BOOKING_API_SECRET;
    if (!apiKey) {
      return fail(500, {
        firstName,
        lastName,
        email,
        phone,
        address,
        details,
        error: 'Server not configured.'
      });
    }

    try {
      const res = await fetch(`${env.BOOKING_API_URL}/booking-request`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-api-key': apiKey },
        body: JSON.stringify({ firstName, lastName, email, phone, address, details }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Failed to submit booking request (${res.status}). ${text}`);
      }

      return { success: true };
    } catch (error: any) {
      return fail(422, {
        firstName,
        lastName,
        email,
        phone,
        address,
        details,
        error: error?.message ?? 'Submission failed',
      });
    }
  }
};
