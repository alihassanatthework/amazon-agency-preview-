import { MaskWipe, Reveal, RevealGroup, useParallax } from '../../motion';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { ArrowRight } from '../../components/ui/Icon';

const FACTS = [
  { value: '2016', label: 'Founded' },
  { value: '19', label: 'Strategists, all US-based' },
  { value: '34', label: 'Brands managed' },
];

/**
 * H9 — About. Identity: who is behind the claims.
 *
 * Editorial two-column with the text block starting 64px below the image top —
 * an intentional stagger rather than a symmetric split. The image is sized
 * smaller than the hero visual so the page's visual weight continues to taper
 * toward the CTA.
 */
export function About() {
  const imageRef = useParallax<HTMLDivElement>(-30);

  return (
    <section className="section about bg-white" id="about" aria-labelledby="about-title" data-bg="white">
      <div className="container about__grid">
        <div className="about__media" ref={imageRef}>
          <MaskWipe className="about__frame media-frame">
            <div className="about-art media-fill" role="img" aria-label="The Northbeam strategy team in the Chicago office" />
          </MaskWipe>
        </div>

        <div className="about__text">
          <SectionHeader
            eyebrow="About us"
            headline={['A specialist team,', 'not a general agency.']}
            id="about-title"
            variant="narrow"
            className="about__header"
          />

          <Reveal delay={120} className="about__body">
            <p className="body">
              Northbeam works on Amazon and nothing else. No paid social, no
              retainers for channels we do not operate, and no accounts taken on
              in categories where we cannot demonstrate a result.
            </p>
            <p className="body">
              Every account is owned by a named strategist who audits it, plans
              it and runs it. They report to you weekly against a plan you
              approved, and they are the same person you met in the pitch.
            </p>
          </Reveal>

          <RevealGroup className="about__facts" stagger={80}>
            {FACTS.map((f) => (
              <div className="about__fact" key={f.label}>
                <span className="about__fact-rule" aria-hidden="true" />
                <p className="about__fact-value">{f.value}</p>
                <p className="caption">{f.label}</p>
              </div>
            ))}
          </RevealGroup>

          <Reveal className="about__cta">
            <a className="link" href="#about">
              Meet the team
              <ArrowRight />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
