import { Link } from 'react-router-dom';
import { Reveal } from '../../motion';
import { Section, Container } from '../../components/layout/Section';
import { Seo } from '../../components/common/Seo';
import { ArrowRight } from '../../components/ui/Icon';
import { site } from '../../data/site';

/** §19.1 — branded, with recovery links. Never an empty template. */
export default function NotFound() {
  return (
    <>
      <Seo route="/404" title="Page not found — BLAZON" noindex />
      <Section surface="obsidian" size="emphasis" className="notfound">
        <div className="ember-gradient notfound__ember" aria-hidden="true" />
        <Container>
          <Reveal className="notfound__inner">
            <p className="eyebrow">404</p>
            <h1 className="display-l">That page isn’t here.</h1>
            <p className="body-l">
              The link may be old, or the address may have a typo. Here is where most
              people are heading.
            </p>
            <ul className="notfound__links">
              <li><Link className="link" to="/services">What we do<ArrowRight /></Link></li>
              <li><Link className="link" to="/pricing">Pricing<ArrowRight /></Link></li>
              <li><Link className="link" to="/results">Client results<ArrowRight /></Link></li>
              <li><Link className="link" to="/get-started">Get a free audit<ArrowRight /></Link></li>
            </ul>
            <p className="caption">Or call us on <a className="link link--inline" href={site.phoneHref}>{site.phone}</a>.</p>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
