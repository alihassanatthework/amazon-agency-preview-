import { useEffect, useMemo, useRef, useState } from 'react';
import { Reveal, useReducedMotion } from '../../motion';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'apparel', label: 'Apparel' },
  { id: 'beauty', label: 'Beauty' },
  { id: 'food', label: 'Food & beverage' },
] as const;

const LOGOS = [
  { name: 'Lumière', category: 'beauty' },
  { name: 'NORTHSIDE', category: 'apparel' },
  { name: 'Verdant', category: 'food' },
  { name: 'Aeris', category: 'beauty' },
  { name: 'Halden & Co', category: 'apparel' },
  { name: 'Copperfield', category: 'food' },
  { name: 'Sable', category: 'beauty' },
  { name: 'Meridian', category: 'apparel' },
  { name: 'Harvestly', category: 'food' },
  { name: 'Osmé', category: 'beauty' },
] as const;

/**
 * H2 — Client logo band. Immediate borrowed credibility, deliberately quiet:
 * this is the lowest-contrast section on the page and must not compete with
 * H1 or H3.
 *
 * The track is duplicated so the loop is seamless with no seam jump. Under
 * reduced motion the marquee becomes a static wrapped grid — the animation is
 * removed, not merely paused.
 */
export function LogoBand() {
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState<string>('all');
  const [slow, setSlow] = useState(false);
  const [visibleOnScreen, setVisibleOnScreen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  /* Off-screen work pauses — the marquee suspends when the band leaves view. */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisibleOnScreen(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const visible = useMemo(
    () => (filter === 'all' ? LOGOS : LOGOS.filter((l) => l.category === filter)),
    [filter],
  );

  // Duplicating the visible set keeps the track full after a filter narrows it,
  // so no gap appears mid-cycle.
  const repeats = reduced ? 1 : Math.max(2, Math.ceil(10 / visible.length) * 2);
  const track = Array.from({ length: repeats }, () => visible).flat();

  return (
    <section
      ref={sectionRef}
      className={`section section--quiet logos bg-white${visibleOnScreen ? ' is-visible' : ''}`}
      aria-label="Client brands"
      data-bg="white"
    >
      <div className="container">
        <Reveal>
          <p className="caption logos__caption">
            Trusted by category-leading DTC and CPG brands
          </p>

          <div className="logos__filters" role="group" aria-label="Filter logos by category">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                className="pill"
                type="button"
                aria-pressed={filter === c.id}
                onClick={() => setFilter(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      <div
        className="logos__viewport"
        onMouseEnter={() => setSlow(true)}
        onMouseLeave={() => setSlow(false)}
      >
        {/* Cross-fades on filter change; the key restarts the cycle cleanly. */}
        <div
          key={filter}
          className={`logos__track${slow ? ' is-slow' : ''}`}
          style={{ ['--marquee-items' as string]: String(track.length) }}
        >
          {track.map((logo, i) => (
            <span
              className="logos__item"
              key={`${logo.name}-${i}`}
              aria-hidden={i >= visible.length ? true : undefined}
            >
              {logo.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
