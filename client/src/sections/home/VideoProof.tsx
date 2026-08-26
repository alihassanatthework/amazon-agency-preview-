import { useEffect, useRef, useState } from 'react';
import { MaskWipe, Reveal, useParallax } from '../../motion';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { ArrowRight, Play } from '../../components/ui/Icon';

/**
 * H6 — Video social proof. Human evidence: a face and a voice after a run of
 * abstraction.
 *
 * The media frame extends past the container's right edge, breaking the grid
 * deliberately once on the page. The player uses a facade — the third-party
 * iframe is never present on initial load at any breakpoint.
 */
export function VideoProof() {
  const [playing, setPlaying] = useState(false);
  const playRef = useRef<HTMLButtonElement>(null);
  const frameRef = useParallax<HTMLDivElement>(-24);

  /* Returning focus to the play control when the player closes. */
  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPlaying(false);
        playRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [playing]);

  return (
    <section className="section video bg-white" aria-labelledby="video-title">
      <div className="container video__grid">
        <SectionHeader
          eyebrow="In their words"
          headline={['Ask the brands,', 'not the agency.']}
          lead="Fourteen client testimonials recorded in the last eighteen months, unedited and unscripted."
          id="video-title"
          variant="narrow"
          className="video__header"
        />

        <div className="video__media" ref={frameRef}>
          <MaskWipe className="video__frame" fromLeft>
            {playing ? (
              /* Instantiated on click only — never on page load. */
              <iframe
                className="video__player"
                src="https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ?autoplay=1&rel=0"
                title="Client testimonial — Lumière"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="video__poster media-fill">
                <div className="video__poster-art" aria-hidden="true" />
                <button
                  ref={playRef}
                  className="video__play"
                  type="button"
                  onClick={() => setPlaying(true)}
                  aria-label="Play client testimonial from Lumière"
                >
                  <Play />
                </button>
              </div>
            )}
          </MaskWipe>

          {/* Quote panel overlaps the frame's lower-left corner. */}
          <Reveal className="video__quote" delay={240}>
            <blockquote>
              <p className="body">
                “They found $1.4M of demand we were handing to a competitor
                every quarter. Nobody had thought to look there.”
              </p>
              <footer className="caption">
                Priya Raman · VP Growth · Lumière
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </div>

      <div className="container">
        <Reveal className="video__cta">
          <a className="link" href="#results">
            Read more client stories
            <ArrowRight />
          </a>
          <p className="caption video__note">
            Captions and a full transcript are available for every testimonial.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
