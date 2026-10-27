import { useState } from 'react';
import { RevealGroup } from '../../motion';
import { Card } from '../../components/common/Card';
import { testimonials as ALL } from '../../data/testimonials';

/* The directory also holds a `-mono` variant of each logo for the homepage
   marquee. Only the full-colour files are wanted here, so they are filtered
   out rather than pulled into this module's eager import. */
const LOGOS = import.meta.glob('../../assets/clients/*.png', { eager: true, import: 'default' }) as Record<string, string>;
const FULL_COLOUR = Object.fromEntries(
  Object.entries(LOGOS).filter(([path]) => !path.endsWith('-mono.png')),
);
const logoFor = (slug: string | null) =>
  slug ? (FULL_COLOUR[`../../assets/clients/${slug}.png`] as string | undefined) ?? null : null;

/**
 * §9.11 — the featured five lead because each carries a distinct, concrete
 * claim. Where a client supplied a logo it renders in the card, which is
 * exactly what the consent question authorised.
 */
export function TestimonialWall({ initial = 5, all = false }: { initial?: number; all?: boolean }) {
  const [expanded, setExpanded] = useState(all);
  const ordered = [...ALL].sort((a, b) => Number(b.featured) - Number(a.featured));
  const shown = expanded ? ordered : ordered.slice(0, initial);

  return (
    <>
      <RevealGroup className="wall" stagger={80}>
        {shown.map((t) => (
          <Card as="figure" interactive className="wall__card" key={t.author}>
            <span className="card__figure wall__quote-mark" aria-hidden="true">”</span>
            <blockquote><p className="body-s">{t.quote}</p></blockquote>
            <figcaption>
              <span className="card__strong wall__author">{t.author}</span>
              <span className="card__meta wall__company">{t.company}</span>
            </figcaption>
            {logoFor(t.slug) && (
              <img className="wall__logo" src={logoFor(t.slug)!} alt={`${t.company} logo`} height={24} loading="lazy" decoding="async" />
            )}
          </Card>
        ))}
      </RevealGroup>

      {!all && !expanded && ALL.length > initial && (
        <div className="wall__more">
          <button className="btn btn--secondary" type="button" onClick={() => setExpanded(true)}>
            Read all {ALL.length}
          </button>
        </div>
      )}
    </>
  );
}
