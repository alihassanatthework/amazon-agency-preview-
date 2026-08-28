import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { useReducedMotion } from '../../motion';

/**
 * §6.3 — an obsidian panel wipes up as the route exits and off the top as the
 * new one enters. Scroll resets BEFORE the incoming panel clears, never after,
 * or the user sees the previous scroll position flash.
 */
export function PublicLayout() {
  const { pathname } = useLocation();
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<'idle' | 'cover' | 'clear'>('idle');
  const [shown, setShown] = useState(pathname);

  useEffect(() => {
    if (pathname === shown) return;
    if (reduced) { window.scrollTo(0, 0); setShown(pathname); return; }
    setPhase('cover');
    const t1 = setTimeout(() => {
      window.scrollTo(0, 0);
      setShown(pathname);
      setPhase('clear');
    }, 380);
    const t2 = setTimeout(() => setPhase('idle'), 380 + 560);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [pathname, shown, reduced]);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main" key={shown}>
        <Outlet />
      </main>
      <Footer />
      {!reduced && (
        <div
          className={`page-wipe${phase === 'cover' ? ' is-covering' : ''}${phase === 'clear' ? ' is-clearing' : ''}`}
          aria-hidden="true"
        />
      )}
    </>
  );
}
