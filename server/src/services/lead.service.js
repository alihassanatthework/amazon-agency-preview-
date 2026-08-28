import { randomUUID } from 'node:crypto';
import * as repo from '../db/repositories/lead.repo.js';
import { notifyLead } from './notify.service.js';
import { AppError } from '../utils/AppError.js';

/** Services take plain arguments and never touch req or res. */
export async function submitLead(data, meta) {
  // Honeypot filled, or submitted implausibly fast. The response is
  // deliberately indistinguishable from a real success — a bot that can tell
  // it was caught simply tries again differently.
  if (data.hp || (data.elapsedMs !== undefined && data.elapsedMs < 2000)) {
    return { uuid: randomUUID() };
  }

  const dupe = await repo.recentDuplicate(data.email);
  if (dupe) throw AppError.conflict('We already have that request — we will be in touch shortly.');

  // Persisted first. Notification is best-effort and recorded either way.
  const lead = await repo.createLead(data, meta);
  const result = await notifyLead(lead, data);
  await repo.markNotify(lead.id, result.status, result.error);

  return { uuid: lead.uuid };
}

export async function submitMessage(data, meta) {
  if (data.website || (data.elapsedMs !== undefined && data.elapsedMs < 2000)) {
    return { uuid: randomUUID() };
  }
  const row = await repo.createMessage(data, meta);
  return { uuid: row.uuid };
}

export const submitConsent = (data, meta) => repo.recordConsent(data, meta);
