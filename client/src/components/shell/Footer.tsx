import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Reveal, RevealGroup, LineDraw } from '../../motion';
import { footerColumns, site, socials } from '../../data/site';
import { ArrowRight } from '../ui/Icon';

/**
 * H11 / C6 — Footer. Terminus: nothing here moves after entry, because the
 * page should come to rest at this point.
 *
 * On mobile the three link groups become accordions with the first expanded;
 * above that breakpoint they are plain always-open columns.
 */
export function Footer() {
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState<string | null>(footerColumns[0].heading);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const sync = () => setIsMobile(mq.matches);
    mq.addEventListener('change', sync);
    sync();
    return () => mq.removeEventListener('change', sync);
  }, []);

  const isOpen = (heading: string) => !isMobile || open === heading;

  return (
    <footer className="footer" role="contentinfo">
      <div className="container footer__inner">
        <RevealGroup className="footer__upper">
          <div className="footer__brand">
            <Link className="wordmark wordmark--onDark" to="/">
              <span className="wordmark__mark" aria-hidden="true">N</span>
              {site.name}
            </Link>
            <p className="footer__desc">
              An Amazon-only growth partner running advertising, account
              management and catalogue performance as one programme.
            </p>

            <ul className="footer__social" aria-label="Social">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} aria-label={s.label}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                      <path d={s.path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>

            <span className="badge badge--onDark">Amazon Verified Partner</span>
          </div>

          {footerColumns.map((col) => {
            const panelId = `footer-${col.heading.toLowerCase().replace(/\s+/g, '-')}`;
            return (
              <div className="footer__col" key={col.heading}>
                <h3>{col.heading}</h3>
                <button
                  className="footer__toggle"
                  type="button"
                  data-footer-toggle=""
                  aria-expanded={isOpen(col.heading)}
                  aria-controls={panelId}
                  onClick={() => setOpen(open === col.heading ? null : col.heading)}
                >
                  <h3>{col.heading}</h3>
                  <span className="indicator" aria-hidden="true" />
                </button>

                <div className="footer__panel" id={panelId} data-open={isOpen(col.heading)}>
                  <ul>
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <Link to={l.to}>{l.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}

          <div className="footer__col footer__start">
            <h3>Get started</h3>
            <button
              className="footer__toggle"
              type="button"
              data-footer-toggle=""
              aria-expanded={isOpen('Get started')}
              aria-controls="footer-get-started"
              onClick={() => setOpen(open === 'Get started' ? null : 'Get started')}
            >
              <h3>Get started</h3>
              <span className="indicator" aria-hidden="true" />
            </button>

            <div className="footer__panel" id="footer-get-started" data-open={isOpen('Get started')}>
              <p>A free audit of advertising, listings and catalogue health.</p>
              <Link className="btn btn--onDark btn--sm" to="/contact">
                Get a free audit
                <ArrowRight />
              </Link>
              <div className="footer__contact">
                <a href={`mailto:${site.email}`}>{site.email}</a>
                <a href={`tel:${site.phone.replace(/[^+\d]/g, '')}`}>{site.phone}</a>
              </div>
            </div>
          </div>
        </RevealGroup>

        <LineDraw className="rule rule--onDark footer__rule" />

        <Reveal className="footer__lower">
          <nav aria-label="Legal">
            <a href="#privacy">Privacy policy</a>
            <a href="#terms">Terms</a>
            <a href="#cookies">Cookie policy</a>
            <a href="#consent">Manage consent</a>
          </nav>
          <span className="footer__copy">
            © <span data-year="">{new Date().getFullYear()}</span> {site.name}. All rights reserved.
          </span>
        </Reveal>
      </div>
    </footer>
  );
}
