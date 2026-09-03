import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { LineDraw, Reveal, useInView } from '../../../motion';
import { Section, Container } from '../../../components/layout/Section';
import { SectionHeader } from '../../../components/layout/SectionHeader';
import { Card } from '../../../components/common/Card';
import { ArrowRight } from '../../../components/ui/Icon';

/**
 * H7 / §9.9 — a light section carrying one dark card, exactly like every other
 * card on the site. The table reads row by row: the scope label first, then
 * BLAZON, then the typical agency, so a row can be compared straight across.
 *
 * The asymmetry still does the work, but through emphasis rather than a second
 * surface — our column is lit and check-marked, theirs is muted and dashed. A
 * small check and a small dash are the only iconography: no red crosses, no
 * scoring, no competitor naming.
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

        <Card className={`compare__table${inView ? ' is-in' : ''}`} ref={ref}>
          <div className="compare__grid">
            {/* Our column is lit for the full height of the table — the one
                piece of emphasis that replaces the old second surface. */}
            <div className="compare__ours" style={{ gridRow: `1 / span ${ROWS.length + 1}` }} aria-hidden="true">
              <LineDraw className="compare__ours-rule" delay={420} />
            </div>

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
                    <span className="body-s">{ours}</span>
                  </span>
                  <span className="compare__cell compare__cell--them">
                    <span className="body-s">{theirs}</span>
                  </span>
                </div>
              </Fragment>
            ))}
          </div>
        </Card>

        <Reveal className="compare__cta">
          <Link className="btn" to="/get-started">Get a free audit<ArrowRight /></Link>
        </Reveal>
      </Container>
    </Section>
  );
}
