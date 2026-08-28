import { useEffect, useState } from 'react';

const Q = '(prefers-reduced-motion: reduce)';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(Q).matches);
  useEffect(() => {
    const mq = window.matchMedia(Q);
    const on = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', on);
    setReduced(mq.matches);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

/** Adds `motion-on` to <html> only when motion is permitted. */
export function useMotionRoot(): boolean {
  const reduced = useReducedMotion();
  useEffect(() => {
    document.documentElement.classList.toggle('motion-on', !reduced);
  }, [reduced]);
  return !reduced;
}
