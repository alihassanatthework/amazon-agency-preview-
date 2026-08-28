import { useEffect, useRef, useState } from 'react';
import { Reveal, useReducedMotion } from '../../../motion';
import { Container } from '../../../components/layout/Section';

const LOGOS = import.meta.glob('../../../assets/clients/*-mono.png', { eager: true, import: 'default' });

const NAMES: Record<string, string> = {
  'ahm-investments': 'AHM Investments',
  'alpine-products': 'Alpine Products',
  'blenditup': 'BlenditUp',
  'halftee': 'Halftee',
  'health-as-it-ought-to-be': 'Health As It Ought To Be',
  'pyro-putty': 'Pyro Putty',
  'raise-them-well': 'Raise Them Well',
  'rv-bug-stop': 'RV Bug Stop',
};

const items = Object.entries(LOGOS).map(([path, src]) => {
  const slug = path.split('/').pop()!.replace('-mono.png', '');
  return { slug, src: src as string, name: NAMES[slug] ?? slug };
});

/**
 * H2 / §9.4 — immediate borrowed credibility, deliberately the quietest
 * section on the page. Every mark here is consent-confirmed.
 */
export function ClientMarquee() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const track = reduced ? items : [...items, ...items];

  return (
    <section
      ref={ref} data-surface="carbon"
      className={`section section--quiet logos${visible ? ' is-visible' : ''}`}
      aria-label="Client brands"
    >
      <Container>
        <Reveal>
          <p className="caption logos__caption">
            Trusted by 80+ brands across supplements, outdoor, personal care, automotive and more
          </p>
        </Reveal>
      </Container>

      <div
        className={`marquee logos__viewport${visible ? ' is-visible' : ''}`}
        onMouseEnter={() => setSlow(true)} onMouseLeave={() => setSlow(false)}
      >
        <div className={`marquee__track${slow ? ' is-slow' : ''}`}>
          {track.map((c, i) => (
            <span className="logos__item" key={`${c.slug}-${i}`} aria-hidden={i >= items.length}>
              <img src={c.src} alt={i < items.length ? c.name : ''} height={28} />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
