import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Fires once at 18% viewport entry (§6.2). Reveals never replay on scroll-back
 * — replaying makes a page feel restless.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(immediate = false) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();
  const [inView, setInView] = useState(reduced || immediate);

  useEffect(() => {
    if (reduced || immediate) { setInView(true); return; }
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) { setInView(true); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        setInView(true);
        io.unobserve(e.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -18% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, immediate]);

  return { ref, inView } as const;
}
