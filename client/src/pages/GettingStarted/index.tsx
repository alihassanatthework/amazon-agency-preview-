import { Link } from 'react-router-dom';
import { Reveal, RevealGroup, useInView } from '../../motion';
import { Section, Container } from '../../components/layout/Section';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { PageHero } from '../../components/layout/PageHero';
import { CtaSection } from '../../components/common/CtaSection';
import { Seo } from '../../components/common/Seo';
import { ArrowRight } from '../../components/ui/Icon';

/** The three-step process from the pitch deck, in order. */
const APPROACH_STEPS = ['Listing Cleanup/Optimization', 'Organic Growth', 'Paid Ads'];

export default function GettingStarted() {
  const { ref: approachRef, inView: approachInView } = useInView<HTMLDivElement>();

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
          <SectionHeader eyebrow="Our approach" headline={['Our Organic Approach that Works']} />
          <div className={`approach-timeline${approachInView ? ' is-in' : ''}`} ref={approachRef}>
            <span className="approach-timeline__rail" aria-hidden="true"><span className="approach-timeline__rail-fill" /></span>
            <ol className="approach-timeline__list">
              {APPROACH_STEPS.map((step, i) => (
                <li className="approach-timeline__step" key={step} style={{ ['--sd' as string]: `${i * 130}ms` }}>
                  <span className="approach-timeline__marker" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <div className="approach-flow__step">
                    <h3 className="heading-s approach-timeline__title">{step}</h3>
                  </div>
                </li>
              ))}
            </ol>
          </div>
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
              <li key={i}><span className="body-s">{i}</span></li>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <CtaSection />
    </>
  );
}
