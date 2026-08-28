import { LineDraw, Reveal, RevealGroup, WordRise } from '../../../motion';
import { Section, Container } from '../../../components/layout/Section';

/**
 * H6 / §9.8 — the thesis, verbatim from sales deck slide 8. Word-rise is used
 * here for the second and last time on the page; "compound growth" is the
 * second and final word-level accent.
 */
const POINTS = [
  ['An investment, not a retainer',
   'We view our relationships with our clients as an investment, and we’re willing to do the work to see the long-term dividends.'],
  ['Incentives that align',
   'The 5% performance component means BLAZON earns more only when the client does.'],
  ['People, not a portal',
   'A dedicated account manager, a task support team and a supervisor on every account, with a weekly 30-minute call.'],
];

export function Differentiator() {
  return (
    <Section surface="carbon" className="thesis" aria-labelledby="thesis-title">
      <div className="ember-gradient thesis__ember" aria-hidden="true" />
      <Container>
        <Reveal><p className="eyebrow">Why BLAZON</p></Reveal>
        <WordRise
          as="h2" id="thesis-title" className="display-m thesis__statement"
          lines={[
            'We insist on maximum effort. By doing',
            'the little things that other agencies won’t,',
            <span key="c">we create <em className="thesis__accent">compound growth</em> over time.</span>,
          ]}
        />
        <RevealGroup className="thesis__points" stagger={80}>
          {POINTS.map(([title, body]) => (
            <div className="thesis__point" key={title}>
              <LineDraw className="thesis__rule" vertical />
              <h3 className="thesis__point-title">{title}</h3>
              <p className="body-s">{body}</p>
            </div>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
