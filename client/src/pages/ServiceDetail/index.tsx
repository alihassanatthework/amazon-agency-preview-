import { Link, useParams } from 'react-router-dom';
import { Reveal, RevealGroup } from '../../motion';
import { Section, Container } from '../../components/layout/Section';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { PageHero } from '../../components/layout/PageHero';
import { CtaSection } from '../../components/common/CtaSection';
import { FaqAccordion } from '../../components/common/FaqAccordion';
import { Seo } from '../../components/common/Seo';
import { Card } from '../../components/common/Card';
import { ArrowRight, Check } from '../../components/ui/Icon';
import { services } from '../../data/services';
import { testimonials } from '../../data/testimonials';
import NotFound from '../NotFound';

const PROBLEM_COPY: Record<string, string> = {
  'Fees keep climbing': 'And margins on anything under $20 have all but vanished.',
  'The rules change constantly': 'Policies, restricted products and restricted verbiage shift without warning.',
  'Listings drift': 'Images, titles and bullets go wrong and stay wrong until someone catches them.',
  "There's no one to call": 'Reaching anyone at Amazon who can actually resolve an issue is close to impossible.',
  'Opportunities stay invisible': 'Most sellers never find the programs and tools that would grow them.',
  'It becomes a second job': 'The day-to-day pulls your team away from the business you actually run.',
};

/** §10.2 — one template, six records. 404 when the slug does not resolve. */
export default function ServiceDetail() {
  const { slug } = useParams();
  const group = services.find((g) => g.slug === slug);

  // Never render an empty template with undefined data.
  if (!group) return <NotFound />;

  // Match the proof to the discipline — a generic testimonial here wastes it.
  const proof = testimonials.filter((t) => t.service === group.slug);

  return (
    <>
      <Seo
        route={`/services/${group.slug}`} title={`${group.title} — BLAZON`}
        description={group.summary}
        schema={{
          '@context': 'https://schema.org', '@type': 'Service',
          serviceType: group.title, provider: { '@type': 'Organization', name: 'BLAZON' },
          areaServed: 'US', description: group.summary,
        }}
      />
      <PageHero eyebrow="Services" headline={[group.title]} lead={group.summary}>
        {group.additionalCost && (
          <Reveal delay={200}><span className="badge">This group carries an additional cost</span></Reveal>
        )}
      </PageHero>

      <Section surface="bone">
        <Container>
          <SectionHeader eyebrow="The problem this solves" headline={['What this fixes.']} />
          <RevealGroup className="problem__grid problem__grid--two" stagger={80}>
            {group.problem.map((p) => (
              <Card as="article" interactive className="problem__card" key={p}>
                <h3 className="problem__title">{p}</h3>
                <p className="body-s">{PROBLEM_COPY[p]}</p>
              </Card>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Section surface="obsidian">
        <Container>
          <SectionHeader
            eyebrow="What's involved"
            headline={['The capabilities.']}
            lead={`${group.items.length} services in this discipline.`}
          />
          <RevealGroup className="cap__grid" stagger={70}>
            {group.items.map((it) => (
              <Card as="article" interactive className="cap" key={it.name}>
                <span className="card__icon cap__tick" aria-hidden="true"><Check size={13} /></span>
                <h3 className="cap__title">
                  {it.name}
                  {it.additionalCost && <em className="card__eyebrow svc__extra"> (additional cost)</em>}
                </h3>
                {it.description && <p className="body-s">{it.description}</p>}
              </Card>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Section surface="carbon">
        <Container>
          <SectionHeader
            eyebrow="How it runs"
            headline={['Cadence and reporting.']}
            lead="A dedicated account manager, a task support team and a supervisor on every account."
          />
          <RevealGroup className="cadence" stagger={80}>
            <Card as="div" interactive className="cadence__item"><h3 className="heading-s">Weekly</h3><p className="body-s">A 30-minute call with your account manager, plus email throughout the week.</p></Card>
            <Card as="div" interactive className="cadence__item"><h3 className="heading-s">Monthly</h3><p className="body-s">Account health review, IPI check, negative seller review removal and a written summary.</p></Card>
            <Card as="div" interactive className="cadence__item"><h3 className="heading-s">Ongoing</h3><p className="body-s">Optimisation against a live plan. Most clients see meaningful movement around months four to six.</p></Card>
          </RevealGroup>
        </Container>
      </Section>

      {proof.length > 0 && (
        <Section surface="obsidian">
          <Container>
            <SectionHeader eyebrow="Proof" headline={['From clients on this exact problem.']} />
            <RevealGroup className="wall wall--inline" stagger={80}>
              {proof.map((t) => (
                <Card as="figure" interactive className="wall__card" key={t.author}>
                  <span className="wall__quote-mark" aria-hidden="true">”</span>
                  <blockquote><p className="body-s">{t.quote}</p></blockquote>
                  <figcaption>
                    <span className="wall__author">{t.author}</span>
                    <span className="wall__company">{t.company}</span>
                  </figcaption>
                </Card>
              ))}
            </RevealGroup>
          </Container>
        </Section>
      )}

      <Section surface="bone">
        <Container>
          <SectionHeader eyebrow="Questions" headline={['Before you ask.']} />
          <FaqAccordion
            items={[
              { q: 'Is this sold separately?', a: 'No. Every discipline is part of one monthly engagement priced by catalogue size — there is no à la carte menu, because the levers only compound when they are pulled together.' },
              { q: 'How quickly will we see movement?', a: 'Most clients see an incremental increase in sales around months four to six. We would rather tell you that now than promise you a month.' },
              { q: 'What do you need from us?', a: 'One dedicated point of contact who can respond to email and join the weekly call. That is the one thing we mark as vital.' },
            ]}
          />
        </Container>
      </Section>

      <Section surface="carbon" size="compact">
        <Container>
          <div className="svc__related">
            <p className="eyebrow">The other disciplines</p>
            <RevealGroup className="svc__related-grid" stagger={70}>
              {services.filter((s) => s.slug !== group.slug).map((s) => (
                <Card
                  as={Link} interactive className="svc__related-card"
                  to={`/services/${s.slug}`} key={s.slug}
                >
                  <h3 className="card__strong">{s.short}</h3>
                  <span className="card__icon"><ArrowRight /></span>
                </Card>
              ))}
            </RevealGroup>
          </div>
        </Container>
      </Section>

      <CtaSection />
    </>
  );
}
