/**
 * The headline figures, stated once.
 *
 * The homepage stat band (`pages/Home/sections/StatBand.tsx`) is the
 * authoritative set — client-approved, verbatim wording. Every other surface
 * that quotes a number (the hero trust line, the About / Results / Contact
 * stat rows, the client-marquee caption) derives it from here.
 *
 * Before this module those surfaces each hand-maintained their own array, and
 * they drifted: the hero claimed 80+ brands and a team of 9 directly above a
 * band saying 100+ and 10+. Add a figure here, not in a page.
 *
 * Headcount deliberately lives in `team.ts` as TEAM_SIZE, next to the roster
 * it counts.
 */

/** Brands under active management. Band: "100+ Brands Currently Servicing". */
export const BRANDS_CURRENT = 100;

/** Brands worked with over the company's life. Band: "250+ Brands Worked With". */
export const BRANDS_TOTAL = 250;

/** Company age. Band: "8+ Years in Business". */
export const YEARS = 8;

/**
 * Combined Amazon experience across the team, in years.
 * Band: "30+ Years of Combined Amazon Experience".
 */
export const COMBINED_YEARS = 30;

/** Average client relationship. Band: "Clients stay 24 months on average". */
export const AVG_MONTHS = 24;

/** Per-specialist minimum Amazon experience. Not the company's age. */
export const SPECIALIST_YEARS = 4;
