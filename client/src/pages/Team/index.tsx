import { RevealGroup } from '../../motion';
import { Section, Container } from '../../components/layout/Section';
import { PageHero } from '../../components/layout/PageHero';
import { CtaSection } from '../../components/common/CtaSection';
import { Seo } from '../../components/common/Seo';
import { Card } from '../../components/common/Card';
import { team, TEAM_SIZE } from '../../data/team';
import { site } from '../../data/site';

/**
 * §10.6 — "Your point of contact", the deck's own framing. It beats a generic
 * "Meet the team" because it tells the visitor these are the people they will
 * actually deal with.
 *
 * Photographs resolve from assets/team by slug. A member without a file gets
 * their initials rather than a stock portrait, so the blueprint's rule — no
 * placeholder avatars, no invented bios — still holds while the shoot is
 * outstanding, and no code changes as files arrive.
 */
const PHOTOS = import.meta.glob('../../assets/team/*.{jpg,jpeg,png,webp}', {
  eager: true, import: 'default',
}) as Record<string, string>;

const photoFor = (slug: string): string | null =>
  Object.entries(PHOTOS).find(([path]) =>
    path.replace(/^.*\//, '').replace(/\.[^.]+$/, '') === slug)?.[1] ?? null;

const initials = (name: string) =>
  name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('');

const ORG_ID = 'https://blazonpros.com/#organization';
const personId = (slug: string) => `https://blazonpros.com/team#${slug}`;

export default function Team() {
  return (
    <>
      <Seo
        route="/team" title="Your point of contact — BLAZON"
        description={`The named people who would run your Amazon account: ${team.map((m) => m.name).join(', ')}.`}
        schema={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Organization', '@id': ORG_ID,
              name: 'BLAZON', url: 'https://blazonpros.com', telephone: site.phone,
              areaServed: 'US', description: site.mission,
              numberOfEmployees: TEAM_SIZE,
              employee: team.map((m) => ({ '@id': personId(m.slug) })),
            },
            ...team.map((m) => ({
              '@type': 'Person',
              '@id': personId(m.slug),
              name: m.name,
              jobTitle: m.role,
              worksFor: { '@id': ORG_ID },
              ...(m.bio ? { description: m.bio } : {}),
            })),
          ],
        }}
      />
      <PageHero
        eyebrow="Our team"
        headline={['Your point of contact.']}
        lead={`These are the people who would actually run your account — not a shared support queue. ${site.founder} leads a US-based team of ${TEAM_SIZE}, every one of them with four or more years selling on Amazon.`}
      />

      <Section surface="obsidian">
        <Container>
          <RevealGroup className="team__grid" stagger={70}>
            {team.map((m) => {
              const photo = photoFor(m.slug);
              return (
                <Card as="article" interactive className="team__member" key={m.slug}>
                  {photo ? (
                    <img
                      className="team__photo" src={photo} alt={`${m.name}, ${m.role} at BLAZON`}
                      width={160} height={160} loading="lazy" decoding="async"
                    />
                  ) : (
                    <span className="team__monogram" aria-hidden="true">{initials(m.name)}</span>
                  )}
                  <h2 className="heading-s team__name">{m.name}</h2>
                  <p className="card__eyebrow team__role">{m.role}</p>
                  {m.bio && <p className="body-s team__bio">{m.bio}</p>}
                </Card>
              );
            })}
          </RevealGroup>

          {team.length < TEAM_SIZE && (
            <p className="caption team__note">
              {team.length} of {TEAM_SIZE} named so far. The rest go up as their roles and
              photographs are confirmed — we would rather name the people we can evidence
              than pad the page out.
            </p>
          )}
        </Container>
      </Section>

      <CtaSection />
    </>
  );
}
