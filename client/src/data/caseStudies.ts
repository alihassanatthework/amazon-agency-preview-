/**
 * The three case studies added alongside the existing, hand-built Aloha Bay
 * page (which stays exactly as it was — see pages/CaseStudy/index.tsx).
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

export interface CaseStudyGraphPoint { label: string; value: number }

/**
 * Every case study's graph is the same Aloha-Bay-style line chart (see
 * pages/Home/sections/CaseChart.tsx) — only the points, axis formatting and
 * an optional callout differ, and only to the extent the underlying data
 * actually supports. `points` never contains a fabricated intermediate
 * value: a two-point series is a straight confirmed-start-to-confirmed-end
 * line, not an invented monthly progression.
 */
export interface CaseStudyGraph {
  points: CaseStudyGraphPoint[];
  caption: string;
  /** Omit for a plain number axis; Aloha Bay itself uses $k via the chart's own default. */
  yTickFormatter?: (v: number) => string;
  /** Off when the values are an unlabelled index (qualitative growth, roadmap stages), not a real unit. */
  showYAxis?: boolean;
  showTooltip?: boolean;
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
  /** The case-study title, e.g. "Replace Stagnancy for Growth". */
  title: string;
  /** The primary, most prominent result — shown large on the card and header. */
  mainResult: string;
  /** Card blurb and detail-page overview. */
  summary: string;
  before: string[];
  after: string[];
  story: CaseStudyStoryBlock[];
  metrics: CaseStudyMetric[];
  graph: CaseStudyGraph;
}

export const caseStudies: CaseStudy[] = [
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
      points: [
        { label: 'Before BLAZON', value: 185 },
        { label: 'With BLAZON', value: 425 },
      ],
      caption: 'Gross sales per month',
      yTickFormatter: (v) => `$${v}K`,
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
      points: [
        { label: 'Brand New to Amazon', value: 1 },
        { label: 'Growth in One Month', value: 2 },
      ],
      caption: 'Growth in the first month',
      showYAxis: false,
      showTooltip: false,
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
      points: [
        { label: 'Month 0', value: 1 },
        { label: 'Month 6', value: 3 },
      ],
      caption: 'Indexed sales growth — 1× to 3×',
      yTickFormatter: (v) => `${v}×`,
      callout: '3,000+ new SKUs launched in 3 months',
    },
  },
];

export const caseStudyBySlug = (slug: string | undefined): CaseStudy | undefined =>
  caseStudies.find((c) => c.slug === slug);
