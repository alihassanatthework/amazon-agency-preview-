import { Link } from 'react-router-dom';
import { LineDraw, Reveal, useReveal } from '../../motion';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { ArrowRight, Check, Dash } from '../../components/ui/Icon';

const ROWS = [
  {
    label: 'Strategy',
    us: 'Built to your margin structure and category position.',
    them: 'One template applied to every account on the roster.',
  },
  {
    label: 'Advertising',
    us: 'PPC and DSP including programmatic competitive conquesting.',
    them: 'Basic sponsored ads against your own branded search.',
  },
  {
    label: 'Team',
    us: 'Named US-based strategists who own the account outright.',
    them: 'Rotating offshore support with no continuity.',
  },
  {
    label: 'Cadence',
    us: 'Proactive weekly optimisation against a live plan.',
    them: 'Reactive monthly reporting after the month has closed.',
  },
  {
    label: 'Track record',
    us: 'Proven client exits above $10M.',
    them: 'No exit experience to point to.',
  },
];

/**
 * H8 — Comparison. The contrast, positioned against the generic alternative.
 *
 * The asymmetry does the work: elevation, a white surface and an amber rule on
 * one side; flat and muted on the other. No red crosses, no green ticks and no
 * scoring — a checkmark and a dash are the only iconography.
 */
export function Comparison() {
  const { ref, revealed } = useReveal<HTMLDivElement>();

  return (
    <section className="section comparison bg-canvas-deep" aria-labelledby="comparison-title" data-bg="canvas-deep">
      <div className="container">
        <SectionHeader
          eyebrow="The difference"
          headline={['Same channel.', 'A different operating model.']}
          lead="Every agency has access to the same console. What separates outcomes is who runs it, against what target, and how often."
          id="comparison-title"
        />

        <div className={`comparison__table${revealed ? ' is-revealed' : ''}`} ref={ref}>
          <div className="comparison__head" aria-hidden="true">
            <span />
            <span className="comparison__col-title comparison__col-title--us">Working with us</span>
            <span className="comparison__col-title">The generic agency model</span>
          </div>

          {/* The raised panel lifts off the page as the section arrives. */}
          <div className="comparison__panel" aria-hidden="true">
            <LineDraw className="comparison__panel-rule" delay={400} />
          </div>

          <ul className="comparison__rows">
            {ROWS.map((row, i) => (
              <li
                className="comparison__row"
                key={row.label}
                style={{ ['--reveal-delay' as string]: `${Math.min(i * 90, 400)}ms` }}
              >
                <span className="comparison__divider" aria-hidden="true" />
                <span className="comparison__label">{row.label}</span>

                <span className="comparison__cell comparison__cell--us">
                  <span className="comparison__mark comparison__mark--us" aria-hidden="true">
                    <Check />
                  </span>
                  <span className="body-s">{row.us}</span>
                </span>

                <span className="comparison__cell comparison__cell--them">
                  <span className="comparison__mark" aria-hidden="true">
                    <Dash />
                  </span>
                  <span className="body-s">{row.them}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <Reveal className="comparison__cta">
          <Link className="btn" to="/contact">
            Get a free audit
            <ArrowRight />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
