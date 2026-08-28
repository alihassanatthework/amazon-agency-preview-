import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMediaQuery } from '../../motion';

/** §9.13 — mobile sticky CTA bar, active from the stat band onward. */
export function StickyCta() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!isMobile) { setShown(false); return; }
    let ticking = false;
    const update = () => {
      ticking = false;
      const stats = document.querySelector('.stats');
      const cta = document.querySelector('.cta');
      if (!stats) return;
      const past = stats.getBoundingClientRect().bottom < 0;
      const ctaVisible = cta ? cta.getBoundingClientRect().top < window.innerHeight : false;
      setShown(past && !ctaVisible);
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMobile]);

  if (!isMobile) return null;
  return (
    <div className={`sticky-cta${shown ? ' is-shown' : ''}`} aria-hidden={!shown}>
      <Link className="btn btn--block" to="/get-started" tabIndex={shown ? 0 : -1}>Get a free audit</Link>
    </div>
  );
}
