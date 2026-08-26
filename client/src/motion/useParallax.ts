import { useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Parallax-soft — the element translates within its own section, capped at
 * 60px total displacement. Disabled below 768px (imperceptible at that width,
 * and its cost is not) and under reduced motion. Off-screen work pauses.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(amount = 40) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const clear = () => el.style.setProperty('--parallax', '0px');

    if (reduced) {
      clear();
      return;
    }

    const wide = window.matchMedia('(min-width: 768px)');
    const capped = Math.min(Math.abs(amount), 60) * (amount < 0 ? -1 : 1);

    let visible = false;
    let ticking = false;

    const update = () => {
      ticking = false;
      if (!visible || !wide.matches) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = (vh - rect.top) / (vh + rect.height); // 0 → 1
      const offset = (progress - 0.5) * 2 * capped;
      el.style.setProperty('--parallax', `${offset.toFixed(2)}px`);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) update();
      },
      { rootMargin: '10% 0px' },
    );
    io.observe(el);

    const onBreakpoint = () => {
      if (!wide.matches) clear();
      else update();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    wide.addEventListener('change', onBreakpoint);
    onBreakpoint();

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      wide.removeEventListener('change', onBreakpoint);
    };
  }, [amount, reduced]);

  return ref;
}
