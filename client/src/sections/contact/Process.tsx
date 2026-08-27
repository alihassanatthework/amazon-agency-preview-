import { useReveal } from '../../motion';
import { SectionHeader } from '../../components/ui/SectionHeader';

const STEPS = [
  {
    index: '01',
    title: 'You submit',
    body: 'Takes about three minutes. Nothing is required beyond what the form asks for.',
  },
  {
    index: '02',
    title: 'We audit',
    body: 'A named strategist reviews advertising, listings, catalogue health and competitive position.',
  },
  {
    index: '03',
    title: 'We send findings',
    body: 'A written review with prioritised opportunities, sent within the stated turnaround.',
  },
  {
    index: '04',
    title: 'We talk',
    body: 'A 30-minute call to walk through it, whether or not you go on to work with us.',
  },
];

/**
 * C3 — What happens next. Removes friction by making the process explicit.
 *
 * The connecting rail draws across the full width and each marker scales in as
 * the rail reaches it, producing a sequential build rather than four
 * simultaneous reveals.
 */
export function Process() {
  const { ref, revealed } = useReveal<HTMLDivElement>();

  return (
    <section className="section process bg-canvas-deep" aria-labelledby="process-title">
      <div className="container">
        <SectionHeader
          eyebrow="The process"
          headline={['Four steps, no obligation.']}
          id="process-title"
        />

        <div className={`process__steps${revealed ? ' is-revealed' : ''}`} ref={ref}>
          <span className="process__rail" aria-hidden="true">
            <span className="process__rail-fill" />
          </span>

          <ol className="process__list">
            {STEPS.map((s, i) => (
              <li
                className="process__step"
                key={s.index}
                style={{ ['--step-delay' as string]: `${i * 240}ms` }}
              >
                <span className="process__marker" aria-hidden="true">{s.index}</span>
                <h3 className="heading-s process__title">{s.title}</h3>
                <p className="body-s">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
