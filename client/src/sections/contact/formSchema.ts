export interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  phone: string;
  brand: string;
  revenue: string;
  asinCount: string;
  markets: string[];
  setup: string;
  goal: string;
  consent: boolean;
}

export const emptyForm: FormValues = {
  firstName: '',
  lastName: '',
  email: '',
  company: '',
  phone: '',
  brand: '',
  revenue: '',
  asinCount: '',
  markets: [],
  setup: '',
  goal: '',
  consent: false,
};

export const REVENUE_OPTIONS = [
  { value: 'under-50k', label: 'Under $50k' },
  { value: '50k-250k', label: '$50k – $250k' },
  { value: '250k-1m', label: '$250k – $1M' },
  { value: '1m-plus', label: '$1M+' },
];

export const ASIN_OPTIONS = [
  { value: 'under-25', label: 'Fewer than 25' },
  { value: '25-100', label: '25 – 100' },
  { value: '100-500', label: '100 – 500' },
  { value: '500-plus', label: 'More than 500' },
];

export const MARKET_OPTIONS = ['US', 'CA', 'UK', 'EU', 'other'];

export const SETUP_OPTIONS = [
  { value: 'seller-central', label: 'Seller Central' },
  { value: 'vendor-central', label: 'Vendor Central' },
  { value: 'both', label: 'Both' },
  { value: 'not-yet-selling', label: 'Not yet selling on Amazon' },
];

export type Errors = Partial<Record<keyof FormValues | 'form', string>>;

/**
 * Validation runs on blur, never on keystroke, so the user is not corrected
 * mid-typing. The same rules run again on the server.
 */
export function validateField(name: keyof FormValues, values: FormValues): string | undefined {
  switch (name) {
    case 'firstName':
      return values.firstName.trim() ? undefined : 'Enter your first name';
    case 'lastName':
      return values.lastName.trim() ? undefined : 'Enter your last name';
    case 'email':
      if (!values.email.trim()) return 'Enter your work email address';
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())
        ? undefined
        : 'Enter a valid work email address';
    case 'company':
      return values.company.trim() ? undefined : 'Enter your company name';
    case 'brand':
      return values.brand.trim() ? undefined : 'Enter your brand or storefront name';
    case 'revenue':
      return values.revenue ? undefined : 'Select your monthly Amazon revenue';
    case 'asinCount':
      return values.asinCount ? undefined : 'Select an approximate ASIN count';
    case 'markets':
      return values.markets.length ? undefined : 'Select at least one market';
    case 'setup':
      return values.setup ? undefined : 'Select your current setup';
    case 'consent':
      return values.consent ? undefined : 'Please accept the privacy policy to continue';
    default:
      return undefined;
  }
}

export const REQUIRED_FIELDS: (keyof FormValues)[] = [
  'firstName',
  'lastName',
  'email',
  'company',
  'brand',
  'revenue',
  'asinCount',
  'markets',
  'setup',
  'consent',
];

export function validateAll(values: FormValues): Errors {
  const errors: Errors = {};
  for (const field of REQUIRED_FIELDS) {
    const message = validateField(field, values);
    if (message) errors[field] = message;
  }
  return errors;
}
