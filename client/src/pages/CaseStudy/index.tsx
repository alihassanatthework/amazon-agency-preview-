import { Link, useParams } from 'react-router-dom';
import { Counter, EmberWipe, Reveal, RevealGroup, useInView } from '../../motion';
import { Section, Container } from '../../components/layout/Section';
import { PageHero } from '../../components/layout/PageHero';
import { CtaSection } from '../../components/common/CtaSection';
import { Seo } from '../../components/common/Seo';
import { CaseStudyGraph } from '../../components/common/CaseStudyGraph';
import { ArrowRight } from '../../components/ui/Icon';
import { caseStudyBySlug, type CaseStudy as CaseStudyData } from '../../data/caseStudies';
import NotFound from '../NotFound';

/**
 * §10.3 — one template for every case study, Aloha Bay included, all reading
 * from the same data source (data/caseStudies.ts). Every study follows the
 * same results-first hierarchy: metric cards, then the same two-line
 * performance graph treatment as Aloha Bay, then the narrative. `mainResult`
 * is the only optional piece of the intro — Aloha Bay's hero lead already
 * carries its headline, so showing a second, identical line beneath it
 * would just repeat itself; studies with a distinct headline (e.g.
 * "$400,000+/month in gross sales") show it as written.
 */
function CaseStudyPage({ study }: { study: CaseStudyData }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const displayName = study.descriptor ? `${study.client} — ${study.descriptor}` : study.client;
  const hasBeforeAfter = study.before.length > 0 || study.after.length > 0;

  return (
    <>
      <Seo
        route={`/results/${study.slug}`} title={`${displayName} — ${study.title} — BLAZON`}
        description={study.seoDescription ?? `${displayName}: ${study.title}. ${study.summary}`}
      />
      <PageHero eyebrow="Case study" headline={[displayName]} lead={study.title} />

      <Section surface="obsidian">
        <Container>
          {study.mainResult && (
            <>
              <Reveal><p className="display-m cs__main-result">{study.mainResult}</p></Reveal>
              <Reveal delay={80}><p className="body cs__summary">{study.summary}</p></Reveal>
            </>
          )}

          {study.metrics.length > 0 && (
            <RevealGroup className="cs__metrics" stagger={90}>
              {study.metrics.map((m) => (
                <div key={m.label}>
                  <p className="cs__metric-value">
                    <Counter to={m.to} displayValue={m.display} prefix={m.prefix} suffix={m.suffix} affixClassName="case__metric-affix" />
                  </p>
                  <p className="caption">{m.label}</p>
                </div>
              ))}
            </RevealGroup>
          )}

          <div ref={ref} className="cs__chart-wrap">
            <EmberWipe className="case__panel">
              <div className="card case__panel-inner">
                <CaseStudyGraph graph={study.graph} animate={inView} />
              </div>
            </EmberWipe>
          </div>
        </Container>
      </Section>

      <Section surface="carbon">
        <Container>
          <div className="cs__body">
            {hasBeforeAfter && (
              <div className="cs__before-after">
                <Reveal className="cs__ba-col">
                  <p className="eyebrow">Before BLAZON</p>
                  <ul className="checklist checklist--muted">
                    {study.before.map((b) => (
                      <li key={b}><span className="body-s">{b}</span></li>
                    ))}
                  </ul>
                </Reveal>
                <Reveal className="cs__ba-col" delay={80}>
                  <p className="eyebrow">With BLAZON</p>
                  <ul className="checklist">
                    {study.after.map((a) => (
                      <li key={a}><span className="body-s">{a}</span></li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            )}

            {study.story.map(({ heading, body }) => (
              <Reveal className="cs__block" key={heading}>
                <h2 className="heading-s cs__block-title">{heading}</h2>
                <p className="body">{body}</p>
              </Reveal>
            ))}

            <Reveal className="cs__back">
              <Link className="link" to="/results">All client results<ArrowRight /></Link>
            </Reveal>
          </div>
        </Container>
      </Section>

      <CtaSection />
    </>
  );
}

/** §10.3 — detail template. Charts are redrawn, never Seller Central screenshots. */
export default function CaseStudy() {
  const { slug } = useParams();
  const study = caseStudyBySlug(slug);
  if (!study) return <NotFound />;
  return <CaseStudyPage study={study} />;
}
