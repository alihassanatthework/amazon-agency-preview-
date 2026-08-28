import { Link } from 'react-router-dom';
import { Reveal, RevealGroup } from '../../motion';
import { Section, Container } from '../../components/layout/Section';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { PageHero } from '../../components/layout/PageHero';
import { CtaSection } from '../../components/common/CtaSection';
import { Seo } from '../../components/common/Seo';
import { ArrowRight, Check } from '../../components/ui/Icon';

/** §08 — the distinct offer for brands not yet selling. */
const KEYS = [
  ['Understanding the marketplace', 'What Amazon rewards, what it punishes, and where your category actually sits.'],
  ['Strategic planning', 'Which products to launch first, at what price, under which fulfilment model.'],
  ['Listing optimisation', 'Titles, imagery, A+ and the variation structure — built right the first time.'],
  ['Day-to-day operations', 'Inventory, cases, account health and the notifications that matter.'],
  ['Building a competitive advantage', 'The programs and tools your competitors are not using.'],
];

export default function GettingStarted() {
  return (
    <>
      <Seo
        route="/getting-started" title="Getting started on Amazon — BLAZON"
        description="Not selling on Amazon yet? A free 60-minute start-up training session, and a launch handled for you. Live in about a month."
      />
      <PageHero
        eyebrow="Getting started on Amazon"
        headline={['Not on Amazon yet?', 'Start it properly.']}
        lead="Most Amazon problems are set at launch — the catalogue structure, the fulfilment model, the account settings. Getting those right the first time is far cheaper than unpicking them later."
      >
        <Reveal delay={220}>
          <Link className="btn btn--lg" to="/get-started">Book the free session<ArrowRight /></Link>
        </Reveal>
      </PageHero>

      <Section surface="bone">
        <Container>
          <SectionHeader
            eyebrow="Free training session"
            headline={['Five keys to getting', 'your store started.']}
            lead="A free 60-minute session covering the five things that decide whether an Amazon launch works."
          />
          <RevealGroup className="keys" stagger={80}>
            {KEYS.map(([t, b], i) => (
              <article className="keys__item card" key={t}>
                <span className="keys__num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="heading-s">{t}</h3>
                <p className="body-s">{b}</p>
              </article>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Section surface="obsidian">
        <Container>
          <SectionHeader
            eyebrow="Then, if you want us to run it"
            headline={['Live in about a month.']}
            lead="If you don’t have an Amazon seller account, we can have you up with active listings in roughly a month."
          />
          <RevealGroup as="ul" className="checklist checklist--wide" stagger={70}>
            {['Brand Registry and account setup, configured correctly from the start',
              'Catalogue built with parent–child structure and synchronised reviews',
              'Listings, imagery, A+ content and brand storefront',
              'Prime badge and fulfilment configuration',
              'Advertising structure built before launch, not after',
              'Account health monitoring from day one'].map((i) => (
              <li key={i}><span className="checklist__tick" aria-hidden="true"><Check size={12} /></span><span className="body-s">{i}</span></li>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <CtaSection />
    </>
  );
}
