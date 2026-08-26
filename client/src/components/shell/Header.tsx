import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navLinks, site } from '../../data/site';
import { ArrowRight } from '../ui/Icon';

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

interface HeaderProps {
  /** C0 renders in the scrolled state from load — there is no dark hero beneath it. */
  solid?: boolean;
}

/**
 * H0 / C0 — sticky header. Sits above the hero rather than pushing it down.
 *
 * Past 64px it takes the White 92% + blur + border + Elevation 2 state. Past
 * 400px it leaves on downward scroll and returns on any upward scroll, so
 * reading space is returned to the user while the action stays one gesture away.
 */
export function Header({ solid = false }: HeaderProps) {
  const [scrolled, setScrolled] = useState(solid);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const lastY = useRef(0);
  const openRef = useRef(false);

  openRef.current = open;

  const { pathname, hash } = useLocation();
  const current = `${pathname}${hash}`;

  /* --- Scroll states ----------------------------------------------------- */
  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;

      if (!solid) setScrolled(y > 64);
      // The drawer being open pins the bar in place.
      setHidden(!openRef.current && y > 400 && y > lastY.current);
      lastY.current = y;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, [solid]);

  /* --- Drawer: scroll lock, focus trap, Escape, focus restore ------------ */
  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) {
      document.body.classList.remove('is-locked');
      return;
    }

    document.body.classList.add('is-locked');
    setHidden(false);

    const drawer = drawerRef.current;
    drawer?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        return;
      }
      if (e.key !== 'Tab' || !drawer) return;

      const items = Array.from(drawer.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
      if (!items.length) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeydown);
    return () => {
      document.removeEventListener('keydown', onKeydown);
      document.body.classList.remove('is-locked');
    };
  }, [open, close]);

  /* Leaving the mobile breakpoint with the drawer open would strand it. */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1280px)');
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches && openRef.current) setOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const headerClass = [
    'header',
    solid ? 'is-solid' : '',
    scrolled ? 'is-scrolled' : '',
    hidden ? 'is-hidden' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const isCurrent = (to: string) =>
    to === '/' ? pathname === '/' && !hash : current === to || pathname === to;

  return (
    <>
      <header className={headerClass}>
        <div className="container header__bar">
          <Link className="wordmark" to="/">
            <span className="wordmark__mark" aria-hidden="true">N</span>
            {site.name}
          </Link>

          <nav className="header__nav" aria-label="Primary">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                className="nav-link"
                to={l.to}
                aria-current={isCurrent(l.to) ? 'page' : undefined}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="header__actions">
            <a className="nav-link header__login" href="#client-login">Client login</a>
            <Link className="btn" to="/contact">
              Get a free audit
              <ArrowRight />
            </Link>
            <button
              ref={toggleRef}
              className="header__toggle"
              type="button"
              aria-expanded={open}
              aria-controls="drawer"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              <span aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`drawer-backdrop${open ? ' is-open' : ''}`}
        onClick={close}
        aria-hidden="true"
      />

      <div
        ref={drawerRef}
        id="drawer"
        className={`drawer${open ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
      >
        <nav className="drawer__links" aria-label="Mobile">
          {navLinks.map((l, i) => (
            <Link
              key={l.label}
              to={l.to}
              onClick={close}
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {l.label}
            </Link>
          ))}
          <a href="#client-login" onClick={close} style={{ transitionDelay: `${navLinks.length * 50}ms` }}>
            Client login
          </a>
        </nav>

        <div className="drawer__footer">
          <Link className="btn btn--block" to="/contact" onClick={close}>
            Get a free audit
          </Link>
          <p className="caption drawer__meta">
            Response within {site.responseTime}. No commitment.
          </p>
        </div>
      </div>
    </>
  );
}
