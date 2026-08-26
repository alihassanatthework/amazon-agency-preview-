import { CountUp, LineDraw, Reveal, RevealGroup } from '../../motion';
import { SectionHeader } from '../../components/ui/SectionHeader';

/**
 * H3 — KPI performance band. The proof, and the first dark moment.
 *
 * Five cells read as a single instrument panel rather than a card grid. The
 * eye should land on five numbers before it reads a single word, so the
 * numerals carry the weight and the labels sit quietly beneath.
 */

interface Metric {
  to: number;
  label: string;
  prefix?: string;
  suffix?: string;
}

const METRICS: Metric[] = [
  { prefix: '$', to: 410, suffix: 'M', label: 'Managed revenue' },
  { to: 24, label: 'Clients with a record Prime Day' },
  { to: 6, label: 'Client exits above $10M' },
  { to: 112, label: 'Active Best Seller badges' },
  { to: 47, suffix: '%', label: 'Uplift in sales per visitor' },
];

export function KpiBand() {
  return (
    <section className="section kpi bg-ink" aria-labelledby="kpi-title">
      <div className="container">
        <SectionHeader
          eyebrow="Performance"
          headline={['The numbers our clients quote back to us.']}
          id="kpi-title"
          onDark
        />

        <LineDraw className="rule rule--amber kpi__rule" />

        <RevealGroup className="kpi__row" stagger={90}>
          {METRICS.map((m) => (
            <div className="kpi__cell" key={m.label}>
              <p className="numeral kpi__value">
                <CountUp
                  to={m.to}
                  prefix={m.prefix}
                  suffix={m.suffix}
                  affixClassName="kpi__unit"
                />
              </p>
              <p className="caption kpi__label">{m.label}</p>
            </div>
          ))}
        </RevealGroup>

        <Reveal>
          <p className="caption kpi__note">
            Figures cover managed accounts for the twelve months to June 2026 and
            are verified against Seller and Vendor Central reporting.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
