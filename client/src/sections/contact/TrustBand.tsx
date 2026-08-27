import { CountUp, Reveal, RevealGroup } from '../../motion';

/**
 * C4 — Trust band. Compressed proof for anyone still deciding, and the page's
 * only dark moment before the footer.
 *
 * No section header: this band interrupts rather than introduces. The count-up
 * mechanics are identical to the homepage band so the two read as the same
 * instrument.
 */
const METRICS = [
  { prefix: '$', to: 410, suffix: 'M', label: 'Managed revenue' },
  { to: 34, label: 'Brands managed' },
  { to: 6, label: 'Client exits above $10M' },
];

export function TrustBand() {
  return (
    <section className="section section--compact trust bg-ink" aria-label="Client proof" data-bg="ink">
      <div className="container">
        <RevealGroup className="trust__row" stagger={90}>
          {METRICS.map((m) => (
            <div className="trust__cell" key={m.label}>
              <p className="numeral trust__value">
                <CountUp to={m.to} prefix={m.prefix} suffix={m.suffix} affixClassName="trust__unit" />
              </p>
              <p className="caption trust__label">{m.label}</p>
            </div>
          ))}
        </RevealGroup>

        <Reveal delay={400} className="trust__quote">
          <blockquote>
            <p className="body-l">
              “The audit was more useful than the last agency&rsquo;s first six
              months of reporting.”
            </p>
            <footer className="caption">Dan Whitlock · Founder · Copperfield</footer>
          </blockquote>
          <span className="badge badge--onDark">Amazon Verified Partner</span>
        </Reveal>
      </div>
    </section>
  );
}
