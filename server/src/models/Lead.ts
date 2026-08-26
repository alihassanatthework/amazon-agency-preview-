import { Schema, model, type InferSchemaType } from 'mongoose';

/**
 * A submitted audit request. The shape mirrors the C2 form exactly — the two
 * grouped steps are stored flat, since they are one submission and not a wizard.
 */
const leadSchema = new Schema(
  {
    // Group 1 — About you
    firstName: { type: String, required: true, trim: true, maxlength: 80 },
    lastName: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    company: { type: String, required: true, trim: true, maxlength: 160 },
    phone: { type: String, trim: true, maxlength: 40 },

    // Group 2 — About your Amazon account
    brand: { type: String, required: true, trim: true, maxlength: 160 },
    revenue: {
      type: String,
      required: true,
      enum: ['under-50k', '50k-250k', '250k-1m', '1m-plus'],
    },
    asinCount: {
      type: String,
      required: true,
      enum: ['under-25', '25-100', '100-500', '500-plus'],
    },
    markets: [{ type: String, enum: ['US', 'CA', 'UK', 'EU', 'other'] }],
    setup: {
      type: String,
      required: true,
      enum: ['seller-central', 'vendor-central', 'both', 'not-yet-selling'],
    },
    goal: { type: String, trim: true, maxlength: 2000 },
    consent: { type: Boolean, required: true },

    // Operational
    status: {
      type: String,
      enum: ['new', 'contacted', 'audited', 'closed'],
      default: 'new',
    },
    source: { type: String, default: 'contact-page' },
  },
  { timestamps: true },
);

leadSchema.index({ createdAt: -1 });

export type Lead = InferSchemaType<typeof leadSchema>;
export const LeadModel = model('Lead', leadSchema);
