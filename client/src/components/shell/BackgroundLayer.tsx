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

    let ticking = false;
    let sections: HTMLElement[] = [];
    let COLOURS = readPalette();

    const collect = () => {
      sections = Array.from(document.querySelectorAll<HTMLElement>('[data-bg]'));
    };

    const paint = () => {
      ticking = false;

      const vh = window.innerHeight;

      // If the layer cannot paint a meaningful gradient — no sections yet, or a
      // collapsed / not-yet-measured viewport — hand rendering back to the
      // per-section backgrounds rather than leaving the page unpainted.
      if (!sections.length || vh <= 0) {
        document.documentElement.classList.remove('has-bg-layer');
        return;
      }

      const stops: string[] = [];
      // The colour at any point is the colour of the last section whose top
      // edge is above it. `currentKey` therefore tracks the section covering
      // the point the walk has reached — starting at the top of the viewport.
      let currentKey = sections[0].dataset.bg ?? 'canvas';

      for (const section of sections) {
        const key = section.dataset.bg ?? 'canvas';
        const top = section.getBoundingClientRect().top;
        const overlap = overlapFor(currentKey, key);

        // Fully above the viewport: it simply becomes the running colour.
        if (top <= -overlap / 2) {
          currentKey = key;
          continue;
        }

        // Beyond the viewport: nothing further can affect what is painted, and
        // crucially it must not advance the running colour — otherwise the
        // trailing stop would take the last section's colour rather than the
        // one actually covering the bottom of the screen.
        if (top >= vh + overlap / 2) break;

        stops.push(
          `${COLOURS[currentKey]} ${Math.round(top - overlap / 2)}px`,
          `${COLOURS[key]} ${Math.round(top + overlap / 2)}px`,
        );
        currentKey = key;
      }

      // A single-colour viewport still needs two stops to be a valid gradient.
      if (!stops.length) stops.push(`${COLOURS[currentKey]} 0px`);
      stops.push(`${COLOURS[currentKey]} ${vh}px`);
      layer.style.backgroundImage = `linear-gradient(to bottom, ${stops.join(', ')})`;
      // Only now is it safe for the sections to go transparent.
      document.documentElement.classList.add('has-bg-layer');
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
