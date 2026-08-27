import { useEffect, useRef, useState } from 'react';
import { CountUp, MaskWipe, useMediaQuery, useReducedMotion } from '../../motion';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { ArrowRight } from '../../components/ui/Icon';

interface CaseStudy {
  category: string;
  brand: string;
  problem: string;
  strategy: string;
  metric: { to: number; prefix?: string; suffix?: string; decimals?: number; label: string };
  image: string;
  alt: string;
}

const CASES: CaseStudy[] = [
  {
    category: 'Beauty',
    brand: 'Lumière',
    problem: 'Spend was buying back customers they already owned.',
    strategy: 'Retargeted on conquesting and margin-weighted bids.',
    metric: { to: 214, suffix: '%', label: 'Net revenue growth, 11 months' },
    image: '/media/case-beauty.jpg',
    alt: 'Serum being dispensed from a dropper bottle in soft daylight',
  },
  {
    category: 'Apparel',
    brand: 'NORTHSIDE',
    problem: '900 ASINs, no variation architecture, flat conversion.',
    strategy: 'Consolidated variations and rebuilt the top 40 ASINs.',
    metric: { to: 61, suffix: '%', label: 'Sales per visitor' },
    image: '/media/case-apparel.jpg',
    alt: 'A studio rail of outerwear in neutral tones',
  },
  {
    category: 'Food & beverage',
    brand: 'Verdant',
    problem: 'Revenue grew while contribution margin fell.',
    strategy: 'Repriced the range and aimed DSP at repeat buyers.',
    metric: { to: 9.4, decimals: 1, prefix: '$', suffix: 'M', label: 'Exit valuation, 2025' },
    image: '/media/case-food.jpg',
    alt: 'A portafilter of ground coffee and a flat white on a wooden board',
  },
];

/**
 * H7 — Case studies. Specific evidence: named brands, real numbers.
 *
 * The track scrolls horizontally against the page's vertical flow while the
 * section is pinned. On mobile the pin is removed and the track becomes a
 * native snap carousel — scroll-driven pinning on touch fights the platform.
 */
export function CaseStudies() {
  const reduced = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const carousel = reduced || isMobile;

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (carousel) return;

    let ticking = false;
    let current = 0;

    const update = () => {
      ticking = false;
      const el = sectionRef.current;
      const track = trackRef.current;
      if (!el || !track) return;

      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;

      const target = Math.min(Math.max(-rect.top / scrollable, 0), 1);
      // A light lerp so the movement feels weighted rather than locked.
      current += (target - current) * 0.18;
      if (Math.abs(target - current) < 0.0005) current = target;

      const distance = track.scrollWidth - track.clientWidth;
      track.style.transform = `translate3d(${-current * distance}px, 0, 0)`;
      setProgress(current);

      if (current !== target) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [carousel]);

  const header = (
    <SectionHeader
      eyebrow="Client results"
      headline={['Three brands. Three problems. Three numbers.']}
      id="results-title"
      variant="center"
    />
  );

  const cards = (
    <>
      {CASES.map((c) => (
        <CaseCard key={c.brand} study={c} animate={!carousel} />
      ))}

      {/* A terminal card gives the track a defined end rather than trailing off. */}
      <article className="case-card case-card--end">
        <p className="eyebrow">The rest of them</p>
        <h3 className="display-m">See all results</h3>
        <p className="body-s">
          Twelve more case studies across apparel, beauty, food and household.
        </p>
        <a className="link" href="#results">
          See all results
          <ArrowRight />
        </a>
      </article>
    </>
  );

  if (carousel) {
    return (
      <section className="section cases bg-canvas" id="results" aria-labelledby="results-title" data-bg="canvas">
        <div className="container">{header}</div>
        <div className={`cases__carousel${reduced ? ' cases__carousel--stacked' : ''}`}>
          {cards}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="cases cases--pinned bg-canvas"
      id="results"
      aria-labelledby="results-title"
      data-bg="canvas"
    >
      <div className="cases__viewport">
        <div className="container">{header}</div>

        <div className="cases__track-wrap">
          <div className="cases__track" ref={trackRef}>
            {cards}
          </div>
        </div>

        <div className="container">
          <div className="cases__rail" aria-hidden="true">
            <span className="cases__rail-fill" style={{ transform: `scaleX(${progress})` }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function CaseCard({ study, animate }: { study: CaseStudy; animate: boolean }) {
  return (
    <article className="case-card card card--interactive" tabIndex={0}>
      <MaskWipe className="case-card__media media-frame">
        <img
          src={study.image}
          alt={study.alt}
          width={1000}
          height={1250}
          loading="lazy"
          decoding="async"
        />
        <span className="media-frame__scrim" aria-hidden="true" />
      </MaskWipe>

      <div className="case-card__body">
        <p className="case-card__category">{study.category}</p>
        <h3 className="heading-s">{study.brand}</h3>
        {/* Problem then strategy, in that order — the sequence carries the
            meaning, so labelling each one costs the card two lines it does not
            have inside the pinned viewport. */}
        <p className="body-s case-card__line case-card__line--problem">{study.problem}</p>
        <p className="body-s case-card__line">{study.strategy}</p>

        <p className="case-card__metric">
          {animate ? (
            <CountUp
              to={study.metric.to}
              decimals={study.metric.decimals ?? 0}
              prefix={study.metric.prefix}
              suffix={study.metric.suffix}
            />
          ) : (
            `${study.metric.prefix ?? ''}${study.metric.to}${study.metric.suffix ?? ''}`
          )}
        </p>
        <p className="caption">{study.metric.label}</p>

        <a className="link case-card__link" href="#results">
          Read the case study
          <ArrowRight />
        </a>
      </div>
    </article>
  );
}
