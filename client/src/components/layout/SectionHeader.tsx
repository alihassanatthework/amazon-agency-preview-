import type { ReactNode } from 'react';
import { Reveal, WordRise } from '../../motion';

interface Props {
  eyebrow: string;
  headline: string[];
  lead?: ReactNode;
  id?: string;
  align?: 'left' | 'center';
  width?: 'default' | 'wide';
  size?: 'display-l' | 'display-m';
  wordRise?: boolean;
  className?: string;
}

/**
 * §5.3 — the section header pattern: 32px rule → eyebrow → 16px → headline →
 * 24px → lead → 72px → content. Used identically on every section of every
 * page. This one component is the primary source of visual consistency.
 */
export function SectionHeader({
  eyebrow, headline, lead, id, align = 'left',
  width = 'default', size = 'display-l', wordRise, className,
}: Props) {
  const classes = [
    'section-header',
    align === 'center' ? 'section-header--center' : '',
    width === 'wide' ? 'section-header--wide' : '',
    className,
  ].filter(Boolean).join(' ');

  const eyebrowEl = (
    <p className={align === 'center' ? 'eyebrow eyebrow--center' : 'eyebrow'}>{eyebrow}</p>
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
        {headline.map((l, i) => (
          <span key={i}>{l}{i < headline.length - 1 ? <br /> : null}</span>
        ))}
      </h2>
      {leadEl}
    </Reveal>
  );
}
