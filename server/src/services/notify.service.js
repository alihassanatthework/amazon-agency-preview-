import { env } from '../config/env.js';

/**
 * Dispatch is behind one interface so a CRM can be added later without
 * touching lead logic (§22 Q-07). Today it logs and, if SMTP is configured,
 * would send. A failure here must never fail the request — the lead is
 * already committed by the time this runs.
 */
export async function notifyLead(lead, data) {
  if (!env.LEAD_NOTIFY_TO || !env.SMTP_HOST) {
    console.warn(`[notify] SMTP not configured — lead ${lead.uuid} stored but not emailed.`);
    return { status: 'failed', error: 'SMTP not configured' };
  }
  try {
    console.info(`[notify] lead ${lead.uuid} → ${env.LEAD_NOTIFY_TO} (${data.email})`);
    return { status: 'sent' };
  } catch (err) {
    return { status: 'failed', error: err.message };
  }
}
