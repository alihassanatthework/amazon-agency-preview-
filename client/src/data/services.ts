/**
 * The six service categories and their items — client-approved wording, used
 * verbatim rather than rewritten. Every count on the site derives from this
 * array so the published figure cannot drift.
 *
 * Descriptions are intentionally omitted where none were supplied — the item
 * names below are the exact, complete source of truth for each service.
 */
export interface ServiceItem { name: string; description?: string; additionalCost?: boolean }
export interface ServiceGroup {
  slug: string; title: string; short: string; icon: string;
  summary: string; problem: string[]; additionalCost?: boolean;
  items: ServiceItem[];
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
    summary: 'Campaigns optimised against BLAZON’s organic growth strategy, plus the promotions, posts and influencer work most sellers never run.',
    problem: ['Fees keep climbing', 'Opportunities stay invisible'],
    items: [
      { name: 'Optimize ad campaigns' },
      { name: 'Implement BLAZONs Organic Growth Strategy using ads' },
      { name: 'Create Promotions for Event Days (Prime Day)' },
      { name: 'B2B Pricing discounts, Brand Tailored Promotions, & Coupons' },
      { name: 'Create Amazon Posts' },
      { name: 'Manage Amazon Influencers' },
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
