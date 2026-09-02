import type { ReactNode } from 'react';
import { LineDraw, Reveal, RevealGroup } from '../../../motion';
import { Section, Container } from '../../../components/layout/Section';
import { SectionHeader } from '../../../components/layout/SectionHeader';
import { TiltCard } from '../../../components/common/TiltCard';

/**
 * H3 / §9.5 — the proof, now eight cards instead of a four-metric instrument
 * row. Wording is verbatim, client-approved: not paraphrased, not
 * renumbered, nothing added.
 */
const STATS = [
  '8+ Years in Business',
  '30+ Years of Combined Amazon Experience',
  'Utah Based',
  '10+ Employees',
  '100+ Brands Currently Servicing',
  '250+ Brands Worked With',
  'Clients stay 24 months on average',
  '3–5 Month to Sales Lift',
];

// Highlights the leading figure inline (e.g. "5+", "100+", "4–6") without
// altering, reordering or dropping any of the surrounding exact wording. A
// stat with no figure at all ("Utah Based") renders wholesale as the accent.
const FIGURE = /\d[\d,]*(?:[-–]\d+)?\+?/;
function renderStat(text: string): ReactNode {
  const match = FIGURE.exec(text);
  if (!match) return <span className="stat-card__figure">{text}</span>;
  const figure = match[0];
  const before = text.slice(0, match.index);
  const after = text.slice(match.index + figure.length);
  return (
    <>
      {before}<span className="stat-card__figure">{figure}</span>{after}
    </>
  );
}

export function StatBand() {
  return (
    <Section surface="obsidian" className="stats" aria-labelledby="stats-title">
      <Container>
        <SectionHeader
          eyebrow="The Numbers"
          headline={['The numbers', 'behind the work.']}
          id="stats-title"
        />
        <LineDraw className="stats__rule" />
        <RevealGroup className="stat-cards" stagger={60}>
          {STATS.map((s) => (
            <TiltCard as="div" className="stat-card card card--interactive" key={s}>
              <p className="body stat-card__text">{renderStat(s)}</p>
            </TiltCard>
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
