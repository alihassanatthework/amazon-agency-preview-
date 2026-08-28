import { Link } from 'react-router-dom';
import full from '../../assets/logo/logo-white-green.png';
import dark from '../../assets/logo/logo-black-green.png';
import flame from '../../assets/logo/flame.png';

/**
 * §3.3 — never reconstruct the wordmark in a system font, always the supplied
 * asset. The flame mark is the only element permitted to animate, and only as
 * a single shimmer on page load.
 */
export function Logo(
  { surface = 'dark', width = 132, shimmer = false, className }:
  { surface?: 'dark' | 'light'; width?: number; shimmer?: boolean; className?: string },
) {
  return (
    <Link to="/" className={['logo', className].filter(Boolean).join(' ')} aria-label="BLAZON — home">
      <img
        src={surface === 'dark' ? full : dark}
        alt="BLAZON"
        width={width}
        height={Math.round((width * 205) / 1170)}
        className={shimmer ? 'flame-shimmer' : undefined}
      />
    </Link>
  );
}

export function FlameMark({ size = 28, className }: { size?: number; className?: string }) {
  return <img src={flame} alt="" width={size} height={size} className={className} aria-hidden="true" />;
}
