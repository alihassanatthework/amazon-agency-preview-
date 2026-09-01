import { Link } from 'react-router-dom';
import { RevealGroup } from '../../../motion';
import { Section, Container } from '../../../components/layout/Section';
import { SectionHeader } from '../../../components/layout/SectionHeader';
import { TiltCard } from '../../../components/common/TiltCard';
import { ArrowRight } from '../../../components/ui/Icon';

/**
 * H5 / §9.7 — the method, framed as levers. Six cards, a clean 3x2 grid.
 *
 * The service count is rendered from the data, not hardcoded.
 */
const GROUPS = [
  { slug: 'account-setup',         title: 'Account Setup', count: 7,
    summary: 'Everything set up right from day one — Brand Registry, settings and a seller and brand profile built to reduce fees.' },
  { slug: 'listing-optimization',  title: 'Listing Optimization', count: 9,
    summary: 'Listings built to convert — catalogue structure, imagery, AI-assisted copy and the A+ content beneath them.' },
  { slug: 'account-health',        title: 'Account Health', count: 5,
    summary: 'Account health monitored and protected — performance notifications, IPI and negative review removal, on a schedule.' },
  { slug: 'advertising-marketing', title: 'Advertising & Marketing', count: 6,
    summary: 'Campaigns optimised against BLAZON’s organic growth strategy, plus the promotions and posts most sellers never run.' },
  { slug: 'value-adds',            title: 'Value Adds', count: 9,
    summary: 'The extras that compound — reviews, badges, financing, beta programs and testing, run alongside the core work.' },
  { slug: 'team-trainings',        title: 'Team Trainings', count: 8,
    summary: 'Your team trained on the specifics — claims, compliance, shipping plans and the mistakes that are easiest to avoid.' },
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
          lead={`Most agencies work the handful of levers that produce the easy majority of sales. That's why most sellers land at average. We work all of them — ${TOTAL} services across six disciplines, run as one system on your account.`}
        />
        <RevealGroup className="levers__grid" stagger={80}>
          {GROUPS.map((g) => (
            <TiltCard as={Link} className="lever card card--interactive" to={`/services/${g.slug}`} key={g.slug}>
              <h3 className="heading-s lever__title">{g.title}</h3>
              <p className="body-s lever__summary">{g.summary}</p>
              <span className="lever__meta">
                {g.count} services<ArrowRight />
              </span>
            </TiltCard>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
