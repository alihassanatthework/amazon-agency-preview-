import { RevealGroup } from '../../../motion';
import { Section, Container } from '../../../components/layout/Section';
import { SectionHeader } from '../../../components/layout/SectionHeader';

/**
 * H4 / §9.6 — LIGHT SECTION. Names the pain in the reader's own words, drawn
 * from sales deck slide 12. This section names pain, it does not sell: no CTA,
 * because the resolution is the next section.
 */
const PROBLEMS = [
  ['Fees keep climbing', 'And margins on anything under $20 have all but vanished.'],
  ['The rules change constantly', 'Policies, restricted products and restricted verbiage shift without warning.'],
  ['Listings drift', 'Images, titles and bullets go wrong and stay wrong until someone catches them.'],
  ["There's no one to call", 'Reaching anyone at Amazon who can actually resolve an issue is close to impossible.'],
  ['Opportunities stay invisible', 'Most sellers never find the programs and tools that would grow them.'],
  ['It becomes a second job', 'The day-to-day pulls your team away from the business you actually run.'],
];

export function Problem() {
  return (
    <Section surface="bone" className="problem" aria-labelledby="problem-title">
      <Container>
        <SectionHeader
          eyebrow="Sound familiar?"
          headline={["Amazon doesn't tell you", 'what’s going wrong.']}
          id="problem-title"
        />
        <RevealGroup className="problem__grid" stagger={80}>
          {PROBLEMS.map(([title, body]) => (
            <article className="problem__card card card--interactive" key={title}>
              <h3 className="problem__title">{title}</h3>
              <p className="body-s">{body}</p>
            </article>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
