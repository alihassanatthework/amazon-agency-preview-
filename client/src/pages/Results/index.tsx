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
import { Card } from '../../components/common/Card';
import { ArrowRight } from '../../components/ui/Icon';
import { caseStudies } from '../../data/caseStudies';
import { AVG_MONTHS, BRANDS_CURRENT, SPECIALIST_YEARS, YEARS } from '../../data/figures';
import { TEAM_SIZE } from '../../data/team';

/**
 * §10.3 — case study index plus the full testimonial wall.
 *
 * Every card is derived from the shared caseStudies data file (see
 * data/caseStudies.ts and pages/CaseStudy/index.tsx) rather than duplicated
 * here. Aloha Bay has no distinct `mainResult` — its title already is the
 * headline — so the card falls back to `title` for that one case.
 */
const CASES = caseStudies.map((s) => ({
  slug: s.slug,
  client: s.descriptor ? `${s.client} — ${s.descriptor}` : s.client,
  category: s.categoryId,
  categoryLabel: s.categoryLabel,
  headline: s.mainResult ?? s.title,
  summary: s.summary,
}));

/**
 * Derived from the published studies rather than hand-listed, so a filter can
 * never be offered for a category with nothing behind it. The hand-written
 * list previously carried a "New to Amazon" pill that matched no study — one
 * click from here to an empty page.
 */
const CATEGORIES = [
  { id: 'all', label: 'All' },
  ...Array.from(
    new Map(CASES.map((c) => [c.category, c.categoryLabel])).entries(),
    ([id, label]) => ({ id, label }),
  ),
];

// Matches the hero stat line on the landing page. The 4+ below is per-specialist
// Amazon experience, not the company's age — it is not the same figure.
const STATS = [
  { to: BRANDS_CURRENT, suffix: '+', label: 'brands currently managed' },
  { to: YEARS, suffix: '+', label: 'years managing Amazon accounts' },
  { to: TEAM_SIZE, suffix: '', label: `specialists, all ${SPECIALIST_YEARS}+ years experience` },
  { to: AVG_MONTHS, suffix: '', label: 'months, average client relationship' },
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
        lead="Twelve clients answered directly, and four accounts are written up in full — the numbers, what we changed, and what it produced."
      />

      <Section surface="carbon" size="compact">
        <Container>
          <RevealGroup className="stats__row" stagger={90}>
            {STATS.map((m) => (
              <div className="stats__cell" key={m.label}>
                <p className="numeral stats__value">
                  <Counter to={m.to} suffix={m.suffix} affixClassName="stats__unit" />
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
                <Card as={Link} interactive className="case-card" to={`/results/${c.slug}`} key={c.slug}>
                  <p className="card__eyebrow case-card__category">{c.categoryLabel}</p>
                  <h3 className="display-m card__accent case-card__headline">{c.headline}</h3>
                  <p className="heading-s case-card__client">{c.client}</p>
                  <p className="body-s case-card__summary">{c.summary}</p>
                  <span className="link case-card__link">Read the case study<ArrowRight /></span>
                </Card>
              ))}
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
