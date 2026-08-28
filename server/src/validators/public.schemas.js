import { z } from 'zod';

const required = (m) => z.string({ message: m }).trim().min(1, m);

export const leadSchema = z.object({
  firstName: required('Enter your first name').max(80),
  lastName: required('Enter your last name').max(80),
  email: required('Enter your work email address').max(200)
    .pipe(z.string().email('Enter a valid work email address')),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  company: z.string().trim().max(160).optional().or(z.literal('')),
  brandName: z.string().trim().max(160).optional().or(z.literal('')),
  storeUrl: z.string().trim().max(300).optional().or(z.literal('')),
  sellingStatus: z.enum(['already_selling', 'not_yet_selling'], {
    message: 'Tell us whether you are already selling on Amazon',
  }),
  platform: z.enum(['seller_central', 'vendor_central', 'both', 'none']).optional().or(z.literal('')),
  monthlyRevenueBand: z.string().trim().max(60).optional().or(z.literal('')),
  skuCountBand: z.string().trim().max(60).optional().or(z.literal('')),
  marketplaces: z.array(z.string().max(20)).max(10).optional(),
  productCategory: z.string().trim().max(120).optional().or(z.literal('')),
  primaryGoal: z.string().trim().max(500).optional().or(z.literal('')),
  message: z.string().trim().max(2000).optional().or(z.literal('')),
  consent: z.literal(true, { message: 'Please accept the privacy policy to continue' }),
  // Spam controls. Deliberately permissive: a filled honeypot must be accepted
  // and then silently discarded by the service, never rejected by name — a
  // validation error mentioning the field tells a bot exactly what to avoid.
  hp: z.string().max(200).optional(),
  elapsedMs: z.coerce.number().optional(),
  sourcePage: z.string().max(200).optional(),
  utmSource: z.string().max(120).optional(),
  utmMedium: z.string().max(120).optional(),
  utmCampaign: z.string().max(120).optional(),
});

export const contactSchema = z.object({
  name: required('Enter your name').max(160),
  email: required('Enter your work email address').max(200)
    .pipe(z.string().email('Enter a valid work email address')),
  company: z.string().trim().max(160).optional().or(z.literal('')),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  inquiryType: z.string().trim().max(40).optional().or(z.literal('')),
  message: z.string().trim().min(10, 'Tell us a little more — at least a sentence.').max(5000),
  consent: z.literal(true, { message: 'Please accept the privacy policy to continue' }),
  website: z.string().max(200).optional(),   // honeypot — see note above
  elapsedMs: z.coerce.number().optional(),
});

export const consentSchema = z.object({
  visitorId: z.string().min(1).max(80),
  analytics: z.boolean(),
  marketing: z.boolean(),
  policyVersion: z.string().min(1).max(20),
});
