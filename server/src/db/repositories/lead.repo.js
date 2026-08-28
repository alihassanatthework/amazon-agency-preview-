import { withTransaction, query } from '../pool.js';

/**
 * §FR-24 — the lead is persisted before any external dispatch, in a
 * transaction with its first event. Failure is visible and retryable, never
 * silent, so no lead is ever lost.
 */
export const createLead = (data, meta) => withTransaction(async (c) => {
  const { rows } = await c.query(
    `INSERT INTO leads (
        first_name, last_name, email, phone, company, brand_name, store_url,
        selling_status, platform, monthly_revenue_band, sku_count_band,
        marketplaces, product_category, primary_goal, message, consent_given,
        source_page, utm_source, utm_medium, utm_campaign, ip_address, user_agent)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
      RETURNING id, uuid, created_at`,
    [data.firstName, data.lastName, data.email, data.phone ?? null,
     data.company ?? null, data.brandName ?? null, data.storeUrl ?? null,
     data.sellingStatus, data.platform ?? null, data.monthlyRevenueBand ?? null,
     data.skuCountBand ?? null, data.marketplaces ?? null,
     data.productCategory ?? null, data.primaryGoal ?? null, data.message ?? null,
     data.consent, meta.sourcePage ?? null, meta.utmSource ?? null,
     meta.utmMedium ?? null, meta.utmCampaign ?? null, meta.ip ?? null, meta.userAgent ?? null],
  );
  const lead = rows[0];
  await c.query(
    `INSERT INTO lead_events (lead_id, event_type, note) VALUES ($1,'created',$2)`,
    [lead.id, `Submitted via ${meta.sourcePage ?? 'get-started'}`],
  );
  return lead;
});

/** §FR-21 — server-side dedupe on email within a window. */
export const recentDuplicate = (email, minutes = 10) => query(
  `SELECT id FROM leads
    WHERE email = $1 AND created_at > now() - ($2 || ' minutes')::interval
    LIMIT 1`, [email, String(minutes)]).then((r) => r.rows[0] ?? null);

export const markNotify = (id, status, error = null) => query(
  `UPDATE leads SET notify_status=$2, crm_last_error=COALESCE($3, crm_last_error)
    WHERE id=$1`, [id, status, error]);

export const createMessage = (data, meta) => query(
  `INSERT INTO contact_messages
     (name, email, company, phone, inquiry_type, message, consent_given, ip_address)
   VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
   RETURNING id, uuid, created_at`,
  [data.name, data.email, data.company ?? null, data.phone ?? null,
   data.inquiryType ?? null, data.message, data.consent, meta.ip ?? null])
  .then((r) => r.rows[0]);

export const recordConsent = (data, meta) => query(
  `INSERT INTO consent_logs (visitor_id, necessary, analytics, marketing, policy_version, ip_address)
   VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
  [data.visitorId, true, data.analytics, data.marketing, data.policyVersion, meta.ip ?? null])
  .then((r) => r.rows[0]);
