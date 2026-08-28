import { query } from '../pool.js';

// password_hash is excluded from every select that feeds an API response.
const SAFE = 'id, email, full_name, role, is_active, last_login_at, created_at';

export const findByEmail = (email) => query(
  `SELECT id, email, password_hash, full_name, role, is_active,
          failed_login_count, locked_until
     FROM users WHERE email = $1`, [email]).then((r) => r.rows[0] ?? null);

export const findById = (id) => query(
  `SELECT ${SAFE} FROM users WHERE id = $1 AND is_active = true`, [id])
  .then((r) => r.rows[0] ?? null);

export const registerFailure = (id) => query(
  `UPDATE users
      SET failed_login_count = failed_login_count + 1,
          locked_until = CASE WHEN failed_login_count + 1 >= 10
                              THEN now() + interval '30 minutes' ELSE locked_until END
    WHERE id = $1`, [id]);

export const registerSuccess = (id) => query(
  `UPDATE users SET failed_login_count = 0, locked_until = NULL, last_login_at = now()
    WHERE id = $1`, [id]);

export const storeRefresh = (userId, tokenHash, expiresAt, meta) => query(
  `INSERT INTO refresh_tokens (user_id, token_hash, expires_at, user_agent, ip_address)
   VALUES ($1,$2,$3,$4,$5) RETURNING id`,
  [userId, tokenHash, expiresAt, meta.userAgent ?? null, meta.ip ?? null])
  .then((r) => r.rows[0]);

export const findRefresh = (tokenHash) => query(
  `SELECT id, user_id, expires_at, revoked_at FROM refresh_tokens WHERE token_hash = $1`,
  [tokenHash]).then((r) => r.rows[0] ?? null);

export const revokeRefresh = (id) => query(
  `UPDATE refresh_tokens SET revoked_at = now() WHERE id = $1`, [id]);

/** Reuse of a revoked token revokes the whole family — stolen-token detection. */
export const revokeAllForUser = (userId) => query(
  `UPDATE refresh_tokens SET revoked_at = now()
    WHERE user_id = $1 AND revoked_at IS NULL`, [userId]);
