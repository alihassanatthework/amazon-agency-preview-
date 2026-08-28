import { Link } from 'react-router-dom';
import { RevealGroup } from '../../../motion';
import { Section, Container } from '../../../components/layout/Section';
import { SectionHeader } from '../../../components/layout/SectionHeader';
import { ArrowRight } from '../../../components/ui/Icon';

/**
 * H5 / §9.7 — the method, framed as levers. Seven cards in a 4+3 arrangement:
 * the asymmetry is deliberate and avoids a dead-generic 3x3 grid.
 *
 * The service count is rendered from the data, not hardcoded — the source
 * document lists 36, not the 38 the blueprint prints. See BLAZON-FINDINGS Q-11.
 */
const GROUPS = [
  { slug: 'account-management',    title: 'Account Management & Strategy', count: 5,
    summary: 'Your account run as a system — set up correctly, positioned deliberately, steered against a plan.' },
  { slug: 'listing-optimization',  title: 'Listing & Optimization', count: 7,
    summary: 'Listings built to convert and to stay compliant — copy, imagery, A+ and the variation architecture beneath.' },
  { slug: 'advertising',           title: 'Advertising & Marketing', count: 6,
    summary: 'PPC and DSP managed to your targets, plus the external traffic and deals most sellers never reach.' },
  { slug: 'sales-growth',          title: 'Sales Optimization & Growth', count: 6,
    summary: 'Ranking, Buy Box, pricing, reviews and subscription revenue — the levers that move a listing.' },
  { slug: 'operations-compliance', title: 'Operations & Compliance', count: 5,
    summary: 'Fulfilment, inventory and account health, including the suspensions that stop a business dead.' },
  { slug: 'analytics',             title: 'Data Analytics & Reporting', count: 4,
    summary: 'What the numbers actually say — performance, ad efficiency and competitor movement.' },
  { slug: 'international',         title: 'International Expansion', count: 3,
    summary: 'New marketplaces opened properly, with the tax and localisation work that makes them hold.' },
];

const TOTAL = GROUPS.reduce((n, g) => n + g.count, 0);

export function Services() {
  return (
    <Section surface="obsidian" id="services" className="levers" aria-labelledby="levers-title">
      <Container>
        <SectionHeader
          eyebrow="What we actually do"
          headline={['Every lever, pulled deliberately.']}
          id="levers-title"
          lead={`Most agencies work the handful of levers that produce the easy majority of sales. That's why most sellers land at average. We work all of them — ${TOTAL} services across seven disciplines, run as one system on your account.`}
        />
        <RevealGroup className="levers__grid" stagger={80}>
          {GROUPS.map((g) => (
            <Link className="lever card card--interactive" to={`/services/${g.slug}`} key={g.slug}>
              <h3 className="heading-s lever__title">{g.title}</h3>
              <p className="body-s lever__summary">{g.summary}</p>
              <span className="lever__meta">
                {g.count} services<ArrowRight />
              </span>
            </Link>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
