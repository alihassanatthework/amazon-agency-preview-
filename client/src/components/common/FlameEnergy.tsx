import { useId } from 'react';

/**
 * The flame mark, isolated from `assets/logo/logo-full.svg` (its first path —
 * a gradient-filled shape, bounding box roughly 152×204, distinct from the six
 * solid-black wordmark paths that follow it in that file). Kept as vector data
 * here rather than a separate asset so the same path can drive both the
 * visible silhouette and the clip that constrains the animation to it.
 */
const FLAME_D =
  'M88.3466 86.2467C101.55 93.1606 106.592 108.538 104.311 131.306C133.599 101.386 95.6685 79.2136 122.076 44.8825C121.836 93.0414 156.645 93.2798 151.964 141.439C148.243 167.545 134.799 187.094 110.072 198.896C151.244 158.724 138.4 118.194 124.476 93.0414C124.957 112.949 124.476 132.379 108.872 147.757C105.271 151.333 99.7497 151.81 95.5485 149.068C91.2273 146.207 89.5469 140.843 91.5874 136.075C95.5485 126.657 96.9889 117.955 95.9086 108.896C95.3085 110.922 94.7083 112.829 93.8681 114.618C87.7464 127.73 71.1819 132.379 58.8185 124.75C58.5785 124.631 58.4584 124.512 58.2184 124.392C50.5363 119.386 42.4941 108.896 51.3765 75.399C51.3765 75.399 15.2467 100.671 48.9759 163.492C51.8566 168.975 46.0951 174.935 40.5736 172.313L25.8096 165.041C29.6506 178.631 40.6936 191.743 54.8575 204.618C9.7252 191.863 -5.87904 161.108 1.92308 116.167C10.3254 128.922 19.4478 139.412 30.4908 144.538C-14.0413 83.3858 79.7042 58.8295 72.3822 0.538086C73.4625 1.25332 74.6628 2.08775 75.7431 2.80299C90.2671 12.8162 95.5485 31.7699 87.9865 47.7434L66.6207 93.7566C66.6207 93.7566 59.4187 109.611 74.9029 112.472C90.5072 115.452 93.3879 95.7831 88.3466 86.2467ZM76.1032 183.161C82.465 184.71 90.027 183.161 99.0295 178.631C93.508 186.618 85.9459 195.2 76.7034 204.26C105.991 192.935 124.957 172.79 124.836 136.075C115.594 158.128 99.2695 173.743 76.1032 183.161Z';

// The path's own bounding box (computed once, offline) — the flame's tip
// sits at the top of this range, its widest point at the bottom.
const FLAME_TOP = 0.5;
const FLAME_BOTTOM = 204.7;
const FLAME_HEIGHT = FLAME_BOTTOM - FLAME_TOP;

/**
 * A small glowing dot travels up through the existing hero flame watermark,
 * leaving a green fill behind it, then fades and resets to loop. Purely
 * decorative and ambient — distinct from the header/footer logo, whose flame
 * keeps its single load-time shimmer and never loops (§6.4).
 *
 * The fill and the dot are one <g> translated by CSS transform and clipped to
 * the flame's own path, so the wave can never draw outside the silhouette.
 * Transform and opacity are the only animated properties, and the global
 * `prefers-reduced-motion` rule in motion.css already collapses this
 * animation to its resting frame — a static flame, exactly as before.
 */
export function FlameEnergy({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, '');
  const clipId = `flame-clip-${uid}`;
  const baseId = `flame-base-${uid}`;
  const waveId = `flame-wave-${uid}`;
  const glowId = `flame-glow-${uid}`;

  return (
    <svg
      className={['flame-energy', className].filter(Boolean).join(' ')}
      viewBox="0 0 153 205"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* The flame's own resting gradient — sage at the tip, lime toward
            the base — identical in character to the static logo mark. */}
        <linearGradient id={baseId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5C8A7E" />
          <stop offset="45%" stopColor="#8DB44D" />
          <stop offset="75%" stopColor="#617C36" />
          <stop offset="100%" stopColor="#26574B" />
        </linearGradient>

        {/* The rising wave: solid energy behind the dot, softening to
            transparent at its leading edge so the front reads as a wave
            rather than a hard fill line. */}
        <linearGradient id={waveId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8AB04B" stopOpacity="0" />
          <stop offset="22%" stopColor="#8AB04B" stopOpacity=".9" />
          <stop offset="100%" stopColor="#ABC482" stopOpacity="1" />
        </linearGradient>

        <filter id={glowId} x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>

        <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
          <path d={FLAME_D} />
        </clipPath>
      </defs>

      {/* The silhouette, unchanged from the current watermark's appearance. */}
      <path d={FLAME_D} fill={`url(#${baseId})`} />

      {/* The energy — clipped precisely to the flame, never able to draw
          outside it regardless of how far the wave has risen. */}
      <g clipPath={`url(#${clipId})`}>
        <g className="flame-energy__runner">
          <rect
            x="-20" y={FLAME_BOTTOM - 1} width="193" height={FLAME_HEIGHT + 40}
            fill={`url(#${waveId})`}
          />
          <circle
            cx="76" cy={FLAME_BOTTOM} r="10"
            fill="#8AB04B" filter={`url(#${glowId})`} opacity=".85"
          />
          <circle cx="76" cy={FLAME_BOTTOM} r="3.4" fill="#D4E3B4" />
        </g>
      </g>
    </svg>
  );
}
