import { useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Drift — translates at 0.88x or 1.12x scroll rate within its own section, to
 * a maximum of 64px. Disabled below 768px and under reduced motion; suspends
 * when off-screen.
 */
export function useDrift<T extends HTMLElement = HTMLDivElement>(amount = 40) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const clear = () => el.style.setProperty('--drift', '0px');
    if (reduced) { clear(); return; }

    const wide = window.matchMedia('(min-width: 768px)');
    const capped = Math.min(Math.abs(amount), 64) * (amount < 0 ? -1 : 1);
    let visible = false, ticking = false;

    const update = () => {
      ticking = false;
      if (!visible || !wide.matches) return;
      const r = el.getBoundingClientRect();
      const p = (window.innerHeight - r.top) / (window.innerHeight + r.height);
      el.style.setProperty('--drift', `${((p - 0.5) * 2 * capped).toFixed(2)}px`);
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) update(); }, { rootMargin: '10% 0px' });
    io.observe(el);
    const onBp = () => (wide.matches ? update() : clear());
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    wide.addEventListener('change', onBp);
    onBp();
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      wide.removeEventListener('change', onBp);
    };
  }, [amount, reduced]);

  return ref;
}
