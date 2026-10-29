import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

/**
 * Lead delivery by email, over SMTP.
 *
 * Configuration is four required environment variables on the Vercel project,
 * plus two optional ones. The names match the Express server's existing
 * `server/.env.example`, so one set of credentials serves both backends:
 *
 *   SMTP_HOST         mail host, e.g. smtp.gmail.com          (required)
 *   SMTP_PORT         587 for STARTTLS, 465 for implicit TLS  (required)
 *   SMTP_USER         the mailbox to authenticate as          (required)
 *   SMTP_PASS         its password or provider app password   (required)
 *   LEAD_NOTIFY_FROM  envelope sender; defaults to SMTP_USER  (optional)
 *   LEAD_NOTIFY_TO    recipient override; defaults below      (optional)
 *
 * Credentials are read from the environment and never committed. If a
 * required variable is missing the caller is told plainly and the submission
 * is refused, rather than being accepted and dropped. A lead that vanishes
 * silently is worse than one the visitor knows to phone in.
 */
export type Delivery =
  | { status: 'sent' }
  | { status: 'unconfigured' }
  | { status: 'failed'; error: string };

/** Where submissions go unless LEAD_NOTIFY_TO overrides it. */
const DEFAULT_TO = 'blakegale@blazonpros.com';

/** The recipient for both forms. */
export const recipient = (): string => process.env.LEAD_NOTIFY_TO?.trim() || DEFAULT_TO;

/**
 * Optional extra recipients, as comma-separated addresses in
 * LEAD_NOTIFY_CC / LEAD_NOTIFY_BCC.
 *
 * Worth having: email is the only copy of a lead in this deployment, so a
 * second address is a cheap safety net against one mailbox filling up,
 * filtering the mail or being misconfigured. Use BCC when the extra reader
 * should not be visible to anyone who sees the message.
 */
const addresses = (raw: string | undefined): string[] =>
  (raw ?? '').split(',').map((a) => a.trim()).filter(Boolean);

export const ccList = (): string[] => addresses(process.env.LEAD_NOTIFY_CC);
export const bccList = (): string[] => addresses(process.env.LEAD_NOTIFY_BCC);

/**
 * The envelope sender. Most providers reject a From that is not the mailbox
 * being authenticated as, so SMTP_USER is the right default.
 */
export const sender = (): string =>
  process.env.LEAD_NOTIFY_FROM?.trim() || process.env.SMTP_USER?.trim() || '';

/**
 * Builds the From header so the inbox shows the visitor's name rather than
 * the mailbox we authenticate with.
 *
 * The address itself cannot be the visitor's: Gmail and every other provider
 * rewrite a From they have not verified, and asserting someone else's address
 * is spoofing that fails SPF and DKIM for their domain. The display name is
 * the honest, deliverable way to surface who submitted the form - it is what
 * every form service does, hence the "via" suffix. Replying still reaches the
 * visitor, because Reply-To carries their real address.
 */
export const fromHeader = (displayName?: string): string => {
  const addr = sender();
  const clean = (displayName ?? '')
    // Newlines here would let a form field inject extra headers.
    .replace(/[\r\n]/g, ' ')
    .replace(/["\\]/g, '')
    .trim()
    .slice(0, 70);
  return clean ? `"${clean} (via BLAZON website)" <${addr}>` : addr;
};

export const isConfigured = (): boolean => Boolean(
  process.env.SMTP_HOST && process.env.SMTP_PORT &&
  process.env.SMTP_USER && process.env.SMTP_PASS,
);

/** The subset of nodemailer this module uses, so tests can supply their own. */
export interface Transport {
  sendMail(options: {
    from: string; to: string; subject: string; text: string;
    html?: string; replyTo?: string; cc?: string; bcc?: string;
  }): Promise<unknown>;
}

/* A warm serverless invocation reuses the module scope, so holding the
   transporter here saves a TLS handshake and an AUTH round trip on every
   submission after the first. */
let cached: Transporter | null = null;
let override: Transport | null = null;

/**
 * Test seam. Routes send() to a stub so the handlers can be exercised end to
 * end without an SMTP server, and resets with `null`. Nothing in the request
 * path calls this.
 */
export const __setTransport = (t: Transport | null): void => { override = t; };

function activeTransport(): Transport {
  if (override) return override;
  if (cached) return cached;
  const port = Number(process.env.SMTP_PORT);
  cached = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    // 465 is implicit TLS; 587 and 25 open in plaintext and upgrade via STARTTLS.
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return cached;
}


export async function send(
  subject: string, text: string, replyTo?: string, fromName?: string,
  html?: string,
): Promise<Delivery> {
  if (!isConfigured()) return { status: 'unconfigured' };
  try {
    /* The subject carries a form field, so it is an injection surface like
       the display name. Nodemailer encodes headers and neutralises this on
       its own, but that is the library's guarantee rather than ours: strip
       the line breaks here so a change of transport cannot make it live. */
    const safeSubject = subject.replace(/[\r\n]+/g, ' ').trim().slice(0, 200);
    const cc = ccList();
    const bcc = bccList();
    await activeTransport().sendMail({
      from: fromHeader(fromName),
      to: recipient(),
      subject: safeSubject,
      text,
      ...(html ? { html } : {}),
      ...(replyTo ? { replyTo } : {}),
      ...(cc.length ? { cc: cc.join(', ') } : {}),
      ...(bcc.length ? { bcc: bcc.join(', ') } : {}),
    });
    return { status: 'sent' };
  } catch (err) {
    return { status: 'failed', error: err instanceof Error ? err.message : String(err) };
  }
}
