import { useId } from 'react';

/**
 * Authentic flame + B shape from Asset 3.svg (cls-9 path).
 * This is the EXACT flame + B design from the Blazon logo reference.
 * The B is surrounded by the flowing flame curves with gradient from yellow to green.
 */
const FLAME_D =
  'm476.26,445.77c-8.24-1.92-16.54-3.48-27.31-5.71,15.75-6.78,29.79-11.23,41.32-20.39,36.29-28.84,45.44-67.54,36.68-110.6-3.62-17.81-11.64-34.7-24.38-47.79-7.59-7.8-16.87-13.85-26.75-18.36-12.03-5.49-24.96-8.78-37.98-11.15-10.31-1.88-20.73-3.19-31.19-3.73-10.31-.53-20.61.08-30.89.09-2.36,0-4.71,0-7.07,0h-203.34c-3.94,0-7.9.06-11.84.31-.24.03-.46.03-.67.09,1.65,3.69,3.39,7.32,5.28,10.93,1.77.27,3.54.55,5.31.89,34.21,6.68,50.02,22.1,53.93,56.37.43,3.81.79,7.6,1.1,11.42.64,7.6,1.04,15.23,1.28,22.83,1.1,33.91-.95,67.94-.15,101.87.15,6.87-3.11,7.23-8.94,6.87-2.14-.15-4.27-.27-6.44-.4,15.14,12.97,30.43,25.79,45.23,38.79.58.52,1.16,1.01,1.74,1.56-.24-27.28.82-54.48,3.78-81.58,1.22-.09,2.44-.18,3.66-.24,1.13,13.06,2.81,26.12,3.24,39.22.61,17.52.46,35.07.46,52.62,11.87,10.89,23.53,22.34,34.7,34.27,0-18.8-.12-37.6-.34-56.43-.09-9.64,2.65-13.49,12.7-13,12.27.61,24.57.4,36.84.31h1.71c2.23-.03,4.46-.03,6.68-.03,12.15.03,24.29.4,36.41,2.01,59.91,8,90.37,37.91,96.26,104.84,3.14,35.46-5.37,67.42-32.5,92.63-10.81,10.02-25.24,17.93-40.94,22.22-3.77,1.03-7.58,1.92-11.46,2.5,0,0-7.62,18.9-10.18,24.18.66-1.13,2.1-3.09,4.73-4.67.36-.22.73-.43,1.11-.62.01,0,.03-.01.04-.02.49-.24.98-.46,1.51-.65,2.69-.99,6.22-1.49,10.79-.91h.3c19.86,0,39.61-2.01,59.34-4.4,53.07-6.44,91.19-41.48,100.78-93.73,11.35-61.99-16.69-134.41-94.52-152.38Zm-113.75-7.08s-38.45,8.42-52.67,2.56c0,0,.76,0,2.03-.05-12.68-.36-15.01-8.6-15.01-31.07v-76.6c.03-26.64.27-53.26-.15-79.87-.15-9.09,2.44-12.6,12.06-12.42,24.45.52,48.95-.49,73.12,4.7,11.54,2.46,20.58,7.13,27.32,14.46l-.02-.03s9.38,6.49,19.21,21.51c-.01-.04-.02-.08-.03-.12,5.3,7.55,9.51,16.16,12.6,25.35.06.17.13.32.19.49l-.04-.06c17.48,52.75-2.82,124.82-78.61,131.15Z';

// Actual bounding box from Asset 3.svg: 573.2×813.52
const FLAME_BOTTOM = 697;
const FLAME_HEIGHT = 813;

/**
 * The flame at its normal resting appearance — unchanged from what shipped
 * originally. Sits inside `.hero__watermark`, which still carries the
 * design system's 4% opacity (§9.3: "a single flame-mark watermark at 4%
 * opacity"). This is the "unfilled" state the liquid layer sits on top of.
 */
export function FlameBase({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, '');
  const gradId = `flame-base-${uid}`;
  return (
    <svg className={className} viewBox="0 0 573 814" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5C8A7E" />
          <stop offset="45%" stopColor="#8DB44D" />
          <stop offset="75%" stopColor="#617C36" />
          <stop offset="100%" stopColor="#26574B" />
        </linearGradient>
      </defs>
      <path d={FLAME_D} fill={`url(#${gradId})`} />
    </svg>
  );
}

/**
 * The liquid-fill layer. A container being filled from the bottom, not a
 * particle trail: everything below the current level is solid, clipped
 * exactly to the flame silhouette; only a small dot marks the surface.
 *
 * Deliberately rendered OUTSIDE `.hero__watermark`'s 4% opacity — no fill
 * color, however saturated, can read as "bright" nested under an ancestor
 * fixed at 4%. This layer carries its own opacity, peaking well above that
 * so the fill is unmistakable, while `.hero__flame-wrap` keeps both layers
 * pinned to the same position and scroll-drift as one unit.
 *
 * Fill colour is `--lime-500` (#8AB04B) — the exact token the primary CTA
 * button uses, not a muted variant tuned to blend with the flame's own
 * gradient the way the base layer's tones are.
 */
export function FlameLiquidFill({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, '');
  const clipId = `flame-clip-${uid}`;
  const glowId = `flame-glow-${uid}`;

  return (
    <svg className={className} viewBox="0 0 573 814" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <filter id={glowId} x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
        <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
          <path d={FLAME_D} />
        </clipPath>
      </defs>

      {/* Everything below the current level, clipped to the flame. A solid
          block, not a long fade — the fade-to-transparent version was the
          bug: it read as a moving glow rather than a filled region. */}
      <g clipPath={`url(#${clipId})`}>
        <g className="flame-fill__runner">
          <rect x="-50" y={FLAME_BOTTOM - 1} width="700" height={FLAME_HEIGHT + 120} fill="#8AB04B" />

          {/* A soft highlight band right at the surface, breathing gently on
              its own short cycle — the "very subtle organic wave" the liquid
              surface needs without an actual animated wave path. */}
          <rect
            className="flame-fill__surface"
            x="-50" y={FLAME_BOTTOM - 6} width="700" height="24"
            fill="#ABC482" opacity=".55"
          />

          {/* The leading-edge dot — small and secondary, marking the level
              rather than driving the effect. */}
          <circle cx="286" cy={FLAME_BOTTOM} r="14" fill="#8AB04B" filter={`url(#${glowId})`} opacity=".7" />
          <circle cx="286" cy={FLAME_BOTTOM} r="5.6" fill="#D4E3B4" />
        </g>
      </g>
    </svg>
  );
}
