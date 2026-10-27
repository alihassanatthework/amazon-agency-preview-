import { ok, fail, invalid, readBody, clientIp, userAgent } from './_lib/http';
import type { ApiRequest, ApiResponse } from './_lib/http';
import { validateLead, looksAutomated } from './_lib/validate';
import { asText, send, isConfigured } from './_lib/notify';

/**
 * POST /api/leads — the "Get a free audit" wizard.
 *
 * The site's primary conversion: every CTA on every page ends here, so this
 * failing is the most expensive thing that can break. See api/contact.ts for
 * why this mirrors the Express route rather than replacing it.
 *
 * Not carried over from the Express version: the 10-minute duplicate-email
 * check (`repo.recentDuplicate`), which needs the database this deployment
 * does not have. Duplicates arrive as separate emails.
 */
export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return fail(res, 405, 'METHOD_NOT_ALLOWED', 'Use POST for this endpoint.');
  }

  const body = readBody(req);

  // Matches `submitLead`: honeypot field here is `hp`.
  if (looksAutomated(body, 'hp')) return ok(res, { received: true });

  const { errors, value } = validateLead(body);
  if (Object.keys(errors).length) return invalid(res, errors);

  if (!isConfigured()) {
    return fail(res, 503, 'NOTIFY_UNCONFIGURED',
      'We could not send that just now. Your answers are saved — try again, or call us on 801-822-9732.');
  }

  const who = [value.firstName, value.lastName].filter(Boolean).join(' ');
  const delivery = await send(
    `Audit request — ${who}${value.brandName ? ` (${value.brandName})` : ''}`,
    asText('New audit request', {
      ...value,
      sourcePage: typeof body.sourcePage === 'string' ? body.sourcePage : '',
      utmSource: typeof body.utmSource === 'string' ? body.utmSource : '',
      utmMedium: typeof body.utmMedium === 'string' ? body.utmMedium : '',
      utmCampaign: typeof body.utmCampaign === 'string' ? body.utmCampaign : '',
      submittedAt: new Date().toISOString(),
      ip: clientIp(req),
      userAgent: userAgent(req),
    }),
    value.email,
  );

  if (delivery.status !== 'sent') {
    return fail(res, 502, 'NOTIFY_FAILED',
      'We could not send that just now. Your answers are saved — try again, or call us on 801-822-9732.');
  }

  return ok(res, { received: true });
}
