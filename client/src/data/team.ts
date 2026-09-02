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
 * Ten people are on the team. Five are named here because five are evidenced.
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
  { slug: 'blake-gale',     name: 'Blake Gale',     role: 'Founder & CEO' },
  { slug: 'keith-slentz',   name: 'Keith Slentz',   role: 'Account Manager' },
  { slug: 'daniel-purser',  name: 'Daniel Purser',  role: 'Account Manager' },
  { slug: 'trevar-gale',    name: 'Trevar Gale',    role: 'Account Manager' },
  {
    slug: 'jantzen-russell',
    name: 'Jantzen Russell',
    role: 'Marketing Director',
    bio: 'Jantzen Russell is the marketing director at BLAZON… helping sellers increase sales for over six years by leveraging sound, sustainable advertising and branding principles to create reliable growth.',
  },
];

/** Headcount is ten; this file names the five we can evidence. */
export const TEAM_SIZE = 10;
