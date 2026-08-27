import { Reveal } from '../../motion';
import { site, socials } from '../../data/site';

/**
 * C2 sidebar — contact details. Sticky while the form scrolls, releasing at
 * the section end. Naming who replies is part of reducing the cost of filling
 * the form in.
 */
export function ContactDetails() {
  return (
    <Reveal className="contact-side" delay={160}>
      <div className="contact-side__inner">
        <h2 className="heading-s">Or reach us directly</h2>

        <dl className="contact-side__list">
          <div>
            <dt className="caption">General</dt>
            <dd><a className="link" href={`mailto:${site.email}`}>{site.email}</a></dd>
          </div>
          <div>
            <dt className="caption">New business</dt>
            <dd><a className="link" href={`mailto:${site.newBusinessEmail}`}>{site.newBusinessEmail}</a></dd>
          </div>
          <div>
            <dt className="caption">Phone</dt>
            <dd>
              <a className="link" href={`tel:${site.phone.replace(/[^+\d]/g, '')}`}>{site.phone}</a>
              <span className="caption contact-side__hours">{site.hours}</span>
            </dd>
          </div>
          <div>
            <dt className="caption">Office</dt>
            <dd className="body-s">
              {site.address.map((line) => (
                <span key={line}>{line}<br /></span>
              ))}
            </dd>
          </div>
        </dl>

        <div className="contact-side__person">
          <span className="contact-side__portrait" aria-hidden="true" />
          <p className="body-s">
            <strong>Marcus Hale</strong> reads every submission and replies
            personally. He has run Amazon accounts for eleven years.
          </p>
        </div>

        <ul className="contact-side__social" aria-label="Social">
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
      </div>
    </Reveal>
  );
}
