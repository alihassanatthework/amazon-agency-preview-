/**
 * §7.6 / Q-10 — three guest posts exist in the archive. Only the evergreen
 * account-settings piece publishes at launch; the other two reference past
 * periods and are held as drafts until refreshed. All three were originally
 * published elsewhere, so `originalSource` drives the attribution line —
 * republishing without it risks a duplicate-content penalty.
 */
export interface Block { type: 'p' | 'h2'; text: string }
export interface Article {
  slug: string; title: string; excerpt: string;
  readingMinutes: number; status: 'published' | 'draft';
  originalSource?: string; body: Block[];
}

export const articles: Article[] = [
  {
    slug: 'amazon-account-settings-most-sellers-have-wrong',
    title: 'Amazon account settings most sellers have wrong',
    excerpt: 'The settings buried in Seller Central that quietly cost you money — return rates, fulfilment defaults, notifications and the money-back programs almost nobody claims.',
    readingMinutes: 9,
    status: 'published',
    originalSource: 'Riverbend Consulting',
    body: [
      { type: 'p', text: 'Most of the accounts we take over are not broken. They are misconfigured — which is worse, because nothing looks wrong. Sales are steady, the listings are live, and somewhere in the settings a handful of defaults are quietly costing the business money every month.' },
      { type: 'h2', text: 'Return settings are doing more damage than your reviews' },
      { type: 'p', text: 'Amazon lets you configure how returns are handled at the category level, and the defaults are rarely what a brand would choose. Returnless refunds, restocking fee eligibility and the return reason mapping all sit in settings that most sellers have never opened. On a catalogue with any meaningful volume, correcting these is usually the single fastest margin recovery available.' },
      { type: 'h2', text: 'Money-back programs almost nobody claims' },
      { type: 'p', text: 'Amazon operates several reimbursement programs for inventory lost or damaged in its own network. They are not automatic. If you have never run a reconciliation, there is a reasonable chance you are owed money right now — and there is a filing window, after which you are not.' },
      { type: 'h2', text: 'Notifications going to the wrong person' },
      { type: 'p', text: 'Performance notifications are the early warning system for suppressions, policy violations and account health problems. In most accounts we inherit, they route to a single inbox that one person checks occasionally. By the time anyone reads them, a listing has been down for a week.' },
      { type: 'h2', text: 'The Inventory Performance Index nobody reviews' },
      { type: 'p', text: 'IPI governs your storage limits. It moves slowly, which is exactly why it gets ignored — until the quarter it drops below the threshold and your storage is capped going into Q4. It should be reviewed monthly, not annually.' },
      { type: 'h2', text: 'What to do about it' },
      { type: 'p', text: 'Work through the settings systematically once, then review them on a schedule. That is genuinely all it takes. The reason it does not happen is not difficulty — it is that nobody owns it, and it never becomes urgent until it becomes expensive.' },
    ],
  },
  {
    slug: 'amazon-logistics-strategies',
    title: 'Amazon logistics — strategies for the fee restructure',
    excerpt: 'How Amazon’s fee changes reshape the FBA and FBM decision.',
    readingMinutes: 8, status: 'draft', originalSource: 'Fulfillit Logistics',
    body: [],
  },
  {
    slug: 'amazon-holiday-ad-strategies',
    title: 'Four Amazon holiday ad strategies',
    excerpt: 'Preparing advertising for the Q4 event calendar.',
    readingMinutes: 6, status: 'draft', originalSource: 'Riverbend Consulting',
    body: [],
  },
];
