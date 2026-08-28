import { useLocation } from 'react-router-dom';
import { Reveal } from '../../motion';
import { Section, Container } from '../../components/layout/Section';
import { PageHero } from '../../components/layout/PageHero';
import { Seo } from '../../components/common/Seo';
import { site } from '../../data/site';

/**
 * §22 Q-04 — privacy, terms and cookie policy do not exist yet, and the
 * consent system needs a linked policy to be compliant. The routes and the
 * template are built; the content must be supplied or drafted by counsel.
 * Marked noindex until then rather than publishing invented legal text.
 */
const PAGES: Record<string, { title: string; eyebrow: string }> = {
  '/privacy': { title: 'Privacy policy', eyebrow: 'Legal' },
  '/terms':   { title: 'Terms of service', eyebrow: 'Legal' },
  '/cookies': { title: 'Cookie policy', eyebrow: 'Legal' },
};

export default function Legal() {
  const { pathname } = useLocation();
  const page = PAGES[pathname] ?? PAGES['/privacy'];

  return (
    <>
      <Seo route={pathname} title={`${page.title} — BLAZON`} noindex />
      <PageHero eyebrow={page.eyebrow} headline={[page.title]} />
      <Section surface="obsidian">
        <Container>
          <Reveal className="legal">
            <p className="body-l">
              This policy is being finalised with counsel and will be published here
              before launch.
            </p>
            <p className="body">
              In the meantime, if you have a question about how BLAZON handles your
              data — including any information you submit through the audit form or
              contact form — email{' '}
              <a className="link link--inline" href={`mailto:${site.email}`}>{site.email}</a>{' '}
              or call <a className="link link--inline" href={site.phoneHref}>{site.phone}</a> and
              we will answer directly.
            </p>
            <p className="body">
              We use the details you submit only to respond to your enquiry. We do not
              sell them, and we will delete them on request.
            </p>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
