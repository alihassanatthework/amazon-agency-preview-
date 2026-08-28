import { AppError } from '../utils/AppError.js';

/**
 * §FR-18 — Zod on every body and query, server side, always, regardless of
 * what the client already checked.
 */
export const validate = (schema, source = 'body') => (req, _res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    const details = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      if (!details[key]) details[key] = issue.message;
    }
    return next(AppError.validation(details));
  }
  req[source === 'body' ? 'validated' : 'validatedQuery'] = result.data;
  next();
};
