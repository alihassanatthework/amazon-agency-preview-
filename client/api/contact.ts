import { ok, fail, invalid, readBody, clientIp, userAgent } from './_lib/http.js';
import type { ApiRequest, ApiResponse } from './_lib/http.js';
import { validateContact, looksAutomated } from './_lib/validate.js';
import { asText, send, isConfigured } from './_lib/notify.js';

/**
 * POST /api/contact — the contact page form.
 *
 * Replaces the Express route of the same path (`server/src/routes/
 * public.routes.js`) for the Vercel deployment, which has no Node server and
 * no database. Same URL, same request body, same response envelope, so
 * `client/src/services/api.ts` is untouched.
 *
 * Difference from the Express route, recorded deliberately: there is no
 * Postgres here, so the submission is emailed rather than persisted to
 * `contact_messages`, and the admin inbox is not part of this deployment.
 */
export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return fail(res, 405, 'METHOD_NOT_ALLOWED', 'Use POST for this endpoint.');
  }

  const body = readBody(req);

  // Honeypot or implausibly fast: answer exactly as a success would, so a bot
  // cannot tell it was caught. Matches `submitMessage` in lead.service.js.
  if (looksAutomated(body, 'website')) return ok(res, { received: true });

  const { errors, value } = validateContact(body);
  if (Object.keys(errors).length) return invalid(res, errors);

  if (!isConfigured()) {
    return fail(res, 503, 'NOTIFY_UNCONFIGURED',
      'We could not send that just now. Please call us on 801-822-9732 and we will take the details.');
  }

  const delivery = await send(
    `Contact form — ${value.name}${value.company ? ` (${value.company})` : ''}`,
    asText('New contact form submission', {
      ...value,
      privacyPolicyAccepted: body.consent === true ? 'Yes' : 'No',
      submittedAt: new Date().toISOString(),
      ip: clientIp(req),
      userAgent: userAgent(req),
    }),
    value.email,
    value.name,
  );

  if (delivery.status !== 'sent') {
    return fail(res, 502, 'NOTIFY_FAILED',
      'We could not send that just now. Please try again, or call us on 801-822-9732.');
  }

  return ok(res, { received: true });
}
