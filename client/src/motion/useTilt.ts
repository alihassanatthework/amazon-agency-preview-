import { useCallback, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface TiltOptions {
  /** Maximum rotation in degrees. Kept small so the interaction stays subtle. */
  max?: number;
  scale?: number;
}

/**
 * Subtle, pointer-driven card tilt. Mouse-only (pointerType check) and
 * disabled under prefers-reduced-motion, so it never sticks after a tap on
 * touch devices and never fights accessibility preferences.
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>({ max = 6, scale = 1.015 }: TiltOptions = {}) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();
  const [style, setStyle] = useState<CSSProperties>({});

  const onPointerMove = useCallback((e: PointerEvent) => {
    if (reduced || e.pointerType !== 'mouse') return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 2 * max;
    const rotateX = (0.5 - py) * 2 * max;
    setStyle({
      transform: `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`,
    });
  }, [reduced, max, scale]);

  const onPointerLeave = useCallback(() => {
    if (reduced) return;
    setStyle({});
  }, [reduced]);

  return { ref, style, onPointerMove, onPointerLeave };
}
