import type { ReactNode } from 'react';
import { LineDraw, Reveal, RevealGroup } from '../../../motion';
import { Section, Container } from '../../../components/layout/Section';
import { SectionHeader } from '../../../components/layout/SectionHeader';
import { Card } from '../../../components/common/Card';
import { AVG_MONTHS, BRANDS_CURRENT, BRANDS_TOTAL, COMBINED_YEARS, YEARS } from '../../../data/figures';
import { TEAM_SIZE } from '../../../data/team';

/**
 * H3 / §9.5 — the proof, now eight cards instead of a four-metric instrument
 * row. Wording is verbatim, client-approved: not paraphrased, not
 * renumbered, nothing added.
 *
 * This band is the authoritative figure set for the whole site. The numbers
 * interpolate from `data/figures.ts` so the pages quoting them cannot drift
 * from what is shown here; the wording around them is unchanged, character
 * for character.
 */
const STATS = [
  `${YEARS}+ Years in Business`,
  `${COMBINED_YEARS}+ Years of Combined Amazon Experience`,
  'Utah Based',
  `${TEAM_SIZE}+ Employees`,
  `${BRANDS_CURRENT}+ Brands Currently Servicing`,
  `${BRANDS_TOTAL}+ Brands Worked With`,
  `Clients stay ${AVG_MONTHS} months on average`,
  '4–6 Month to Sales Lift',
];

// Highlights the leading figure inline (e.g. "5+", "100+", "4–6") without
// altering, reordering or dropping any of the surrounding exact wording. A
// stat with no figure at all ("Utah Based") renders wholesale as the accent.
const FIGURE = /\d[\d,]*(?:[-–]\d+)?\+?/;
function renderStat(text: string): ReactNode {
  const match = FIGURE.exec(text);
  if (!match) return <span className="card__figure stat-card__figure">{text}</span>;
  const figure = match[0];
  const before = text.slice(0, match.index);
  const after = text.slice(match.index + figure.length);
  return (
    <>
      {before}<span className="card__figure stat-card__figure">{figure}</span>{after}
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
            <Card as="div" interactive className="stat-card" key={s}>
              <p className="body stat-card__text">{renderStat(s)}</p>
            </Card>
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
