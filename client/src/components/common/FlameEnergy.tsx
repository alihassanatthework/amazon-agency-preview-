import { useId } from 'react';
import { MARK_PATHS, MARK_SCALE } from './logoMark';

/**
 * The shape the hero animation fills: the complete BLAZON mark — the B with
 * the flame/leaf wrapped around it — not the B alone it used to be.
 *
 * The geometry is the logo's own, lifted verbatim from logo-full.svg (see
 * logoMark.ts). Nothing here is traced, approximated or redrawn, and the
 * transform only scales the mark's native coordinates into the 573x814 space
 * this animation already worked in, so every constant below and every
 * keyframe in pages.css is untouched.
 */
function MarkPaths() {
  return (
    <g transform={`scale(${MARK_SCALE})`}>
      {MARK_PATHS.map((d, i) => <path key={i} d={d} />)}
    </g>
  );
}

// Unchanged: the fill's rest position and travel, in the same 573×814 space.
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
      <g fill={`url(#${gradId})`}><MarkPaths /></g>
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
          <MarkPaths />
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
