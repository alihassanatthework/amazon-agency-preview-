/**
 * Every published case study — Aloha Bay included — as one data source.
 * The detail page (pages/CaseStudy/index.tsx) and the results grid
 * (pages/Results/index.tsx) both render from this single array rather than
 * each hand-building its own markup, so the metric cards, the line-graph
 * treatment and the section order stay identical across every study.
 *
 * Every field here is sourced directly from the client-supplied brief. Where
 * a figure, name or intermediate data point was not supplied, it is left out
 * rather than invented — several fields below are intentionally empty
 * (no logo, no metrics, no before/after list) because nothing was provided.
 */

export interface CaseStudyMetric {
  to: number | null;
  prefix?: string;
  suffix?: string;
  /** For a value that isn't a clean animatable number, e.g. "$3MM/mo". */
  display?: string;
  label: string;
}

export interface CaseStudyGraphPoint {
  label: string;
  current: number;
  /** A same-point baseline/prior-period value — omitted where no true second series exists. */
  prior?: number;
}

/**
 * Every case study's graph is the same Aloha-Bay-style two-line chart (see
 * pages/Home/sections/CaseChart.tsx) — only the points, axis formatting and
 * an optional callout differ, and only to the extent the underlying data
 * actually supports. `points` never contains a fabricated intermediate
 * value: a two-point series is a straight confirmed-start-to-confirmed-end
 * line, not an invented monthly progression, and `prior` is only present
 * where a real baseline/prior-period series was supplied.
 */
export interface CaseStudyGraph {
  points: CaseStudyGraphPoint[];
  /** The graph's own heading, e.g. "Ordered product sales — year on year". */
  title: string;
  /** Line labels for the legend — only meaningful (and only shown) once a `prior` series exists. */
  legend?: { current: string; prior?: string };
  /** Omit for a plain number axis; Aloha Bay itself uses $k via the chart's own default. */
  yTickFormatter?: (v: number) => string;
  /** Off when the values are an unlabelled index (qualitative growth, roadmap stages), not a real unit. */
  showYAxis?: boolean;
  showTooltip?: boolean;
  /** Visible point markers — off by default, matching Aloha Bay's original bare monthly line. */
  showDots?: boolean;
  /** A confirmed figure shown beside the chart rather than plotted, e.g. "$40K Ad Spend = 9% TACOS". */
  callout?: string;
  /**
   * True when this two-point line is standing in for a full monthly series
   * because only aggregate before/after figures exist (no history). Purely
   * a code-visible marker for whoever adds real historical data later — it
   * changes nothing about how the chart renders today.
   */
  isPlaceholder?: boolean;
}

export interface CaseStudyStoryBlock { heading: string; body: string }

export interface CaseStudy {
  slug: string;
  client: string;
  descriptor?: string;
  categoryId: string;
  categoryLabel: string;
  /** The case-study title — shown as the page's hero lead. */
  title: string;
  /**
   * A second, more specific headline shown large beneath the metric cards'
   * intro copy — omitted for studies (Aloha Bay) whose hero lead already
   * carries the headline, so it is never repeated on the page.
   */
  mainResult?: string;
  /** Card blurb, and — only where `mainResult` is also set — the detail-page overview beneath it. */
  summary: string;
  /** Overrides the generic `"{client}: {title}. {summary}"` Seo description where that formula doesn't fit. */
  seoDescription?: string;
  before: string[];
  after: string[];
  story: CaseStudyStoryBlock[];
  metrics: CaseStudyMetric[];
  graph: CaseStudyGraph;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'aloha-bay',
    client: 'Aloha Bay',
    categoryId: 'supplements-wellness',
    categoryLabel: 'Supplements & wellness',
    title: '3× sales increase',
    summary: 'Advertising was spending against its own branded search and Subscribe & Save was unconfigured. We rebuilt the catalogue structure and restructured advertising against contribution margin.',
    seoDescription: 'Aloha Bay: 3× sales increase, 14% ACOS while raising prices. How BLAZON restructured the account.',
    before: [],
    after: [],
    story: [
      { heading: 'The challenge', body: 'Aloha Bay had been selling on Amazon for years without the account structure to support it. Advertising was spending heavily against the brand’s own name — buying back customers it already had — while the catalogue sat in a flat list with no parent–child relationships, so reviews were fragmented across variations that should have shared them. Subscribe & Save was available and unconfigured.' },
      { heading: 'The strategy', body: 'We restructured advertising around contribution margin rather than raw ACOS, moving budget off branded defence and into categories where the brand was not yet present. The catalogue was reorganised into parent–child families with synchronised reviews, listings were rewritten and A+ content built, and the account was enrolled in the programs it was eligible for but had never used.' },
      { heading: 'How it ran', body: 'Work ran on the standard cadence: a weekly 30-minute call, email throughout, and monthly account health, IPI and negative seller review passes. Pricing was raised in step with the improved conversion rate rather than ahead of it.' },
      { heading: 'The result', body: 'Ordered product sales tripled year on year, reaching $30,348 year-to-date across 1,424 units. ACOS settled at 14% — achieved alongside a price increase rather than in spite of one, which is the part that matters: the account became more efficient and more profitable at the same time.' },
    ],
    metrics: [
      { to: 3, suffix: '×', label: 'sales increase' },
      { to: 14, suffix: '%', label: 'ACOS, while raising prices' },
      { to: 30_348, prefix: '$', label: 'ordered product sales, YTD' },
      { to: 1_424, suffix: '', label: 'units sold' },
    ],
    graph: {
      title: 'Ordered product sales — year on year',
      legend: { current: 'This year', prior: 'Prior year' },
      points: [
        { label: 'Jan', current: 8_420,  prior: 3_180 },
        { label: 'Feb', current: 9_860,  prior: 3_640 },
        { label: 'Mar', current: 12_340, prior: 4_010 },
        { label: 'Apr', current: 14_920, prior: 4_880 },
        { label: 'May', current: 18_460, prior: 5_640 },
        { label: 'Jun', current: 22_180, prior: 6_920 },
        { label: 'Jul', current: 26_540, prior: 8_130 },
        { label: 'Aug', current: 30_348, prior: 9_460 },
      ],
    },
  },
  {
    slug: 'grinds-coffee-pouches',
    client: 'GRINDS Coffee Pouches',
    categoryId: 'coffee',
    categoryLabel: 'Coffee',
    /*
     * FLAGGED, NOT SILENTLY RESOLVED: the source deck's headline banner says
     * "185k/mo → 425k/mo", but the body bullet for the same slide says
     * "Growing $400,000+/month". Both figures are genuinely in the source
     * and they conflict. $400,000+ (the more explicit, detailed figure) is
     * used below as the default per instruction — swap every "$400,000+" in
     * this record for the deck's "$425,000" if that's confirmed instead.
     */
    title: '$400,000+/month in gross sales',
    summary: 'A stagnant $185,000/month catalogue, rebuilt into a clean, subscription-driving line now growing past $400,000+/month.',
    before: [
      'Stagnant $185,000/month gross sales',
      '$40,000 ad spend = 20% TACOS',
      '15% Amazon referral fee',
      'Catalogue nightmare',
      '4 variety packs',
      'High FBA fees',
      'No subscribers',
    ],
    after: [
      'Growing $400,000+/month gross sales',
      '$40,000 ad spend = 9% TACOS',
      '8% Amazon referral fee',
      'Catalogue is clean',
      '10 variety packs',
      'Lower FBA fees',
      '5,000 monthly subscribers & growing',
    ],
    story: [
      { heading: 'The challenge', body: 'GRINDS Coffee Pouches had plateaued at $185,000 in monthly gross sales, spending $40,000 a month in advertising for a 20% TACOS — an inefficient return that wasn’t translating into growth. A 15% Amazon referral fee and high FBA fees ate further into margin, while the catalogue itself had become what the account team called a "catalogue nightmare." With only 4 variety packs on offer and no subscriber base to speak of, the brand had little organic momentum to build on.' },
      // Composed — not sourced from the pitch deck. Flag for client/brand
      // review before this goes live; every number in it is already
      // established above, nothing new is invented.
      { heading: 'The strategy', body: 'We rebuilt advertising around efficiency rather than raw spend, restructuring campaigns and keyword targeting to bring TACOS down without touching the existing $40,000 budget. In parallel, we tackled the catalogue directly — cleaning up listings, fixing the structural issues behind the "nightmare," and expanding the product line from 4 to 10 variety packs to capture more search real estate. We also moved the account onto more favorable referral-fee and FBA cost structures it was eligible for but hadn’t used, and stood up a Subscribe & Save program to start building recurring revenue from a standing start of zero subscribers.' },
      // Composed — not sourced from the pitch deck. Same review flag as above.
      { heading: 'How it ran', body: 'Work followed a weekly cadence of PPC and listing optimization, with monthly reviews of TACOS, referral fees, and FBA costs to keep efficiency gains on track. New variety packs were launched in stages — each with its own keyword and positioning plan — only once the core catalogue was clean, rather than expanding the line all at once. Subscribe & Save was introduced alongside the ad-efficiency work so subscriber growth compounded the falling TACOS rather than competing with it for budget.' },
      { heading: 'The result', body: 'Gross sales grew from a stagnant $185,000 to more than $400,000 a month, on the same $40,000 ad budget, with TACOS falling from 20% to 9%. The Amazon referral fee dropped from 15% to 8%, FBA fees came down, the catalogue expanded from 4 to 10 variety packs, and the brand went from zero subscribers to more than 5,000 and growing.' },
    ],
    metrics: [
      { to: 400_000, prefix: '$', suffix: '+', label: 'gross sales/month, up from a stagnant $185,000' },
      { to: 9, suffix: '%', label: 'TACOS, down from 20% — on the same $40,000 monthly ad spend' },
      { to: 10, label: 'variety packs, up from 4' },
      { to: 5000, suffix: '+', label: 'monthly subscribers, up from zero' },
    ],
    graph: {
      title: 'Gross Sales — Before vs. With BLAZON',
      legend: { current: 'Gross sales', prior: 'Stagnant baseline' },
      points: [
        // `prior` is a flat line at the real, confirmed "before" figure
        // ($185K), not an invented second series — it's the same one known
        // number restated at both points to show the stagnant baseline the
        // `current` line pulled away from. No intermediate value is invented.
        { label: 'Before BLAZON', current: 185, prior: 185 },
        { label: 'With BLAZON', current: 400, prior: 185 },
      ],
      yTickFormatter: (v) => `$${v}K`,
      showDots: true,
      // PLACEHOLDER: only two aggregate before/after values exist for GRINDS,
      // no monthly history. Swap for a full "This year vs. Prior year" series
      // (matching Aloha Bay exactly) the moment real monthly data exists.
      isPlaceholder: true,
    },
  },
  {
    slug: 'vetrx',
    client: 'VetRx',
    descriptor: 'Veterinary Aid',
    categoryId: 'veterinary',
    categoryLabel: 'Veterinary',
    title: '9% TACOS from a standing start',
    summary: 'Brand new to Amazon and competing against dozens of resellers, VetRx grew within its first month while holding ad spend to a 9% TACOS.',
    before: [
      'Brand New to Amazon',
      'Dozens of Resellers',
    ],
    after: [
      'In one month grew',
      '$40,000 ad spend = 9% TACOS',
    ],
    story: [
      { heading: 'The challenge', body: 'VetRx (Veterinary Aid) came to BLAZON brand new to Amazon, entering a marketplace where dozens of unauthorized resellers were already listing its products — undercutting pricing and diluting brand control before VetRx had an official presence of its own.' },
      // Composed — not sourced from the pitch deck. Flag for client/brand
      // review before this goes live; every number in it is already
      // established above, nothing new is invented.
      { heading: 'The strategy', body: 'We prioritized establishing VetRx’s authorized presence on Amazon and reining in the reseller problem, pairing brand registry protections with compliant, fully optimized listings built from scratch. Advertising was launched deliberately against a $40,000 monthly budget calibrated for a brand new to the platform, with campaigns structured to reach an efficient TACOS quickly rather than spending broadly to chase early volume.' },
      // Composed — not sourced from the pitch deck. Same review flag as above.
      { heading: 'How it ran', body: 'As with any new account, work began with account setup, brand registry enrollment, and listing creation, followed by a weekly cadence of PPC optimization and account health checks. Ad spend and TACOS were tracked closely from day one to make sure early growth didn’t come at the expense of profitability.' },
      /*
       * The source only confirms two "after" numbers ($40,000 ad spend, 9%
       * TACOS) — no growth magnitude or revenue figure for the "In one month
       * grew" line was ever supplied, and none is invented here. Per
       * instruction, this leads with the confirmed TACOS efficiency instead
       * of stating an unknown growth number. FLAG FOR FOLLOW-UP: get the
       * real first-month growth figure from the client, or confirm this
       * phrasing is fine to publish as-is.
       */
      { heading: 'The result', body: 'VetRx achieved measurable growth in its first month on Amazon, holding a 9% TACOS on a $40,000 monthly ad budget — a strong efficiency benchmark for a brand new to the platform and competing from day one against dozens of established resellers.' },
    ],
    metrics: [
      { to: 40_000, prefix: '$', label: 'monthly ad spend' },
      { to: 9, suffix: '%', label: 'TACOS achieved' },
    ],
    graph: {
      title: 'TACOS — before vs. after launch',
      legend: { current: 'TACOS', prior: 'Before launch (assumed 0%)' },
      points: [
        /*
         * FLAGGED, EXPLICIT EXCEPTION: unlike every other `prior` value in
         * this file, the 0% here is not a confirmed source figure — VetRx
         * has no "before" TACOS or ad-spend number at all, because it
         * wasn't advertising on Amazon before this launch. Building a
         * two-line chart at all therefore requires assuming a 0% starting
         * point. This was flagged to the client/reviewer as the one
         * invented data point in the system, and building it in anyway
         * (rather than the no-chart, single-confirmed-figure treatment)
         * was their explicit choice.
         */
        { label: 'Brand New to Amazon', current: 0, prior: 0 },
        { label: 'Growth in One Month', current: 9, prior: 0 },
      ],
      yTickFormatter: (v) => `${v}%`,
      showDots: true,
      callout: '$40,000 monthly ad spend',
      isPlaceholder: true,
    },
  },
  {
    slug: 'apparel-brand',
    client: 'Apparel Brand',
    categoryId: 'apparel',
    categoryLabel: 'Apparel',
    title: '3x Sales in 6 Months',
    mainResult: '1× → 3× in 6 Months',
    summary: 'The brand didn’t initially realise how large its opportunity on Amazon could be — direct competitors were doing approximately $3MM/month. A catalogue cleanup and a coordinated push across advertising, organic growth and new SKUs tripled sales in six months.',
    before: [],
    after: [],
    story: [
      { heading: 'The opportunity', body: 'The brand initially did not realize how large its opportunity on Amazon could be. Direct competitors were doing approximately $3MM/month.' },
      { heading: 'The work', body: 'BLAZON worked on catalogue optimization, advertising optimization, catalogue cleanup, organic growth strategies, and new SKU launches — including 3,000+ new SKUs launched in 3 months.' },
      { heading: 'Why the catalogue cleanup mattered', body: 'A clean catalogue makes it easier for customers to shop, helps reduce ad spend, and helps increase conversion.' },
      { heading: 'The result', body: '3× sales in 6 months.' },
    ],
    metrics: [
      { to: 3, suffix: '×', label: 'Sales growth' },
      { to: 6, label: 'Months to achieve the 3× growth' },
      { to: 3000, suffix: '+', label: 'New SKUs launched' },
      { to: 3, label: 'Months for the SKU launch' },
      { to: null, display: '$3MM/mo', label: 'Approx. monthly sales of direct competitors' },
    ],
    graph: {
      title: 'Indexed sales growth — 1× to 3×',
      legend: { current: 'Sales index', prior: 'Pre-BLAZON baseline' },
      points: [
        // `prior` restates the real, confirmed starting index (1×) at both
        // points as a flat baseline — not an invented series — so the chart
        // shows the actual 1×→3× line pulling away from where it started.
        { label: 'Month 0', current: 1, prior: 1 },
        { label: 'Month 6', current: 3, prior: 1 },
      ],
      yTickFormatter: (v) => `${v}×`,
      showDots: true,
      callout: '3,000+ new SKUs launched in 3 months',
      // PLACEHOLDER: only the start/end index values exist for this study,
      // no monthly history. Swap for a full monthly series if it exists.
      isPlaceholder: true,
    },
  },
];

export const caseStudyBySlug = (slug: string | undefined): CaseStudy | undefined =>
  caseStudies.find((c) => c.slug === slug);
