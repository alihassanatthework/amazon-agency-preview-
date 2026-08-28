import { randomUUID } from 'node:crypto';
import { AppError } from '../utils/AppError.js';
import { env } from '../config/env.js';

export function requestId(req, _res, next) {
  req.id = `req_${randomUUID().replace(/-/g, '').slice(0, 20)}`;
  next();
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: `No route for ${req.method} ${req.path}` },
    requestId: req.id,
  });
}

/** Must be last, and must keep the 4-argument signature. */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  const isApp = err instanceof AppError;
  const status = isApp ? err.status : 500;

  // Stack traces and SQL errors never reach the client.
  if (!isApp || status >= 500) {
    console.error(`[${req.id}] ${req.method} ${req.path}`, err);
  }

  res.status(status).json({
    success: false,
    error: {
      code: isApp ? err.code : 'INTERNAL_ERROR',
      message: isApp ? err.message : 'Something went wrong on our end.',
      ...(isApp && err.details ? { details: err.details } : {}),
      ...(env.NODE_ENV === 'development' && !isApp ? { debug: err.message } : {}),
    },
    requestId: req.id,
  });
}
