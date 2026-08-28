import { verifyAccess } from '../services/auth.service.js';
import { AppError } from '../utils/AppError.js';

export function requireAuth(req, _res, next) {
  const header = req.get('authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(AppError.unauthenticated());
  try {
    const payload = verifyAccess(token);
    req.user = { id: Number(payload.sub), role: payload.role };
    next();
  } catch {
    next(AppError.unauthenticated());
  }
}

/**
 * The frontend guard is UX, not security — every protected endpoint enforces
 * authorization independently.
 */
export const requireRole = (...roles) => (req, _res, next) =>
  roles.includes(req.user?.role) ? next() : next(AppError.forbidden());
