import { ok, fail, invalid, readBody } from './_lib/http.js';
import type { ApiRequest, ApiResponse } from './_lib/http.js';
import { validateLead, looksAutomated } from './_lib/validate.js';
import { send, isConfigured } from './_lib/notify.js';
import { asText, asHtml, humanLabel, humanValue, humanTime } from './_lib/format.js';
import type { Section } from './_lib/format.js';

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
  const str = (k: string) => (typeof body[k] === 'string' ? (body[k] as string) : '');

  const sections: Section[] = [
    {
      heading: 'Who to contact',
      fields: [
        { label: 'Name', value: who },
        { label: humanLabel('email'), value: value.email, kind: 'email' as const },
        { label: humanLabel('phone'), value: value.phone, kind: 'phone' as const },
        { label: humanLabel('company'), value: value.company },
      ].filter((f) => f.value),
    },
    {
      heading: 'Their business',
      fields: [
        { label: humanLabel('brandName'), value: value.brandName },
        { label: humanLabel('storeUrl'), value: value.storeUrl, kind: 'url' as const },
        { label: humanLabel('sellingStatus'), value: humanValue(value.sellingStatus) },
        { label: humanLabel('platform'), value: humanValue(value.platform) },
        { label: humanLabel('monthlyRevenueBand'), value: value.monthlyRevenueBand },
        { label: humanLabel('skuCountBand'), value: value.skuCountBand },
        { label: humanLabel('productCategory'), value: value.productCategory },
        { label: 'Marketplaces', value: value.marketplaces.join(', ') },
        { label: humanLabel('stage'), value: value.stage },
      ].filter((f) => f.value),
    },
    {
      heading: 'What they want',
      fields: [
        { label: humanLabel('primaryGoal'), value: value.primaryGoal, kind: 'long' as const },
        { label: humanLabel('message'), value: value.message, kind: 'long' as const },
        { label: humanLabel('platformIssues'), value: value.platformIssues, kind: 'long' as const },
      ].filter((f) => f.value),
    },
    {
      heading: 'Submission',
      fields: [
        { label: humanLabel('submittedAt'), value: humanTime(new Date().toISOString()) },
        { label: humanLabel('privacyPolicyAccepted'), value: body.consent === true ? 'Yes' : 'No' },
        { label: 'Source page', value: str('sourcePage') },
        { label: 'UTM source', value: str('utmSource') },
        { label: 'UTM medium', value: str('utmMedium') },
        { label: 'UTM campaign', value: str('utmCampaign') },
      ].filter((f) => f.value),
    },
  ];

  const title = 'New audit request';
  const subtitle = `${who}${value.brandName ? ` — ${value.brandName}` : ''}`;

  const delivery = await send(
    `Free audit request — ${who}${value.brandName ? ` (${value.brandName})` : ''}`,
    asText(title, sections),
    value.email,
    who,
    asHtml(title, subtitle, sections),
  );

  if (delivery.status !== 'sent') {
    return fail(res, 502, 'NOTIFY_FAILED',
      'We could not send that just now. Your answers are saved — try again, or call us on 801-822-9732.');
  }

  return ok(res, { received: true });
}
