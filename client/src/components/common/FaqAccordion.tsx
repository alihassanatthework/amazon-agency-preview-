import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { RevealGroup } from '../../motion';

interface Item { q: string; a: ReactNode }

/**
 * §10.7 / §12.1 — aria-expanded and aria-controls wired, height animated,
 * multiple items open at once. Forcing closure of a previously read answer is
 * an annoyance, not a feature. First item open so the pattern is self-evident.
 */
export function FaqAccordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number[]>([0]);
  const toggle = (i: number) =>
    setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));

  return (
    <RevealGroup as="dl" className="faq" stagger={70}>
      {items.map((item, i) => (
        <div className="faq__item" key={item.q}>
          <dt>
            <button
              className="faq__question" type="button"
              aria-expanded={open.includes(i)} aria-controls={`faq-${i}`} id={`faq-btn-${i}`}
              onClick={() => toggle(i)}
            >
              <span className="heading-s">{item.q}</span>
              <span className={`faq__indicator${open.includes(i) ? ' is-open' : ''}`} aria-hidden="true" />
            </button>
          </dt>
          <FaqPanel id={`faq-${i}`} labelledBy={`faq-btn-${i}`} open={open.includes(i)}>
            {item.a}
          </FaqPanel>
        </div>
      ))}
    </RevealGroup>
  );
}

function FaqPanel({ id, labelledBy, open, children }:
  { id: string; labelledBy: string; open: boolean; children: ReactNode }) {
  const inner = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(0);

  // Measured from the content so the transition has a real target, and
  // re-measured on resize so a reflow cannot leave the panel clipped.
  useEffect(() => {
    const el = inner.current;
    if (!el) return;
    const measure = () => setH(el.getBoundingClientRect().height);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <dd className="faq__panel" id={id} role="region" aria-labelledby={labelledBy}
        data-open={open} style={{ height: open ? h : 0 }}>
      <div className="faq__answer" ref={inner}>
        {typeof children === 'string' ? <p className="body">{children}</p> : children}
      </div>
    </dd>
  );
}
