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
    title: 'Replace Stagnancy for Growth',
    mainResult: '$185K/month → $425K/month',
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
    story: [],
    metrics: [
      { to: null, display: '$185K → $425K', label: 'Gross sales per month' },
      { to: 9, suffix: '%', label: 'TACOS, down from 20%' },
      { to: 10, label: 'Variety packs, up from 4' },
      { to: 5000, suffix: '+', label: 'Monthly subscribers' },
    ],
    graph: {
      title: 'Gross sales per month',
      points: [
        { label: 'Before BLAZON', current: 185 },
        { label: 'With BLAZON', current: 425 },
      ],
      yTickFormatter: (v) => `$${v}K`,
      showDots: true,
    },
  },
  {
    slug: 'vetrx',
    client: 'VetRx',
    descriptor: 'Veterinary Aid',
    categoryId: 'veterinary',
    categoryLabel: 'Veterinary',
    title: 'Replace Stagnancy for Growth',
    mainResult: 'Brand New to Amazon → Growth in One Month',
    summary: 'Brand new to Amazon and competing against dozens of resellers, VetRx grew within its first month while holding ad spend to a 9% TACOS.',
    before: [
      'Brand New to Amazon',
      'Dozens of Resellers',
    ],
    after: [
      'In one month grew',
      '$40,000 ad spend = 9% TACOS',
    ],
    story: [],
    metrics: [
      { to: null, display: '1 Month', label: 'Time to first growth' },
      { to: 9, suffix: '%', label: 'TACOS on $40,000 ad spend' },
    ],
    graph: {
      title: 'Growth in the first month',
      points: [
        { label: 'Brand New to Amazon', current: 1 },
        { label: 'Growth in One Month', current: 2 },
      ],
      showYAxis: false,
      showTooltip: false,
      showDots: true,
      callout: '$40K Ad Spend = 9% TACOS',
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
      points: [
        { label: 'Month 0', current: 1 },
        { label: 'Month 6', current: 3 },
      ],
      yTickFormatter: (v) => `${v}×`,
      showDots: true,
      callout: '3,000+ new SKUs launched in 3 months',
    },
  },
];

export const caseStudyBySlug = (slug: string | undefined): CaseStudy | undefined =>
  caseStudies.find((c) => c.slug === slug);
