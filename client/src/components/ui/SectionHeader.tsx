import type { ReactNode } from 'react';
import { Reveal, WordRise } from '../../motion';

interface SectionHeaderProps {
  eyebrow: string;
  /** One entry per authored line. A single entry renders as one line. */
  headline: string[];
  lead?: ReactNode;
  id?: string;
  /** Column span behaviour: split = columns 1–7, centre = one of the three
   *  permitted centred moments. */
  variant?: 'split' | 'narrow' | 'center';
  /** Dark bands use the light amber eyebrow step. */
  onDark?: boolean;
  /** display-l is the default; the approach statement uses display-m. */
  size?: 'display-l' | 'display-m';
  /** Word-rise is permitted on the two largest section headlines only. */
  wordRise?: boolean;
  className?: string;
}

/**
 * 2.3 — the section header pattern, used identically on both pages:
 * eyebrow → 16px → headline → 24px → lead → 72px → content.
 * This single pattern repeats eleven times and is the primary source of
 * visual consistency, so no section is allowed to deviate from it.
 */
export function SectionHeader({
  eyebrow,
  headline,
  lead,
  id,
  variant = 'split',
  onDark = false,
  size = 'display-l',
  wordRise = false,
  className,
}: SectionHeaderProps) {
  const classes = [
    'section-header',
    `section-header--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const eyebrowEl = (
    <p className={onDark ? 'eyebrow eyebrow--dark' : 'eyebrow'}>{eyebrow}</p>
  );

  const leadEl = lead ? <p className="body-l section-header__lead">{lead}</p> : null;

  if (wordRise) {
    return (
      <div className={classes}>
        <Reveal>{eyebrowEl}</Reveal>
        <WordRise as="h2" lines={headline} className={size} id={id} />
        {leadEl ? <Reveal delay={140}>{leadEl}</Reveal> : null}
      </div>
    );
  }

  return (
    <Reveal className={classes}>
      {eyebrowEl}
      <h2 className={size} id={id}>
        {headline.map((line, i) => (
          <span key={line}>
            {line}
            {i < headline.length - 1 ? <br /> : null}
          </span>
        ))}
      </h2>
      {leadEl}
    </Reveal>
  );
}
