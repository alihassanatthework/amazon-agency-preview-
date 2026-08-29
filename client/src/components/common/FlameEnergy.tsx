import { useId } from 'react';

/**
 * The flame mark, isolated from `assets/logo/logo-full.svg` (its first path —
 * a gradient-filled shape, bounding box roughly 152×204, distinct from the six
 * solid-black wordmark paths that follow it in that file). Kept as vector data
 * here rather than a separate asset so the same path can drive the visible
 * silhouette, the liquid-fill clip and the dim base layer from one source —
 * they are guaranteed to align because they are the same path.
 */
const FLAME_D =
  'M88.3466 86.2467C101.55 93.1606 106.592 108.538 104.311 131.306C133.599 101.386 95.6685 79.2136 122.076 44.8825C121.836 93.0414 156.645 93.2798 151.964 141.439C148.243 167.545 134.799 187.094 110.072 198.896C151.244 158.724 138.4 118.194 124.476 93.0414C124.957 112.949 124.476 132.379 108.872 147.757C105.271 151.333 99.7497 151.81 95.5485 149.068C91.2273 146.207 89.5469 140.843 91.5874 136.075C95.5485 126.657 96.9889 117.955 95.9086 108.896C95.3085 110.922 94.7083 112.829 93.8681 114.618C87.7464 127.73 71.1819 132.379 58.8185 124.75C58.5785 124.631 58.4584 124.512 58.2184 124.392C50.5363 119.386 42.4941 108.896 51.3765 75.399C51.3765 75.399 15.2467 100.671 48.9759 163.492C51.8566 168.975 46.0951 174.935 40.5736 172.313L25.8096 165.041C29.6506 178.631 40.6936 191.743 54.8575 204.618C9.7252 191.863 -5.87904 161.108 1.92308 116.167C10.3254 128.922 19.4478 139.412 30.4908 144.538C-14.0413 83.3858 79.7042 58.8295 72.3822 0.538086C73.4625 1.25332 74.6628 2.08775 75.7431 2.80299C90.2671 12.8162 95.5485 31.7699 87.9865 47.7434L66.6207 93.7566C66.6207 93.7566 59.4187 109.611 74.9029 112.472C90.5072 115.452 93.3879 95.7831 88.3466 86.2467ZM76.1032 183.161C82.465 184.71 90.027 183.161 99.0295 178.631C93.508 186.618 85.9459 195.2 76.7034 204.26C105.991 192.935 124.957 172.79 124.836 136.075C115.594 158.128 99.2695 173.743 76.1032 183.161Z';

// The path's own bounding box (computed once, offline) — the widest point
// sits at the bottom of this range, which is where the fill begins.
const FLAME_BOTTOM = 204.7;
const FLAME_HEIGHT = 204.2;

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
    <svg className={className} viewBox="0 0 153 205" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
    <svg className={className} viewBox="0 0 153 205" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
          <rect x="-20" y={FLAME_BOTTOM - 1} width="193" height={FLAME_HEIGHT + 40} fill="#8AB04B" />

          {/* A soft highlight band right at the surface, breathing gently on
              its own short cycle — the "very subtle organic wave" the liquid
              surface needs without an actual animated wave path. */}
          <rect
            className="flame-fill__surface"
            x="-20" y={FLAME_BOTTOM - 6} width="193" height="10"
            fill="#ABC482" opacity=".55"
          />

          {/* The leading-edge dot — small and secondary, marking the level
              rather than driving the effect. */}
          <circle cx="76" cy={FLAME_BOTTOM} r="6" fill="#8AB04B" filter={`url(#${glowId})`} opacity=".7" />
          <circle cx="76" cy={FLAME_BOTTOM} r="2.4" fill="#D4E3B4" />
        </g>
      </g>
    </svg>
  );
}
