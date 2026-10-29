/**
 * §10.6 — the five named staff we can actually evidence.
 *
 * Four come from the deck's "Point of Contact" slide; Jantzen Russell comes
 * from the guest blog bios and has no photograph yet. Bios are quoted, never
 * written for someone: only Jantzen has one on record, so only Jantzen has one
 * here. The blueprint's rule still holds — no stock portraits, no invented
 * biographies — which is why `photo` is optional and a member without one
 * renders a monogram rather than a borrowed face.
 *
 * Photographs live in assets/team as <slug>.jpg|png|webp and are picked up
 * automatically (see photoFor in pages/Team/index.tsx). Drop the files in and
 * they appear; nothing else needs editing.
 *
 * Ten people are on the team; six are named here, each with a photograph. Surnames are left off where none was supplied.
 * The page is built to take the rest as they arrive.
 */
export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  /** Verbatim, from an existing published bio. Never composed. */
  bio?: string;
}

export const team: TeamMember[] = [
  { slug: 'gyle',            name: 'Gyle',           role: 'CFO' },
  { slug: 'blake-gale',      name: 'Blake Gale',     role: 'Founder & CEO' },
  { slug: 'trevar-gale',     name: 'Trevar Gale',    role: 'Account Executive' },
  { slug: 'james',           name: 'James',          role: 'Senior Amazon Expert' },
  { slug: 'lordan',          name: 'Lordan',         role: 'Amazon Expert' },
  { slug: 'shirley',         name: 'Shirley',        role: 'Advertising' },
];

/** Headcount is ten; this file names the six we have photographs for. */
export const TEAM_SIZE = 10;
