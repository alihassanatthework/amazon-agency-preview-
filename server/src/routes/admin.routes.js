import { Router } from 'express';
import { z } from 'zod';
import { query, withTransaction } from '../db/pool.js';
import { requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { AppError } from '../utils/AppError.js';

export const adminRouter = Router();
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const ok = (res, data, meta) => res.json({ success: true, data, ...(meta ? { meta } : {}) });

const audit = (c, req, action, entityType, entityId, changes) => c.query(
  `INSERT INTO audit_log (user_id, action, entity_type, entity_id, changes, ip_address)
   VALUES ($1,$2,$3,$4,$5,$6)`,
  [req.user.id, action, entityType, entityId ?? null, changes ? JSON.stringify(changes) : null, req.ip],
);

adminRouter.get('/dashboard', requireRole('editor', 'admin'), wrap(async (_req, res) => {
  const [leads, messages, attention, drafts] = await Promise.all([
    query(`SELECT count(*) FILTER (WHERE created_at > now() - interval '7 days')  AS week,
                  count(*) FILTER (WHERE created_at > now() - interval '30 days') AS month,
                  count(*) FILTER (WHERE status = 'new')                          AS unworked,
                  count(*)                                                        AS total
             FROM leads`),
    query(`SELECT count(*) AS unread FROM contact_messages WHERE status = 'new'`),
    query(`SELECT id, uuid, email, created_at, notify_status, crm_status
             FROM leads WHERE crm_status='failed' OR notify_status='failed'
            ORDER BY created_at DESC LIMIT 10`),
    query(`SELECT count(*) AS drafts FROM case_studies WHERE status='draft'`),
  ]);
  const recent = await query(
    `SELECT uuid, first_name, last_name, email, company, selling_status, status, created_at
       FROM leads ORDER BY created_at DESC LIMIT 8`);
  ok(res, {
    leads: leads.rows[0], messages: messages.rows[0],
    needsAttention: attention.rows, draftContent: drafts.rows[0], recent: recent.rows,
  });
}));

/** ORDER BY maps a whitelisted key to a fixed column — never interpolated. */
const LEAD_SORT = {
  created_at: 'l.created_at', email: 'l.email', status: 'l.status', company: 'l.company',
};

adminRouter.get('/leads', requireRole('editor', 'admin'), wrap(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 25);
  const sort = LEAD_SORT[req.query.sort] ?? LEAD_SORT.created_at;
  const dir = req.query.dir === 'asc' ? 'ASC' : 'DESC';

  const { rows } = await query(
    `SELECT l.*, count(*) OVER() AS total_count
       FROM leads l
      WHERE ($1::lead_status IS NULL OR l.status = $1)
        AND ($2::selling_status IS NULL OR l.selling_status = $2)
        AND ($3::text IS NULL OR l.email ILIKE '%'||$3||'%'
                              OR l.company ILIKE '%'||$3||'%'
                              OR (l.first_name||' '||l.last_name) ILIKE '%'||$3||'%')
      ORDER BY ${sort} ${dir}
      LIMIT $4 OFFSET $5`,
    [req.query.status ?? null, req.query.selling ?? null, req.query.q ?? null,
     limit, (page - 1) * limit],
  );
  const total = rows[0]?.total_count ? Number(rows[0].total_count) : 0;
  ok(res, rows, { page, limit, total, totalPages: Math.ceil(total / limit) });
}));

adminRouter.get('/leads/:id', requireRole('editor', 'admin'), wrap(async (req, res) => {
  const { rows } = await query('SELECT * FROM leads WHERE id = $1', [req.params.id]);
  if (!rows[0]) throw AppError.notFound('That lead no longer exists.');
  const events = await query(
    'SELECT event_type, note, created_at FROM lead_events WHERE lead_id=$1 ORDER BY created_at DESC',
    [req.params.id]);
  ok(res, { lead: rows[0], events: events.rows });
}));

const patchLead = z.object({
  status: z.enum(['new', 'contacted', 'qualified', 'won', 'lost', 'spam']).optional(),
  note: z.string().max(1000).optional(),
});

adminRouter.patch('/leads/:id', requireRole('editor', 'admin'), validate(patchLead),
  wrap(async (req, res) => {
    const out = await withTransaction(async (c) => {
      const { rows } = await c.query(
        `UPDATE leads SET status = COALESCE($2, status) WHERE id = $1 RETURNING *`,
        [req.params.id, req.validated.status ?? null]);
      if (!rows[0]) throw AppError.notFound('That lead no longer exists.');
      if (req.validated.status) {
        await c.query(
          `INSERT INTO lead_events (lead_id, event_type, note, created_by) VALUES ($1,'status_changed',$2,$3)`,
          [req.params.id, `Status set to ${req.validated.status}`, req.user.id]);
      }
      if (req.validated.note) {
        await c.query(
          `INSERT INTO lead_events (lead_id, event_type, note, created_by) VALUES ($1,'note',$2,$3)`,
          [req.params.id, req.validated.note, req.user.id]);
      }
      await audit(c, req, 'update', 'lead', Number(req.params.id), req.validated);
      return rows[0];
    });
    ok(res, out);
  }));

adminRouter.get('/leads/export/csv', requireRole('editor', 'admin'), wrap(async (req, res) => {
  const { rows } = await query(
    `SELECT uuid, first_name, last_name, email, phone, company, brand_name,
            selling_status, monthly_revenue_band, sku_count_band, status, created_at
       FROM leads ORDER BY created_at DESC`);
  await withTransaction((c) => audit(c, req, 'export', 'lead', null, { count: rows.length }));

  const cols = Object.keys(rows[0] ?? { uuid: '' });
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="blazon-leads.csv"');
  res.send([cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n'));
}));

adminRouter.get('/messages', requireRole('editor', 'admin'), wrap(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 25);
  const { rows } = await query(
    `SELECT *, count(*) OVER() AS total_count FROM contact_messages
      WHERE ($1::message_status IS NULL OR status = $1)
      ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    [req.query.status ?? null, limit, (page - 1) * limit]);
  const total = rows[0]?.total_count ? Number(rows[0].total_count) : 0;
  ok(res, rows, { page, limit, total, totalPages: Math.ceil(total / limit) });
}));

adminRouter.patch('/messages/:id', requireRole('editor', 'admin'),
  validate(z.object({ status: z.enum(['new', 'read', 'replied', 'archived', 'spam']) })),
  wrap(async (req, res) => {
    const out = await withTransaction(async (c) => {
      const { rows } = await c.query(
        'UPDATE contact_messages SET status=$2 WHERE id=$1 RETURNING *',
        [req.params.id, req.validated.status]);
      if (!rows[0]) throw AppError.notFound('That message no longer exists.');
      await audit(c, req, 'update', 'contact_message', Number(req.params.id), req.validated);
      return rows[0];
    });
    ok(res, out);
  }));

/**
 * Content resources share one shape: list including drafts, read, update and
 * reorder, each transactional with an audit entry.
 */
const RESOURCES = {
  hero: 'hero_slides', metrics: 'kpi_metrics', clients: 'clients',
  categories: 'categories', services: 'services', testimonials: 'testimonials',
  'case-studies': 'case_studies', comparison: 'comparison_rows',
  'pricing-tiers': 'pricing_tiers', articles: 'articles', team: 'team_members',
};

adminRouter.get('/:resource', requireRole('editor', 'admin'), wrap(async (req, res, next) => {
  const table = RESOURCES[req.params.resource];
  if (!table) return next();
  const { rows } = await query(`SELECT * FROM ${table} ORDER BY id`);
  ok(res, rows);
}));

adminRouter.get('/audit-log', requireRole('admin'), wrap(async (req, res) => {
  const { rows } = await query(
    `SELECT a.*, u.email AS actor FROM audit_log a
       LEFT JOIN users u ON u.id = a.user_id
      ORDER BY a.created_at DESC LIMIT 200`);
  ok(res, rows);
}));

adminRouter.get('/settings', requireRole('admin'), wrap(async (_req, res) => {
  const { rows } = await query('SELECT key, value, description, is_public FROM site_settings ORDER BY key');
  ok(res, rows);
}));
