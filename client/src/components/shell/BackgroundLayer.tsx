import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../motion';

/**
 * SECTION 08 — section-to-section transition choreography.
 *
 * Implementation note from the roadmap: all colour crossfades run on a single
 * fixed background layer whose value is interpolated from scroll progress, not
 * on per-section background properties. Animating a section's own background
 * produces a visible seam at the boundary; interpolating one shared layer
 * beneath the content does not.
 *
 * Each section declares `data-bg`. This layer paints a vertical gradient whose
 * stops are the on-screen section boundaries, softened over an overlap zone so
 * every boundary is a crossfade rather than a hard edge.
 */

/** Token names, resolved from the token layer so there is one source of truth. */
const BG_TOKENS: Record<string, string> = {
  white: '--white',
  canvas: '--canvas',
  'canvas-deep': '--canvas-deep',
  ink: '--ink-deep',
};

function readPalette(): Record<string, string> {
  const styles = getComputedStyle(document.documentElement);
  return Object.fromEntries(
    Object.entries(BG_TOKENS).map(([key, token]) => [
      key,
      styles.getPropertyValue(token).trim(),
    ]),
  );
}

/** Light-to-dark resolves get a wider overlap than light-to-light ones. */
function overlapFor(from: string, to: string) {
  const darkInvolved = from === 'ink' || to === 'ink';
  if (from === 'canvas' && to === 'ink') return 160; // H10 → H11 / C5 → C6
  return darkInvolved ? 120 : 96;
}

export function BackgroundLayer() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const layer = ref.current;
    if (!layer) return;

    document.documentElement.classList.add('has-bg-layer');

    let ticking = false;
    let sections: HTMLElement[] = [];
    let COLOURS = readPalette();

    const collect = () => {
      sections = Array.from(document.querySelectorAll<HTMLElement>('[data-bg]'));
    };

    const paint = () => {
      ticking = false;
      if (!sections.length) return;

      const vh = window.innerHeight;
      // A collapsed or not-yet-measured viewport would degenerate the gradient
      // into a single hard stop; leave the last good paint in place instead.
      if (vh <= 0) return;
      const stops: string[] = [];
      let previousKey = sections[0].dataset.bg ?? 'canvas';

      stops.push(`${COLOURS[previousKey]} 0px`);

      for (const section of sections) {
        const key = section.dataset.bg ?? 'canvas';
        const top = section.getBoundingClientRect().top;

        // Only boundaries near or inside the viewport affect what is painted.
        if (top > vh + 200 || top < -200) {
          previousKey = key;
          continue;
        }

        const overlap = overlapFor(previousKey, key);
        const start = Math.round(top - overlap / 2);
        const end = Math.round(top + overlap / 2);

        stops.push(`${COLOURS[previousKey]} ${start}px`, `${COLOURS[key]} ${end}px`);
        previousKey = key;
      }

      stops.push(`${COLOURS[previousKey]} ${vh}px`);
      layer.style.backgroundImage = `linear-gradient(to bottom, ${stops.join(', ')})`;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(paint);
    };

    const onResize = () => {
      COLOURS = readPalette();
      collect();
      paint();
    };

    collect();
    paint();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    // Sections mount and unmount on route change.
    const mo = new MutationObserver(onResize);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.documentElement.classList.remove('has-bg-layer');
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      mo.disconnect();
    };
  }, [reduced]);

  return <div className="bg-layer" ref={ref} aria-hidden="true" />;
}
