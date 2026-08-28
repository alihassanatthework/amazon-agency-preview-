import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { publicRouter } from './routes/public.routes.js';
import { authRouter } from './routes/auth.routes.js';
import { adminRouter } from './routes/admin.routes.js';
import { requireAuth } from './middleware/auth.js';
import { requestId, notFoundHandler, errorHandler } from './middleware/error.js';

export const app = express();

// §17.2 — order matters. Security headers first, error handler last.
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(requestId);

const limiterOpts = { standardHeaders: 'draft-7', legacyHeaders: false };
const general = rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, ...limiterOpts });
const authLimit = rateLimit({
  windowMs: 15 * 60 * 1000, limit: 5, ...limiterOpts,
  keyGenerator: (req) => `${req.ip}:${req.body?.email ?? ''}`,
  message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many attempts. Try again in 15 minutes.' } },
});
const formLimit = rateLimit({
  windowMs: 15 * 60 * 1000, limit: 10, ...limiterOpts,
  message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many submissions. Please try again shortly.' } },
});

app.use('/api', general);
app.use('/api/auth', authLimit, authRouter);
app.use('/api/leads', formLimit);
app.use('/api/contact', formLimit);
app.use('/api', publicRouter);
app.use('/api/admin', requireAuth, adminRouter);

app.use(notFoundHandler);
app.use(errorHandler);
