import { LineDraw, Reveal, RevealGroup, WordRise, useReducedMotion } from '../../motion';

const POINTS = [
  {
    title: 'Owned, not outsourced',
    body: 'The strategist who audits your account is the one who runs it. No handover to a delivery pod.',
  },
  {
    title: 'Margin before volume',
    body: 'Targets are set on contribution margin, so growth that costs more than it returns is not counted as growth.',
  },
  {
    title: 'Weekly, not quarterly',
    body: 'Optimisation happens on a weekly cadence against a live plan, not in a monthly reporting deck.',
  },
];

/**
 * H5 — Approach. The thesis: why this method rather than the default one.
 *
 * Intentionally sparse. The statement is the second-largest typographic moment
 * on the page after the hero, and exactly one clause within it carries the
 * amber emphasis — a single accented phrase, never more.
 */
export function Approach() {
  const reduced = useReducedMotion();

  return (
    <section className="section approach bg-canvas-deep" aria-labelledby="approach-title" data-bg="canvas-deep">
      <div className="container">
        <Reveal className="approach__header">
          <p className="eyebrow">Our approach</p>
        </Reveal>

        {/* Word-rise is permitted here and on the hero only. */}
        <WordRise
          as="h2"
          id="approach-title"
          className="display-m approach__statement"
          lines={[
            'Durable growth on Amazon comes from',
            'taking demand away from competitors —',
            'run as a continuous programme, not a campaign.',
          ]}
        />

        {/* The emphasis lands after the line is read, not with it. */}
        <Reveal className="approach__emphasis-wrap" delay={200}>
          <p className="body-l approach__note">
            Harvesting your own branded search is{' '}
            <em className="approach__emphasis">maintenance, not growth</em>. The
            revenue that moves a business sits in someone else&rsquo;s share of
            the category.
          </p>
        </Reveal>

        <RevealGroup className="approach__points" stagger={80}>
          {POINTS.map((p) => (
            <div className="approach__point" key={p.title}>
              {!reduced && <LineDraw className="approach__point-rule" vertical />}
              <h3 className="approach__point-title">{p.title}</h3>
              <p className="body-s">{p.body}</p>
            </div>
          ))}
        </RevealGroup>

        <Reveal className="approach__cta">
          <a className="link" href="#about">
            How we work
            <svg className="arrow" width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
              <path d="M1 5h11M8.5 1.5 12 5 8.5 8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
