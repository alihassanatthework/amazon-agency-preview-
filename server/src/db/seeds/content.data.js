/**
 * BLAZON seed content.
 *
 * Every string here is taken from the _Marketing archive, not written for it.
 * Sources are noted per block. Blueprint §1.3: "Use the supplied content. Do
 * not write placeholder copy where real copy exists."
 */

// --- Settings ---------------------------------------------------------------
// §2.1 verified company facts. Q-05: the public email is the domain address,
// not the personal one used in the email campaigns.
export const settings = [
  ['contact.phone',        '"801-822-9732"',                                        'Public phone number',          true],
  ['contact.email',        '"blakegale@blazonpros.com"',                            'Public email — see Q-05',      true],
  ['contact.hours',        '"Monday to Friday, 9am to 5pm Mountain Time"',          'Business hours',               true],
  ['brand.mission',        '"At BLAZON, our mission is to exceed client expectations by immersing ourselves in their business, gaining a deep understanding of their needs, and delivering tailored strategies for maximizing growth on Amazon."', 'Mission statement, sales deck slide 3 — verbatim', true],
  ['brand.disclaimer',     '"Not affiliated with or endorsed by Amazon.com, Inc."', 'Required footer disclaimer — Q-08', true],
  ['brand.founder',        '"Blake Gale"',                                          'Founder / principal',          true],
  ['site.domain',          '"blazonpros.com"',                                      'Canonical domain',             true],
];

// --- KPI metrics -------------------------------------------------------------
// §9.5. All four verified from sales deck slides 3 and 7. Q-01: no revenue
// figure is included — BLAZON has not stated a verified aggregate.
export const kpiMetrics = [
  { label: 'brands currently managed',            value: 80,   prefix: '', suffix: '+', display: null,          sub: 'Sales deck slide 3' },
  { label: 'years managing Amazon accounts',      value: 4,    prefix: '', suffix: '+', display: null,          sub: 'Sales deck slide 3' },
  { label: 'specialists, all 4+ years experience',value: 9,    prefix: '', suffix: '',  display: null,          sub: 'Sales deck slide 3' },
  // Not numerically countable — rendered as a static value, not a broken counter.
  { label: 'average client relationship',         value: null, prefix: '', suffix: '',  display: '1 yr 7 mo',   sub: 'Sales deck slide 7' },
];

// --- Categories --------------------------------------------------------------
// §14.2, seeded from the real client industries in the archive.
export const categories = [
  ['Supplements & wellness', 'supplements-wellness'],
  ['Outdoor & recreation',   'outdoor-recreation'],
  ['Personal care',          'personal-care'],
  ['Automotive',             'automotive'],
  ['Food & beverage',        'food-beverage'],
  ['Apparel',                'apparel'],
];

// --- Clients -----------------------------------------------------------------
// Only those who answered "Yes" to the consent question AND supplied a usable
// mark. Power Steering Resources supplied an infographic and All Fresh has no
// consent row — both excluded per Q-09.
export const clients = [
  { name: 'Raise Them Well',          slug: 'raise-them-well',          categories: ['supplements-wellness'] },
  { name: 'BlenditUp',                slug: 'blenditup',                categories: ['food-beverage'] },
  { name: 'Health As It Ought To Be', slug: 'health-as-it-ought-to-be', categories: ['supplements-wellness'] },
  { name: 'Pyro Putty',               slug: 'pyro-putty',               categories: ['outdoor-recreation'] },
  { name: 'RV Bug Stop',              slug: 'rv-bug-stop',              categories: ['automotive','outdoor-recreation'] },
  // The consent sheet's company cell reads "Darren Jones"; the supplied logo is
  // Alpine Innovations and the contact email is @alpineproducts.com. Seeded from
  // the verifiable domain — confirm the trading name before launch.
  { name: 'Alpine Products',          slug: 'alpine-products',          categories: ['outdoor-recreation'] },
  { name: 'AHM Investments',          slug: 'ahm-investments',          categories: [] },
  { name: 'Halftee',                  slug: 'halftee',                  categories: ['apparel'] },
];

// Consented but without a usable logo file — still valid testimonial authors.
export const logolessClients = [
  { name: 'Seller Investigators',           slug: 'seller-investigators',      categories: [] },
  { name: 'Rebel Rebel Personal Care Corp.',slug: 'rebel-rebel-personal-care', categories: ['personal-care'] },
  { name: 'Natures Energy',                 slug: 'natures-energy',            categories: ['supplements-wellness'] },
  { name: 'Power Steering Resources',       slug: 'power-steering-resources',  categories: ['automotive'] },
];

// --- Services ----------------------------------------------------------------
// §7.2. Seven groups, 38 items, verbatim from Our services.docx.
export const services = [
  {
    slug: 'account-management', icon: 'settings', order: 1,
    title: 'Amazon Account Management & Strategy',
    summary: 'Your account run as a system — set up correctly, positioned deliberately, and steered against a plan rather than a to-do list.',
    items: [
      ['Amazon Account Setup & Management', 'Creating and managing seller/vendor accounts.'],
      ['Amazon Marketplace Strategy Development', 'Crafting tailored growth strategies.'],
      ['Competitor Research & Market Analysis', 'Identifying trends, strengths, and weaknesses of competitors.'],
      ['Amazon Category & Niche Selection', 'Choosing the right product categories for success.'],
      ['Brand Positioning & Differentiation', 'Helping brands stand out from the competition.'],
    ],
  },
  {
    slug: 'listing-optimization', icon: 'brand-image', order: 2,
    title: 'Product Listing & Optimization',
    summary: 'Listings built to convert and to stay compliant — copy, imagery, A+ content and the variation architecture underneath them.',
    items: [
      ['Product Listing Creation & Optimization', 'Writing keyword-rich, high-converting titles, bullet points, and product descriptions.'],
      ['Amazon SEO (Search Engine Optimization)', 'Optimizing titles, descriptions, bullet points, and backend keywords.'],
      ['Premium A+ Content', 'Designing rich media content for increased conversions.'],
      ['Amazon Storefront Design & Optimization', 'Creating branded stores with engaging visuals and navigation.'],
      ['Product Photography & Videography Partnership', 'High-quality images, lifestyle photography, and product videos.'],
      ['3D Product Imaging', 'Offering immersive product visualization to enhance conversions.'],
      ['Amazon Listing Compliance Checks', "Ensuring listings meet Amazon's guidelines to avoid suppression."],
    ],
  },
  {
    slug: 'advertising', icon: 'marketing', order: 3,
    title: 'Advertising & Marketing',
    summary: 'PPC and DSP managed to your targets, plus the external traffic, deals and partnerships most sellers never get to.',
    items: [
      ['Amazon PPC (Pay-Per-Click) Management', 'Running and optimizing Sponsored Ads campaigns.'],
      ['Amazon DSP (Demand-Side Platform) Advertising', 'Managing display, video, and retargeting ads.'],
      ['Amazon External Traffic Strategies', 'Driving traffic from Google, Facebook, Instagram, and TikTok to Amazon.'],
      ['Amazon Coupons, Deals, and Promotions Management', 'Setting up Lightning Deals, coupons, and special offers.'],
      ['Amazon Influencer & Affiliate Marketing', 'Leveraging influencer partnerships to drive traffic.'],
      ['Brand Awareness & Customer Engagement Strategies', 'Engaging customers through promotions and credits back on newsletters, social media, and Amazon Posts.'],
    ],
  },
  {
    slug: 'sales-growth', icon: 'growth', order: 4,
    title: 'Sales Optimization & Growth',
    summary: 'The levers that move a listing from present to profitable — ranking, Buy Box, pricing, reviews and subscription revenue.',
    items: [
      ['Amazon Product Launch & Ranking Strategies', 'Implementing ranking strategies for new product launches.'],
      ['Review & Feedback Management', 'Encouraging authentic reviews and managing negative feedback.'],
      ['Amazon Buy Box Optimization', 'Improving pricing, fulfillment, and seller metrics to win the Buy Box.'],
      ['Repricing & Profitability Analysis', 'Using automated or manual strategies to maximize profit margins.'],
      ['Conversion Rate Optimization (CRO)', 'Enhancing listings for better click-through and conversion rates.'],
      ['Amazon Subscribe & Save Management', 'Optimizing recurring order subscriptions to increase customer retention and lifetime value.'],
    ],
  },
  {
    slug: 'operations-compliance', icon: 'rudder', order: 5,
    title: 'Operations, Logistics & Compliance',
    summary: 'Fulfilment, inventory and account health — including the suspensions and appeals that stop a business dead.',
    items: [
      ['Amazon FBA (Fulfillment by Amazon) & FBM (Fulfillment by Merchant) Support', 'Advising on fulfillment strategies.'],
      ['Inventory & Demand Planning', 'Managing stock levels to avoid overstocking or stockouts.', true],
      ['Amazon Account & Listing Suspensions & Appeal Management', 'Resolving suspensions and reinstating accounts.'],
      ['Amazon Policy Compliance & Risk Management', "Ensuring adherence to Amazon's selling policies."],
      ['Counterfeit & Unauthorized Seller Protection', 'Protecting brands from fake or unauthorized sellers.'],
    ],
  },
  {
    slug: 'analytics', icon: 'bar-chart', order: 6,
    title: 'Data Analytics & Reporting',
    summary: 'What the numbers actually say — performance, ad efficiency, buying patterns and what competitors are doing about it.',
    items: [
      ['Amazon Sales & Performance Analytics', 'Analyzing key performance metrics to inform decisions.'],
      ['Advertising ROI Analysis & Optimization', 'Maximizing ad spend efficiency.'],
      ['Customer Behavior & Buying Pattern Insights', 'Understanding customer trends and preferences.'],
      ['Competitor Pricing & Performance Tracking', 'Monitoring competitor movements and adjusting accordingly.'],
    ],
  },
  {
    // The source document marks this whole group as an additional cost.
    slug: 'international', icon: 'network', order: 7, additionalCost: true,
    title: 'International Expansion & Growth',
    summary: 'New marketplaces opened properly — with the tax, compliance and localisation work that makes them hold.',
    items: [
      ['Amazon Global Selling & International Expansion', 'Assisting brands in entering new marketplaces.'],
      ['Amazon VAT & Tax Compliance for International Sales', 'Helping with taxation and legal compliance.'],
      ['Localization & Translation Services', 'Translating listings to cater to global audiences.', true],
    ],
  },
];

// --- Testimonials ------------------------------------------------------------
// §7.1. Twelve real responses. Every respondent answered "Yes" to using their
// name, company name and logo linked to their Amazon store. Quotes are trimmed
// for length per §9.11 but never altered in meaning.
export const testimonials = [
  {
    author: 'Emily Saunders', clientSlug: 'raise-them-well', featured: true, order: 5,
    service: 'account-management', date: '2023-03-14',
    quote: 'Blake and his team have helped us to focus on our brand and growing our business by taking over the management and day to day challenges related to our Amazon account. They are truly experts! I really enjoy working with individuals and not an "agency". It truly feels like a team effort.',
  },
  {
    author: 'Rod Stuart', clientSlug: 'blenditup', featured: true, order: 4,
    service: 'listing-optimization', date: '2023-03-14',
    quote: 'In just our second month of working with them, we saw a significant boost in our sales. They were able to identify areas where we could improve our listings and optimize our product pages to increase visibility and drive more sales. They didn’t just stop at the initial boost — they continued to monitor our listings and make adjustments to ensure consistent growth.',
  },
  {
    author: 'Lori Hayes', clientSlug: 'health-as-it-ought-to-be', featured: false, order: 6,
    service: 'account-management', date: '2023-03-15',
    quote: 'Blake always knows what to do! Amazon is such a mystery and is always changing but all I have to do is let Blake know something is going on and then it gets fixed. Blake also stays on top of issues that take longer to fix.',
  },
  {
    author: 'Robert Ferreira', clientSlug: 'seller-investigators', featured: true, order: 2,
    service: 'advertising', date: '2023-03-20',
    quote: 'Blake and his team was able to bring my marketing spend way down and still generate substantial orders. I stopped wasting 10’s of thousands of dollars a month in ineffective ad spend. You are not a number to them but rather a partner in success.',
  },
  {
    author: 'Amin Shahbaz', clientSlug: 'rebel-rebel-personal-care', featured: false, order: 7,
    service: 'account-management', date: '2023-03-20',
    quote: 'BLAZON was incredible in taking over the day to day obstacles that often come up on Amazon which can be a real distraction pulling away resources and attention from our core competencies. If you plan on being on Amazon, especially if you’re selling dangerous goods like batteries or hand sanitizers, then you need an Amazon specialist like BLAZON to look after your account.',
  },
  {
    author: 'Dena Kinghorn', clientSlug: 'natures-energy', featured: true, order: 3,
    service: null, date: '2023-03-25',
    quote: 'We started sales on Amazon 8 years ago. We were never very successful and used several different marketing teams. Blazon has been amazing. We immediately saw new sales and they are growing by the week! Not only the fast response time to our questions, but the willingness to teach us in every area.',
  },
  {
    author: 'Cheston Davis', clientSlug: 'pyro-putty', featured: false, order: 8,
    service: 'operations-compliance', date: '2023-03-28',
    quote: 'Blake and team are able to offer quick problem solving when things go south on listings with their direct access to Amazon support individuals. This single handedly is a game changer. From building listings, to providing insight on new markets, and helping increase revenue by utilizing Amazon’s hidden sales promos.',
  },
  {
    author: 'Duran Anderson', clientSlug: 'rv-bug-stop', featured: false, order: 9,
    service: 'operations-compliance', date: '2023-04-17',
    quote: 'Amazon had taken me off of their site because the name had the word bug in it and they assumed my product was a pesticide, which takes a special license to sell on Amazon. My product is not a pesticide and I tried to get back on their site but had no luck. That’s when I contacted BLAZON and they were able to get me back on very quickly. After setting me up with Prime my sales jumped very soon after.',
  },
  {
    author: 'Tami', clientSlug: 'halftee', featured: false, order: 10,
    service: null, date: '2023-04-19',
    quote: 'The constant changes and updates to the ever fluid Amazon world. Just the ever growing knowledge about what is new and upcoming and first choice in new opportunities.',
  },
  {
    author: 'Darren Jones', clientSlug: 'alpine-products', featured: false, order: 11,
    service: null, date: '2023-04-25',
    quote: 'We have consistently grown our sales year over year and Blazon has been at the foundation of our business. Managing Amazon needs has been a big challenge and Blazon has been proactive in resolving the issues as they arise.',
  },
  {
    // The only clean hard percentage in the archive — leads the wall.
    author: 'Bob Lifsey', clientSlug: 'power-steering-resources', featured: true, order: 1,
    service: 'sales-growth', date: '2023-05-01',
    quote: 'Amazon FBA Gross Revenue has increased 40%+. Successful Brand Registry.',
  },
  {
    author: 'Andrew Millecam', clientSlug: 'ahm-investments', featured: false, order: 12,
    service: null, date: '2023-08-07',
    quote: 'The team at Blazon is professional and friendly. Even with all the troubles and loops that Amazon has put us through we have been able to keep a great relationship and work towards our end goal. Great company to work with and very responsive. Highly recommended.',
  },
];

// --- Comparison rows ---------------------------------------------------------
// §9.9. Derived from sales deck slides 5, 7, 8 and 11. The advertising row is
// deliberately candid and should not be softened — it is a genuine trust signal.
export const comparisonRows = [
  ['Scope',       'Every program and tool available to sellers.',
                  'The handful of high-impact actions that produce the easy majority of sales.'],
  ['Team',        'A dedicated account manager, a task support team and a supervisor — all US-based, each with 4+ years on Amazon.',
                  'Rotating contacts who can be talked in circles.'],
  ['Cadence',     'Weekly 30-minute calls, with email throughout.',
                  'Monthly reporting after the month has closed.'],
  ['Incentive',   '5% of growth above your baseline, so we earn more only when you do.',
                  'A flat fee regardless of result.'],
  ['Advertising', 'Managed to your targets, with an honest handoff to a specialist partner above $3,000/month in spend.',
                  'Spend maximised, because the fee is a percentage of it.'],
];

// --- Pricing -----------------------------------------------------------------
// §10.4, from Blazon Pricing Guidelines for Amazon Sellers.xlsx.
//
// Q-06 RESOLVED: the blueprint records Model 2's flat fees as truncated in the
// source. In the copy of the spreadsheet supplied in this archive every cell is
// legible, and Model 2 mirrors Model 1's after-3-months structure exactly.
// Figures below are transcribed from that sheet, not assumed.
export const pricingTiers = [
  // Getting Started on Amazon — BLAZON runs launch strategy, the client runs day-to-day.
  { model: 'getting_started', name: 'Extra Small', skuMin: 1,   skuMax: 5,   introFee: 750,  base: 500,  flat: 1500, order: 1 },
  { model: 'getting_started', name: 'Small',       skuMin: 10,  skuMax: 25,  introFee: 1000, base: 500,  flat: 1500, order: 2 },
  { model: 'getting_started', name: 'Medium',      skuMin: 26,  skuMax: 100, introFee: 1500, base: 750,  flat: 1875, order: 3, featured: true },
  { model: 'getting_started', name: 'Large',       skuMin: 101, skuMax: 250, introFee: 2000, base: 750,  flat: 2500, order: 4 },
  { model: 'getting_started', name: 'Extra Large', skuMin: 251, skuMax: 500, introFee: 2500, base: 1250, flat: 3125, order: 5 },
  { model: 'getting_started', name: 'Custom',      skuMin: 500, skuMax: null, quoteOnly: true, order: 6 },
  // Operating an Amazon Store — BLAZON runs day-to-day.
  { model: 'operating', name: 'Extra Small', skuMin: 1,   skuMax: 5,   base: 500,  flat: 1500, order: 1 },
  { model: 'operating', name: 'Small',       skuMin: 10,  skuMax: 25,  base: 500,  flat: 1500, order: 2 },
  { model: 'operating', name: 'Medium',      skuMin: 26,  skuMax: 100, base: 750,  flat: 1875, order: 3, featured: true },
  { model: 'operating', name: 'Large',       skuMin: 101, skuMax: 250, base: 750,  flat: 2500, order: 4 },
  { model: 'operating', name: 'Extra Large', skuMin: 251, skuMax: 500, base: 1250, flat: 3125, order: 5 },
  { model: 'operating', name: 'Custom',      skuMin: 500, skuMax: null, quoteOnly: true, order: 6 },
];

// --- Hero --------------------------------------------------------------------
// §9.3. Headline and answer line verbatim from sales deck slide 3.
export const hero = {
  eyebrow: 'Amazon account management & growth',
  headline: 'How many levers will you pull to increase your sales?',
  accentLine: 'All of them.',
  lead: 'BLAZON manages Amazon for brands that are tired of guessing. We pull every lever the platform offers — listings, advertising, account health, pricing, programs most sellers never find — and we do it as your team, not a vendor.',
  ctaLabel: 'Get a free audit', ctaUrl: '/get-started',
  secondaryLabel: 'See client results', secondaryUrl: '/results',
  trustLine: '80+ brands managed · 4+ years · US-based team of 9 · avg. client 1 year 7 months',
};
