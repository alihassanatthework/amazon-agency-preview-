import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { LineDraw, Reveal, useInView } from '../../../motion';
import { Section, Container } from '../../../components/layout/Section';
import { SectionHeader } from '../../../components/layout/SectionHeader';
import { ArrowRight, Check, Dash } from '../../../components/ui/Icon';

/**
 * H7 / §9.9 — LIGHT SECTION. The asymmetry does the work: a raised paper panel
 * with a green top rule on one side, flat and muted on the other. A small check
 * and a small dash are the only iconography — no red crosses, no scoring, no
 * competitor naming.
 *
 * The advertising row is unusually honest and is kept deliberately.
 */
const ROWS = [
  ['Scope', 'Every program and tool available to sellers.',
   'The handful of high-impact actions that produce the easy majority of sales.'],
  ['Team', 'A dedicated account manager, a task support team and a supervisor — all US-based, each with 4+ years on Amazon.',
   'Rotating contacts who can be talked in circles.'],
  ['Cadence', 'Weekly 30-minute calls, with email throughout.',
   'Monthly reporting after the month has closed.'],
  ['Incentive', '5% of growth above your baseline, so we earn more only when you do.',
   'A flat fee regardless of result.'],
  ['Advertising', 'Managed to your targets, with an honest handoff to a specialist partner above $3,000/month in spend.',
   'Spend maximised, because the fee is a percentage of it.'],
];

export function Comparison() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <Section surface="bone" className="compare" aria-labelledby="compare-title">
      <Container>
        <SectionHeader
          eyebrow="The difference"
          headline={['Same marketplace.', 'A different amount of effort.']}
          id="compare-title"
        />

        <div className={`compare__table${inView ? ' is-in' : ''}`} ref={ref}>
          <div className="compare__grid">
            <div className="compare__panel" style={{ gridRow: `1 / span ${ROWS.length + 1}` }} aria-hidden="true">
              <LineDraw className="compare__panel-rule" delay={420} />
            </div>
            <div className="compare__spine" style={{ gridRow: `1 / span ${ROWS.length + 1}` }} aria-hidden="true" />
            <div className="compare__foil" style={{ gridRow: `1 / span ${ROWS.length + 1}` }} aria-hidden="true" />

            <span className="compare__corner" aria-hidden="true" />
            <span className="compare__title compare__title--us">Working with BLAZON</span>
            <span className="compare__title compare__title--them">A typical Amazon agency</span>

            {ROWS.map(([label, ours, theirs], i) => (
              <Fragment key={label}>
                <div
                  className="compare__row"
                  style={{ ['--d' as string]: `${Math.min(i * 90, 400)}ms`, ['--row' as string]: String(i + 2) }}
                >
                  <span className="compare__label">{label}</span>
                  <span className="compare__cell compare__cell--us">
                    <span className="compare__mark compare__mark--us" aria-hidden="true"><Check /></span>
                    <span className="body-s">{ours}</span>
                  </span>
                  <span className="compare__cell compare__cell--them">
                    <span className="compare__mark" aria-hidden="true"><Dash /></span>
                    <span className="body-s">{theirs}</span>
                  </span>
                </div>
              </Fragment>
            ))}
          </div>
        </div>

        <Reveal className="compare__cta">
          <Link className="btn" to="/get-started">Get a free audit<ArrowRight /></Link>
        </Reveal>
      </Container>
    </Section>
  );
}
