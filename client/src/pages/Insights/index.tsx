import { Link } from 'react-router-dom';
import { Reveal, RevealGroup } from '../../motion';
import { Section, Container } from '../../components/layout/Section';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { PageHero } from '../../components/layout/PageHero';
import { CtaSection } from '../../components/common/CtaSection';
import { Seo } from '../../components/common/Seo';
import { Card } from '../../components/common/Card';
import { ArrowRight } from '../../components/ui/Icon';
import { articles } from '../../data/articles';

/** §10.7 — index. Only the evergreen article publishes at launch (Q-10). */
export default function Insights() {
  const live = articles.filter((a) => a.status === 'published');
  const drafts = articles.filter((a) => a.status !== 'published');

  return (
    <>
      <Seo
        route="/insights" title="Insights — BLAZON"
        description="Practical Amazon guidance from the team that manages 80+ brands: account settings, logistics, advertising."
      />
      <PageHero
        eyebrow="Insights"
        headline={['What we keep', 'having to explain.']}
        lead="Written by the people who run the accounts, not by a content team."
      />

      <Section surface="obsidian">
        <Container>
          <RevealGroup className="insights__grid" stagger={80}>
            {live.map((a) => (
              <Card as={Link} interactive className="insight" to={`/insights/${a.slug}`} key={a.slug}>
                <p className="insight__meta">{a.readingMinutes} min read</p>
                <h2 className="heading-s insight__title">{a.title}</h2>
                <p className="body-s insight__excerpt">{a.excerpt}</p>
                <span className="link insight__link">Read it<ArrowRight /></span>
              </Card>
            ))}
          </RevealGroup>

          {drafts.length > 0 && (
            <Reveal className="insights__pending">
              <p className="eyebrow">Being refreshed</p>
              <p className="body-s">
                {drafts.map((d) => d.title).join(' · ')} — both reference past
                periods and are held back until the figures are current. We would
                rather publish nothing than publish a stale fee schedule.
              </p>
            </Reveal>
          )}
        </Container>
      </Section>

      <Section surface="carbon" size="compact">
        <Container>
          <SectionHeader
            eyebrow="Newsletter"
            headline={['A biweekly note.']}
            lead="Every other week: what changed on Amazon, and what to do about it. The same note our clients get."
          />
          <Reveal>
            <form className="newsletter" onSubmit={(e) => e.preventDefault()}>
              <div className="field">
                <label className="field__label" htmlFor="nl">Work email</label>
                <input className="input" id="nl" type="email" placeholder="you@company.com" required />
              </div>
              <button className="btn" type="submit">Subscribe</button>
            </form>
          </Reveal>
        </Container>
      </Section>

      <CtaSection />
    </>
  );
}
