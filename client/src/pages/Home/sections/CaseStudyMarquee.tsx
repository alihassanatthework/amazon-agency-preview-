import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, FocusEvent } from 'react';
import { Link } from 'react-router-dom';
import { Reveal, useDrift, useReducedMotion } from '../../../motion';
import { Section, Container } from '../../../components/layout/Section';
import { SectionHeader } from '../../../components/layout/SectionHeader';
import { Card } from '../../../components/common/Card';
import { ArrowRight } from '../../../components/ui/Icon';
import { caseStudies } from '../../../data/caseStudies';

/**
 * H8 — the home page's evidence: every case study as a moving band, the same
 * engine and direction as the client-logo marquee (.marquee / .marquee__track
 * in motion.css). It reads straight from data/caseStudies, so a new study
 * appears here with no edit, and it replaces the single featured study that
 * used to sit here.
 *
 * Three layers of motion, each doing a different job:
 *  - Entrance: the first time the band scrolls into view its cards arrive in
 *    a staggered sweep from the right, the direction the band then carries on.
 *  - Scroll drift: scrolling nudges the whole band along its own direction of
 *    travel (useDrift, the hero's scroll-parallax), so it moves with the page
 *    rather than playing in a box on it.
 *  - Hover: it eases to a stop and back — by ramping the running CSS
 *    animation's playbackRate, since animation-play-state cannot transition.
 */

// A half-track narrower than the viewport shows a gap before the loop point,
// so the list repeats until each half holds at least this many cards.
const MIN_CARDS_PER_HALF = 8;
// Constant reading speed, whatever the number of studies.
const SECONDS_PER_CARD = 9;
const BRAKE_MS = 520;
// Only the cards that can be on screen at entrance need a delay of their own.
const MAX_STAGGER_STEPS = 6;

const CASES = caseStudies.map((s) => ({
  slug: s.slug,
  category: s.categoryLabel,
  headline: s.mainResult ?? s.title,
  client: s.descriptor ? `${s.client} — ${s.descriptor}` : s.client,
  summary: s.summary,
}));

export function CaseStudyMarquee() {
  const reduced = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  // Negative: scrolling down pushes the band left, the way it already travels.
  const driftRef = useDrift<HTMLDivElement>(-56);
  const raf = useRef(0);
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);

  // `visible` tracks the viewport both ways (the shared .marquee rule parks
  // the loop off-screen); `entered` is one-shot, so the sweep plays once.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      setVisible(e.isIntersecting);
      if (e.intersectionRatio >= 0.25) setEntered(true);
    }, { threshold: [0, 0.25] });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  /** Ease the running loop's speed toward `target` (0 = stopped, 1 = normal). */
  const brakeTo = (target: number) => {
    const anim = trackRef.current?.getAnimations()
      .find((a) => (a as CSSAnimation).animationName === 'marquee');
    if (!anim) return;
    cancelAnimationFrame(raf.current);
    const from = anim.playbackRate;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / BRAKE_MS, 1);
      const eased = 1 - Math.pow(1 - t, 3);          // easeOutCubic
      anim.playbackRate = from + (target - from) * eased;
      if (t < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };

  // Keyboard focus stops it too; moving focus between cards keeps it stopped.
  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!viewportRef.current?.contains(e.relatedTarget as Node | null)) brakeTo(1);
  };

  const repeat = reduced ? 1 : Math.max(1, Math.ceil(MIN_CARDS_PER_HALF / CASES.length));
  const half = Array.from({ length: repeat }, () => CASES).flat();
  const track = reduced ? half : [...half, ...half];

  return (
    <Section surface="obsidian" className="cases-marquee" aria-labelledby="cases-marquee-title">
      <Container className="cases-marquee__head">
        <SectionHeader
          eyebrow="Case studies"
          headline={['Every result,', 'written up in full.']}
          id="cases-marquee-title"
        />
        <Reveal className="cases-marquee__more" delay={200}>
          <Link className="link" to="/results">See all results<ArrowRight /></Link>
        </Reveal>
      </Container>

      <div
        ref={viewportRef}
        className={`marquee cases-marquee__viewport${visible ? ' is-visible' : ''}${entered ? ' is-entered' : ''}`}
        onMouseEnter={() => brakeTo(0)} onMouseLeave={() => brakeTo(1)}
        onFocus={() => brakeTo(0)} onBlur={onBlur}
      >
        <div ref={driftRef} className="cases-marquee__drift">
          <ul
            ref={trackRef} className="marquee__track cases-marquee__track"
            style={{ ['--marquee-duration' as string]: `${half.length * SECONDS_PER_CARD}s` }}
          >
            {track.map((c, i) => {
              // Only the first copy of each study is announced and tabbable;
              // the rest exist purely to make the loop seamless.
              const echo = i >= CASES.length;
              const n = (i % CASES.length) + 1;
              return (
                <li
                  className="cases-marquee__item" key={`${c.slug}-${i}`} aria-hidden={echo || undefined}
                  style={{ ['--i' as string]: Math.min(i, MAX_STAGGER_STEPS) } as CSSProperties}
                >
                  <Card
                    as={Link} to={`/results/${c.slug}`} interactive
                    className="case-card cases-marquee__card" tabIndex={echo ? -1 : undefined}
                  >
                    <div className="cases-marquee__top">
                      <p className="card__eyebrow case-card__category">{c.category}</p>
                      <span className="card__meta cases-marquee__index" aria-hidden="true">
                        {String(n).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="card__accent cases-marquee__headline">{c.headline}</h3>
                    <span className="cases-marquee__rule" aria-hidden="true" />
                    <p className="heading-s case-card__client">{c.client}</p>
                    <p className="body-s cases-marquee__summary">{c.summary}</p>
                    <span className="link case-card__link">Read the case study<ArrowRight /></span>
                  </Card>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Section>
  );
}
