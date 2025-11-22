import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { Resource } from 'sst';
import { issueCsrf, verifyCsrf } from '$lib/server/csrf';
import { sanitizeString, sanitizeEmail, sanitizePhone } from '$lib/server/form-utils';

export const load: PageServerLoad = async ({ cookies }) => {
  const { csrfToken } = issueCsrf(cookies);
  return { csrfToken };
};

export const actions: Actions = {
  submitBooking: async ({ request, fetch, cookies, url }) => {
    // Basic Origin/Referer check (non-breaking): if Origin is present and doesn't match host, reject
    const origin = request.headers.get('origin') || '';
    const referer = request.headers.get('referer') || '';
    const host = request.headers.get('host') || url.host;
    if (origin && !origin.includes(host)) {
      return fail(400, { error: 'Please fill out all required fields with valid values.' });
    }
    if (referer && !referer.includes(host)) {
      return fail(400, { error: 'Please fill out all required fields with valid values.' });
    }

    const data = await request.formData();

    // Anti-bot honeypot and time-trap
    const referrer = String(data.get('referrer') ?? '').trim();
    const formTsRaw = String(data.get('form_ts') ?? '').trim();
    const formTs = Number(formTsRaw);
    const now = Date.now();

    if (referrer) {
      return fail(400, { error: 'Please fill out all required fields with valid values.' });
    }

    if (!Number.isFinite(formTs) || now - formTs < 3000) {
      return fail(400, { error: 'Please fill out all required fields with valid values.' });
    }

    // CSRF: verify hidden token against HttpOnly cookie signature and TTL
    const hidden = String(data.get('csrf_token') ?? '');
    if (!verifyCsrf(cookies, hidden)) {
      return fail(400, { error: 'Please fill out all required fields with valid values.' });
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

    // Ensure secret is configured server-side (prefer env, then SST Secret if linked)
    let apiKey: string | undefined = env.BOOKING_API_SECRET;
    if (!apiKey) {
      try {
        apiKey = (Resource as any).BookingApiSecret?.value as string | undefined;
      } catch {}
    }
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
      const res = await fetch(`${env.API_URL}/booking-request`, {
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
  },

  submitTestimonial: async ({ request, fetch, cookies, url }) => {
    // Basic Origin/Referer check
    const origin = request.headers.get('origin') || '';
    const referer = request.headers.get('referer') || '';
    const host = request.headers.get('host') || url.host;
    if (origin && !origin.includes(host)) {
      return fail(400, { error: 'Please fill out all required fields with valid values.' });
    }
    if (referer && !referer.includes(host)) {
      return fail(400, { error: 'Please fill out all required fields with valid values.' });
    }

    const data = await request.formData();

    // Anti-bot honeypot and time-trap
    const referrer = String(data.get('referrer') ?? '').trim();
    const formTsRaw = String(data.get('form_ts') ?? '').trim();
    const formTs = Number(formTsRaw);
    const now = Date.now();

    if (referrer) {
      return fail(400, { error: 'Please fill out all required fields with valid values.' });
    }

    if (!Number.isFinite(formTs) || now - formTs < 3000) {
      return fail(400, { error: 'Please fill out all required fields with valid values.' });
    }

    // CSRF: verify hidden token against HttpOnly cookie signature and TTL
    const hidden = String(data.get('csrf_token') ?? '');
    if (!verifyCsrf(cookies, hidden)) {
      return fail(400, { error: 'Please fill out all required fields with valid values.' });
    }

    const name = sanitizeString(data.get('name'), 200);
    const projectDetails = sanitizeString(data.get('projectDetails'), 2000);
    const dateOfProject = sanitizeString(data.get('dateOfProject'), 100);
    const location = sanitizeString(data.get('location'), 200);
    const selectedOption = sanitizeString(data.get('selectedOption'), 5000);
    const additionalComments = sanitizeString(data.get('additionalComments'), 5000);
    const signature = sanitizeString(data.get('signature'), 200);
    const dateSubmitted = new Date().toLocaleString('en-US', { 
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'America/Chicago',
      timeZoneName: 'short'
    });

    if (!name || !projectDetails || !dateOfProject || !selectedOption || !signature) {
      return fail(400, {
        name,
        projectDetails,
        dateOfProject,
        location,
        additionalComments,
        signature,
        error: 'Please fill out all required fields with valid values.'
      });
    }

    // Ensure secret is configured server-side
    let apiKey: string | undefined = env.TESTIMONIAL_API_SECRET;
    if (!apiKey) {
      try {
        apiKey = (Resource as any).TestimonialApiSecret?.value as string | undefined;
      } catch {}
    }
    if (!apiKey) {
      return fail(500, {
        name,
        projectDetails,
        dateOfProject,
        location,
        additionalComments,
        signature,
        error: 'Server not configured.'
      });
    }

    try {
      const res = await fetch(`${env.API_URL}/testimonial`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-api-key': apiKey },
        body: JSON.stringify({ 
          name, 
          projectDetails, 
          dateOfProject, 
          location, 
          selectedOption, 
          additionalComments, 
          signature,
          dateSubmitted
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Failed to submit testimonial (${res.status}). ${text}`);
      }

      return { success: true };
    } catch (error: any) {
      return fail(422, {
        name,
        projectDetails,
        dateOfProject,
        location,
        additionalComments,
        signature,
        error: error?.message ?? 'Submission failed',
      });
    }
  }
};
