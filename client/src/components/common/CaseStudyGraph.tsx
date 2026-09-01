import type { CaseStudyGraph as GraphConfig } from '../../data/caseStudies';
import { ArrowRight } from '../ui/Icon';

/**
 * Renders one of four graph treatments depending on what data a case study
 * actually has — never a fabricated line chart with invented points. Sits
 * inside the same `.case__chart` shell Aloha Bay's recharts panel uses, so
 * the surrounding card/caption/legend treatment stays identical.
 */
export function CaseStudyGraph({ graph }: { graph: GraphConfig }) {
  if (graph.kind === 'two-point') {
    const { fromLabel, toLabel, fromValue, toValue, prefix = '', unit = '', caption } = graph;
    const fromPct = Math.max(8, Math.round((fromValue / toValue) * 100));
    return (
      <div className="csg">
        <p className="caption case__chart-label">{caption}</p>
        <div className="csg__bars">
          <div className="csg__bar-col">
            <span className="csg__bar-value">{prefix}{fromValue}{unit}</span>
            <div className="csg__bar-track"><div className="csg__bar" style={{ height: `${fromPct}%` }} /></div>
            <span className="csg__bar-label">{fromLabel}</span>
          </div>
          <span className="csg__arrow" aria-hidden="true"><ArrowRight /></span>
          <div className="csg__bar-col">
            <span className="csg__bar-value">{prefix}{toValue}{unit}</span>
            <div className="csg__bar-track"><div className="csg__bar csg__bar--peak" style={{ height: '100%' }} /></div>
            <span className="csg__bar-label">{toLabel}</span>
          </div>
        </div>
      </div>
    );
  }

  if (graph.kind === 'qualitative-growth') {
    const { fromLabel, toLabel, callout, caption } = graph;
    return (
      <div className="csg">
        <p className="caption case__chart-label">{caption}</p>
        <div className="csg__bars">
          <div className="csg__bar-col">
            <div className="csg__bar-track"><div className="csg__bar" style={{ height: '28%' }} /></div>
            <span className="csg__bar-label">{fromLabel}</span>
          </div>
          <span className="csg__arrow" aria-hidden="true"><ArrowRight /></span>
          <div className="csg__bar-col">
            <div className="csg__bar-track"><div className="csg__bar csg__bar--peak" style={{ height: '100%' }} /></div>
            <span className="csg__bar-label">{toLabel}</span>
          </div>
        </div>
        <p className="csg__callout">{callout}</p>
      </div>
    );
  }

  if (graph.kind === 'indexed-growth') {
    const { fromMultiple, toMultiple, months, sub, caption } = graph;
    const fromPct = Math.max(8, Math.round((fromMultiple / toMultiple) * 100));
    return (
      <div className="csg">
        <p className="caption case__chart-label">{caption}</p>
        <div className="csg__bars">
          <div className="csg__bar-col">
            <span className="csg__bar-value">{fromMultiple}×</span>
            <div className="csg__bar-track"><div className="csg__bar" style={{ height: `${fromPct}%` }} /></div>
            <span className="csg__bar-label">Start</span>
          </div>
          <span className="csg__arrow" aria-hidden="true"><ArrowRight /></span>
          <div className="csg__bar-col">
            <span className="csg__bar-value">{toMultiple}×</span>
            <div className="csg__bar-track"><div className="csg__bar csg__bar--peak" style={{ height: '100%' }} /></div>
            <span className="csg__bar-label">{months} months</span>
          </div>
        </div>
        {sub && <p className="csg__callout">{sub.value} <span>{sub.label}</span></p>}
      </div>
    );
  }

  // roadmap
  const { steps, caption } = graph;
  return (
    <div className="csg">
      <p className="caption case__chart-label">{caption}</p>
      <div className="csg__roadmap">
        {steps.flatMap((step, i) => {
          const nodes = [
            <div className="csg__roadmap-step" key={step}>
              <span className="csg__roadmap-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="csg__roadmap-label">{step}</span>
            </div>,
          ];
          if (i < steps.length - 1) {
            nodes.push(<span className="csg__arrow csg__arrow--sm" aria-hidden="true" key={`${step}-arrow`}><ArrowRight /></span>);
          }
          return nodes;
        })}
      </div>
    </div>
  );
}
