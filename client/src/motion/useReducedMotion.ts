import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Phase 03 — reduced motion is a first-class rendering path, not a fallback.
 * Every motion primitive reads this and renders its finished state when true.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(QUERY).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    setReduced(mq.matches);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

/**
 * Adds `motion-on` to <html> only when motion is permitted. The CSS initial
 * (hidden) states are scoped to that class, so with motion off nothing is ever
 * hidden and the page renders complete.
 */
export function useMotionRoot(): boolean {
  const reduced = useReducedMotion();

  useEffect(() => {
    document.documentElement.classList.toggle('motion-on', !reduced);
  }, [reduced]);

  return !reduced;
}
