import { Link } from 'react-router-dom';
import { Reveal } from '../../motion';
import { Section, Container } from '../../components/layout/Section';
import { PageHero } from '../../components/layout/PageHero';
import { CtaSection } from '../../components/common/CtaSection';
import { EmptyState } from '../../components/common/EmptyState';
import { Seo } from '../../components/common/Seo';
import { site } from '../../data/site';

/**
 * §10.6 — the page and its data model are built, but the archive contains no
 * portraits and no bios (Q-03). Blueprint: "Do not ship placeholder avatars or
 * invented bios." So the page states the position honestly rather than filling
 * it with stock faces, and it stays out of the primary navigation.
 */
export default function Team() {
  return (
    <>
      <Seo
        route="/team" title="Our team — BLAZON" noindex
        description="Nine Amazon specialists, all US-based, each with four or more years of experience."
      />
      <PageHero
        eyebrow="Our team"
        headline={['Nine specialists.', 'All US-based.']}
        lead={`Every person who touches your account has four or more years selling on Amazon. ${site.founder} leads the team, and clients name him constantly — which is the point of a boutique.`}
      />
      <Section surface="obsidian">
        <Container>
          <Reveal>
            <EmptyState
              title="Profiles are being photographed"
              body="We would rather leave this page honest than fill it with stock portraits and invented biographies. Individual profiles go up as soon as the shoot is done. In the meantime, the fastest way to meet the person who would run your account is to book the audit — you will speak to them on the call."
              action={<Link className="btn" to="/get-started">Get a free audit</Link>}
            />
          </Reveal>
        </Container>
      </Section>
      <CtaSection />
    </>
  );
}
