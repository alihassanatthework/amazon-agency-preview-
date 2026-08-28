import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Reveal, RevealGroup, LineDraw } from '../../motion';
import { Logo } from './Logo';
import { ArrowRight } from '../ui/Icon';
import { serviceNav, site } from '../../data/site';

const COMPANY = [
  { to: '/about', label: 'About' }, { to: '/team', label: 'Team' },
  { to: '/results', label: 'Results' }, { to: '/pricing', label: 'Pricing' },
  { to: '/insights', label: 'Insights' }, { to: '/contact', label: 'Contact' },
];

/** H12 / §9.14 — the page comes to rest here; nothing moves after entry. */
export function Footer() {
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState<string | null>('Services');

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const sync = () => setIsMobile(mq.matches);
    mq.addEventListener('change', sync); sync();
    return () => mq.removeEventListener('change', sync);
  }, []);

  const isOpen = (k: string) => !isMobile || open === k;

  const column = (key: string, links: { to: string; label: string }[]) => (
    <div className="footer__col" key={key}>
      <h3>{key}</h3>
      <button
        className="footer__toggle" type="button"
        aria-expanded={isOpen(key)} aria-controls={`footer-${key}`}
        onClick={() => setOpen(open === key ? null : key)}
      >
        <h3>{key}</h3><span className="indicator" aria-hidden="true" />
      </button>
      <div className="footer__panel" id={`footer-${key}`} data-open={isOpen(key)}>
        <ul>{links.map((l) => <li key={l.to + l.label}><Link to={l.to}>{l.label}</Link></li>)}</ul>
      </div>
    </div>
  );

  return (
    <footer className="footer" data-surface="void" role="contentinfo">
      <div className="container footer__inner">
        <RevealGroup className="footer__upper">
          <div className="footer__brand">
            <Logo width={140} />
            <p className="footer__mission">
              Amazon account management and growth for brands that intend to win.
            </p>
            <div className="footer__contact">
              <a href={site.phoneHref}>{site.phone}</a>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </div>
          </div>

          {column('Services', serviceNav.map((s) => ({ to: `/services/${s.slug}`, label: s.title })))}
          {column('Company', COMPANY)}

          <div className="footer__col footer__start">
            <h3>Get started</h3>
            <button
              className="footer__toggle" type="button"
              aria-expanded={isOpen('Get started')} aria-controls="footer-Get started"
              onClick={() => setOpen(open === 'Get started' ? null : 'Get started')}
            >
              <h3>Get started</h3><span className="indicator" aria-hidden="true" />
            </button>
            <div className="footer__panel" id="footer-Get started" data-open={isOpen('Get started')}>
              <p className="body-s">A free 60-minute audit of your listings, advertising and account health.</p>
              <Link className="btn btn--secondary btn--sm" to="/get-started">Get a free audit<ArrowRight /></Link>
              <p className="caption footer__hours">{site.hours}</p>
            </div>
          </div>
        </RevealGroup>

        <LineDraw className="divider footer__rule" />

        <Reveal className="footer__legal">
          <nav aria-label="Legal">
            <Link to="/privacy">Privacy policy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/cookies">Cookie policy</Link>
            <button type="button" className="footer__consent" onClick={() => window.dispatchEvent(new Event('blazon:consent-open'))}>
              Manage consent
            </button>
          </nav>
          {/* §22 Q-08 — this disclaimer is required. */}
          <p className="footer__copy">
            © {new Date().getFullYear()} BLAZON LLC. {site.disclaimer}
          </p>
        </Reveal>
      </div>
    </footer>
  );
}
