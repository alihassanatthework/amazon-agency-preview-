import { Router } from 'express';
import { z } from 'zod';
import * as auth from '../services/auth.service.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';

export const authRouter = Router();
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const COOKIE = 'blazon_rt';
const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/api/auth',
};

const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(1, 'Enter your password'),
});

authRouter.post('/login', validate(loginSchema), wrap(async (req, res) => {
  const meta = { ip: req.ip, userAgent: req.get('user-agent') };
  const { user, accessToken, refresh } = await auth.login(
    req.validated.email, req.validated.password, meta,
  );
  res.cookie(COOKIE, refresh.raw, { ...cookieOpts, expires: refresh.expiresAt });
  res.json({ success: true, data: { user, accessToken } });
}));

authRouter.post('/refresh', wrap(async (req, res) => {
  const meta = { ip: req.ip, userAgent: req.get('user-agent') };
  const { user, accessToken, refresh } = await auth.refresh(req.cookies?.[COOKIE], meta);
  res.cookie(COOKIE, refresh.raw, { ...cookieOpts, expires: refresh.expiresAt });
  res.json({ success: true, data: { user, accessToken } });
}));

authRouter.post('/logout', wrap(async (req, res) => {
  await auth.logout(req.cookies?.[COOKIE]);
  res.clearCookie(COOKIE, cookieOpts);
  res.json({ success: true, data: { ok: true } });
}));

authRouter.get('/me', requireAuth, wrap(async (req, res) => {
  res.json({ success: true, data: { user: await auth.me(req.user.id) } });
}));
