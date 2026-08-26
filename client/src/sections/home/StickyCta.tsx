import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMediaQuery } from '../../motion';

/**
 * Mobile-only sticky CTA bar, active from H3 onward. On small screens the
 * primary action should never be more than a tap away once the reader has
 * passed the proof section.
 */
export function StickyCta() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!isMobile) {
      setShown(false);
      return;
    }

    let ticking = false;

    const update = () => {
      ticking = false;
      const kpi = document.querySelector('.kpi');
      const cta = document.querySelector('.cta');
      if (!kpi) return;

      const past = kpi.getBoundingClientRect().bottom < 0;
      // It would be redundant once the full CTA section is on screen.
      const ctaVisible = cta ? cta.getBoundingClientRect().top < window.innerHeight : false;
      setShown(past && !ctaVisible);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMobile]);

  if (!isMobile) return null;

  return (
    <div className={`sticky-cta${shown ? ' is-shown' : ''}`} aria-hidden={!shown}>
      <Link className="btn btn--block" to="/contact" tabIndex={shown ? 0 : -1}>
        Get a free audit
      </Link>
    </div>
  );
}
