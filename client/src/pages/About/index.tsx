import { Counter, Reveal, RevealGroup, WordRise } from '../../motion';
import { Section, Container } from '../../components/layout/Section';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { PageHero } from '../../components/layout/PageHero';
import { CtaSection } from '../../components/common/CtaSection';
import { Seo } from '../../components/common/Seo';
import { site } from '../../data/site';

// Matches the hero stat line on the landing page. The 4+ below is per-employee
// Amazon experience, not the company's age — it is not the same figure.
const STATS = [
  { to: 80, suffix: '+', label: 'brands currently managed' },
  { to: 8, suffix: '+', label: 'years in business' },
  { to: 9, suffix: '', label: 'employees, all 4+ years on Amazon' },
  { to: 24, suffix: '', label: 'months, average client relationship' },
];

export default function About() {
  return (
    <>
      <Seo
        route="/about" title="About BLAZON — an Amazon-only growth agency"
        description="A boutique team of nine, all with 4+ years on Amazon, managing 80+ brands. Our mission, our approach, and exactly what to expect."
        schema={{
          '@context': 'https://schema.org', '@type': 'Organization',
          name: 'BLAZON', url: 'https://blazonpros.com', telephone: site.phone,
          areaServed: 'US', description: site.mission,
        }}
      />
      <PageHero
        eyebrow="About us"
        headline={['A boutique team,', 'entirely on Amazon.']}
        lead="Nine people, every one of them with four or more years selling on Amazon, managing more than eighty brands. Small enough that you know who runs your account; experienced enough that they have seen your problem before."
      />

      <Section surface="carbon" className="mission">
        <div className="ember-gradient mission__ember" aria-hidden="true" />
        <Container>
          <Reveal><p className="eyebrow">Our mission</p></Reveal>
          {/* §2.2 — verbatim. */}
          <WordRise
            as="p" className="display-m mission__text"
            lines={[
              'At BLAZON, our mission is to exceed client expectations',
              'by immersing ourselves in their business, gaining a deep',
              'understanding of their needs, and delivering tailored',
              'strategies for maximizing growth on Amazon.',
            ]}
          />
        </Container>
      </Section>

      <Section surface="obsidian">
        <Container>
          <SectionHeader
            eyebrow="By the numbers"
            headline={['Eight years. Eighty brands.']}
            lead="Verified from our own client reporting. We don’t publish an aggregate revenue figure we can’t substantiate."
          />
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

      <CtaSection />
    </>
  );
}
