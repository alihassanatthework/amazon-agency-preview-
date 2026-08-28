import { Link, useParams } from 'react-router-dom';
import {
  CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { Counter, EmberWipe, Reveal, RevealGroup, useInView } from '../../motion';
import { Section, Container } from '../../components/layout/Section';
import { PageHero } from '../../components/layout/PageHero';
import { CtaSection } from '../../components/common/CtaSection';
import { Seo } from '../../components/common/Seo';
import { ArrowRight } from '../../components/ui/Icon';
import NotFound from '../NotFound';

const DATA = [
  { month: 'Jan', current: 8_420,  prior: 3_180 },
  { month: 'Feb', current: 9_860,  prior: 3_640 },
  { month: 'Mar', current: 12_340, prior: 4_010 },
  { month: 'Apr', current: 14_920, prior: 4_880 },
  { month: 'May', current: 18_460, prior: 5_640 },
  { month: 'Jun', current: 22_180, prior: 6_920 },
  { month: 'Jul', current: 26_540, prior: 8_130 },
  { month: 'Aug', current: 30_348, prior: 9_460 },
];

const STUDY = {
  slug: 'aloha-bay',
  client: 'Aloha Bay',
  category: 'Supplements & wellness',
  headline: '3× sales increase',
  metrics: [
    { to: 3, suffix: '×', label: 'sales increase' },
    { to: 14, suffix: '%', label: 'ACOS, while raising prices' },
    { to: 30_348, prefix: '$', label: 'ordered product sales, YTD' },
    { to: 1_424, suffix: '', label: 'units sold' },
  ],
  challenge:
    'Aloha Bay had been selling on Amazon for years without the account structure to support it. Advertising was spending heavily against the brand’s own name — buying back customers it already had — while the catalogue sat in a flat list with no parent–child relationships, so reviews were fragmented across variations that should have shared them. Subscribe & Save was available and unconfigured.',
  strategy:
    'We restructured advertising around contribution margin rather than raw ACOS, moving budget off branded defence and into categories where the brand was not yet present. The catalogue was reorganised into parent–child families with synchronised reviews, listings were rewritten and A+ content built, and the account was enrolled in the programs it was eligible for but had never used.',
  execution:
    'Work ran on the standard cadence: a weekly 30-minute call, email throughout, and monthly account health, IPI and negative seller review passes. Pricing was raised in step with the improved conversion rate rather than ahead of it.',
  results:
    'Ordered product sales tripled year on year, reaching $30,348 year-to-date across 1,424 units. ACOS settled at 14% — achieved alongside a price increase rather than in spite of one, which is the part that matters: the account became more efficient and more profitable at the same time.',
};

/** §10.3 — detail template. Charts are redrawn, never Seller Central screenshots. */
export default function CaseStudy() {
  const { slug } = useParams();
  const { ref, inView } = useInView<HTMLDivElement>();
  if (slug !== STUDY.slug) return <NotFound />;

  return (
    <>
      <Seo
        route={`/results/${STUDY.slug}`} title={`${STUDY.client} — ${STUDY.headline} — BLAZON`}
        description={`${STUDY.client}: ${STUDY.headline}, 14% ACOS while raising prices. How BLAZON restructured the account.`}
      />
      <PageHero eyebrow="Case study" headline={[STUDY.client]} lead={STUDY.headline} />

      <Section surface="obsidian">
        <Container>
          <RevealGroup className="cs__metrics" stagger={90}>
            {STUDY.metrics.map((m) => (
              <div key={m.label}>
                <p className="cs__metric-value">
                  <Counter to={m.to} prefix={m.prefix} suffix={m.suffix} affixClassName="case__metric-affix" />
                </p>
                <p className="caption">{m.label}</p>
              </div>
            ))}
          </RevealGroup>

          <div ref={ref} className="cs__chart-wrap">
            <EmberWipe className="case__panel">
              <div className="case__panel-inner">
                <p className="caption case__chart-label">Ordered product sales — year on year</p>
                <div className="case__chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={DATA} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
                      <CartesianGrid stroke="rgba(142,145,136,.12)" vertical={false} />
                      <XAxis dataKey="month" stroke="#8E9188" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                      <YAxis stroke="#8E9188" tickLine={false} axisLine={false} width={54} tick={{ fontSize: 12 }}
                             tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`} />
                      <Tooltip contentStyle={{ background: '#131711', border: '1px solid #2A3124', borderRadius: 8, color: '#C7C9C1', fontSize: 13 }}
                               formatter={(v) => [`$${Number(v).toLocaleString()}`, ''] as [string, string]} />
                      <Line type="monotone" dataKey="prior" stroke="#6F9A6B" strokeWidth={2} strokeOpacity={.6} dot={false} isAnimationActive={inView} animationDuration={1400} />
                      <Line type="monotone" dataKey="current" stroke="#8AB04B" strokeWidth={2.5} dot={false} isAnimationActive={inView} animationDuration={1400} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="case__legend">
                  <span><i style={{ background: '#8AB04B' }} />This year</span>
                  <span><i style={{ background: '#6F9A6B', opacity: .6 }} />Prior year</span>
                </div>
              </div>
            </EmberWipe>
          </div>
        </Container>
      </Section>

      <Section surface="carbon">
        <Container>
          <div className="cs__body">
            {([['The challenge', STUDY.challenge], ['The strategy', STUDY.strategy],
               ['How it ran', STUDY.execution], ['The result', STUDY.results]] as const).map(([h, b]) => (
              <Reveal className="cs__block" key={h}>
                <h2 className="heading-s cs__block-title">{h}</h2>
                <p className="body">{b}</p>
              </Reveal>
            ))}
            <Reveal className="cs__back">
              <Link className="link" to="/results">All client results<ArrowRight /></Link>
            </Reveal>
          </div>
        </Container>
      </Section>

      <CtaSection />
    </>
  );
}
