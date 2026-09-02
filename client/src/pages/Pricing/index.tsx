import { Link } from 'react-router-dom';
import { Reveal, RevealGroup } from '../../motion';
import { Section, Container } from '../../components/layout/Section';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { PageHero } from '../../components/layout/PageHero';
import { CtaSection } from '../../components/common/CtaSection';
import { FaqAccordion } from '../../components/common/FaqAccordion';
import { Seo } from '../../components/common/Seo';
import { Card } from '../../components/common/Card';
import { Check } from '../../components/ui/Icon';
import { included } from '../../data/services';
import { site } from '../../data/site';

/**
 * §5 — three packages, not six SKU tiers. There is one pricing model now, so
 * the two-model tab switcher is gone with it.
 *
 * ADVANCED sits in the middle and is permanently featured: `accent` puts the
 * lime border on it and `.is-featured` lifts it 8px, both already part of the
 * shared Card treatment. Copy and figures are transcribed from the packages
 * sheet, not paraphrased.
 */
interface Package {
  name: string;
  summary: string;
  price: string;
  priceNote: string;
  items: string[];
  featured?: boolean;
}

const PACKAGES: Package[] = [
  {
    name: 'One-Time Projects',
    summary: 'Struggling doing Amazon yourself? Let’s talk and we’ll get you a quote.',
    price: '$750–$2500',
    priceNote: '/project',
    items: [
      'Listing creations',
      'Account/listing Reinstatements',
      'Consulting',
      'Amazon Account fixes',
      'Case management & Appeals',
      'Etc.',
    ],
  },
  {
    name: 'Management ADVANCED',
    summary: 'Includes truly “Full” Amazon management with Advertising management',
    price: '$2250–$6500',
    priceNote: '/mo. + Growth %',
    featured: true,
    items: [
      'PPC Ad management',
      'Dedicated point of contact & support team',
      '150 point checklist of all things sellers can do',
      'Advanced Strategies that work',
      'Product & best practices recommendations',
      'Case management & Appeals',
    ],
  },
  {
    name: 'Management BASIC',
    summary: 'Includes truly “Full” Amazon management without Advertising management',
    price: '$750–$5000',
    priceNote: '/mo. + Growth %',
    items: [
      'Create, organize, & update catalog listings',
      'Dedicated point of contact & support team',
      '130 point checklist of all things sellers can do',
      'Advanced Strategies that work',
      'Product & best practice recommendations',
      'Case management & Appeals',
    ],
  },
];

export default function Pricing() {
  return (
    <>
      <Seo
        route="/pricing" title="Pricing — BLAZON Amazon management"
        description="Three Amazon packages, published not hidden: one-time projects from $750, and full management from $750–$6,500/month plus a share of growth."
      />
      <PageHero
        eyebrow="Pricing"
        headline={['Three packages.', 'Published, not hidden.']}
        lead="One-time project work when you need a specific thing fixed, or full monthly management with or without advertising. Management packages are a monthly fee plus a share of the growth we add."
      />

      <Section surface="obsidian">
        <Container>
          <RevealGroup className="pricing__grid" stagger={80}>
            {PACKAGES.map((p) => (
              <Card
                as="article" interactive accent={p.featured}
                className={`pricing__tier${p.featured ? ' is-featured' : ''}`} key={p.name}
              >
                {p.featured && <span className="card__badge pricing__flag">Recommended</span>}
                <h3 className="heading-s">{p.name}</h3>
                <p className="body-s pricing__summary">{p.summary}</p>

                <p className="pricing__intro">
                  <span className="card__figure pricing__figure">{p.price}</span>
                  <span className="caption">{p.priceNote}</span>
                </p>

                <ul className="pricing__features">
                  {p.items.map((i) => (
                    <li key={i}>
                      <span className="card__icon pricing__tick" aria-hidden="true"><Check size={12} /></span>
                      {i}
                    </li>
                  ))}
                </ul>

                <Link className="btn btn--secondary btn--sm pricing__cta" to="/get-started">Get a free audit</Link>
              </Card>
            ))}
          </RevealGroup>
          <Reveal delay={120}>
            <p className="caption pricing__note">
              Flexible and custom pricing is available — call{' '}
              <a className="link link--inline" href={site.phoneHref}>{site.phone}</a> to talk through your situation.
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section surface="bone">
        <Container>
          <SectionHeader eyebrow="What's included" headline={['Included every month.']} />
          <RevealGroup className="incl__grid" stagger={80}>
            {included.map((b) => (
              <Card as="div" interactive className="incl__block" key={b.group}>
                <h3 className="heading-s">{b.group}</h3>
                <ul>{b.items.map((i) => (
                  <li key={i}><span className="card__icon incl__tick" aria-hidden="true"><Check size={12} /></span>{i}</li>
                ))}</ul>
              </Card>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Section surface="obsidian">
        <Container>
          <SectionHeader eyebrow="Terms" headline={['The commitment, plainly.']} />
          <FaqAccordion items={[
            { q: 'How does cancellation work?', a: (
              <>
                <p className="body">
                  Cancel any time with written notice. Your engagement runs to the end of the
                  following calendar month — 30 to 60 days depending on when you give notice.
                </p>
                <p className="caption faq__clause">
                  The clause itself: “After written notice, the relationship will continue until
                  the last day of the calendar month subsequent to the calendar month in which the
                  Cancellation Notice was issued. (30–60 Days)”
                </p>
              </>
            ) },
            { q: 'What does the growth percentage apply to?', a: 'Gross sales above your average monthly sales — so it is a share of the growth, not a share of the business you already had. It is charged once the calendar month is complete.' },
            { q: 'What is the difference between ADVANCED and BASIC?', a: 'Advertising. ADVANCED includes PPC ad management and a 150 point checklist; BASIC covers the same full management without advertising, on a 130 point checklist. Everything else — your dedicated contact, strategies, recommendations and case management — is in both.' },
            { q: 'Is advertising management included?', a: 'In Management ADVANCED, yes, up to $3,000/month in ad spend. Above that we hand off to a specialist partner rather than pretend otherwise. We also recommend an ad budget of 5–10% of monthly gross sales.' },
            { q: 'Does this cover international marketplaces?', a: 'Prices are based on Amazon US management only. International marketplaces are quoted separately.' },
            { q: 'Can pricing be customised?', a: `Yes. Flexible and custom pricing is available — call ${site.phone} to discuss your specific situation.` },
          ]} />
        </Container>
      </Section>

      <CtaSection />
    </>
  );
}
