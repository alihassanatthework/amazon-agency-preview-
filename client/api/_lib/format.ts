/**
 * Renders a submission as the notification email.
 *
 * One set of sections produces both the HTML part and the plain-text part, so
 * the two can never drift. Both are always sent: some clients and most
 * accessibility tooling read the text part, and an HTML-only message scores
 * worse with spam filters.
 *
 * Everything is real text, never an image, so the reader can select and copy
 * any value straight out of the message.
 *
 * Layout is tables with inline styles because that is what email clients
 * support - Outlook renders through Word and has no flexbox or grid. Colours
 * are stated explicitly on both the container and the text so a client that
 * forces dark mode cannot leave dark text on a dark card.
 */

export interface Field {
  label: string;
  value: string;
  /** Renders as a mailto:/tel: link, and on its own line if long. */
  kind?: 'email' | 'phone' | 'url' | 'long';
}

export interface Section {
  heading: string;
  fields: Field[];
}

/* Labels that a naive camelCase split gets wrong. */
const LABELS: Record<string, string> = {
  skuCountBand: 'SKU count',
  storeUrl: 'Store URL',
  monthlyRevenueBand: 'Monthly revenue',
  productCategory: 'Product category',
  primaryGoal: 'Primary goal',
  platformIssues: 'Issues raised',
  brandName: 'Brand',
  sellingStatus: 'Selling on Amazon',
  inquiryType: 'Enquiry',
  firstName: 'First name',
  lastName: 'Last name',
  privacyPolicyAccepted: 'Privacy policy accepted',
  submittedAt: 'Submitted',
};

/* Stored values are identifiers; these are the words the visitor actually
   saw. Kept in step with INQUIRY in pages/Contact and PLATFORMS in
   pages/GetStarted. */
const VALUES: Record<string, string> = {
  already_selling: 'Yes, selling now',
  not_yet_selling: 'Not yet, wants to start',
  seller_central: 'Seller Central',
  vendor_central: 'Vendor Central',
  both: 'Both',
  none: 'Not yet selling',
  audit: 'Wants an audit',
  'not-selling': 'Not selling on Amazon yet',
  'account-issue': 'Has an account issue',
  pricing: 'Pricing question',
  other: 'Something else',
};

export const humanLabel = (key: string): string =>
  LABELS[key] ?? key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());

export const humanValue = (v: string): string => VALUES[v] ?? v;

/** An ISO timestamp is unreadable; the reader is in Mountain Time. */
export const humanTime = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  // dateStyle/timeStyle cannot be combined with timeZoneName - Intl throws.
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
    timeZone: 'America/Denver', timeZoneName: 'short',
  }).format(d);
};

const esc = (s: string): string => s
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

/* An href is an injection surface of its own: a value starting with
   "javascript:" would become a live link. Only the two safe schemes are
   built, and the address is encoded. */
const link = (f: Field): string | null => {
  if (f.kind === 'email') {
    // Not encodeURIComponent: it turns "@" into %40, which some clients open
    // as a literal address. The value already passed the email validator, so
    // only characters that could break out of the attribute are dropped.
    const addr = f.value.replace(/[\s"'<>\\]/g, '');
    return addr ? `mailto:${addr}` : null;
  }
  if (f.kind === 'phone') {
    // A leading "+" must stay literal; %2B dials the wrong number.
    const num = f.value.replace(/[^\d+]/g, '');
    return num ? `tel:${num}` : null;
  }
  if (f.kind === 'url') return /^https?:\/\//i.test(f.value) ? f.value : null;
  return null;
};

export function asText(title: string, sections: Section[]): string {
  const out: string[] = [title, '='.repeat(title.length), ''];
  for (const s of sections) {
    if (!s.fields.length) continue;
    out.push(s.heading.toUpperCase(), '-'.repeat(s.heading.length), '');
    for (const f of s.fields) out.push(`${f.label}: ${f.value}`);
    out.push('');
  }
  return out.join('\n');
}

const INK = '#1A1E18';
const MUTED = '#6B7166';
const RULE = '#E3E6DF';
const ACCENT = '#5C8A2B';

function fieldRow(f: Field): string {
  const href = link(f);
  const shown = esc(f.value);
  const value = href
    ? `<a href="${esc(href)}" style="color:${ACCENT};text-decoration:underline;">${shown}</a>`
    : shown;

  if (f.kind === 'long') {
    return `<tr><td style="padding:10px 0 0 0;border-top:1px solid ${RULE};">
      <div style="font:400 12px/1.4 Helvetica,Arial,sans-serif;color:${MUTED};padding-bottom:4px;">${esc(f.label)}</div>
      <div style="font:400 15px/1.55 Helvetica,Arial,sans-serif;color:${INK};white-space:pre-wrap;">${shown}</div>
    </td></tr>`;
  }
  return `<tr>
    <td style="padding:9px 14px 9px 0;border-top:1px solid ${RULE};font:400 13px/1.4 Helvetica,Arial,sans-serif;color:${MUTED};white-space:nowrap;vertical-align:top;">${esc(f.label)}</td>
    <td style="padding:9px 0;border-top:1px solid ${RULE};font:400 15px/1.45 Helvetica,Arial,sans-serif;color:${INK};vertical-align:top;">${value}</td>
  </tr>`;
}

function card(s: Section): string {
  if (!s.fields.length) return '';
  return `<tr><td style="padding:0 0 14px 0;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
           style="background:#FFFFFF;border:1px solid ${RULE};border-radius:10px;">
      <tr><td style="padding:16px 18px 4px 18px;">
        <div style="font:700 11px/1.3 Helvetica,Arial,sans-serif;color:${ACCENT};letter-spacing:.08em;text-transform:uppercase;">${esc(s.heading)}</div>
      </td></tr>
      <tr><td style="padding:4px 18px 16px 18px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          ${s.fields.map(fieldRow).join('')}
        </table>
      </td></tr>
    </table>
  </td></tr>`;
}

export function asHtml(title: string, subtitle: string, sections: Section[]): string {
  return `<!doctype html>
<html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:#F2F4EE;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(subtitle)}</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#F2F4EE;">
<tr><td align="center" style="padding:22px 12px;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:580px;">
    <tr><td style="padding:0 2px 14px 2px;">
      <div style="font:700 20px/1.3 Helvetica,Arial,sans-serif;color:${INK};">${esc(title)}</div>
      <div style="font:400 14px/1.5 Helvetica,Arial,sans-serif;color:${MUTED};padding-top:3px;">${esc(subtitle)}</div>
    </td></tr>
    ${sections.map(card).join('')}
  </table>
</td></tr></table>
</body></html>`;
}
