import { useCallback, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from './useMediaQuery';
import { useReducedMotion } from './useReducedMotion';

interface TiltOptions {
  /** Maximum rotation on each axis, in degrees. Kept small on purpose. */
  max?: number;
  /** Additional depth applied to layers marked with --depth. */
  depth?: number;
}

/**
 * A restrained pointer-driven tilt. The composition rotates a few degrees
 * toward the cursor and its layers separate along Z, which reads as physical
 * depth rather than as an effect.
 *
 * Pointer-fine devices only, and never under reduced motion — a tilt is a
 * hover treatment, and hover treatments must not stick after a tap.
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>({
  max = 4,
  depth = 1,
}: TiltOptions = {}) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)');
  const active = fine && !reduced;

  const [tilt, setTilt] = useState({ x: 0, y: 0, engaged: false });

  const onMove = useCallback(
    (e: React.PointerEvent) => {
      if (!active) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({ x: -py * max * 2, y: px * max * 2, engaged: true });
    },
    [active, max],
  );

  const onLeave = useCallback(() => setTilt({ x: 0, y: 0, engaged: false }), []);

  useEffect(() => {
    if (!active) setTilt({ x: 0, y: 0, engaged: false });
  }, [active]);

  const style = {
    ['--tilt-x' as string]: `${tilt.x.toFixed(2)}deg`,
    ['--tilt-y' as string]: `${tilt.y.toFixed(2)}deg`,
    ['--tilt-depth' as string]: String(depth),
    // Tracking is immediate; releasing settles back over motion-base.
    ['--tilt-ease' as string]: tilt.engaged
      ? 'var(--motion-instant) var(--ease-instant)'
      : 'var(--motion-base) var(--ease-base)',
  } as React.CSSProperties;

  return { ref, style, onPointerMove: onMove, onPointerLeave: onLeave, active } as const;
}
