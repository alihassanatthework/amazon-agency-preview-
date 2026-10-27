/**
 * The six service categories and their items — client-approved wording, used
 * verbatim rather than rewritten. Every count on the site derives from this
 * array so the published figure cannot drift.
 *
 * Descriptions are intentionally omitted where none were supplied — the item
 * names below are the exact, complete source of truth for each service.
 */
export interface ServiceItem { name: string; description?: string; additionalCost?: boolean }
/** A named stage of how a discipline is actually run, shown on its page. */
export interface ServiceApproach { heading: string; body: string }
/** Per-discipline override of the Weekly/Monthly/Ongoing cards. */
export interface ServiceCadence { label: string; body: string }
export interface ServiceGroup {
  slug: string; title: string; short: string; icon: string;
  summary: string; problem: string[]; additionalCost?: boolean;
  items: ServiceItem[];
  /**
   * Optional, and only Advertising & Marketing carries them today. Both were
   * added so the advertising page could describe its own work in the detail
   * Amazon's Solution Provider review asks for, instead of inheriting the
   * generic account-health cadence every discipline shared. The other five
   * fall back to the shared copy in pages/ServiceDetail until written.
   */
  approach?: ServiceApproach[];
  cadence?: ServiceCadence[];
}

export const services: ServiceGroup[] = [
  {
    slug: 'account-setup', icon: 'settings',
    title: 'Account Setup', short: 'Account Setup',
    summary: 'Everything set up right from day one — Brand Registry, settings, notifications and a seller and brand profile built to reduce fees and returns.',
    problem: ['It becomes a second job', "There's no one to call"],
    items: [
      { name: 'Amazon Brand Registry' },
      { name: 'All Setting Reconfiguration' },
      { name: 'Amazon Money Back Programs' },
      { name: 'Notifications/Customer Setup for Team' },
      { name: 'Settings Reduce Return Rate' },
      { name: 'Build Seller & Brand Profile' },
      { name: 'Reduce Amazon Fees' },
    ],
  },
  {
    slug: 'listing-optimization', icon: 'brand-image',
    title: 'Listing Optimization', short: 'Listing Optimization',
    summary: 'Listings built to convert — organised catalogue structure, imagery, AI-assisted copy, A+ content and the bundle and variation work beneath them.',
    problem: ['Listings drift', 'The rules change constantly'],
    items: [
      { name: 'Create new listings (FBA & FBM)' },
      { name: 'Organize all products in Parent-Child relationships based on similarity' },
      { name: 'Synchronize Product Reviews' },
      { name: 'Create infographics' },
      { name: 'Using Tools with AI Advances to Write Titles, bullet points, product descriptions' },
      { name: 'Build Brand Story & Premium A+ Content' },
      { name: '3D Images of all products' },
      { name: 'Case work' },
      { name: 'Product recommendations (bundles, colors, sizes)' },
    ],
  },
  {
    slug: 'account-health', icon: 'rudder',
    title: 'Account Health', short: 'Account Health',
    summary: 'Account health monitored and protected — performance notifications, IPI, negative review removal and Voice of the Customer, checked on a schedule.',
    problem: ["There's no one to call", 'The rules change constantly'],
    items: [
      { name: 'Check Account Health Regularly & Fix Issues' },
      { name: 'Review all Performance notifications & address them as needed' },
      { name: 'Inventory Performance Index Review & Resolve issues' },
      { name: 'Monthly Negative Seller Reviews Removal' },
      { name: 'Voice of the Customer Checks & Provide Recommendations' },
    ],
  },
  {
    slug: 'advertising-marketing', icon: 'marketing',
    title: 'Advertising & Marketing', short: 'Advertising & Marketing',
    summary: 'Advertising optimisation measured against profit, not impressions — campaign structure, keyword targeting, bids and budget rebuilt around contribution margin, then run on a weekly cadence against your targets.',
    problem: ['Fees keep climbing', 'Opportunities stay invisible'],
    /**
     * Descriptions and the approach/cadence below describe how BLAZON already
     * ran the published case studies — every claim traces to one of them:
     * Aloha Bay (branded-search waste, contribution margin over raw ACOS, 14%
     * ACOS while raising prices), GRINDS (campaign and keyword restructuring
     * taking TACOS 20%→9% on an unchanged $40,000 budget, weekly PPC cadence,
     * monthly TACOS review, per-launch keyword plans), VetRx (campaigns
     * structured to reach an efficient TACOS rather than spending broadly),
     * plus the published $3,000/month managed ceiling and 5–10%-of-gross
     * budget guidance. Nothing here asserts a service the site cannot already
     * evidence. AWAITING CLIENT SIGN-OFF before this is treated as final.
     */
    items: [
      { name: 'Optimize ad campaigns',
        description: 'We audit the account first — where spend is going, which campaigns earn it and which are defending search terms you already own. Then we rebuild the structure: campaigns and ad groups organised so budget can be steered, keyword and product targeting set deliberately, wasteful search terms excluded, and bids and budgets managed against the targets we agree. Performance is judged on contribution margin rather than raw ACOS, because a low ACOS on a product that does not pay for itself is not a result.' },
      { name: 'Implement BLAZON’s Organic Growth Strategy using ads',
        description: 'Paid is the third step, not the first. Listings are cleaned and optimised, organic position is built, and only then is advertising pointed at the places where it compounds that work rather than substituting for it. New products and variations launch with their own keyword and positioning plan instead of being added to an existing campaign.' },
      { name: 'Create Promotions for Event Days (Prime Day)',
        description: 'Prime Day, Black Friday and the other event days are planned ahead — deals submitted to deadline, inventory and budget set for the traffic, and pricing checked so a discount does not land on a product that cannot carry it.' },
      { name: 'B2B Pricing discounts, Brand Tailored Promotions, & Coupons',
        description: 'The promotional mechanics most accounts leave switched off: business pricing and quantity discounts for Amazon Business buyers, Brand Tailored Promotions aimed at your own audiences, and coupons — each used where it moves volume or rank, not run continuously until it only discounts sales you would have made anyway.' },
      { name: 'Create Amazon Posts',
        description: 'Posts are free placement on your own and competitors’ listings. We publish them on a schedule against your brand imagery so the surface is working rather than sitting empty.' },
      { name: 'Manage Amazon Influencers',
        description: 'Finding and briefing Amazon influencers for your catalogue, and running the relationship — so the content lands on your listings and in the Inspire feed rather than being a one-off post that disappears.' },
    ],
    approach: [
      { heading: 'Audit before spend',
        body: 'We start by reading the account as it is: where the budget actually goes, which search terms you are paying to defend, what the current ACOS and TACOS are, and which products can carry ad spend at all once fees are counted. That assessment is part of the free audit, and you keep it whether or not you work with us.' },
      { heading: 'Rebuild the structure',
        body: 'Campaigns and ad groups are reorganised so that budget can be moved deliberately rather than spread evenly. Keyword and product targeting is set per campaign, search-term reports drive what gets excluded, and spend is moved off branded defence and into categories where the brand is not yet present — which is exactly what took Aloha Bay to a 14% ACOS while prices went up.' },
      { heading: 'Manage to a target, weekly',
        body: 'Bids and budgets are reviewed weekly against the target we agree with you, not adjusted reactively. On GRINDS that cadence took TACOS from 20% to 9% without changing the $40,000 monthly budget — the same spend, structured better.' },
      { heading: 'Report in numbers you can check',
        body: 'You get the figures that decide whether advertising is working: spend, ACOS and TACOS against target, what changed in the account and why, and what is planned next. Monthly reviews also cover referral and FBA costs, because ad efficiency gained and then lost to fees is not efficiency.' },
      { heading: 'Know the ceiling, and say so',
        body: 'Ad management is included up to $3,000 per month in spend. Above that we hand off to a specialist partner rather than pretend we are one, and we will tell you when you are approaching it. We generally recommend an ad budget of 5–10% of monthly gross sales.' },
    ],
    cadence: [
      { label: 'Weekly',
        body: 'PPC optimisation — bid and budget review against target, search-term review and negative targeting, plus a 30-minute call with your account manager and email throughout the week.' },
      { label: 'Monthly',
        body: 'A written review of spend, ACOS and TACOS against the agreed target, what changed and why, and what is planned next — alongside referral-fee and FBA-cost checks so efficiency is not quietly given back.' },
      { label: 'Ongoing',
        body: 'Event-day and promotional planning, launch plans for new products and variations, and Posts and influencer work running against the same calendar. Most clients see meaningful movement around months four to six.' },
    ],
  },
  {
    slug: 'value-adds', icon: 'increase',
    title: 'Value Adds', short: 'Value Adds',
    summary: 'The extras that compound — reviews, badges, financing, beta programs, store followers and testing, run alongside the core account work.',
    problem: ['Opportunities stay invisible', 'It becomes a second job'],
    items: [
      { name: '3rd Party Tools & Service Recommendations' },
      { name: 'Increase Product Reviews' },
      { name: 'Unlocking Badges on Listings' },
      { name: 'Customer Financing' },
      { name: 'Participating Amazon Programs & Events' },
      { name: 'Unlocking Amazon Beta Programs' },
      { name: 'Increase Store Followers' },
      { name: 'A/B Testing' },
      { name: 'Amazon Global Selling' },
    ],
  },
  {
    slug: 'team-trainings', icon: 'network',
    title: 'Team Trainings', short: 'Team Trainings',
    summary: 'Your team trained on the specifics — claims, compliance, shipping plans and the seller mistakes that are easiest to avoid.',
    problem: ['It becomes a second job', "There's no one to call"],
    items: [
      { name: 'Customer Services' },
      { name: 'A-Z Claims' },
      { name: 'Safe-T Claims' },
      { name: 'Compliance' },
      { name: 'Best Practices' },
      { name: 'Things to Avoid' },
      { name: 'Shipping Plans' },
      { name: 'Seller Misconduct Mistakes to Avoid' },
    ],
  },
];

export const totalServices = services.reduce((n, g) => n + g.items.length, 0);

/**
 * The "what's included every month" checklist — shown on the Services and
 * Pricing pages. Five of its six blocks predate this restructure and keep
 * their existing wording; "Team Trainings" is added using the exact items
 * above so the checklist reflects all six categories.
 */
export const included = [
  { group: 'Account Setup', items: [
    'Amazon Brand Registry', 'FBA setting reconfiguration', 'All setting reconfiguration',
    'Amazon money-back programs', 'Notifications and customer setup for your team',
    'Settings to reduce return rate', 'Build seller and brand profile',
  ]},
  { group: 'Listing Optimization', items: [
    'Create new listings (FBA & FBM) and organise products in parent–child relationships with synchronised reviews',
    'Get the Prime badge (2-day shipping)', 'Create infographics for product images',
    'Write titles, bullet points and descriptions using our tools with AI assistance',
    'Build brand story and Premium A+ content', '3D images of all products',
    'Upload all content and make any necessary changes', 'Case work to fix listings',
    'Product recommendations (bundles, colours, sizes)', 'Pricing strategy',
  ]},
  { group: 'Account Health', items: [
    'Check account health regularly and fix issues',
    'Review all performance notifications and address them as needed',
    'Inventory Performance Index review and issue resolution',
    'Monthly negative seller review removal', 'Voice of the Customer checks and recommendations',
  ]},
  { group: 'Advertising & Marketing', items: [
    'Optimise ad campaigns', 'Implement BLAZON’s organic growth strategy using ads',
    'Create promotions for event days (Prime Day)',
    'B2B pricing discounts, brand-tailored promotions and coupons',
    'Create Amazon Posts', 'Manage Amazon influencers',
  ]},
  { group: 'Value Adds', items: [
    'Third-party tools and service recommendations', 'Increase product reviews',
    'Unlocking badges on listings', 'Customer financing',
    'Participating Amazon programs and events', 'Unlocking Amazon beta programs',
    'Increase store followers', 'A/B testing', 'Amazon global selling',
  ]},
  { group: 'Team Trainings', items: [
    'Customer services', 'A-Z claims', 'Safe-T claims', 'Compliance',
    'Best practices', 'Things to avoid', 'Shipping plans', 'Seller misconduct mistakes to avoid',
  ]},
];
