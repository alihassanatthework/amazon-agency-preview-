import type { ReactNode } from 'react';
import { Reveal, WordRise } from '../../motion';
import { Container } from './Section';

/**
 * Every page composes from the same skeleton (§10): PageHero → alternating
 * content sections → proof module → CtaSection → Footer.
 */
export function PageHero({
  eyebrow, headline, lead, children, compact,
}: {
  eyebrow: string; headline: string[]; lead?: ReactNode;
  children?: ReactNode; compact?: boolean;
}) {
  return (
    <section className={`page-hero${compact ? ' page-hero--compact' : ''}`} data-surface="obsidian">
      <div className="ember-gradient page-hero__ember" aria-hidden="true" />
      <Container className="page-hero__inner">
        <Reveal><p className="eyebrow">{eyebrow}</p></Reveal>
        <WordRise as="h1" className="display-l page-hero__title" lines={headline} immediate />
        {lead && <Reveal delay={140}><p className="body-l page-hero__lead">{lead}</p></Reveal>}
        {children}
      </Container>
    </section>
  );
}
