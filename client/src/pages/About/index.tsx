import { Counter, Reveal, RevealGroup, WordRise } from '../../motion';
import { Section, Container } from '../../components/layout/Section';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { PageHero } from '../../components/layout/PageHero';
import { CtaSection } from '../../components/common/CtaSection';
import { Seo } from '../../components/common/Seo';
import { Check } from '../../components/ui/Icon';
import { site } from '../../data/site';

// Matches the hero stat line on the landing page. The 4+ below is per-employee
// Amazon experience, not the company's age — it is not the same figure.
const STATS = [
  { to: 80, suffix: '+', label: 'brands currently managed' },
  { to: 8, suffix: '+', label: 'years in business' },
  { to: 9, suffix: '', label: 'employees, all 4+ years on Amazon' },
  { to: 24, suffix: '', label: 'months, average client relationship' },
];

/** From sales deck slide 7 — kept candid. */
const EXPECT = [
  'Results typically arrive around months four to six.',
  'If you don’t have an Amazon seller account, we can have you live with active listings in about a month.',
  'Each account has a dedicated account manager with a task support team, plus a supervisor overseeing all accounts.',
  'Expect Amazon to be extremely difficult to navigate, understand and manage. It’s not like changing an image on your website.',
  'Ad budget should be 5–10% of monthly gross sales.',
];

/** From slide 6 — the first is the one BLAZON marks VITAL. */
const NEEDED = [
  'A dedicated point of contact who can respond to email and join weekly calls.',
  'Customer service ownership for your Amazon channel.',
  'Inventory and shipping plans we can plan against.',
  'Creative assets — logos, imagery, brand guidelines.',
  'Product documentation, certificates and compliance paperwork.',
  'Engagement with notifications and green lights for projects.',
  'Third-party tools, where you already use them.',
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
                  <Counter to={m.to} displayValue={m.display} suffix={m.suffix} affixClassName="stats__unit" />
                </p>
                <p className="caption stats__label">{m.label}</p>
              </div>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Section surface="bone">
        <Container>
          <div className="expect__grid">
            <div>
              <SectionHeader eyebrow="What to expect" headline={['Plainly, up front.']} />
              <RevealGroup as="ul" className="checklist" stagger={70}>
                {EXPECT.map((e) => (
                  <li key={e}><span className="checklist__tick" aria-hidden="true"><Check size={12} /></span><span className="body-s">{e}</span></li>
                ))}
              </RevealGroup>
            </div>
            <div>
              <SectionHeader eyebrow="What we need from you" headline={['A partnership, not a handoff.']} />
              <RevealGroup as="ul" className="checklist" stagger={70}>
                {NEEDED.map((e, i) => (
                  <li key={e}>
                    <span className="checklist__tick" aria-hidden="true"><Check size={12} /></span>
                    <span className="body-s">
                      {e}{i === 0 && <strong className="checklist__vital"> Vital.</strong>}
                    </span>
                  </li>
                ))}
              </RevealGroup>
            </div>
          </div>
        </Container>
      </Section>

      <CtaSection />
    </>
  );
}
