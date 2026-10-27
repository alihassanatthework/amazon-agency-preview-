/**
 * Lead delivery by email.
 *
 * Uses Resend's REST API over `fetch` rather than an SDK: these functions run
 * on every form submission and a dependency-free handler keeps the cold start
 * short. Configuration is three environment variables on the Vercel project:
 *
 *   RESEND_API_KEY    the API key
 *   LEAD_NOTIFY_TO    where submissions are sent
 *   LEAD_NOTIFY_FROM  a verified sender on your Resend domain
 *
 * If those are missing the caller is told plainly and the submission is
 * refused, rather than being accepted and dropped. A lead that vanishes
 * silently is worse than one the visitor knows to phone in.
 */
export type Delivery =
  | { status: 'sent' }
  | { status: 'unconfigured' }
  | { status: 'failed'; error: string };

const ENDPOINT = 'https://api.resend.com/emails';

export const isConfigured = (): boolean => Boolean(
  process.env.RESEND_API_KEY && process.env.LEAD_NOTIFY_TO && process.env.LEAD_NOTIFY_FROM,
);

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

export async function send(subject: string, text: string, replyTo?: string): Promise<Delivery> {
  if (!isConfigured()) return { status: 'unconfigured' };
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.LEAD_NOTIFY_FROM,
        to: [process.env.LEAD_NOTIFY_TO],
        subject,
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      return { status: 'failed', error: `${res.status} ${detail}`.trim() };
    }
    return { status: 'sent' };
  } catch (err) {
    return { status: 'failed', error: err instanceof Error ? err.message : String(err) };
  }
}
