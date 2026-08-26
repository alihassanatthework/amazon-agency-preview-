import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Reveal, WordRise, useMediaQuery, useReducedMotion } from '../../motion';
import { site } from '../../data/site';
import { ArrowRight } from '../../components/ui/Icon';

/**
 * H10 — Contact CTA. The resolution: every prior section funnels here.
 *
 * No card, no container, no border — the content sits directly on the bloom,
 * which makes it feel like an opening rather than another block.
 *
 * The magnetic hover is the only magnetic element on either page, which is
 * what makes it register. Pointer-fine devices only.
 */
export function ContactCta() {
  const reduced = useReducedMotion();
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)');
  const magnetic = fine && !reduced;

  const btnRef = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!magnetic) return;
      const el = btnRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      // Translates up to 6px toward the cursor.
      setOffset({
        x: Math.max(-6, Math.min(6, dx * 0.18)),
        y: Math.max(-6, Math.min(6, dy * 0.3)),
      });
    },
    [magnetic],
  );

  const onLeave = useCallback(() => setOffset({ x: 0, y: 0 }), []);

  useEffect(() => {
    if (!magnetic) setOffset({ x: 0, y: 0 });
  }, [magnetic]);

  return (
    <section className="section section--emphasis cta bg-canvas" aria-labelledby="cta-title">
      {/* Gradient bloom 2 of 2 — anchored bottom-centre, bleeding toward the footer. */}
      <div className="bloom cta__bloom" aria-hidden="true" />

      <div className="container cta__inner">
        <Reveal>
          <p className="eyebrow eyebrow--center">Next step</p>
        </Reveal>

        <WordRise
          as="h2"
          id="cta-title"
          className="display-l cta__title"
          lines={['Find out what your Amazon', 'account is leaving on the table.']}
        />

        <Reveal delay={120}>
          <p className="body-l cta__lead">
            A free audit of advertising, listings and catalogue health, returned
            within {site.responseTime}, with no obligation.
          </p>
        </Reveal>

        <Reveal delay={220} className="cta__actions">
          <Link
            ref={btnRef}
            className="btn btn--lg cta__btn"
            to="/contact"
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            style={{
              transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
              transition: offset.x === 0 && offset.y === 0
                ? 'transform 420ms cubic-bezier(.22,1,.36,1), background-color 240ms cubic-bezier(.4,0,.2,1), box-shadow 240ms cubic-bezier(.4,0,.2,1)'
                : 'transform 120ms cubic-bezier(.4,0,.2,1), background-color 240ms cubic-bezier(.4,0,.2,1), box-shadow 240ms cubic-bezier(.4,0,.2,1)',
            }}
          >
            Get a free audit
            <ArrowRight />
          </Link>

          <a className="link cta__secondary" href={`mailto:${site.email}`}>
            Or email us directly
          </a>
        </Reveal>

        <Reveal delay={320} className="cta__trust">
          <p className="caption">
            Reply within {site.responseTime} · No commitment
          </p>
          <span className="badge">Amazon Verified Partner</span>
        </Reveal>
      </div>
    </section>
  );
}
