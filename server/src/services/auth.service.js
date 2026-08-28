import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createHash, randomBytes } from 'node:crypto';
import * as repo from '../db/repositories/auth.repo.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

const ACCESS_TTL = '15m';
const REFRESH_DAYS = 7;
const hash = (t) => createHash('sha256').update(t).digest('hex');

export const signAccess = (user) =>
  jwt.sign({ sub: String(user.id), role: user.role }, env.JWT_ACCESS_SECRET, { expiresIn: ACCESS_TTL });

export const verifyAccess = (token) => jwt.verify(token, env.JWT_ACCESS_SECRET);

async function issueRefresh(userId, meta) {
  const raw = randomBytes(64).toString('hex');
  const expiresAt = new Date(Date.now() + REFRESH_DAYS * 86_400_000);
  await repo.storeRefresh(userId, hash(raw), expiresAt, meta);   // only the hash is stored
  return { raw, expiresAt };
}

export async function login(email, password, meta) {
  const user = await repo.findByEmail(email);
  // The same generic message regardless of whether the email exists.
  const generic = AppError.unauthenticated('Email or password is incorrect.');

  if (!user || !user.is_active) throw generic;
  if (user.locked_until && new Date(user.locked_until) > new Date()) {
    throw AppError.rateLimited('This account is temporarily locked. Try again later.');
  }
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) { await repo.registerFailure(user.id); throw generic; }

  await repo.registerSuccess(user.id);
  const refresh = await issueRefresh(user.id, meta);
  return {
    user: { id: user.id, email: user.email, fullName: user.full_name, role: user.role },
    accessToken: signAccess(user),
    refresh,
  };
}

export async function refresh(rawToken, meta) {
  if (!rawToken) throw AppError.unauthenticated('Session expired. Please sign in again.');
  const row = await repo.findRefresh(hash(rawToken));
  if (!row) throw AppError.unauthenticated('Session expired. Please sign in again.');

  if (row.revoked_at) {
    // Reuse of a revoked token: assume theft and revoke the entire family.
    await repo.revokeAllForUser(row.user_id);
    throw AppError.unauthenticated('Session expired. Please sign in again.');
  }
  if (new Date(row.expires_at) < new Date()) {
    throw AppError.unauthenticated('Session expired. Please sign in again.');
  }

  await repo.revokeRefresh(row.id);                     // rotate on every use
  const user = await repo.findById(row.user_id);
  if (!user) throw AppError.unauthenticated('Session expired. Please sign in again.');

  const next = await issueRefresh(user.id, meta);
  return {
    user: { id: user.id, email: user.email, fullName: user.full_name, role: user.role },
    accessToken: signAccess(user),
    refresh: next,
  };
}

export async function logout(rawToken) {
  if (!rawToken) return;
  const row = await repo.findRefresh(hash(rawToken));
  if (row) await repo.revokeRefresh(row.id);            // server-side, not just client state
}

export const me = (id) => repo.findById(id);
