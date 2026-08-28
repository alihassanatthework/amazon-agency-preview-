import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { ArrowRight, Phone } from '../ui/Icon';
import { serviceNav, aboutNav, site } from '../../data/site';

const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

/**
 * H0 / §9.2 — transparent over the hero, obsidian at 88% with blur past 80px,
 * hides on downward scroll past 480px and returns on any upward scroll. A 2px
 * lime rule at the bottom edge fills with page scroll progress.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);

  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const lastY = useRef(0);
  const openRef = useRef(false);
  openRef.current = open;

  const { pathname } = useLocation();

  useEffect(() => { setMenu(null); setOpen(false); }, [pathname]);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(y / max, 1) : 0);
      setScrolled(y > 80);
      setHidden(!openRef.current && y > 480 && y > lastY.current);
      lastY.current = y;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = useCallback(() => { setOpen(false); toggleRef.current?.focus(); }, []);

  useEffect(() => {
    if (!open) { document.body.style.overflow = ''; return; }
    document.body.style.overflow = 'hidden';
    setHidden(false);
    drawerRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab' || !drawerRef.current) return;
      const items = Array.from(drawerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
        .filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, close]);

  // Escape closes an open dropdown without closing the whole header.
  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menu]);

  const cls = ['header', scrolled ? 'is-scrolled' : '', hidden ? 'is-hidden' : ''].filter(Boolean).join(' ');

  return (
    <>
      <header className={cls} onMouseLeave={() => setMenu(null)}>
        <div className="container header__bar">
          <Logo shimmer width={132} />

          <nav className="header__nav" aria-label="Primary">
            <div className="header__item" onMouseEnter={() => setMenu('services')}>
              <button
                className="nav-link" type="button"
                aria-expanded={menu === 'services'} aria-haspopup="true"
                onClick={() => setMenu(menu === 'services' ? null : 'services')}
              >
                Services <span aria-hidden="true">▾</span>
              </button>
            </div>
            <NavLink className="nav-link" to="/results">Results</NavLink>
            <NavLink className="nav-link" to="/pricing">Pricing</NavLink>
            <div className="header__item" onMouseEnter={() => setMenu('about')}>
              <button
                className="nav-link" type="button"
                aria-expanded={menu === 'about'} aria-haspopup="true"
                onClick={() => setMenu(menu === 'about' ? null : 'about')}
              >
                About <span aria-hidden="true">▾</span>
              </button>
            </div>
            <NavLink className="nav-link" to="/insights">Insights</NavLink>
          </nav>

          <div className="header__actions">
            {/* A visible phone number is a deliberate trust signal for this
                audience — clients repeatedly praise being able to call. */}
            <a className="header__phone" href={site.phoneHref}><Phone />{site.phone}</a>
            <Link className="btn" to="/get-started">Get a free audit<ArrowRight /></Link>
            <button
              ref={toggleRef} className="header__toggle" type="button"
              aria-expanded={open} aria-controls="drawer"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              <span aria-hidden="true" />
            </button>
          </div>
        </div>

        {menu === 'services' && (
          <div className="dropdown" onMouseLeave={() => setMenu(null)}>
            <div className="container dropdown__inner">
              <ul className="dropdown__grid">
                {serviceNav.map((s) => (
                  <li key={s.slug}>
                    <Link to={`/services/${s.slug}`}>{s.title}</Link>
                  </li>
                ))}
              </ul>
              <div className="dropdown__feature">
                <p className="eyebrow">Our approach</p>
                <p className="dropdown__pitch">
                  How many levers will you pull to increase your sales?
                  <strong> All of them.</strong>
                </p>
                <Link className="link" to="/getting-started">
                  Not selling on Amazon yet?<ArrowRight />
                </Link>
              </div>
            </div>
          </div>
        )}
        {menu === 'about' && (
          <div className="dropdown dropdown--narrow" onMouseLeave={() => setMenu(null)}>
            <div className="container dropdown__inner">
              <ul className="dropdown__grid dropdown__grid--one">
                {aboutNav.map((a) => <li key={a.to}><Link to={a.to}>{a.label}</Link></li>)}
              </ul>
            </div>
          </div>
        )}

        <span className="header__progress" aria-hidden="true" style={{ transform: `scaleX(${progress})` }} />
      </header>

      <div className={`drawer-backdrop${open ? ' is-open' : ''}`} onClick={close} aria-hidden="true" />
      <div
        ref={drawerRef} id="drawer" className={`drawer${open ? ' is-open' : ''}`}
        role="dialog" aria-modal="true" aria-label="Menu" {...(open ? {} : { inert: '' as unknown as boolean })}
      >
        <nav className="drawer__links" aria-label="Mobile">
          {[{ to: '/services', label: 'Services' }, { to: '/results', label: 'Results' },
            { to: '/pricing', label: 'Pricing' }, { to: '/about', label: 'About' },
            { to: '/team', label: 'Team' }, { to: '/insights', label: 'Insights' },
            { to: '/contact', label: 'Contact' }].map((l, i) => (
            <Link key={l.to} to={l.to} onClick={close} style={{ transitionDelay: `${i * 50}ms` }}>{l.label}</Link>
          ))}
        </nav>
        <div className="drawer__footer">
          <a className="drawer__phone" href={site.phoneHref}><Phone />{site.phone}</a>
          <Link className="btn btn--block" to="/get-started" onClick={close}>Get a free audit</Link>
        </div>
      </div>
    </>
  );
}
