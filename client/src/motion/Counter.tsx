import { useEffect, useRef, useState } from 'react';
import { useInView } from './useInView';
import { useReducedMotion } from './useReducedMotion';

interface Props {
  to: number | null;
  /** For values that are not numerically countable, e.g. "1 yr 7 mo". */
  displayValue?: string | null;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
  affixClassName?: string;
}

const fmt = (v: number, d: number) =>
  v.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/**
 * Count-up — numeral animates 0→target, prefix and suffix stay static, width
 * reserved with tabular figures so there is zero layout shift. Single-fire.
 */
export function Counter({
  to, displayValue, prefix, suffix, decimals = 0,
  duration = 2000, className, affixClassName,
}: Props) {
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [value, setValue] = useState(reduced || to === null ? (to ?? 0) : 0);
  const done = useRef(false);

  useEffect(() => {
    if (to === null) return;
    if (reduced) { setValue(to); return; }
    if (!inView || done.current) return;
    done.current = true;
    let raf = 0, start: number | null = null;
    const frame = (now: number) => {
      if (start === null) start = now;
      const t = Math.min((now - start) / duration, 1);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);   // easeOutExpo
      setValue(to * eased);
      if (t < 1) raf = requestAnimationFrame(frame); else setValue(to);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, to, duration]);

  // §9.5 — a non-countable value renders as a static display value with a
  // fade-in rather than a broken counter.
  // A value like "1 yr 7 mo" is not numerically countable, so it renders as a
  // static string. It also carries far more glyphs than a two-digit numeral,
  // so it is set a step down to sit on one line beside the counted cells.
  if (displayValue) {
    return <span ref={ref} className={[className, 'count--text'].filter(Boolean).join(' ')}>{displayValue}</span>;
  }

  const final = fmt(to ?? 0, decimals);
  return (
    <span ref={ref} className={className}>
      {prefix ? <span className={affixClassName}>{prefix}</span> : null}
      <span className="visually-hidden">{final}</span>
      <span className="count" aria-hidden="true">
        <span className="count__reserve">{final}</span>
        <span className="count__value">{fmt(value, decimals)}</span>
      </span>
      {suffix ? <span className={affixClassName}>{suffix}</span> : null}
    </span>
  );
}
