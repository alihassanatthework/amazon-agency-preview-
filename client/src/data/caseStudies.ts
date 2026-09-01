/**
 * The four case studies added alongside the existing, hand-built Aloha Bay
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

export type CaseStudyGraph =
  /** A confirmed start value and end value — no fabricated points between them. */
  | { kind: 'two-point'; fromLabel: string; toLabel: string; fromValue: number; toValue: number; prefix?: string; unit?: string; caption: string }
  /** Growth is confirmed to have happened, but no numbers were supplied for it. */
  | { kind: 'qualitative-growth'; fromLabel: string; toLabel: string; callout: string; caption: string }
  /** A confirmed multiple (1x -> Nx) over a confirmed number of months. */
  | { kind: 'indexed-growth'; fromMultiple: number; toMultiple: number; months: number; sub?: { value: string; label: string }; caption: string }
  /** No sales figures at all — a stage-based journey instead of a chart. */
  | { kind: 'roadmap'; steps: string[]; caption: string };

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
      kind: 'two-point',
      fromLabel: 'Before BLAZON', toLabel: 'With BLAZON',
      fromValue: 185, toValue: 425, prefix: '$', unit: 'K/mo',
      caption: 'Gross sales per month',
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
      kind: 'qualitative-growth',
      fromLabel: 'Brand New to Amazon', toLabel: 'Growth in One Month',
      callout: '$40K Ad Spend = 9% TACOS',
      caption: 'Growth in the first month',
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
      kind: 'indexed-growth',
      fromMultiple: 1, toMultiple: 3, months: 6,
      sub: { value: '3,000+', label: 'New SKUs launched in 3 months' },
      caption: 'Indexed sales growth',
    },
  },
  {
    slug: 'new-to-amazon-business',
    client: 'New to Amazon Business',
    categoryId: 'new-to-amazon',
    categoryLabel: 'New to Amazon',
    title: 'Long-term businesses rather than short-term wins',
    mainResult: 'Launch → Brand Recognition → Rankings → Profitability → Sustainable Growth',
    summary: 'Starting from square one with products completely new to the Amazon market, built for profitability through catalogue cleanup, a better shopping experience, and long-term, sustainable growth rather than a short-term win.',
    before: [],
    after: [],
    story: [
      { heading: 'Starting from square one', body: 'This business started from square one with products that were completely new to the Amazon market. Starting from scratch can be difficult, but it can be successful with the right strategy. The brand’s primary goal was profitability.' },
      { heading: 'The approach', body: 'BLAZON focused on catalogue cleanup, improving the customer shopping experience, reducing ad spend, increasing conversion, building brand recognition, improving rankings, and creating sustainable, scalable Amazon growth.' },
      { heading: 'The philosophy', body: 'Success does not happen overnight. Building brand recognition and strong rankings takes time. The core philosophy is long-term businesses rather than short-term wins.' },
    ],
    metrics: [],
    graph: {
      kind: 'roadmap',
      steps: ['Launch', 'Brand Recognition', 'Rankings', 'Profitability', 'Sustainable Growth'],
      caption: 'The long-term path to sustainable growth',
    },
  },
];

export const caseStudyBySlug = (slug: string | undefined): CaseStudy | undefined =>
  caseStudies.find((c) => c.slug === slug);
