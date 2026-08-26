import { useEffect, useRef, useState } from 'react';
import { useReveal } from './useReveal';
import { useReducedMotion } from './useReducedMotion';

interface CountUpProps {
  to: number;
  decimals?: number;
  /** Thousands separators. */
  separator?: boolean;
  duration?: number;
  /** Static affixes — they never animate, only the numeral does. */
  prefix?: string;
  suffix?: string;
  className?: string;
  affixClassName?: string;
}

function format(value: number, decimals: number, separator: boolean) {
  const out = value.toFixed(decimals);
  if (!separator) return out;
  const [whole, frac] = out.split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return frac ? `${grouped}.${frac}` : grouped;
}

/**
 * Count-up — the numeral animates 0→target on motion-count; prefix and suffix
 * stay static. Single-fire.
 *
 * Width is reserved by rendering the final value as an inert spacer stacked
 * under the live one, so there is zero layout shift during the count and no
 * measurement pass is needed. Under reduced motion the final value is shown
 * immediately rather than omitted.
 */
export function CountUp({
  to,
  decimals = 0,
  separator = true,
  duration = 1800,
  prefix,
  suffix,
  className,
  affixClassName,
}: CountUpProps) {
  const reduced = useReducedMotion();
  const { ref, revealed } = useReveal<HTMLSpanElement>();
  const [value, setValue] = useState(reduced ? to : 0);
  const done = useRef(false);

  useEffect(() => {
    if (reduced) {
      setValue(to);
      return;
    }
    if (!revealed || done.current) return;
    done.current = true;

    let raf = 0;
    let start: number | null = null;

    const frame = (now: number) => {
      if (start === null) start = now;
      const t = Math.min((now - start) / duration, 1);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t); // easeOutExpo
      setValue(to * eased);
      if (t < 1) raf = requestAnimationFrame(frame);
      else setValue(to);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [revealed, reduced, to, duration]);

  const final = format(to, decimals, separator);

  return (
    <span ref={ref} className={className}>
      {prefix ? <span className={affixClassName}>{prefix}</span> : null}
      <span className="count" role="text" aria-label={`${prefix ?? ''}${final}${suffix ?? ''}`}>
        {/* Inert spacer holds the final width — zero layout shift. */}
        <span className="count__reserve" aria-hidden="true">
          {final}
        </span>
        <span className="count__value" aria-hidden="true">
          {format(value, decimals, separator)}
        </span>
      </span>
      {suffix ? <span className={affixClassName}>{suffix}</span> : null}
    </span>
  );
}
