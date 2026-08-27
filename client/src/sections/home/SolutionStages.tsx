import { Check } from '../../components/ui/Icon';

/**
 * The four stage visuals for H4.
 *
 * Each one is a built interface panel rather than a decorative graphic or a
 * stock photograph — the same register as the hero's dashboard object, so the
 * section reads as a look at the actual working surface. All four share one
 * frame, one header row and one padding rhythm; only the body differs.
 */

function Frame({
  title,
  meta,
  children,
}: {
  title: string;
  meta: string;
  children: React.ReactNode;
}) {
  return (
    <div className="stage">
      <div className="stage__head">
        <span className="stage__title">{title}</span>
        <span className="stage__meta">{meta}</span>
      </div>
      <div className="stage__body">{children}</div>
    </div>
  );
}

/** 01 — Advertising: spend against contribution margin, week by week. */
export function AdvertisingStage() {
  const weeks = [
    { spend: 44, margin: 58 },
    { spend: 52, margin: 66 },
    { spend: 48, margin: 74 },
    { spend: 61, margin: 88 },
    { spend: 57, margin: 96 },
    { spend: 64, margin: 100 },
  ];

  return (
    <Frame title="Contribution margin vs. spend" meta="Last 6 weeks">
      <div className="stage__chart">
        {weeks.map((w, i) => (
          <div className="stage__bars" key={i}>
            <span className="stage__bar stage__bar--spend" style={{ height: `${w.spend}%` }} />
            <span className="stage__bar stage__bar--margin" style={{ height: `${w.margin}%` }} />
          </div>
        ))}
      </div>
      <div className="stage__legend">
        <span><i className="stage__swatch stage__swatch--spend" />Ad spend</span>
        <span><i className="stage__swatch stage__swatch--margin" />Contribution margin</span>
      </div>
      <div className="stage__foot">
        <span className="stage__pill">DSP conquesting live</span>
        <span className="stage__stat">+42% ad revenue</span>
      </div>
    </Frame>
  );
}

/** 02 — Account management: the operations queue a strategist works from. */
export function OperationsStage() {
  const rows = [
    { sku: 'NB-4471 · Repair Serum', status: 'In stock', tone: 'ok', cover: 86 },
    { sku: 'NB-2210 · Night Cream', status: 'Reorder', tone: 'warn', cover: 34 },
    { sku: 'NB-8830 · Travel Set', status: 'Case open', tone: 'case', cover: 61 },
  ];

  return (
    <Frame title="Operations queue" meta="Seller + Vendor Central">
      <ul className="stage__rows">
        {rows.map((r) => (
          <li key={r.sku}>
            <span className="stage__sku">{r.sku}</span>
            <span className={`stage__status stage__status--${r.tone}`}>{r.status}</span>
            <span className="stage__meter">
              <i style={{ width: `${r.cover}%` }} />
            </span>
          </li>
        ))}
      </ul>
      <div className="stage__foot">
        <span className="stage__pill">98% in-stock rate</span>
        <span className="stage__stat">4d avg. resolution</span>
      </div>
    </Frame>
  );
}

/** 03 — Listing and catalogue: the detail page being rebuilt. */
export function CatalogueStage() {
  return (
    <Frame title="Listing quality" meta="A+ and variation architecture">
      <div className="stage__listing">
        <div className="stage__thumb">
          <img
            src="/media/case-beauty.jpg"
            alt=""
            width={1000}
            height={1250}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="stage__listing-body">
          <span className="stage__line stage__line--title" />
          <span className="stage__line" style={{ width: '92%' }} />
          <span className="stage__line" style={{ width: '78%' }} />
          <span className="stage__line" style={{ width: '85%' }} />
          <div className="stage__swatches">
            <i /><i /><i /><i />
          </div>
        </div>
      </div>
      <div className="stage__foot">
        <span className="stage__pill">A+ modules complete</span>
        <span className="stage__stat">+47% sales per visitor</span>
      </div>
    </Frame>
  );
}

/** 04 — Setup and onboarding: the infrastructure checklist. */
export function SetupStage() {
  const steps = [
    { label: 'Brand registry approved', done: true },
    { label: 'Catalogue established', done: true },
    { label: 'Variation tree mapped', done: true },
    { label: 'Advertising structure live', done: false },
  ];

  return (
    <Frame title="Onboarding" meta="Day 21 of 30">
      <ul className="stage__steps">
        {steps.map((s) => (
          <li key={s.label} data-done={s.done}>
            <span className="stage__tick">{s.done ? <Check size={11} /> : null}</span>
            {s.label}
          </li>
        ))}
      </ul>
      <div className="stage__progress"><i style={{ width: '75%' }} /></div>
      <div className="stage__foot">
        <span className="stage__pill">Registry approved</span>
        <span className="stage__stat">21d avg. time to live</span>
      </div>
    </Frame>
  );
}

export const STAGES = {
  ads: AdvertisingStage,
  ops: OperationsStage,
  catalogue: CatalogueStage,
  setup: SetupStage,
} as const;

export type StageKey = keyof typeof STAGES;
