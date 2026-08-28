import 'dotenv/config';
import { z } from 'zod';

/** Validated at boot — the process refuses to start with an invalid config. */
const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  CLIENT_URL: z.string().url(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  LEAD_NOTIFY_TO: z.string().email().optional(),
  CRM_WEBHOOK_URL: z.string().url().optional(),
  UPLOAD_DIR: z.string().default('./uploads'),
  MAX_UPLOAD_BYTES: z.coerce.number().default(5_242_880),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error('[env] invalid configuration:');
  for (const i of parsed.error.issues) console.error(`  ${i.path.join('.')}: ${i.message}`);
  process.exit(1);
}

export const env = parsed.data;
