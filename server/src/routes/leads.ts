import { Router } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { LeadModel } from '../models/Lead.js';

export const leadsRouter = Router();

/**
 * Server-side validation mirrors the client's, because the client's can be
 * bypassed. Every rule carries its own message: these strings are rendered
 * beneath the offending field, so a default like "expected string, received
 * undefined" would be shown to the person filling the form in.
 */
const required = (message: string) => z.string({ message }).trim().min(1, message);

const leadSchema = z.object({
  firstName: required('Enter your first name').max(80),
  lastName: required('Enter your last name').max(80),
  email: required('Enter your work email address')
    .max(200)
    .pipe(z.email('Enter a valid work email address')),
  company: required('Enter your company name').max(160),
  phone: z.string().trim().max(40).optional().or(z.literal('')),

  brand: required('Enter your brand or storefront name').max(160),
  revenue: z.enum(['under-50k', '50k-250k', '250k-1m', '1m-plus'], {
    message: 'Select your monthly Amazon revenue',
  }),
  asinCount: z.enum(['under-25', '25-100', '100-500', '500-plus'], {
    message: 'Select an approximate ASIN count',
  }),
  markets: z
    .array(z.enum(['US', 'CA', 'UK', 'EU', 'other']), { message: 'Select at least one market' })
    .min(1, 'Select at least one market'),
  setup: z.enum(['seller-central', 'vendor-central', 'both', 'not-yet-selling'], {
    message: 'Select your current setup',
  }),
  goal: z.string().trim().max(2000).optional().or(z.literal('')),
  consent: z.literal(true, { message: 'Please accept the privacy policy to continue' }),
});

leadsRouter.post('/', async (req, res) => {
  const parsed = leadSchema.safeParse(req.body);

  if (!parsed.success) {
    // Field-keyed errors so the client can mark the exact inputs that failed
    // and move focus to the first of them.
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return res.status(400).json({ ok: false, fieldErrors });
  }

  // Without a database the submission must still not be lost: log it loudly
  // and tell the client to fall back to email rather than reporting success.
  if (mongoose.connection.readyState !== 1) {
    console.error('[leads] No database connection. Unpersisted submission:', parsed.data);
    return res.status(503).json({
      ok: false,
      message: 'We could not save your request just now. Please email us and we will pick it up.',
    });
  }

  try {
    const lead = await LeadModel.create(parsed.data);
    return res.status(201).json({ ok: true, id: lead.id });
  } catch (err) {
    console.error('[leads] Failed to persist submission:', err, parsed.data);
    return res.status(500).json({
      ok: false,
      message: 'Something went wrong saving your request. Please email us and we will pick it up.',
    });
  }
});

leadsRouter.get('/', async (_req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ ok: false, message: 'Database unavailable' });
  }
  const leads = await LeadModel.find().sort({ createdAt: -1 }).limit(50).lean();
  return res.json({ ok: true, leads });
});
