import { lazy, Suspense } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Counter, EmberWipe, Reveal, RevealGroup, useInView } from '../../motion';
const CaseChart = lazy(() => import('../Home/sections/CaseChart'));

import { Section, Container } from '../../components/layout/Section';
import { PageHero } from '../../components/layout/PageHero';
import { CtaSection } from '../../components/common/CtaSection';
import { Seo } from '../../components/common/Seo';
import { CaseStudyGraph } from '../../components/common/CaseStudyGraph';
import { ArrowRight, Check, Dash } from '../../components/ui/Icon';
import { caseStudyBySlug, type CaseStudy as CaseStudyData } from '../../data/caseStudies';
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

/** Aloha Bay — unchanged from the original single-study implementation. */
function AlohaBayStudy() {
  const { ref, inView } = useInView<HTMLDivElement>();

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
              <div className="card case__panel-inner">
                <p className="caption case__chart-label">Ordered product sales — year on year</p>
                <div className="case__chart">
                  <Suspense fallback={<div className="skeleton case__chart-skeleton" />}>
                    <CaseChart data={DATA} animate={inView} />
                  </Suspense>
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

/**
 * GRINDS, VetRx, Apparel Brand, New to Amazon Business — same section order,
 * same shell components (PageHero, cs__metrics, case__panel chart box,
 * cs__body narrative, back link, CtaSection) as Aloha Bay above, plus a
 * before/after comparison block where the brief supplied one. The graph
 * itself is whichever treatment fits the data that was actually provided —
 * never a fabricated line chart.
 */
function GenericStudy({ study }: { study: CaseStudyData }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const displayName = study.descriptor ? `${study.client} — ${study.descriptor}` : study.client;
  const hasBeforeAfter = study.before.length > 0 || study.after.length > 0;

  return (
    <>
      <Seo
        route={`/results/${study.slug}`} title={`${displayName} — ${study.title} — BLAZON`}
        description={`${displayName}: ${study.title}. ${study.summary}`}
      />
      <PageHero eyebrow="Case study" headline={[displayName]} lead={study.title} />

      <Section surface="obsidian">
        <Container>
          <Reveal><p className="display-m cs__main-result">{study.mainResult}</p></Reveal>
          <Reveal delay={80}><p className="body cs__summary">{study.summary}</p></Reveal>

          {study.metrics.length > 0 && (
            <RevealGroup className="cs__metrics" stagger={90}>
              {study.metrics.map((m) => (
                <div key={m.label}>
                  <p className="cs__metric-value">
                    <Counter to={m.to} displayValue={m.display} prefix={m.prefix} suffix={m.suffix} affixClassName="case__metric-affix" />
                  </p>
                  <p className="caption">{m.label}</p>
                </div>
              ))}
            </RevealGroup>
          )}

          {hasBeforeAfter && (
            <div className="cs__before-after">
              <Reveal className="cs__ba-col">
                <p className="eyebrow">Before BLAZON</p>
                <ul className="checklist checklist--muted">
                  {study.before.map((b) => (
                    <li key={b}><span className="checklist__tick" aria-hidden="true"><Dash /></span><span className="body-s">{b}</span></li>
                  ))}
                </ul>
              </Reveal>
              <Reveal className="cs__ba-col" delay={80}>
                <p className="eyebrow">With BLAZON</p>
                <ul className="checklist">
                  {study.after.map((a) => (
                    <li key={a}><span className="checklist__tick" aria-hidden="true"><Check size={12} /></span><span className="body-s">{a}</span></li>
                  ))}
                </ul>
              </Reveal>
            </div>
          )}

          <div ref={ref} className="cs__chart-wrap">
            <EmberWipe className="case__panel">
              <div className="card case__panel-inner">
                <CaseStudyGraph graph={study.graph} animate={inView} />
              </div>
            </EmberWipe>
          </div>
        </Container>
      </Section>

      {study.story.length > 0 && (
        <Section surface="carbon">
          <Container>
            <div className="cs__body">
              {study.story.map(({ heading, body }) => (
                <Reveal className="cs__block" key={heading}>
                  <h2 className="heading-s cs__block-title">{heading}</h2>
                  <p className="body">{body}</p>
                </Reveal>
              ))}
              <Reveal className="cs__back">
                <Link className="link" to="/results">All client results<ArrowRight /></Link>
              </Reveal>
            </div>
          </Container>
        </Section>
      )}

      {study.story.length === 0 && (
        <Section surface="carbon">
          <Container>
            <div className="cs__body">
              <Reveal className="cs__back">
                <Link className="link" to="/results">All client results<ArrowRight /></Link>
              </Reveal>
            </div>
          </Container>
        </Section>
      )}

      <CtaSection />
    </>
  );
}

/** §10.3 — detail template. Charts are redrawn, never Seller Central screenshots. */
export default function CaseStudy() {
  const { slug } = useParams();
  if (slug === STUDY.slug) return <AlohaBayStudy />;
  const study = caseStudyBySlug(slug);
  if (!study) return <NotFound />;
  return <GenericStudy study={study} />;
}
