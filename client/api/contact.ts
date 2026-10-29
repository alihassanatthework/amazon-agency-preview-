import { ok, fail, invalid, readBody } from './_lib/http.js';
import type { ApiRequest, ApiResponse } from './_lib/http.js';
import { validateContact, looksAutomated } from './_lib/validate.js';
import { send, isConfigured } from './_lib/notify.js';
import { asText, asHtml, humanLabel, humanValue, humanTime } from './_lib/format.js';
import type { Section } from './_lib/format.js';

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

  // Grouped so the reader meets the person before the detail. Empty fields are
  // dropped rather than shown blank.
  const sections: Section[] = [
    {
      heading: 'Who got in touch',
      fields: [
        { label: humanLabel('name'), value: value.name },
        { label: humanLabel('email'), value: value.email, kind: 'email' as const },
        { label: humanLabel('phone'), value: value.phone, kind: 'phone' as const },
        { label: humanLabel('company'), value: value.company },
      ].filter((f) => f.value),
    },
    {
      heading: 'What they said',
      fields: [
        { label: humanLabel('inquiryType'), value: humanValue(value.inquiryType) },
        { label: humanLabel('message'), value: value.message, kind: 'long' as const },
      ].filter((f) => f.value),
    },
    {
      heading: 'Submission',
      fields: [
        { label: humanLabel('submittedAt'), value: humanTime(new Date().toISOString()) },
        { label: humanLabel('privacyPolicyAccepted'), value: body.consent === true ? 'Yes' : 'No' },
      ],
    },
  ];

  const title = 'New contact form submission';
  const subtitle = `${value.name}${value.company ? ` — ${value.company}` : ''}`;

  const delivery = await send(
    `Contact form — ${value.name}${value.company ? ` (${value.company})` : ''}`,
    asText(title, sections),
    value.email,
    value.name,
    asHtml(title, subtitle, sections),
  );

  if (delivery.status !== 'sent') {
    return fail(res, 502, 'NOTIFY_FAILED',
      'We could not send that just now. Please try again, or call us on 801-822-9732.');
  }

  return ok(res, { received: true });
}
