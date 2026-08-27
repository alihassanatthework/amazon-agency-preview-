import { useEffect, useRef, useState } from 'react';
import { Reveal, RevealGroup } from '../../motion';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { site } from '../../data/site';

const ITEMS = [
  {
    q: 'Is the audit really free?',
    a: 'Yes, and there is no sales sequence attached to it. We do it because roughly one in four turns into a client, and because the ones that do not still tell people we were useful.',
  },
  {
    q: 'How long does it take to hear back?',
    a: `Within ${site.responseTime}. If your account is unusually large or the catalogue is complex, we will tell you on day one that it will take the full window.`,
  },
  {
    q: 'What access do you need from me?',
    a: 'Nothing to start. The first pass runs on public data plus what you tell us. If you want figures verified against your own reporting, we will ask for read-only Seller or Vendor Central access at that point.',
  },
  {
    q: 'What size brands do you usually work with?',
    a: 'Most of our clients sit between $50k and $2M a month on Amazon. Below that the fee rarely pays for itself, and we will say so rather than take the account.',
  },
  {
    q: 'Do you work with Vendor Central accounts?',
    a: 'Yes, and with hybrid Seller and Vendor setups, which is where most of the margin problems we find tend to live.',
  },
  {
    q: 'What happens to my data?',
    a: 'It is used to respond to your request and nothing else. It is not sold, not shared with third parties, and is deleted on request. The full detail is in the privacy policy.',
    link: { label: 'privacy policy', href: '#privacy' },
  },
];

/**
 * C5 — Contact FAQ. Answers the objections that stop a form being submitted.
 *
 * An editorial list separated by rules, not a stack of boxes. Multiple items
 * may be open at once — forcing closure of a previously read answer is an
 * annoyance, not a feature.
 */
export function ContactFaq() {
  // First item open by default so the pattern is self-evident.
  const [open, setOpen] = useState<number[]>([0]);

  const toggle = (i: number) =>
    setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));

  return (
    <section className="section faq bg-white" aria-labelledby="faq-title">
      <div className="container faq__grid">
        <div className="faq__aside">
          <SectionHeader
            eyebrow="Questions"
            headline={['Before you send it.']}
            id="faq-title"
            variant="narrow"
            className="faq__header"
          />
          <Reveal className="faq__prompt">
            <p className="body-s">Still not sure whether it applies to you?</p>
            <a className="link" href={`mailto:${site.email}`}>{site.email}</a>
          </Reveal>
        </div>

        <RevealGroup as="dl" className="faq__list" stagger={70}>
          {ITEMS.map((item, i) => {
            const isOpen = open.includes(i);
            return (
              <div className="faq__item" key={item.q}>
                <dt>
                  <button
                    className="faq__question"
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-button-${i}`}
                    onClick={() => toggle(i)}
                  >
                    <span className="heading-s">{item.q}</span>
                    <span className={`faq__indicator${isOpen ? ' is-open' : ''}`} aria-hidden="true" />
                  </button>
                </dt>
                <FaqPanel id={`faq-panel-${i}`} labelledBy={`faq-button-${i}`} open={isOpen}>
                  <p className="body">
                    {item.a}{' '}
                    {item.link ? <a className="link" href={item.link.href}>{item.link.label}</a> : null}
                  </p>
                </FaqPanel>
              </div>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}

/**
 * The panel unfolds rather than snapping: its height is measured from the
 * content so the transition has a real target, and the answer fades and rises
 * 8px inside it. Height is set to `auto` once open so a resize or a font swap
 * cannot leave the panel clipped at a stale measurement.
 */
function FaqPanel({
  id,
  labelledBy,
  open,
  children,
}: {
  id: string;
  labelledBy: string;
  open: boolean;
  children: React.ReactNode;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const measure = () => setHeight(el.getBoundingClientRect().height);
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <dd
      className="faq__panel"
      id={id}
      role="region"
      aria-labelledby={labelledBy}
      data-open={open}
      style={{ height: open ? height : 0 }}
    >
      <div className="faq__answer" ref={innerRef}>
        {children}
      </div>
    </dd>
  );
}
