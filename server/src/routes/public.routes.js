import { Router } from 'express';
import * as content from '../db/repositories/content.repo.js';
import * as leadService from '../services/lead.service.js';
import { validate } from '../middleware/validate.js';
import { leadSchema, contactSchema, consentSchema } from '../validators/public.schemas.js';
import { pool } from '../db/pool.js';

export const publicRouter = Router();

const ok = (res, data, meta) =>
  res.json({ success: true, data, ...(meta ? { meta } : {}) });

/** Controllers hold no SQL and no business rules. */
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const meta = (req) => ({
  ip: req.ip,
  userAgent: req.get('user-agent'),
  sourcePage: req.body?.sourcePage,
  utmSource: req.body?.utmSource,
  utmMedium: req.body?.utmMedium,
  utmCampaign: req.body?.utmCampaign,
});

publicRouter.get('/health', wrap(async (_req, res) => {
  const db = await pool.query('SELECT 1').then(() => 'connected').catch(() => 'disconnected');
  ok(res, { status: 'ok', database: db, uptime: Math.round(process.uptime()) });
}));

publicRouter.get('/content/hero',        wrap(async (_q, r) => ok(r, await content.getHero())));
publicRouter.get('/content/metrics',     wrap(async (q, r) => ok(r, await content.getMetrics(q.query.context))));
publicRouter.get('/content/clients',     wrap(async (_q, r) => ok(r, await content.getClients())));
publicRouter.get('/content/categories',  wrap(async (_q, r) => ok(r, await content.getCategories())));
publicRouter.get('/content/comparison',  wrap(async (_q, r) => ok(r, await content.getComparison())));
publicRouter.get('/content/settings',    wrap(async (_q, r) => ok(r, await content.getPublicSettings())));
publicRouter.get('/content/testimonials', wrap(async (q, r) => ok(r, await content.getTestimonials({
  featured: q.query.featured === undefined ? undefined : q.query.featured === 'true',
  service: q.query.service,
  limit: q.query.limit ? Number(q.query.limit) : undefined,
}))));

publicRouter.get('/services', wrap(async (_q, r) => ok(r, await content.getServices())));
publicRouter.get('/services/:slug', wrap(async (q, r, next) => {
  const row = await content.getServiceBySlug(q.params.slug);
  if (!row) return next(Object.assign(new Error('Not found'), { status: 404, code: 'NOT_FOUND' }));
  ok(r, row);
}));

publicRouter.get('/pricing', wrap(async (_q, r) => ok(r, await content.getPricing())));

publicRouter.get('/case-studies', wrap(async (q, r) => {
  const page = Math.max(1, Number(q.query.page) || 1);
  const limit = Math.min(24, Number(q.query.limit) || 9);
  const rows = await content.getCaseStudies({
    category: q.query.category, limit, offset: (page - 1) * limit,
  });
  const total = rows[0]?.total_count ? Number(rows[0].total_count) : 0;
  ok(r, rows, { page, limit, total, totalPages: Math.ceil(total / limit) });
}));

publicRouter.get('/articles', wrap(async (q, r) => {
  const page = Math.max(1, Number(q.query.page) || 1);
  const limit = Math.min(24, Number(q.query.limit) || 9);
  const rows = await content.getArticles({ limit, offset: (page - 1) * limit });
  const total = rows[0]?.total_count ? Number(rows[0].total_count) : 0;
  ok(r, rows, { page, limit, total, totalPages: Math.ceil(total / limit) });
}));
publicRouter.get('/articles/:slug', wrap(async (q, r, next) => {
  const row = await content.getArticleBySlug(q.params.slug);
  if (!row) return next(Object.assign(new Error('Not found'), { status: 404, code: 'NOT_FOUND' }));
  ok(r, row);
}));

publicRouter.get('/team', wrap(async (_q, r) => ok(r, await content.getTeam())));
publicRouter.get('/seo', wrap(async (q, r) => ok(r, await content.getSeo(q.query.route))));

publicRouter.post('/leads', validate(leadSchema), wrap(async (req, res) => {
  const result = await leadService.submitLead(req.validated, meta(req));
  res.status(201).json({ success: true, data: result });
}));

publicRouter.post('/contact', validate(contactSchema), wrap(async (req, res) => {
  const result = await leadService.submitMessage(req.validated, meta(req));
  res.status(201).json({ success: true, data: result });
}));

publicRouter.post('/consent', validate(consentSchema), wrap(async (req, res) => {
  await leadService.submitConsent(req.validated, meta(req));
  res.status(201).json({ success: true, data: { recorded: true } });
}));
