/**
 * The seven service groups and their 36 items, verbatim from Our services.docx.
 *
 * NOTE: the blueprint states 38 in three places, two of which are shipping copy.
 * The source document lists 36. Every count on the site derives from this array
 * so the published figure cannot drift — see BLAZON-FINDINGS.md, Q-11.
 */
export interface ServiceItem { name: string; description: string; additionalCost?: boolean }
export interface ServiceGroup {
  slug: string; title: string; short: string; icon: string;
  summary: string; problem: string[]; additionalCost?: boolean;
  items: ServiceItem[];
}

export const services: ServiceGroup[] = [
  {
    slug: 'account-management', icon: 'settings',
    title: 'Amazon Account Management & Strategy', short: 'Account Management & Strategy',
    summary: 'Your account run as a system — set up correctly, positioned deliberately, and steered against a plan rather than a to-do list.',
    problem: ['It becomes a second job', 'Opportunities stay invisible'],
    items: [
      { name: 'Amazon Account Setup & Management', description: 'Creating and managing seller/vendor accounts.' },
      { name: 'Amazon Marketplace Strategy Development', description: 'Crafting tailored growth strategies.' },
      { name: 'Competitor Research & Market Analysis', description: 'Identifying trends, strengths, and weaknesses of competitors.' },
      { name: 'Amazon Category & Niche Selection', description: 'Choosing the right product categories for success.' },
      { name: 'Brand Positioning & Differentiation', description: 'Helping brands stand out from the competition.' },
    ],
  },
  {
    slug: 'listing-optimization', icon: 'brand-image',
    title: 'Product Listing & Optimization', short: 'Listing & Optimization',
    summary: 'Listings built to convert and to stay compliant — copy, imagery, A+ content and the variation architecture underneath them.',
    problem: ['Listings drift', 'The rules change constantly'],
    items: [
      { name: 'Product Listing Creation & Optimization', description: 'Writing keyword-rich, high-converting titles, bullet points, and product descriptions.' },
      { name: 'Amazon SEO (Search Engine Optimization)', description: 'Optimizing titles, descriptions, bullet points, and backend keywords.' },
      { name: 'Premium A+ Content', description: 'Designing rich media content for increased conversions.' },
      { name: 'Amazon Storefront Design & Optimization', description: 'Creating branded stores with engaging visuals and navigation.' },
      { name: 'Product Photography & Videography Partnership', description: 'High-quality images, lifestyle photography, and product videos.' },
      { name: '3D Product Imaging', description: 'Offering immersive product visualization to enhance conversions.' },
      { name: 'Amazon Listing Compliance Checks', description: 'Ensuring listings meet Amazon’s guidelines to avoid suppression.' },
    ],
  },
  {
    slug: 'advertising', icon: 'marketing',
    title: 'Advertising & Marketing', short: 'Advertising & Marketing',
    summary: 'PPC and DSP managed to your targets, plus the external traffic, deals and partnerships most sellers never get to.',
    problem: ['Fees keep climbing', 'Opportunities stay invisible'],
    items: [
      { name: 'Amazon PPC (Pay-Per-Click) Management', description: 'Running and optimizing Sponsored Ads campaigns.' },
      { name: 'Amazon DSP (Demand-Side Platform) Advertising', description: 'Managing display, video, and retargeting ads.' },
      { name: 'Amazon External Traffic Strategies', description: 'Driving traffic from Google, Facebook, Instagram, and TikTok to Amazon.' },
      { name: 'Amazon Coupons, Deals, and Promotions Management', description: 'Setting up Lightning Deals, coupons, and special offers.' },
      { name: 'Amazon Influencer & Affiliate Marketing', description: 'Leveraging influencer partnerships to drive traffic.' },
      { name: 'Brand Awareness & Customer Engagement Strategies', description: 'Engaging customers through promotions and credits back on newsletters, social media, and Amazon Posts.' },
    ],
  },
  {
    slug: 'sales-growth', icon: 'increase',
    title: 'Sales Optimization & Growth', short: 'Sales Optimization & Growth',
    summary: 'The levers that move a listing from present to profitable — ranking, Buy Box, pricing, reviews and subscription revenue.',
    problem: ['Fees keep climbing', 'Opportunities stay invisible'],
    items: [
      { name: 'Amazon Product Launch & Ranking Strategies', description: 'Implementing ranking strategies for new product launches.' },
      { name: 'Review & Feedback Management', description: 'Encouraging authentic reviews and managing negative feedback.' },
      { name: 'Amazon Buy Box Optimization', description: 'Improving pricing, fulfillment, and seller metrics to win the Buy Box.' },
      { name: 'Repricing & Profitability Analysis', description: 'Using automated or manual strategies to maximize profit margins.' },
      { name: 'Conversion Rate Optimization (CRO)', description: 'Enhancing listings for better click-through and conversion rates.' },
      { name: 'Amazon Subscribe & Save Management', description: 'Optimizing recurring order subscriptions to increase customer retention and lifetime value.' },
    ],
  },
  {
    slug: 'operations-compliance', icon: 'rudder',
    title: 'Operations, Logistics & Compliance', short: 'Operations & Compliance',
    summary: 'Fulfilment, inventory and account health — including the suspensions and appeals that stop a business dead.',
    problem: ["There's no one to call", 'The rules change constantly'],
    items: [
      { name: 'Amazon FBA & FBM Support', description: 'Advising on fulfillment strategies.' },
      { name: 'Inventory & Demand Planning', description: 'Managing stock levels to avoid overstocking or stockouts.', additionalCost: true },
      { name: 'Amazon Account & Listing Suspensions & Appeal Management', description: 'Resolving suspensions and reinstating accounts.' },
      { name: 'Amazon Policy Compliance & Risk Management', description: 'Ensuring adherence to Amazon’s selling policies.' },
      { name: 'Counterfeit & Unauthorized Seller Protection', description: 'Protecting brands from fake or unauthorized sellers.' },
    ],
  },
  {
    slug: 'analytics', icon: 'bar-chart',
    title: 'Data Analytics & Reporting', short: 'Data Analytics & Reporting',
    summary: 'What the numbers actually say — performance, ad efficiency, buying patterns and what competitors are doing about it.',
    problem: ['Opportunities stay invisible'],
    items: [
      { name: 'Amazon Sales & Performance Analytics', description: 'Analyzing key performance metrics to inform decisions.' },
      { name: 'Advertising ROI Analysis & Optimization', description: 'Maximizing ad spend efficiency.' },
      { name: 'Customer Behavior & Buying Pattern Insights', description: 'Understanding customer trends and preferences.' },
      { name: 'Competitor Pricing & Performance Tracking', description: 'Monitoring competitor movements and adjusting accordingly.' },
    ],
  },
  {
    slug: 'international', icon: 'network', additionalCost: true,
    title: 'International Expansion & Growth', short: 'International Expansion',
    summary: 'New marketplaces opened properly — with the tax, compliance and localisation work that makes them hold.',
    problem: ['Opportunities stay invisible'],
    items: [
      { name: 'Amazon Global Selling & International Expansion', description: 'Assisting brands in entering new marketplaces.' },
      { name: 'Amazon VAT & Tax Compliance for International Sales', description: 'Helping with taxation and legal compliance.' },
      { name: 'Localization & Translation Services', description: 'Translating listings to cater to global audiences.', additionalCost: true },
    ],
  },
];

export const totalServices = services.reduce((n, g) => n + g.items.length, 0);

/**
 * The "Top Items" list from the same document — more concrete and more
 * persuasive than the service names alone. Drives the Pricing page checklist.
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
];
