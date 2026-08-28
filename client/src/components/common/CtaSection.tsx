import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Reveal, WordRise, useMediaQuery, useReducedMotion } from '../../motion';
import { Section, Container } from '../layout/Section';
import { ArrowRight } from '../ui/Icon';
import { site } from '../../data/site';

/**
 * H11 / §9.13 — the resolution, used on every page. No card and no border: the
 * content sits directly on ember gradient 2 so it reads as an opening rather
 * than another block. The third and final centred moment.
 *
 * The magnetic hover is the only magnetic element on the entire site, which is
 * what makes it register.
 */
export function CtaSection({ magnetic = false }: { magnetic?: boolean }) {
  const reduced = useReducedMotion();
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)');
  const on = magnetic && fine && !reduced;

  const btnRef = useRef<HTMLAnchorElement>(null);
  const [off, setOff] = useState({ x: 0, y: 0 });

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!on) return;
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    setOff({
      x: Math.max(-6, Math.min(6, dx * 0.18)),
      y: Math.max(-6, Math.min(6, dy * 0.3)) - 2,   // the standard -2px lift, folded in
    });
  }, [on]);

  useEffect(() => { if (!on) setOff({ x: 0, y: 0 }); }, [on]);
  const atRest = off.x === 0 && off.y === 0;

  return (
    <Section surface="obsidian" size="emphasis" className="cta" aria-labelledby="cta-title">
      <div className="ember-gradient cta__ember" aria-hidden="true" />
      <Container className="cta__inner">
        <Reveal><p className="eyebrow eyebrow--center">Next step</p></Reveal>
        <WordRise
          as="h2" id="cta-title" className="display-l cta__title"
          lines={['Find out what your Amazon', 'account is leaving on the table.']}
        />
        <Reveal delay={120}>
          <p className="body-l cta__lead">
            A free 60-minute audit of your listings, advertising, account health and
            catalogue. You’ll get our findings whether or not you work with us.
          </p>
        </Reveal>
        <Reveal delay={240} className="cta__actions">
          <Link
            ref={btnRef} className="btn btn--lg cta__btn" to="/get-started"
            onMouseMove={onMove} onMouseLeave={() => setOff({ x: 0, y: 0 })}
            data-rest={atRest ? 'true' : 'false'}
            style={{ transform: `translate3d(${off.x}px, ${off.y}px, 0)` }}
          >
            Get a free audit<ArrowRight />
          </Link>
          <a className="link cta__secondary" href={site.phoneHref}>Or call us on {site.phone}</a>
        </Reveal>
        <Reveal delay={340}>
          <p className="caption cta__trust">
            No commitment · 3-month minimum only if you proceed · US-based team
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
