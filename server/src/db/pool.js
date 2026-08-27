import pg from 'pg';
import 'dotenv/config';

// NUMERIC comes back as a string by default so precision is not silently lost.
// Money in this schema is well inside float range, so parse it for convenience.
pg.types.setTypeParser(1700, (v) => (v === null ? null : Number(v)));

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
});

pool.on('error', (err) => {
  console.error('[db] idle client error', err);
});

export const query = (text, params) => pool.query(text, params);

/**
 * Runs `fn` inside a transaction.
 *
 * Every transaction needs an explicit ROLLBACK in a catch and a release in a
 * finally — a leaked connection under load is the most common cause of a site
 * that works in development and dies in production.
 */
export async function withTransaction(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
