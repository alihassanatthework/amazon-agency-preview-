import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LineDraw, MaskWipe, WordRise, useParallax, useReducedMotion } from '../../motion';
import { ArrowRight } from '../../components/ui/Icon';

/**
 * H1 — Hero. The claim. Asymmetric split: text in columns 1–6, the layered
 * visual composition in 7–12, vertically centred.
 *
 * The headline is the single largest element on the page and nothing competes
 * with it; the visual is deliberately secondary in weight and reinforces
 * rather than announces.
 */
export function Hero() {
  const reduced = useReducedMotion();
  const [entered, setEntered] = useState(reduced);
  const [pastCue, setPastCue] = useState(false);

  const textRef = useParallax<HTMLDivElement>(-40);
  const panelRef = useParallax<HTMLDivElement>(-70);
  const metricRef = useParallax<HTMLDivElement>(-24);
  const listingRef = useParallax<HTMLDivElement>(-96);
  const bloomRef = useParallax<HTMLDivElement>(30);

  /* Entrance sequence runs on load, total under 1.4 seconds. */
  useEffect(() => {
    if (reduced) {
      setEntered(true);
      return;
    }
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [reduced]);

  /* The scroll cue fades after 12% scroll and does not return. */
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.12) {
        setPastCue(true);
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      className={`section section--emphasis hero bg-canvas${entered ? ' is-entered' : ''}${
        pastCue ? ' is-past-cue' : ''
      }`}
      aria-labelledby="hero-title"
      data-bg="canvas"
    >
      {/* Gradient bloom 1 of 2 — anchored behind the visual at 70% / 30%. */}
      <div ref={bloomRef} className="bloom hero__bloom" aria-hidden="true" />

      <div className="container hero__grid">
        <div ref={textRef} className="hero__text">
          <p className="eyebrow hero__eyebrow">Amazon growth partner</p>

          <WordRise
            as="h1"
            id="hero-title"
            className="display-xl hero__title"
            lines={['Built for brands', 'that intend to', 'win Amazon.']}
            immediate
          />

          <p className="body-l hero__lead">
            Advertising, account management and listing performance run as one
            system against a single revenue target — not four vendors optimising
            four different numbers.
          </p>

          <div className="hero__actions">
            <Link className="btn btn--lg" to="/contact">
              Get a free audit
              <ArrowRight />
            </Link>
            <a className="link hero__secondary" href="#results">
              See client results
              <ArrowRight />
            </a>
          </div>

          <p className="caption hero__trust">
            $410M managed revenue · US-based strategists · Amazon Verified Partner
          </p>
        </div>

        {/* A layered marketplace-performance object, not a stock photograph. */}
        <div className="hero__visual" aria-hidden="true">
          <div ref={panelRef} className="hero__panel-wrap">
            <MaskWipe className="hero__panel">
              <div className="hero__panel-inner">
                <div className="hero__panel-head">
                  <p className="caption">Net revenue · trailing 90 days</p>
                  <div className="hero__panel-figure-row">
                    <p className="hero__panel-figure">$2.84M</p>
                    <span className="hero__delta">+38.2%</span>
                  </div>
                </div>

                <svg className="hero__chart" viewBox="0 0 420 150" fill="none" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="heroCurveFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--amber-500)" stopOpacity=".22" />
                      <stop offset="100%" stopColor="var(--amber-500)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 122 L52 112 L104 118 L156 92 L208 98 L260 66 L312 58 L364 34 L420 18 L420 150 L0 150 Z"
                    fill="url(#heroCurveFill)"
                  />
                  <path
                    className="hero__curve"
                    d="M0 122 L52 112 L104 118 L156 92 L208 98 L260 66 L312 58 L364 34 L420 18"
                    stroke="var(--amber-500)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <div className="hero__panel-foot">
                  <span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span>
                </div>
              </div>
            </MaskWipe>
          </div>

          <div ref={metricRef} className="hero__float hero__float--metric card card--elevated">
            <p className="caption">TACoS</p>
            <p className="hero__float-figure">11.4<span>%</span></p>
            <p className="caption hero__float-note">−4.6 pts vs. Q2</p>
          </div>

          <div ref={listingRef} className="hero__float hero__float--listing card card--elevated">
            <div className="hero__thumb" />
            <div>
              <p className="hero__float-title">Best Seller</p>
              <p className="caption">Hair Care · #1</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container hero__cue-wrap">
        <span className="hero__cue" aria-hidden="true"><i /></span>
      </div>

      {/* This rule is the same element that forms the top edge of the logo
          band — movement carries across the boundary rather than stopping. */}
      <div className="container">
        <LineDraw className="rule rule--amber hero__handoff" />
      </div>
    </section>
  );
}
