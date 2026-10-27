/**
 * Field rules and error messages mirroring the Express API's Zod schemas in
 * `server/src/validators/public.schemas.js`, so a given submission is accepted
 * or rejected identically whichever backend serves it, and the forms show the
 * same inline copy either way.
 *
 * Deliberately hand-written rather than importing those schemas: the server is
 * on Zod 4 and this package is on Zod 3, and their option syntax differs. A
 * few dozen lines here is cheaper and clearer than reconciling that.
 */
export type Errors = Record<string, string>;

const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface Rule { max?: number; min?: number; required?: string; invalid?: string }

function field(out: Errors, key: string, raw: unknown, rule: Rule): string {
  const v = str(raw);
  if (!v) { if (rule.required) out[key] = rule.required; return ''; }
  if (rule.min && v.length < rule.min && rule.invalid) out[key] = rule.invalid;
  if (rule.max && v.length > rule.max) out[key] = `Keep this under ${rule.max} characters.`;
  return v;
}

function email(out: Errors, raw: unknown): string {
  const v = field(out, 'email', raw, { required: 'Enter your work email address', max: 200 });
  if (v && !EMAIL.test(v)) out.email = 'Enter a valid work email address';
  return v;
}

/** True when the submission looks automated — a filled honeypot or an
 *  implausibly fast fill. Callers must answer with a normal success. */
export const looksAutomated = (body: Record<string, unknown>, honeypot: string): boolean => {
  const elapsed = Number(body.elapsedMs);
  return Boolean(str(body[honeypot])) || (Number.isFinite(elapsed) && elapsed < 2000);
};

export interface ContactInput {
  name: string; email: string; company: string; phone: string;
  inquiryType: string; message: string;
}

export function validateContact(b: Record<string, unknown>): { errors: Errors; value: ContactInput } {
  const e: Errors = {};
  const value: ContactInput = {
    name: field(e, 'name', b.name, { required: 'Enter your name', max: 160 }),
    email: email(e, b.email),
    company: field(e, 'company', b.company, { max: 160 }),
    phone: field(e, 'phone', b.phone, { max: 40 }),
    inquiryType: field(e, 'inquiryType', b.inquiryType, { max: 40 }),
    message: field(e, 'message', b.message, {
      required: 'Tell us a little more — at least a sentence.',
      min: 10, invalid: 'Tell us a little more — at least a sentence.', max: 5000,
    }),
  };
  if (b.consent !== true) e.consent = 'Please accept the privacy policy to continue';
  return { errors: e, value };
}

export interface LeadInput extends Record<string, string | string[]> {
  firstName: string; lastName: string; email: string; phone: string;
  company: string; brandName: string; storeUrl: string; sellingStatus: string;
  platform: string; monthlyRevenueBand: string; skuCountBand: string;
  productCategory: string; primaryGoal: string; message: string;
  marketplaces: string[];
}

const SELLING = ['already_selling', 'not_yet_selling'];

export function validateLead(b: Record<string, unknown>): { errors: Errors; value: LeadInput } {
  const e: Errors = {};
  const selling = str(b.sellingStatus);
  if (!SELLING.includes(selling)) {
    e.sellingStatus = 'Tell us whether you are already selling on Amazon';
  }
  const value: LeadInput = {
    firstName: field(e, 'firstName', b.firstName, { required: 'Enter your first name', max: 80 }),
    lastName: field(e, 'lastName', b.lastName, { required: 'Enter your last name', max: 80 }),
    email: email(e, b.email),
    phone: field(e, 'phone', b.phone, { max: 40 }),
    company: field(e, 'company', b.company, { max: 160 }),
    brandName: field(e, 'brandName', b.brandName, { max: 160 }),
    storeUrl: field(e, 'storeUrl', b.storeUrl, { max: 300 }),
    sellingStatus: selling,
    platform: field(e, 'platform', b.platform, { max: 40 }),
    monthlyRevenueBand: field(e, 'monthlyRevenueBand', b.monthlyRevenueBand, { max: 60 }),
    skuCountBand: field(e, 'skuCountBand', b.skuCountBand, { max: 60 }),
    productCategory: field(e, 'productCategory', b.productCategory, { max: 120 }),
    primaryGoal: field(e, 'primaryGoal', b.primaryGoal, { max: 500 }),
    message: field(e, 'message', b.message, { max: 2000 }),
    marketplaces: Array.isArray(b.marketplaces)
      ? (b.marketplaces as unknown[]).slice(0, 10).map(str).filter(Boolean) : [],
  };
  if (b.consent !== true) e.consent = 'Please accept the privacy policy to continue';
  return { errors: e, value };
}
