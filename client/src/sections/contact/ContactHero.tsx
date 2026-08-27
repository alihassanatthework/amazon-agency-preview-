import { Reveal, RevealGroup, WordRise, useParallax } from '../../motion';
import { site } from '../../data/site';

const RETURNS = [
  'A written review of the account as it stands today',
  'An advertising and contribution-margin assessment',
  'A 30-minute call to walk through the findings',
];

/**
 * C1 — Contact hero. Deliberately short, roughly 42vh, so the form in C2 is
 * visible or near-visible immediately on load.
 *
 * No CTA button appears here: the form immediately below is the action, and a
 * competing button would split intent.
 */
export function ContactHero() {
  const bloomRef = useParallax<HTMLDivElement>(20);

  return (
    <section className="section contact-hero bg-canvas" aria-labelledby="contact-title" data-bg="canvas">
      <div ref={bloomRef} className="bloom contact-hero__bloom" aria-hidden="true" />

      <div className="container contact-hero__grid">
        <div className="contact-hero__text">
          <Reveal>
            <p className="eyebrow">Contact</p>
          </Reveal>

          <WordRise
            as="h1"
            id="contact-title"
            className="display-l"
            lines={['Tell us about your', 'Amazon account.']}
            immediate
          />

          <Reveal delay={140}>
            <p className="body-l contact-hero__lead">
              The audit covers advertising, listing quality, catalogue health and
              competitive position. You get the findings in writing, whether or
              not you go on to work with us.
            </p>
          </Reveal>
        </div>

        {/* The only elevated element in the section. */}
        <Reveal delay={260} className="contact-hero__card card card--elevated card--interactive">
          <h2 className="heading-s">What you get back</h2>
          <RevealGroup as="ul" className="contact-hero__list" stagger={60}>
            {RETURNS.map((r) => (
              <li key={r}>
                <span className="contact-hero__bullet" aria-hidden="true" />
                <span className="body-s">{r}</span>
              </li>
            ))}
          </RevealGroup>
          <p className="caption contact-hero__turnaround">
            Returned within {site.responseTime}.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
