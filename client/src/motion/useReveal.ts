import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface RevealOptions {
  /** Trigger at 20% viewport entry, matching the scroll-reveal grammar. */
  rootMargin?: string;
  /** Skip observation entirely and render revealed (used by entrance sequences). */
  immediate?: boolean;
}

/**
 * The reveal observer. Fires once — reveals never replay on upward scroll,
 * because replaying makes a page feel restless.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  { rootMargin = '0px 0px -20% 0px', immediate = false }: RevealOptions = {},
) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();
  const [revealed, setRevealed] = useState(reduced || immediate);

  useEffect(() => {
    if (reduced || immediate) {
      setRevealed(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      setRevealed(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setRevealed(true);
          io.unobserve(entry.target); // single-fire
        });
      },
      { threshold: 0, rootMargin },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [reduced, immediate, rootMargin]);

  return { ref, revealed } as const;
}
