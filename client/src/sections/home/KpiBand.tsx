import { CountUp, LineDraw, Reveal, RevealGroup } from '../../motion';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Check } from '../../components/ui/Icon';

/**
 * H3 — KPI performance band. The proof, and the first dark moment.
 *
 * The five cells sit inside one glass slab rather than floating as separate
 * cards, so the metrics still read as a single instrument panel — but the slab
 * is lit: a warm light source behind it, an edge highlight along its top, and
 * hairline dividers between cells. The eye should land on five numbers before
 * it reads a single word.
 */

interface Metric {
  to: number;
  label: string;
  prefix?: string;
  suffix?: string;
  note: string;
}

const METRICS: Metric[] = [
  { prefix: '$', to: 410, suffix: 'M', label: 'Managed revenue', note: 'Trailing 12 months' },
  { to: 24, label: 'Clients with a record Prime Day', note: '2025 event' },
  { to: 6, label: 'Client exits above $10M', note: 'Since 2019' },
  { to: 112, label: 'Active Best Seller badges', note: 'Live at time of writing' },
  { to: 47, suffix: '%', label: 'Uplift in sales per visitor', note: 'Median, first 6 months' },
];

export function KpiBand() {
  return (
    <section
      className="section kpi bg-ink"
      aria-labelledby="kpi-title"
      data-bg="ink"
    >
      <div className="container">
        <div className="kpi__head">
          <SectionHeader
            eyebrow="Performance"
            headline={['The numbers our clients', 'quote back to us.']}
            id="kpi-title"
            onDark
            className="kpi__header"
          />

          <Reveal delay={160} className="kpi__verify">
            <span className="kpi__verify-icon" aria-hidden="true"><Check size={13} /></span>
            <span>
              Verified against Seller and Vendor Central reporting for the twelve
              months to June&nbsp;2026.
            </span>
          </Reveal>
        </div>

        <div className="kpi__slab glass">
          <LineDraw className="kpi__slab-rule" />

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
                <p className="kpi__label">{m.label}</p>
                <p className="caption kpi__note">{m.note}</p>
              </div>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
