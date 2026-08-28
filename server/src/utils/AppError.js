/** Services throw these; the error handler turns them into the envelope. */
export class AppError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
  static badRequest(m = 'Bad request', d) { return new AppError(400, 'BAD_REQUEST', m, d); }
  static unauthenticated(m = 'Sign in to continue') { return new AppError(401, 'UNAUTHENTICATED', m); }
  static forbidden(m = 'You do not have access to that') { return new AppError(403, 'FORBIDDEN', m); }
  static notFound(m = 'Not found') { return new AppError(404, 'NOT_FOUND', m); }
  static conflict(m = 'That already exists') { return new AppError(409, 'CONFLICT', m); }
  static validation(details, m = 'Please correct the highlighted fields.') {
    return new AppError(422, 'VALIDATION_ERROR', m, details);
  }
  static rateLimited(m = 'Too many attempts. Please try again shortly.') {
    return new AppError(429, 'RATE_LIMITED', m);
  }
}
