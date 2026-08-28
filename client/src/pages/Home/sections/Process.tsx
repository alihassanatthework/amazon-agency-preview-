import { useInView } from '../../../motion';
import { Section, Container } from '../../../components/layout/Section';
import { SectionHeader } from '../../../components/layout/SectionHeader';

/**
 * H10 / §9.12 — LIGHT SECTION. Step 4's honesty about the 4–6 month timeline
 * is a deliberate differentiator taken from slide 7. Do not soften it.
 */
const STEPS = [
  ['01', 'Free audit', 'A 60-minute review of your account, listings, advertising and account health. No commitment.'],
  ['02', 'Your plan', 'We show you what we found, what we’d change first, and what it costs.'],
  ['03', 'We take it over', 'Dedicated account manager, support team and supervisor. Live in about a month if you’re not on Amazon yet.'],
  ['04', 'Compound growth', 'Weekly calls, constant optimisation. Most clients see meaningful movement around months four to six.'],
];

export function Process() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <Section surface="bone" className="process" aria-labelledby="process-title">
      <Container>
        <SectionHeader eyebrow="Getting started" headline={['Four steps, no obligation.']} id="process-title" />
        <div className={`process__steps${inView ? ' is-in' : ''}`} ref={ref}>
          <span className="process__rail" aria-hidden="true"><span className="process__rail-fill" /></span>
          <ol className="process__list">
            {STEPS.map(([n, title, body], i) => (
              <li className="process__step" key={n} style={{ ['--sd' as string]: `${i * 260}ms` }}>
                <span className="process__marker" aria-hidden="true">{n}</span>
                <h3 className="heading-s process__title">{title}</h3>
                <p className="body-s">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
