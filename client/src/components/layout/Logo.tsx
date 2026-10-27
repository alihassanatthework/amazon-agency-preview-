import { Link } from 'react-router-dom';
import markWebp from '../../assets/logo/logo-mark-440.webp';
import markPng from '../../assets/logo/logo-mark-440.png';

/**
 * §3.3 — never reconstruct the wordmark in a system font, always the supplied
 * asset.
 *
 * The asset here is a 429×440 export of the master artwork, not the master
 * itself. The previous version imported `logo-black-green.png` — 4500×4615 and
 * 401 KB — to paint a mark 132 px wide, on every page, in the critical path.
 * At 440 px the export still covers 3× the largest size the mark is drawn at
 * (140 px in the footer), and WebP brings it to roughly 15 KB. The 4500 px
 * master stays in assets/logo as the source to re-export from.
 *
 * There is also no longer a `surface` prop. It chose between two imports that
 * were byte-identical files, and no caller ever passed anything but the
 * default — so it selected nothing while implying a light-surface variant
 * exists. If one is ever drawn, add it back deliberately.
 */
const RATIO = 440 / 429;

export function Logo(
  { width = 132, shimmer = false, className }:
  { width?: number; shimmer?: boolean; className?: string },
) {
  return (
    <Link to="/" className={['logo', className].filter(Boolean).join(' ')} aria-label="BLAZON — home">
      <picture>
        <source srcSet={markWebp} type="image/webp" />
        <img
          src={markPng}
          alt="BLAZON"
          width={width}
          height={Math.round(width * RATIO)}
          decoding="async"
          className={shimmer ? 'flame-shimmer' : undefined}
        />
      </picture>
    </Link>
  );
}
