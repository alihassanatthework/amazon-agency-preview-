import { Link } from 'react-router-dom';
import { Reveal, RevealGroup } from '../../motion';
import { Section, Container } from '../../components/layout/Section';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { PageHero } from '../../components/layout/PageHero';
import { CtaSection } from '../../components/common/CtaSection';
import { TestimonialWall } from '../../components/common/TestimonialWall';
import { Seo } from '../../components/common/Seo';
import { TiltCard } from '../../components/common/TiltCard';
import { ArrowRight, Check } from '../../components/ui/Icon';
import { services, totalServices, included } from '../../data/services';

/** §10.1 — the six groups as one integrated system. */
export default function Services() {
  return (
    <>
      <Seo
        route="/services" title={`${totalServices} Amazon services, one account team — BLAZON`}
        description="Six disciplines run as one system on your Amazon account: account setup, listing optimization, account health, advertising & marketing, value adds and team trainings."
      />
      <PageHero
        eyebrow="Services"
        headline={[`${totalServices} services.`, 'One account team.']}
        lead="Most agencies work the handful of levers that produce the easy majority of sales. We work all of them, across six disciplines, run as one system on your account."
      />

      <Section surface="obsidian">
        <Container>
          <RevealGroup className="svc__groups" stagger={80}>
            {services.map((g) => (
              <TiltCard as="article" className="svc__group card" key={g.slug}>
                <header className="svc__group-head">
                  <h2 className="heading-s">{g.title}</h2>
                  {g.additionalCost && <span className="badge">Additional cost</span>}
                </header>
                <p className="body-s svc__group-summary">{g.summary}</p>
                <ul className="svc__items">
                  {g.items.map((it) => (
                    <li key={it.name}>
                      <span className="svc__tick" aria-hidden="true"><Check size={12} /></span>
                      <span>
                        <strong>{it.name}</strong>
                        {it.additionalCost && <em className="svc__extra"> (additional cost)</em>}
                        {it.description && <span className="svc__desc"> — {it.description}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link className="link svc__more" to={`/services/${g.slug}`}>
                  More on {g.short}<ArrowRight />
                </Link>
              </TiltCard>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Section surface="bone">
        <Container>
          <SectionHeader
            eyebrow="What's included"
            headline={['Included every month.']}
            lead="The work that happens on your account whether or not anything is on fire."
          />
          <RevealGroup className="incl__grid" stagger={80}>
            {included.map((block) => (
              <TiltCard as="div" className="incl__block card" key={block.group}>
                <h3 className="heading-s">{block.group}</h3>
                <ul>
                  {block.items.map((i) => (
                    <li key={i}><span className="incl__tick" aria-hidden="true"><Check size={12} /></span>{i}</li>
                  ))}
                </ul>
              </TiltCard>
            ))}
          </RevealGroup>
          <Reveal className="incl__note">
            <p className="caption">
              Ad management is included up to $3,000/month in spend.
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section surface="carbon">
        <Container>
          <SectionHeader eyebrow="In their words" headline={['What that looks like in practice.']} align="center" />
          <TestimonialWall initial={3} />
        </Container>
      </Section>

      <CtaSection />
    </>
  );
}
