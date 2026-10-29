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
    from: string; to: string; subject: string; text: string; replyTo?: string;
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

/** Renders a flat record as a readable plain-text email body. */
export const asText = (title: string, fields: Record<string, unknown>): string => {
  const lines = Object.entries(fields)
    .filter(([, v]) => v !== undefined && v !== null && v !== '' &&
      !(Array.isArray(v) && v.length === 0))
    .map(([k, v]) => {
      const label = k.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
      return `${label}: ${Array.isArray(v) ? v.join(', ') : String(v)}`;
    });
  return `${title}\n${'='.repeat(title.length)}\n\n${lines.join('\n')}\n`;
};

export async function send(
  subject: string, text: string, replyTo?: string, fromName?: string,
): Promise<Delivery> {
  if (!isConfigured()) return { status: 'unconfigured' };
  try {
    await activeTransport().sendMail({
      from: fromHeader(fromName),
      to: recipient(),
      subject,
      text,
      ...(replyTo ? { replyTo } : {}),
    });
    return { status: 'sent' };
  } catch (err) {
    return { status: 'failed', error: err instanceof Error ? err.message : String(err) };
  }
}
