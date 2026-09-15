import { useEffect, useRef, useState } from 'react';
import type { FocusEvent } from 'react';
import { Link } from 'react-router-dom';
import { Reveal, useReducedMotion } from '../../../motion';
import { Section, Container } from '../../../components/layout/Section';
import { SectionHeader } from '../../../components/layout/SectionHeader';
import { Card } from '../../../components/common/Card';
import { ArrowRight } from '../../../components/ui/Icon';
import { caseStudies } from '../../../data/caseStudies';

/**
 * H8b — every case study as a moving band, the same engine and direction as
 * the client-logo marquee (.marquee / .marquee__track in motion.css). Reads
 * straight from data/caseStudies, so a new study appears here with no edit.
 *
 * The logo band only slows on hover. This one stops, because these cards are
 * meant to be read and clicked — and it eases to a stop rather than snapping,
 * by ramping the running CSS animation's playbackRate instead of toggling
 * animation-play-state, which has no transition.
 */

// A half-track narrower than the viewport shows a gap before the loop point,
// so the list is repeated until each half holds at least this many cards
// (8 x 412px covers screens past 3000px wide).
const MIN_CARDS_PER_HALF = 8;
// Constant reading speed whatever the number of studies.
const SECONDS_PER_CARD = 9;
const BRAKE_MS = 520;

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
  const raf = useRef(0);
  const [visible, setVisible] = useState(false);

  // Off-screen, the shared .marquee rule parks the track at play-state paused.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  /** Ease the running animation's speed toward `target` (0 = stopped, 1 = normal). */
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

  // Keyboard users get the same stop; moving focus between cards keeps it stopped.
  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!viewportRef.current?.contains(e.relatedTarget as Node | null)) brakeTo(1);
  };

  const repeat = reduced ? 1 : Math.max(1, Math.ceil(MIN_CARDS_PER_HALF / CASES.length));
  const half = Array.from({ length: repeat }, () => CASES).flat();
  const track = reduced ? half : [...half, ...half];

  return (
    <Section surface="obsidian" className="cases-marquee" aria-labelledby="cases-marquee-title">
      <Container>
        <SectionHeader
          eyebrow="All case studies"
          headline={['Every result,', 'written up in full.']}
          id="cases-marquee-title"
        />
      </Container>

      <div
        ref={viewportRef}
        className={`marquee cases-marquee__viewport${visible ? ' is-visible' : ''}`}
        onMouseEnter={() => brakeTo(0)} onMouseLeave={() => brakeTo(1)}
        onFocus={() => brakeTo(0)} onBlur={onBlur}
      >
        <ul
          ref={trackRef} className="marquee__track cases-marquee__track"
          style={{ ['--marquee-duration' as string]: `${half.length * SECONDS_PER_CARD}s` }}
        >
          {track.map((c, i) => {
            // Only the first copy of each study is announced and tabbable; the
            // rest exist purely to make the loop seamless.
            const echo = i >= CASES.length;
            return (
              <li className="cases-marquee__item" key={`${c.slug}-${i}`} aria-hidden={echo || undefined}>
                <Card
                  as={Link} to={`/results/${c.slug}`} interactive
                  className="case-card cases-marquee__card" tabIndex={echo ? -1 : undefined}
                >
                  <p className="card__eyebrow case-card__category">{c.category}</p>
                  <h3 className="card__accent cases-marquee__headline">{c.headline}</h3>
                  <p className="heading-s case-card__client">{c.client}</p>
                  <p className="body-s cases-marquee__summary">{c.summary}</p>
                  <span className="link case-card__link">Read the case study<ArrowRight /></span>
                </Card>
              </li>
            );
          })}
        </ul>
      </div>

      <Container>
        <Reveal className="cases-marquee__more">
          <Link className="link" to="/results">See all results<ArrowRight /></Link>
        </Reveal>
      </Container>
    </Section>
  );
}
