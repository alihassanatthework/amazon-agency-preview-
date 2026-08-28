import { Counter, LineDraw, Reveal, RevealGroup } from '../../../motion';
import { Section, Container } from '../../../components/layout/Section';
import { SectionHeader } from '../../../components/layout/SectionHeader';

/**
 * H3 / §9.5 — the proof. One row, not a card grid, so the four metrics read as
 * a single instrument panel. All four verified from sales deck slides 3 and 7;
 * §22 Q-01 forbids adding a revenue figure.
 */
const METRICS = [
  { to: 80,   suffix: '+', label: 'brands currently managed' },
  { to: 4,    suffix: '+', label: 'years managing Amazon accounts' },
  { to: 9,    suffix: '',  label: 'specialists, all 4+ years experience' },
  // Not numerically countable — a static display value, not a broken counter.
  { to: null, display: '1 yr 7 mo', label: 'average client relationship' },
];

export function StatBand() {
  return (
    <Section surface="obsidian" className="stats" aria-labelledby="stats-title">
      <Container>
        <SectionHeader
          eyebrow="By the numbers"
          headline={['Four years. Eighty brands.', 'One approach.']}
          id="stats-title"
        />
        <LineDraw className="stats__rule" />
        <RevealGroup className="stats__row" stagger={90}>
          {METRICS.map((m) => (
            <div className="stats__cell" key={m.label}>
              <p className="numeral stats__value">
                <Counter to={m.to} displayValue={m.display} suffix={m.suffix} affixClassName="stats__unit" />
              </p>
              <p className="caption stats__label">{m.label}</p>
            </div>
          ))}
        </RevealGroup>
        <Reveal>
          <p className="caption stats__note">
            Figures from BLAZON's own client reporting. We do not publish an aggregate
            revenue number we cannot substantiate.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
