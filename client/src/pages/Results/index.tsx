import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Counter, Reveal, RevealGroup } from '../../motion';
import { Section, Container } from '../../components/layout/Section';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { PageHero } from '../../components/layout/PageHero';
import { CtaSection } from '../../components/common/CtaSection';
import { TestimonialWall } from '../../components/common/TestimonialWall';
import { EmptyState } from '../../components/common/EmptyState';
import { Seo } from '../../components/common/Seo';
import { ArrowRight } from '../../components/ui/Icon';

/**
 * §10.3 — case study index plus the full testimonial wall.
 *
 * Only Aloha Bay is written. Rick Young and Phone Skope have evidence but no
 * narrative (Q-02), so they are not published. The single-item state is the
 * realistic launch condition and is designed deliberately, not treated as an
 * edge case.
 */
const CASES = [
  {
    slug: 'aloha-bay', client: 'Aloha Bay', category: 'supplements-wellness',
    categoryLabel: 'Supplements & wellness',
    headline: '3× sales increase',
    summary: 'Advertising was spending against its own branded search and Subscribe & Save was unconfigured. We rebuilt the catalogue structure and restructured advertising against contribution margin.',
    metrics: [{ to: 3, suffix: '×', label: 'sales increase' }, { to: 14, suffix: '%', label: 'ACOS while raising prices' }],
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'supplements-wellness', label: 'Supplements & wellness' },
  { id: 'outdoor-recreation', label: 'Outdoor & recreation' },
  { id: 'automotive', label: 'Automotive' },
];

const STATS = [
  { to: 80, suffix: '+', label: 'brands currently managed' },
  { to: 4, suffix: '+', label: 'years managing Amazon accounts' },
  { to: 9, suffix: '', label: 'specialists, all 4+ years experience' },
  { to: null, display: '1 yr 7 mo', label: 'average client relationship' },
];

export default function Results() {
  const [filter, setFilter] = useState('all');
  const shown = filter === 'all' ? CASES : CASES.filter((c) => c.category === filter);

  return (
    <>
      <Seo
        route="/results" title="Client results — BLAZON"
        description="Real numbers from BLAZON clients, and twelve testimonials collected directly from the brands we manage."
      />
      <PageHero
        eyebrow="Client results"
        headline={['The numbers, and', 'the people behind them.']}
        lead="Twelve clients answered directly. One full case study is published, with more being written from account data we already hold."
      />

      <Section surface="carbon" size="compact">
        <Container>
          <RevealGroup className="stats__row" stagger={90}>
            {STATS.map((m) => (
              <div className="stats__cell" key={m.label}>
                <p className="numeral stats__value">
                  <Counter to={m.to} displayValue={m.display} suffix={m.suffix} affixClassName="stats__unit" />
                </p>
                <p className="caption stats__label">{m.label}</p>
              </div>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Section surface="obsidian">
        <Container>
          <SectionHeader eyebrow="Case studies" headline={['Written up in full.']} />
          <Reveal className="filters" role="group" aria-label="Filter case studies by category">
            {CATEGORIES.map((c) => (
              <button key={c.id} className="pill" type="button"
                      aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>
                {c.label}
              </button>
            ))}
          </Reveal>

          {shown.length === 0 ? (
            <Reveal>
              <EmptyState
                title="No case studies in this category yet"
                body="We are writing up more from account data we already hold. In the meantime the testimonial wall below covers every category we work in."
                action={<button className="btn btn--secondary btn--sm" type="button" onClick={() => setFilter('all')}>Clear filter</button>}
              />
            </Reveal>
          ) : (
            <RevealGroup className="cases__grid" stagger={80}>
              {shown.map((c) => (
                <Link className="case-card card card--interactive" to={`/results/${c.slug}`} key={c.slug}>
                  <p className="case-card__category">{c.categoryLabel}</p>
                  <h3 className="display-m case-card__headline">{c.headline}</h3>
                  <p className="heading-s case-card__client">{c.client}</p>
                  <p className="body-s case-card__summary">{c.summary}</p>
                  <span className="link case-card__link">Read the case study<ArrowRight /></span>
                </Link>
              ))}
              <article className="case-card case-card--note">
                <p className="eyebrow">In progress</p>
                <p className="body-s">
                  Two further studies — Rick Young and Phone Skope — have verified account
                  data but are not published until the write-up is complete. We would rather
                  show one finished study than three thin ones.
                </p>
              </article>
            </RevealGroup>
          )}
        </Container>
      </Section>

      <Section surface="carbon">
        <Container>
          <SectionHeader eyebrow="In their words" headline={['All twelve, unedited.']} align="center" />
          <TestimonialWall all />
        </Container>
      </Section>

      <CtaSection />
    </>
  );
}
