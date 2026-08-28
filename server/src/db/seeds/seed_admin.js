/** Creates the first admin. There is deliberately no public registration. */
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool } from '../pool.js';

const email = process.argv[2] ?? 'admin@blazonpros.com';
const password = process.argv[3] ?? 'ChangeMe!2026';
const name = process.argv[4] ?? 'BLAZON Admin';

const hash = await bcrypt.hash(password, 12);   // cost 12
const { rows } = await pool.query(
  `INSERT INTO users (email, password_hash, full_name, role)
   VALUES ($1,$2,$3,'admin')
   ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
   RETURNING id, email, role`,
  [email, hash, name]);

console.log('[seed] admin ready:', rows[0]);
console.log('[seed] password:', password, '— change it after first sign-in.');
await pool.end();
