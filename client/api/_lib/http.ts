/**
 * The response envelope the client already expects.
 *
 * `client/src/services/api.ts` reads `json.data` on success and
 * `json.error.message` / `json.error.details` on failure, so these helpers
 * reproduce the Express API's shape exactly (`server/src/utils/AppError.js`,
 * `server/src/middleware/error.js`). Keeping it identical means the client
 * needs no change whether it talks to these functions or the Express server.
 */
export interface ApiRequest {
  method?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
}

export interface ApiResponse {
  status(code: number): ApiResponse;
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
}

export const ok = (res: ApiResponse, data: unknown, status = 201) =>
  res.status(status).json({ success: true, data });

export const fail = (
  res: ApiResponse, status: number, code: string, message: string,
  details?: Record<string, string>,
) => res.status(status).json({ error: { code, message, ...(details ? { details } : {}) } });

/** Mirrors AppError.validation: 422 + per-field messages the form renders inline. */
export const invalid = (res: ApiResponse, details: Record<string, string>) =>
  fail(res, 422, 'VALIDATION_ERROR', 'Please correct the highlighted fields.', details);

/** Trusts Vercel's proxy header, falling back to the socket. */
export const clientIp = (req: ApiRequest): string => {
  const fwd = req.headers['x-forwarded-for'];
  const first = Array.isArray(fwd) ? fwd[0] : fwd;
  return (first?.split(',')[0] ?? req.socket?.remoteAddress ?? '').trim();
};

export const userAgent = (req: ApiRequest): string => {
  const ua = req.headers['user-agent'];
  return (Array.isArray(ua) ? ua[0] : ua) ?? '';
};

/** Reads a JSON body whether the runtime parsed it or handed us a string. */
export const readBody = (req: ApiRequest): Record<string, unknown> => {
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body) as Record<string, unknown>; } catch { return {}; }
  }
  return (req.body as Record<string, unknown>) ?? {};
};
