import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { WordRise, useDrift, useReducedMotion } from '../../../motion';
import { Container } from '../../../components/layout/Section';
import { ArrowRight } from '../../../components/ui/Icon';
import { FlameBase, FlameLiquidFill } from '../../../components/common/FlameEnergy';

/**
 * H1 / §9.3 — the claim. Centred across columns 3–10, one of the three
 * permitted centred moments. Ember gradient 1 of 2 rises behind the content.
 *
 * The tagline is verbatim from the BLAZON pitch deck. "Empires" carries the
 * single permitted green headline moment on the page, and it ignites after
 * the line lands rather than arriving green.
 */
export function Hero() {
  const reduced = useReducedMotion();
  const [entered, setEntered] = useState(reduced);
  const [pastCue, setPastCue] = useState(false);
  const emberRef = useDrift<HTMLDivElement>(36);
  const flameRef = useDrift<HTMLDivElement>(-24);

  useEffect(() => {
    if (reduced) { setEntered(true); return; }
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [reduced]);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.1) {
        setPastCue(true);
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      className={`hero${entered ? ' is-entered' : ''}${pastCue ? ' is-past-cue' : ''}`}
      data-surface="obsidian"
      aria-labelledby="hero-title"
    >
      <div ref={emberRef} className="ember-gradient hero__ember" aria-hidden="true" />
      {/* One positioned wrapper carries the scroll drift for both layers, so
          they can never separate. The dim base flame keeps the design
          system's 4% opacity untouched; the liquid fill is a sibling with
          its own opacity, since no fill color can read as "bright" nested
          inside a 4%-opacity ancestor. */}
      <div ref={flameRef} className="hero__flame-wrap" aria-hidden="true">
        <div className="hero__watermark"><FlameBase /></div>
        <div className="hero__flame-fill"><FlameLiquidFill /></div>
      </div>

      <Container className="hero__inner">
        <p className="eyebrow eyebrow--center hero__eyebrow">Amazon account management &amp; growth</p>

        <WordRise
          as="h1" id="hero-title" className="display-xl hero__title" immediate
          lines={[
            'Turn Clicks into Customers',
            <span key="a">and Brands into <span className="accent-ignite">Empires</span></span>,
          ]}
        />

        <p className="body-l hero__lead">
          BLAZON manages Amazon for brands that are tired of guessing. We pull every
          lever the platform offers — listings, advertising, account health, pricing,
          programs most sellers never find — and we do it as your team, not a vendor.
        </p>

        <div className="hero__actions">
          <Link className="btn btn--lg" to="/get-started">Get a free audit<ArrowRight /></Link>
          <Link className="link hero__secondary" to="/results">See client results<ArrowRight /></Link>
        </div>

        {/* Verified figures only — §22 Q-01 forbids a revenue claim. */}
        <p className="caption hero__trust">
          80+ brands managed · 8+ years · US-based team of 9 · avg. client 24 months
        </p>
      </Container>

      <span className="hero__cue" aria-hidden="true"><i /></span>
    </section>
  );
}
