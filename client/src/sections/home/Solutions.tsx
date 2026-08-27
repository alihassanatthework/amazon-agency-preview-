import { useEffect, useRef, useState } from 'react';
import { CountUp, RevealGroup, useMediaQuery, useReducedMotion } from '../../motion';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { STAGES, type StageKey } from './SolutionStages';

interface Solution {
  index: string;
  title: string;
  description: string;
  metrics: { to: number; suffix?: string; prefix?: string; label: string }[];
  /** Which built interface panel this solution shows. */
  stage: StageKey;
}

const SOLUTIONS: Solution[] = [
  {
    index: '01',
    title: 'Advertising',
    description:
      'PPC and DSP run against contribution margin, including programmatic competitive targeting rather than branded search alone.',
    metrics: [
      { to: 42, suffix: '%', label: 'Avg. ad revenue lift' },
      { to: 11, suffix: '%', label: 'Median TACoS' },
    ],
    stage: 'ads',
  },
  {
    index: '02',
    title: 'Account management',
    description:
      'Seller and Vendor Central operations, inventory, pricing and case handling, owned end to end by a named strategist.',
    metrics: [
      { to: 98, suffix: '%', label: 'In-stock rate' },
      { to: 4, suffix: 'd', label: 'Avg. case resolution' },
    ],
    stage: 'ops',
  },
  {
    index: '03',
    title: 'Listing and catalogue',
    description:
      'Content, imagery, A+ and variation architecture built for conversion, not for a content checklist.',
    metrics: [
      { to: 47, suffix: '%', label: 'Sales per visitor' },
      { to: 320, label: 'ASINs rebuilt' },
    ],
    stage: 'catalogue',
  },
  {
    index: '04',
    title: 'Setup and onboarding',
    description:
      'Brand registry, catalogue establishment and the account infrastructure that everything after it depends on.',
    metrics: [
      { to: 21, suffix: 'd', label: 'Avg. time to live' },
      { to: 100, suffix: '%', label: 'Registry approval' },
    ],
    stage: 'setup',
  },
];

/**
 * H4 — Solutions. The method: an integrated system, not a list of services.
 *
 * The section pins for a bounded 300vh while the reader steps through one
 * panel at a time. Only one entry is legible at full strength at any moment,
 * which is what communicates a system being stepped through rather than a
 * grid being scanned.
 *
 * On mobile the pin is removed entirely and the four solutions become stacked
 * cards. That is a recomposition, not a shrink — scroll-driven pinning on
 * touch fights the platform's native scroll.
 */
export function Solutions() {
  const reduced = useReducedMotion();
  /* The pin is a desktop affordance. Below 768px it is removed entirely and
     the section recomposes into stacked cards. */
  const isMobile = useMediaQuery('(max-width: 767px)');
  const stacked = reduced || isMobile;
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (stacked) return;

    let ticking = false;

    const update = () => {
      ticking = false;
      const el = sectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollable = rect.height - vh;
      if (scrollable <= 0) return;

      const travelled = Math.min(Math.max(-rect.top, 0), scrollable);
      const p = travelled / scrollable;

      setPinned(rect.top <= 0 && rect.bottom >= vh);
      setProgress(p);

      // The pin releases exactly as the fourth panel completes.
      const step = Math.min(SOLUTIONS.length - 1, Math.floor(p * SOLUTIONS.length));
      setActive(step);
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
  }, [stacked]);

  /* Index entries jump the scroll position to that step. */
  const jumpTo = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const scrollable = el.offsetHeight - window.innerHeight;
    if (scrollable <= 0) {
      setActive(i);
      return;
    }
    const target =
      el.offsetTop + scrollable * ((i + 0.5) / SOLUTIONS.length);
    window.scrollTo({ top: target, behavior: reduced ? 'auto' : 'smooth' });
  };

  const header = (
    <SectionHeader
      eyebrow="Solutions"
      headline={['Four functions,', 'one operating system.']}
      id="solutions-title"
      variant="split"
    />
  );

  /* --- Stacked recomposition: mobile and reduced motion ------------------ */
  if (stacked) {
    return (
      <section className="section solutions bg-canvas" id="solutions" aria-labelledby="solutions-title" data-bg="canvas">
        <div className="container">
          {header}
          <RevealGroup className="solutions__stack">
            {SOLUTIONS.map((s) => (
              <article className="solutions__card card" key={s.index}>
                <SolutionStage stage={s.stage} title={s.title} />
                <p className="solutions__index">{s.index}</p>
                <h3 className="heading-s">{s.title}</h3>
                <p className="body-s solutions__desc">{s.description}</p>
                <SolutionMetrics metrics={s.metrics} animate={false} />
              </article>
            ))}
          </RevealGroup>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className={`solutions solutions--pinned bg-canvas${pinned ? ' is-pinned' : ''}`}
      id="solutions"
      aria-labelledby="solutions-title"
      data-bg="canvas"
    >
      <div className="solutions__viewport">
        <div className="container solutions__inner">
          {header}

          <div className="solutions__grid">
            {/* Left: sticky index list, columns 1–5 */}
            <div className="solutions__index-col">
              <div className="solutions__rail" aria-hidden="true">
                <span
                  className="solutions__rail-fill"
                  style={{ transform: `scaleY(${progress})` }}
                />
              </div>

              <ol className="solutions__list">
                {SOLUTIONS.map((s, i) => (
                  <li key={s.index}>
                    <button
                      type="button"
                      className={`solutions__entry${i === active ? ' is-active' : ''}`}
                      onClick={() => jumpTo(i)}
                      aria-current={i === active ? 'step' : undefined}
                    >
                      <span className="solutions__entry-index">{s.index}</span>
                      <span className="heading-s">{s.title}</span>
                    </button>
                  </li>
                ))}
              </ol>

              <div className="solutions__detail" key={active}>
                <p className="body solutions__desc">{SOLUTIONS[active].description}</p>
                <SolutionMetrics metrics={SOLUTIONS[active].metrics} animate />
              </div>
            </div>

            {/* Right: stacked visual stage, one panel active at a time */}
            <div className="solutions__stage" aria-hidden="true">
              {SOLUTIONS.map((s, i) => (
                <div
                  className={`solutions__panel${i === active ? ' is-active' : ''}${
                    i < active ? ' is-past' : ''
                  }`}
                  key={s.index}
                >
                  <SolutionStage stage={s.stage} title={s.title} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SolutionMetrics({
  metrics,
  animate,
}: {
  metrics: Solution['metrics'];
  animate: boolean;
}) {
  return (
    <dl className="solutions__metrics">
      {metrics.map((m) => (
        <div key={m.label}>
          <dt className="caption">{m.label}</dt>
          <dd className="solutions__metric-value">
            {animate ? (
              <CountUp to={m.to} prefix={m.prefix} suffix={m.suffix} duration={900} />
            ) : (
              `${m.prefix ?? ''}${m.to}${m.suffix ?? ''}`
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Each solution shows its own built interface panel. */
function SolutionStage({ stage, title }: { stage: StageKey; title: string }) {
  const Stage = STAGES[stage];
  return (
    <div className="stage-wrap" role="img" aria-label={`${title} — interface preview`}>
      <Stage />
    </div>
  );
}
